"""Configurações do back-end do portfólio. Tudo que muda entre local e produção vem do backend/.env."""

import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')


def env_list(name, default=''):
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


DEBUG = os.getenv('DJANGO_DEBUG', '1') == '1'
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-only-insecure-key')
ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
# O Render informa o endereço próprio do serviço (xxx.onrender.com).
if os.getenv('RENDER_EXTERNAL_HOSTNAME'):
    ALLOWED_HOSTS.append(os.getenv('RENDER_EXTERNAL_HOSTNAME'))
CORS_ALLOWED_ORIGINS = env_list('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')
CSRF_TRUSTED_ORIGINS = [f'https://{host}' for host in ALLOWED_HOSTS if host not in ('localhost', '127.0.0.1')]
# Atrás do proxy HTTPS do Render/Cloudflare: sem isso as URLs das imagens saem com http://.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'portfolio',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Sem DATABASE_URL: SQLite local. Em produção, PostgreSQL pela URL.
# (`or`, e não default=: no .env a linha "DATABASE_URL=" existe vazia.)
DATABASES = {
    'default': dj_database_url.parse(
        os.getenv('DATABASE_URL') or f'sqlite:///{BASE_DIR / "db.sqlite3"}', conn_max_age=600
    ),
}
# URL "pooled" do Neon (host com -pooler): o PgBouncer em modo transação não suporta server-side cursors.
if '-pooler.' in os.getenv('DATABASE_URL', ''):
    DATABASES['default']['DISABLE_SERVER_SIDE_CURSORS'] = True

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# CSS/JS do admin servidos pelo próprio Django (WhiteNoise). Imagens enviadas: pasta media/ local
# ou, com R2_BUCKET, um bucket do Cloudflare R2 (o disco do Render se apaga a cada deploy).
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'
        if DEBUG
        else 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    },
}
if os.getenv('R2_BUCKET'):
    STORAGES['default'] = {
        'BACKEND': 'storages.backends.s3.S3Storage',
        'OPTIONS': {
            'bucket_name': os.getenv('R2_BUCKET'),
            'endpoint_url': f'https://{os.getenv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com',
            'access_key': os.getenv('R2_ACCESS_KEY_ID'),
            'secret_key': os.getenv('R2_SECRET_ACCESS_KEY'),
            'region_name': 'auto',
            'signature_version': 's3v4',
            # Endereço público do bucket (ex.: media.seudominio.dev.br), sem https://
            'custom_domain': os.getenv('R2_PUBLIC_DOMAIN'),
            'querystring_auth': False,
            'file_overwrite': False,
        },
    }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# E-mail: com RESEND_API_KEY, envio pela API do Resend (produção: o Render free bloqueia SMTP).
# Sem ela: SMTP se houver EMAIL_HOST, senão as mensagens só aparecem no terminal.
NOTIFY_EMAIL = os.getenv('NOTIFY_EMAIL', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'webmaster@localhost')
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
if os.getenv('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
    EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', '1') == '1'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# WhatsApp Cloud API (Meta). Sem token, a confirmação é pulada.
WHATSAPP_TOKEN = os.getenv('WHATSAPP_TOKEN', '')
WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID', '')
WHATSAPP_TEMPLATE = os.getenv('WHATSAPP_TEMPLATE', 'contato_recebido')
WHATSAPP_TEMPLATE_LANG = os.getenv('WHATSAPP_TEMPLATE_LANG', 'pt_BR')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'loggers': {
        'portfolio': {'handlers': ['console'], 'level': 'INFO'},
        # Com DEBUG=0 o Django não imprime os erros 500 (só manda e-mail aos ADMINS); assim eles aparecem nos Logs do Render.
        'django.request': {'handlers': ['console'], 'level': 'ERROR', 'propagate': False},
    },
}
