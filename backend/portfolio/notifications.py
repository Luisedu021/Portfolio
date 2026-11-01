"""Avisos de uma nova mensagem: e-mail para o dono do site e confirmação no WhatsApp para quem enviou."""

import json
import logging
import re
import urllib.error
import urllib.request

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger('portfolio')

GRAPH_URL = 'https://graph.facebook.com/v21.0/{phone_id}/messages'
RESEND_URL = 'https://api.resend.com/emails'


def post_json(url, payload, token):
    """POST com JSON e Bearer token. Erros HTTP viram RuntimeError com a resposta da API (aparece no painel)."""
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        # User-Agent próprio: o padrão do urllib é barrado pelo Cloudflare na frente da API do Resend.
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json', 'User-Agent': 'portfolio-api'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(request, timeout=10):
            return True
    except urllib.error.HTTPError as error:
        raise RuntimeError(f'{error.code}: {error.read().decode(errors="replace")[:500]}') from error


def notify_owner(msg):
    """
    E-mail para NOTIFY_EMAIL com os dados da mensagem; "Responder" vai direto para quem escreveu.
    Com RESEND_API_KEY envia pela API HTTP do Resend (o Render free bloqueia SMTP);
    sem ela, usa o EMAIL_BACKEND do Django (terminal localmente, ou SMTP). Retorna True se enviou.
    """
    if not settings.NOTIFY_EMAIL:
        return False
    subject = f'Novo contato pelo portfólio: {msg.project}'
    phone = normalize_phone(msg.phone)
    html = render_to_string('portfolio/email/contact.html', {
        'msg': msg,
        'subject': subject,
        'reply_subject': f'Re: {msg.project}',
        'whatsapp_link': f'https://wa.me/{phone}' if phone else '',
        'panel_link': f'{settings.PUBLIC_URL}/admin/portfolio/contactmessage/{msg.pk}/change/' if settings.PUBLIC_URL else '',
    })
    # Versão em texto puro: aparece em clientes que não mostram HTML e ajuda a não cair no spam.
    body = '\n'.join([
        f'Nome: {msg.name}',
        f'E-mail: {msg.email}',
        f'WhatsApp: {msg.phone or "-"}',
        f'Localização: {msg.location or "-"}',
        f'Projeto: {msg.project}',
        '',
        msg.message,
    ])

    if settings.RESEND_API_KEY:
        payload = {
            'from': settings.DEFAULT_FROM_EMAIL,
            'to': [settings.NOTIFY_EMAIL],
            'reply_to': msg.email,
            'subject': subject,
            'text': body,
            'html': html,
        }
        return post_json(RESEND_URL, payload, settings.RESEND_API_KEY)

    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.NOTIFY_EMAIL],
        reply_to=[msg.email],
    )
    email.attach_alternative(html, 'text/html')
    email.send()
    return True


def normalize_phone(phone):
    """Só dígitos, com DDI. Números brasileiros sem DDI (10 ou 11 dígitos) ganham o 55."""
    digits = re.sub(r'\D', '', phone or '')
    if len(digits) in (10, 11):
        digits = f'55{digits}'
    return digits if len(digits) >= 12 else ''


def confirm_on_whatsapp(msg):
    """Envia o modelo aprovado na Meta para o WhatsApp de quem escreveu. Retorna True se enviou."""
    to = normalize_phone(msg.phone)
    if not (settings.WHATSAPP_TOKEN and settings.WHATSAPP_PHONE_NUMBER_ID and to):
        return False

    payload = {
        'messaging_product': 'whatsapp',
        'to': to,
        'type': 'template',
        'template': {
            'name': settings.WHATSAPP_TEMPLATE,
            'language': {'code': settings.WHATSAPP_TEMPLATE_LANG},
            'components': [{'type': 'body', 'parameters': [{'type': 'text', 'text': msg.name.split()[0]}]}],
        },
    }
    return post_json(GRAPH_URL.format(phone_id=settings.WHATSAPP_PHONE_NUMBER_ID), payload, settings.WHATSAPP_TOKEN)


def notify(msg):
    """Roda os dois avisos. Uma falha não impede o outro nem a mensagem de ficar salva."""
    errors = []
    for field, sender in (('email_sent', notify_owner), ('whatsapp_sent', confirm_on_whatsapp)):
        try:
            setattr(msg, field, sender(msg))
        except Exception as error:  # noqa: BLE001 - qualquer falha de envio só é registrada
            logger.exception('Falha ao notificar (%s)', field)
            errors.append(f'{field}: {error}')
    msg.notification_error = '\n'.join(errors)
    msg.save(update_fields=['email_sent', 'whatsapp_sent', 'notification_error'])
