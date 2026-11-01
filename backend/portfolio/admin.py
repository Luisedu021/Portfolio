from django.contrib import admin
from django.utils.html import format_html

from .models import ContactMessage, Project


def thumbnail(image, height=64):
    if not image:
        return '—'
    return format_html('<img src="{}" style="height:{}px;border-radius:6px" />', image.url, height)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'order', 'published', 'cover')
    list_editable = ('order', 'published')
    list_filter = ('category', 'published')
    search_fields = ('title', 'summary_pt')
    prepopulated_fields = {'key': ('title',)}
    readonly_fields = ('cover_large',)
    fieldsets = (
        (None, {'fields': ('title', 'key', 'category', 'order', 'published', 'tags', 'href')}),
        ('Textos em português', {'fields': ('summary_pt', 'challenge_pt', 'result_pt')}),
        ('Textos em inglês', {'fields': ('summary_en', 'challenge_en', 'result_en'), 'classes': ('collapse',)}),
        (
            'Imagens',
            {
                'description': 'Só aparecem os aparelhos com imagem: notebook + tablet + celular, tablet + celular ou só notebook.',
                'fields': ('screen_desktop', 'screen_tablet', 'screen_mobile', 'preview', 'cover_large'),
            },
        ),
    )

    @admin.display(description='capa')
    def cover(self, obj):
        return thumbnail(obj.preview or obj.screen_mobile)

    @admin.display(description='capa atual')
    def cover_large(self, obj):
        return thumbnail(obj.preview or obj.screen_mobile, height=240)


def badge(text, kind):
    """Etiqueta colorida (estilos .badge em static/admin-theme/admin-theme.css)."""
    return format_html('<span class="badge badge--{}">{}</span>', kind, text)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('status', 'name', 'project', 'preview', 'contact', 'email_status', 'created_at', 'read')
    list_display_links = ('name',)
    list_filter = ('read', 'email_sent', 'whatsapp_sent', 'created_at')
    list_editable = ('read',)
    list_per_page = 30
    date_hierarchy = 'created_at'
    search_fields = ('name', 'email', 'project', 'message')
    readonly_fields = (
        'name', 'email', 'phone', 'location', 'project', 'message', 'language', 'created_at',
        'email_sent', 'whatsapp_sent', 'notification_error',
    )
    fieldsets = (
        ('Quem escreveu', {'fields': ('name', 'email', 'phone', 'location', 'language', 'created_at')}),
        ('Mensagem', {'fields': ('project', 'message', 'read')}),
        ('Avisos', {'fields': ('email_sent', 'whatsapp_sent', 'notification_error'), 'classes': ('collapse',)}),
    )
    actions = ('mark_read', 'mark_unread')

    def has_add_permission(self, request):
        # Mensagens só chegam pelo formulário do site.
        return False

    def change_view(self, request, object_id, form_url='', extra_context=None):
        # Abrir a mensagem já marca como lida.
        self.get_queryset(request).filter(pk=object_id, read=False).update(read=True)
        return super().change_view(request, object_id, form_url, extra_context)

    @admin.display(description='', ordering='read')
    def status(self, obj):
        return badge('Nova', 'new') if not obj.read else badge('Lida', 'muted')

    @admin.display(description='mensagem')
    def preview(self, obj):
        return obj.message if len(obj.message) <= 70 else f'{obj.message[:70]}…'

    @admin.display(description='contato')
    def contact(self, obj):
        return format_html(
            '<a href="mailto:{}">{}</a>{}', obj.email, obj.email,
            format_html('<br><span style="color:var(--body-quiet-color)">{}</span>', obj.phone) if obj.phone else '',
        )

    @admin.display(description='aviso', ordering='email_sent')
    def email_status(self, obj):
        if obj.email_sent:
            return badge('E-mail enviado', 'ok')
        if obj.notification_error:
            return badge('Erro', 'error')
        return badge('Sem aviso', 'muted')

    @admin.action(description='Marcar como lidas')
    def mark_read(self, request, queryset):
        queryset.update(read=True)

    @admin.action(description='Marcar como não lidas')
    def mark_unread(self, request, queryset):
        queryset.update(read=False)
