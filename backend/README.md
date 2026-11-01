# Painel do portfólio (Django)

Back-end do site: painel (Django admin) para os projetos e API para o site e o formulário de contato.

- `GET /api/projects/`: projetos publicados, no formato de `src/data/content.ts`.
- `POST /api/contact/`: salva a mensagem, avisa por e-mail e confirma no WhatsApp de quem enviou.
- `/admin/`: painel (projetos, imagens, textos PT/EN, mensagens recebidas).

## Rodar localmente

```bash
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py seed_projects
.venv\Scripts\python.exe manage.py createsuperuser
.venv\Scripts\python.exe manage.py runserver 8010
```

No site, crie `.env.local` na raiz com `VITE_API_URL=http://localhost:8010` e rode `npm run dev`.
Sem `VITE_API_URL`, o site usa os projetos de `src/data/content.ts` e o formulário abre o app de e-mail.

Painel: http://localhost:8010/admin/ (login criado no `createsuperuser`).

## Notificações

- **E-mail para você**: preencha `NOTIFY_EMAIL`, `RESEND_API_KEY` e `DEFAULT_FROM_EMAIL` (de um domínio verificado
  no Resend). O envio é pela API HTTP do Resend, porque o Render free bloqueia as portas SMTP. O "Responder" do
  e-mail vai direto para quem escreveu. Sem a chave, o e-mail aparece no terminal (ou sai por SMTP, com `EMAIL_HOST`).
- **WhatsApp para quem enviou**: crie o app na Meta (WhatsApp Cloud API), aprove um modelo com uma variável
  (o nome da pessoa) e preencha `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` e `WHATSAPP_TEMPLATE`.
  Sem token, essa etapa é pulada.

Se um aviso falhar, a mensagem continua salva; o erro aparece na mensagem dentro do painel.

## Produção

Tudo grátis, menos o domínio: site no Cloudflare Pages, API no Render, banco no Neon e imagens no Cloudflare R2.
O DNS fica na Cloudflare (domínio `.br` comprado no Registro.br, com os servidores DNS trocados para os da Cloudflare).

1. **Banco (Neon)**: crie um projeto em neon.tech e copie a connection string (`postgres://...`).
2. **Imagens (R2)**: no painel da Cloudflare, R2 → crie um bucket, ative um domínio público
   (ex.: `media.seudominio.dev.br`) e crie um token de API do R2 com leitura e escrita.
3. **API (Render)**: New → Blueprint → este repositório (usa o `render.yaml` da raiz). Preencha:
   - `DATABASE_URL`: a string do Neon
   - `DJANGO_ALLOWED_HOSTS`: `api.seudominio.dev.br`
   - `CORS_ALLOWED_ORIGINS`: `https://seudominio.dev.br,https://www.seudominio.dev.br`
   - `R2_*`: Account ID, bucket, chaves do token e o domínio público
   - `NOTIFY_EMAIL`, `RESEND_API_KEY`, `DEFAULT_FROM_EMAIL` e, quando tiver, o WhatsApp
   - `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD`: o login do painel

   Depois, em Settings → Custom Domains, adicione `api.seudominio.dev.br` e crie o CNAME que o Render indicar
   na Cloudflare. O build roda `collectstatic`, `migrate` e cria o login do painel (o plano free não tem Shell).
   Para popular o banco com os projetos, rode `seed_projects` localmente com `DATABASE_URL` (e `R2_*`) de produção.
4. **Site (Cloudflare Worker)**: em Settings → Build → Variables, adicione `VITE_API_URL=https://api.seudominio.dev.br`
   e faça um novo deploy (a variável entra no build do Vite).

No plano free o Render desliga a API depois de ~15 min sem acesso; a primeira visita seguinte espera uns 30–50 s.
O site não quebra nesse meio tempo: sem resposta da API ele mostra os projetos de `src/data/content.ts`.

## Testes

```bash
.venv\Scripts\python.exe manage.py test portfolio
```
