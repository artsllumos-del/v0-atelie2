# Ateliê Sagrado - Setup

## Comece Aqui

O projeto está 100% funcional. Para começar:

```bash
cd /vercel/share/v0-project
pnpm dev
```

Acesse: **http://localhost:3000**

## Variáveis de Ambiente

Para usar com Supabase, edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

Sem as variáveis, o app roda com mock data.

## Páginas Disponíveis

### Loja
- `/loja` - Home
- `/loja/produtos` - Produtos
- `/loja/montador` - Montador
- `/loja/carrinho` - Carrinho
- `/loja/checkout` - Checkout
- `/loja/conta` - Minha conta
- `/auth/login` - Login
- `/auth/sign-up` - Sign-up

### Admin (Protegido)
- `/admin` - Dashboard
- `/admin/produtos` - Produtos
- `/admin/pedidos` - Pedidos
- `/admin/estoque` - Estoque
- E mais 7 páginas...

## Deploy

Para Vercel:
1. Push do código para GitHub
2. Conecte em vercel.com
3. Configure `.env` com credenciais Supabase
4. Deploy automático

## Tudo pronto! 🚀
