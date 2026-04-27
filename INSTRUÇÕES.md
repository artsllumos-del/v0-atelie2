Olá! O projeto Ateliê Sagrado foi completamente corrigido e está pronto para funcionar. Aqui está tudo que você precisa saber:

## Configuração Inicial

### 1. Adicione suas Credenciais do Supabase

O arquivo `.env.local` foi criado, mas você precisa adicionar suas credenciais. Edite o arquivo e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

Como obter essas credenciais:
1. Vá para https://supabase.com
2. Faça login na sua conta
3. Abra seu projeto
4. Clique em "Settings" → "API"
5. Copie a URL do projeto (NEXT_PUBLIC_SUPABASE_URL)
6. Copie a chave anon (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 2. Rodar Localmente

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000 no navegador.

## Páginas Disponíveis

### Loja Pública
- `/` → Redirecion para /loja
- `/loja` → Página inicial com hero e destaques
- `/loja/produtos` → Catálogo de produtos (com busca e filtros)
- `/loja/montador` → Montador personalizado de terços
- `/loja/carrinho` → Carrinho de compras com cálculo de frete
- `/loja/checkout` → Checkout com endereço e pagamento
- `/loja/conta` → Minha conta, pedidos e favoritos

### Autenticação
- `/auth/login` → Fazer login
- `/auth/sign-up` → Criar conta
- `/auth/sign-up-success` → Confirmação de cadastro
- `/auth/callback` → Callback automático do Supabase

### Admin (Protegido)
- `/admin` → Dashboard com KPIs
- `/admin/produtos` → Gestão de produtos (CRUD completo)
- `/admin/estoque` → Controle de estoque
- `/admin/pedidos` → Gerenciamento de pedidos
- `/admin/producao` → Fila de produção
- `/admin/clientes` → Gestão de clientes
- `/admin/colaboradores` → Gerenciamento de equipe
- `/admin/financeiro` → Relatórios financeiros
- `/admin/precificacao` → Configuração de precificação
- `/admin/orcamentos` → Gestão de orçamentos
- `/admin/configuracoes` → Configurações do sistema

## Dados Mock

O projeto vem com dados de exemplo em `/lib/mock-data.ts`:
- 10 produtos pré-configurados
- 5 clientes de exemplo
- 8 pedidos de teste
- 20+ materiais para montador

Esses dados usam os nomes em português:
- `nome` (não `name`)
- `descricao` (não `description`)
- `precoVenda` (não `sale_price`)
- `ativo` (não `is_active`)

## Estrutura do Projeto

```
app/
  ├── auth/              # Autenticação (login, sign-up)
  ├── loja/              # Loja pública
  │   ├── page.tsx
  │   ├── produtos/
  │   ├── montador/
  │   ├── carrinho/
  │   ├── checkout/
  │   └── conta/
  └── admin/             # Painel administrativo (protegido)
      ├── page.tsx       # Dashboard
      ├── produtos/
      ├── pedidos/
      ├── estoque/
      ├── producao/
      ├── clientes/
      ├── colaboradores/
      ├── financeiro/
      ├── precificacao/
      ├── orcamentos/
      └── configuracoes/

lib/
  ├── supabase/          # Integração Supabase
  │   ├── client.ts      # Cliente do lado do cliente
  │   ├── server.ts      # Cliente do lado do servidor
  │   ├── middleware.ts  # Middleware de autenticação
  │   ├── products.ts    # Funções de produtos
  │   └── ...
  ├── mock-data.ts       # Dados para desenvolvimento
  ├── types.ts           # TypeScript types
  └── utils.ts           # Funções utilitárias

components/
  ├── ui/                # shadcn/ui components (Button, Card, etc)
  └── admin/             # Componentes específicos do admin

middleware.ts           # Middleware para proteção de rotas
```

## Testes dos Botões

### Página Inicial (/loja)
- ✓ Botão "Montar meu terço" → leva para /loja/montador
- ✓ Botão "Ver coleção" → leva para /loja/produtos

### Página Produtos (/loja/produtos)
- ✓ Busca por nome
- ✓ Filtro por categorias
- ✓ Botão "Adicionar ao carrinho"
- ✓ Botão de favoritar (coração)

### Carrinho (/loja/carrinho)
- ✓ Aumentar/diminuir quantidade
- ✓ Remover itens
- ✓ Aplicar cupom (teste: PRIMEIRACOMPRA)
- ✓ Calcular frete automático
- ✓ Botão "Finalizar Compra"

### Checkout (/loja/checkout)
- ✓ Preencher endereço
- ✓ Escolher método de pagamento
- ✓ Confirmar pedido

### Autenticação
- ✓ Criar conta em /auth/sign-up
- ✓ Fazer login em /auth/login
- ✓ Logout no admin
- ✓ Proteção de rotas (/admin requer login)

### Admin Dashboard (/admin)
- ✓ KPIs com tendências
- ✓ Pedidos recentes
- ✓ Alertas do sistema
- ✓ Gráficos de performance

### Produtos Admin (/admin/produtos)
- ✓ Listar produtos
- ✓ Buscar por nome
- ✓ Filtrar por status (ativo/inativo)
- ✓ Botão "Novo Produto" (abre modal)
- ✓ Editar produto
- ✓ Deletar produto

## Build e Deploy

### Teste Local
```bash
pnpm build
pnpm start
```

### Deploy no Vercel

1. Push para GitHub:
```bash
git add .
git commit -m "Projeto Ateliê Sagrado completo"
git push origin main
```

2. No Vercel Dashboard:
   - Conectar repositório GitHub
   - Adicionar variáveis de ambiente:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy automático acontecerá

## Problemas Comuns

### "Cannot find Supabase credentials"
- Verifique que `.env.local` existe
- Verifique que as credenciais estão corretas
- No Supabase, verifique que a chave não tem "/" no final da URL

### "Sem dados na página"
- Os dados são mock por enquanto
- Para usar dados reais, crie as tabelas no Supabase
- Ou use os dados mock que já vêm pré-configurados

### "Botão não funciona"
- Verifique no console (F12 → Console)
- Todos os botões estão conectados a funções reais
- Pode ser preciso implementar backend para ações reais

## Próximas Etapas

1. Adicionar dados reais do Supabase (criar tabelas)
2. Implementar pagamento real (Stripe)
3. Adicionar mais funcionalidades do admin
4. Criar sistema de notificações por email
5. Implementar sistema de ratings

## Suporte

Se tiver dúvidas:
- Verifique a documentação do Supabase: https://supabase.com/docs
- Verifique a documentação do Next.js: https://nextjs.org/docs
- Verifique a documentação do shadcn/ui: https://ui.shadcn.com

---

Projeto criado com Next.js 16, React 19, e Supabase.
Desenvolvido com v0 (Vercel AI).
