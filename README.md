# Ateliê Sagrado - Sistema de Gestão de Terços Artesanais

Sistema integrado de gestão para produção artesanal de terços e artigos religiosos. Controle de estoque, precificação inteligente, loja personalizada e painel administrativo completo.

## 🚀 Funcionalidades

- **Loja Online**: Catálogo de produtos, carrinho e checkout
- **Montador de Terços**: Personalize terços com diferentes materiais
- **Painel Administrativo**: Gestão completa de pedidos, estoque, produção e financeiro
- **Autenticação**: Sistema de login seguro com Supabase
- **Sistema de Precificação**: Cálculo automático com margin​em inteligente
- **Dashboard**: Visão geral de KPIs e alertas

## 📋 Pré-requisitos

- Node.js 18+ (recomenda-se usar pnpm)
- Conta no Supabase ([supabase.com](https://supabase.com))

## ⚙️ Setup Local

### 1. Clonar o repositório e instalar dependências

```bash
git clone <repo-url>
cd v0-atelie
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Configurar Supabase

No painel do Supabase, crie as tabelas necessárias ou execute as migrations:

```bash
# As migrations estão em scripts/ (quando disponíveis)
# Execute-as no SQL editor do Supabase
```

### 4. Rodar o servidor de desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🔐 Autenticação

- **Loja**: Acesso público, com possibilidade de criar conta
- **Admin**: Protegido por autenticação (acesso em `/admin`)
  - Faça login em `/auth/login`
  - Crie uma conta em `/auth/sign-up` (pode ser restringido no Supabase)

## 📦 Estrutura do Projeto

```
├── app/
│   ├── auth/              # Páginas de autenticação
│   ├── loja/              # Loja pública (produtos, carrinho, checkout)
│   ├── admin/             # Painel administrativo (protegido)
│   └── api/               # Rotas de API
├── lib/
│   ├── supabase/          # Cliente e funções do Supabase
│   ├── mock-data.ts       # Dados mock para desenvolvimento
│   └── utils.ts           # Funções utilitárias
├── components/            # Componentes reutilizáveis (shadcn/ui)
└── public/                # Arquivos estáticos
```

## 🌐 Rotas Principais

### Loja Pública
- `/` → Redirecion​a para `/loja`
- `/loja` → Página inicial
- `/loja/produtos` → Catálogo de produtos
- `/loja/montador` → Montador personalizado de terços
- `/loja/carrinho` → Carrinho de compras
- `/loja/checkout` → Finalizar compra
- `/loja/conta` → Minha conta e pedidos

### Autenticação
- `/auth/login` → Fazer login
- `/auth/sign-up` → Criar conta
- `/auth/callback` → Callback do Supabase

### Admin (Protegido)
- `/admin` → Dashboard
- `/admin/produtos` → Gestão de produtos
- `/admin/estoque` → Controle de estoque
- `/admin/pedidos` → Pedidos
- `/admin/producao` → Fila de produção
- `/admin/clientes` → Gestão de clientes
- `/admin/financeiro` → Relatórios financeiros

## 🔒 Segurança

- Autenticação via Supabase Auth
- Proteção de rotas administrativas no middleware
- Variáveis sensíveis em `.env.local` (nunca commit)
- Cookies HTTP-only para sessões

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- Dispositivos móveis (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## 🎨 Design

- Baseado em **Tailwind CSS v4**
- Componentes **shadcn/ui**
- Tema customizável via design tokens
- Suporte a dark mode (theme via next-themes)

## 🚀 Deploy

### Deploy no Vercel

1. Push do código para o GitHub
2. Connect no painel do Vercel
3. Adicione variáveis de ambiente no Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático acontece a cada push para `main`

### Checklist pré-deploy

- [ ] Supabase configurado e credenciais corretas
- [ ] `.env.local` NÃO foi commitado
- [ ] Todas as migrations do banco de dados executadas
- [ ] Testes básicos realizados localmente
- [ ] RLS policies configuradas no Supabase (se necessário)

## 📊 Dados de Teste

O projeto inclui dados mock em `lib/mock-data.ts` para desenvolvimento. Em produção, esses dados devem ser substituídos por dados reais do Supabase.

## 🐛 Troubleshooting

### "Cannot find module" - produtos
Se receber erro sobre módulos faltando:
```bash
pnpm install
```

### Erro de autenticação
- Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretos
- Certifique-se que URL não tem slash final
- No Supabase, verifique se Auth está habilitado

### Erro de banco de dados
- Verifique se as tabelas foram criadas no Supabase
- Rode as migrations necessárias
- Verifique as RLS policies

## 📚 Tecnologias Usadas

- **Next.js 16** - Framework React com SSR
- **React 19** - UI library
- **Supabase** - Backend & Auth
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Componentes UI
- **SWR** - Data fetching & caching
- **Sonner** - Notificações
- **Lucide React** - Ícones
- **TypeScript** - Type safety

## 📖 Aprender Mais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)

## 📄 Licença

Este projeto é privado. Todos os direitos reservados a Ateliê Sagrado.

---

**Desenvolvido com ❤️ usando v0**
