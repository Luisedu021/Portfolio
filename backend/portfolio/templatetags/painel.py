"""Números e listas da página inicial do painel (templates/admin/index.html)."""

from datetime import timedelta

from django import template
from django.utils import timezone

from ..models import ContactMessage, Project

register = template.Library()


@register.inclusion_tag('admin/painel/resumo.html')
def painel_resumo():
    week_ago = timezone.now() - timedelta(days=7)
    messages = ContactMessage.objects.all()
    return {
        'unread': messages.filter(read=False).count(),
        'this_week': messages.filter(created_at__gte=week_ago).count(),
        'total_messages': messages.count(),
        'failed': messages.filter(email_sent=False).exclude(notification_error='').count(),
        'published': Project.objects.filter(published=True).count(),
        'total_projects': Project.objects.count(),
        'latest': messages[:5],
    }
