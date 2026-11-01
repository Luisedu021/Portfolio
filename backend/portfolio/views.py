import json

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import ContactMessage, Project
from .notifications import notify

REQUIRED_FIELDS = ('name', 'email', 'project', 'message')
MAX_LENGTHS = {'name': 120, 'email': 254, 'phone': 30, 'location': 120, 'project': 200, 'message': 5000}


def cors(view):
    """Libera a API para os endereços do site em CORS_ALLOWED_ORIGINS (e responde ao preflight)."""

    def wrapper(request, *args, **kwargs):
        response = HttpResponse(status=204) if request.method == 'OPTIONS' else view(request, *args, **kwargs)
        origin = request.headers.get('Origin')
        if origin in settings.CORS_ALLOWED_ORIGINS:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type'
            response['Vary'] = 'Origin'
        return response

    return wrapper


def image_url(request, image):
    return request.build_absolute_uri(image.url) if image else None


@cors
def projects(request):
    """Projetos publicados, no formato que o site espera (src/data/content.ts)."""
    if request.method != 'GET':
        return JsonResponse({'error': 'method'}, status=405)

    data = [
        {
            'key': project.key,
            'category': project.category,
            'title': project.title,
            'tags': project.tag_list(),
            'href': project.href or None,
            'screens': {
                'desktop': image_url(request, project.screen_desktop),
                'tablet': image_url(request, project.screen_tablet),
                'mobile': image_url(request, project.screen_mobile),
            },
            'preview': image_url(request, project.preview or project.screen_mobile or project.screen_desktop),
            'text': {
                'pt': {'summary': project.summary_pt, 'challenge': project.challenge_pt, 'result': project.result_pt},
                'en': {
                    'summary': project.summary_en or project.summary_pt,
                    'challenge': project.challenge_en or project.challenge_pt,
                    'result': project.result_en or project.result_pt,
                },
            },
        }
        for project in Project.objects.filter(published=True)
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
@cors
def contact(request):
    """Recebe o formulário: valida, salva e dispara os avisos."""
    if request.method != 'POST':
        return JsonResponse({'error': 'method'}, status=405)

    try:
        payload = json.loads(request.body or b'{}')
    except ValueError:  # JSON inválido ou texto que não é UTF-8 (ex.: Windows PowerShell 5.1 manda Latin-1)
        return JsonResponse({'error': 'invalid_json'}, status=400)

    # Campo escondido no formulário: só robôs o preenchem.
    if payload.get('website'):
        return JsonResponse({'ok': True}, status=201)

    fields = {name: str(payload.get(name, '')).strip()[:limit] for name, limit in MAX_LENGTHS.items()}
    missing = [name for name in REQUIRED_FIELDS if not fields[name]]
    if missing:
        return JsonResponse({'error': 'missing', 'fields': missing}, status=400)
    try:
        validate_email(fields['email'])
    except ValidationError:
        return JsonResponse({'error': 'invalid', 'fields': ['email']}, status=400)

    language = payload.get('language') if payload.get('language') in ('pt', 'en') else 'pt'
    msg = ContactMessage.objects.create(**fields, language=language)
    notify(msg)
    return JsonResponse({'ok': True}, status=201)
