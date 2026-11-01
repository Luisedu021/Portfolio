import json
from unittest import mock

from django.core import mail
from django.test import TestCase, override_settings

from .models import ContactMessage, Project
from .notifications import normalize_phone

VALID = {'name': 'Ana Souza', 'email': 'ana@example.com', 'project': 'Site', 'message': 'Olá!', 'phone': '18 99999-0000'}


@override_settings(NOTIFY_EMAIL='dono@example.com', EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class ContactTests(TestCase):
    def post(self, data):
        return self.client.post('/api/contact/', json.dumps(data), content_type='application/json')

    def test_saves_and_emails_owner(self):
        response = self.post(VALID)
        self.assertEqual(response.status_code, 201)
        msg = ContactMessage.objects.get()
        self.assertTrue(msg.email_sent)
        self.assertFalse(msg.whatsapp_sent)  # sem token configurado
        self.assertEqual(mail.outbox[0].to, ['dono@example.com'])
        self.assertEqual(mail.outbox[0].reply_to, ['ana@example.com'])
        self.assertIn('18 99999-0000', mail.outbox[0].body)
        html, mimetype = mail.outbox[0].alternatives[0]
        self.assertEqual(mimetype, 'text/html')
        self.assertIn('https://wa.me/5518999990000', html)

    def test_html_email_escapes_visitor_input(self):
        self.post({**VALID, 'message': '<script>alert(1)</script>'})
        html = mail.outbox[0].alternatives[0][0]
        self.assertNotIn('<script>', html)
        self.assertIn('&lt;script&gt;', html)

    @override_settings(RESEND_API_KEY='re_teste', DEFAULT_FROM_EMAIL='Portfólio <contato@example.com>')
    def test_emails_through_resend_api(self):
        with mock.patch('portfolio.notifications.urllib.request.urlopen') as urlopen:
            self.assertEqual(self.post(VALID).status_code, 201)
        request = urlopen.call_args.args[0]
        payload = json.loads(request.data)
        self.assertEqual(request.full_url, 'https://api.resend.com/emails')
        self.assertEqual(request.get_header('Authorization'), 'Bearer re_teste')
        self.assertEqual(payload['to'], ['dono@example.com'])
        self.assertEqual(payload['reply_to'], 'ana@example.com')
        self.assertIn('Ana Souza', payload['html'])
        self.assertTrue(ContactMessage.objects.get().email_sent)
        self.assertEqual(mail.outbox, [])

    def test_rejects_missing_fields_and_bad_email(self):
        self.assertEqual(self.post({**VALID, 'message': ''}).status_code, 400)
        self.assertEqual(self.post({**VALID, 'email': 'nao-e-email'}).status_code, 400)
        self.assertFalse(ContactMessage.objects.exists())

    def test_rejects_body_that_is_not_utf8(self):
        body = json.dumps(VALID, ensure_ascii=False).encode('latin-1')  # como o Windows PowerShell 5.1 envia
        response = self.client.post('/api/contact/', body, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(ContactMessage.objects.exists())

    def test_honeypot_is_discarded(self):
        self.assertEqual(self.post({**VALID, 'website': 'spam.com'}).status_code, 201)
        self.assertFalse(ContactMessage.objects.exists())

    def test_email_failure_keeps_message(self):
        with mock.patch('portfolio.notifications.EmailMultiAlternatives.send', side_effect=OSError('smtp fora')):
            self.assertEqual(self.post(VALID).status_code, 201)
        msg = ContactMessage.objects.get()
        self.assertFalse(msg.email_sent)
        self.assertIn('smtp fora', msg.notification_error)

    @override_settings(CORS_ALLOWED_ORIGINS=['http://localhost:5173'])
    def test_cors_preflight(self):
        response = self.client.options('/api/contact/', HTTP_ORIGIN='http://localhost:5173')
        self.assertEqual(response['Access-Control-Allow-Origin'], 'http://localhost:5173')


class PhoneTests(TestCase):
    def test_normalize(self):
        self.assertEqual(normalize_phone('(18) 99999-0000'), '5518999990000')
        self.assertEqual(normalize_phone('+55 18 99999-0000'), '5518999990000')
        self.assertEqual(normalize_phone('123'), '')


class ProjectsApiTests(TestCase):
    def test_lists_only_published_with_english_fallback(self):
        Project.objects.create(key='a', category='uiux', title='A', summary_pt='Resumo', tags='UI/UX, App')
        Project.objects.create(key='b', category='uiux', title='B', summary_pt='x', published=False)
        data = self.client.get('/api/projects/').json()
        self.assertEqual([p['key'] for p in data], ['a'])
        self.assertEqual(data[0]['tags'], ['UI/UX', 'App'])
        self.assertEqual(data[0]['text']['en']['summary'], 'Resumo')
        self.assertIsNone(data[0]['screens']['desktop'])
