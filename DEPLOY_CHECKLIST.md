# Checklist de Deploy - Ateliê Sagrado

## Antes de fazer deploy:

### Variáveis de Ambiente
- [x] `NEXT_PUBLIC_SUPABASE_URL` - Configurada nas variáveis do Vercel
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Configurada nas variáveis do Vercel
- [x] Arquivo `.env.example` criado para referência

### Estrutura do Banco de Dados
- [ ] Tabelas do Supabase criadas:
  - `products` - Catálogo de produtos
  - `clients` - Clientes da loja
  - `orders` - Pedidos
  - `cart_items` - Carrinho
  - `inventory` - Estoque
  - `collaborators` - Colaboradores/Usuarios
  - `financial_transactions` - Transações financeiras
  - `quotes` - Orçamentos

### Autenticação
- [ ] Supabase Auth habilitado
- [ ] Email/Password configurado como método de login
- [ ] URL de redirect configurada: `https://seu-dominio/auth/callback`
- [ ] Row Level Security (RLS) configurado para tabelas sensíveis

### Testes
- [x] Build local testado e passou
- [ ] Teste de login funcionando
- [ ] Teste de navegação na loja
- [ ] Teste de admin (se tiver conta)
- [ ] Teste de carrinho
- [ ] Teste de checkout

### Segurança
- [ ] `.env.local` NÃO está commitado
- [ ] RLS policies configuradas no Supabase
- [ ] Admin routes protegidas
- [ ] Credenciais do banco seguras

### Performance
- [ ] Next.js build otimizado
- [ ] Images otimizadas
- [ ] Code splitting funcionando

### Deploy
- [ ] GitHub repository linkado ao Vercel
- [ ] Variáveis de ambiente adicionadas no Vercel
- [ ] Preview deployment testado
- [ ] Production deployment pronto

## Pós-Deploy

- [ ] Verificar logs no Vercel
- [ ] Testar fluxo completo em produção
- [ ] Monitorar performance
- [ ] Configurar backups do banco de dados
- [ ] Configurar alerts de erro

## Contatos Úteis

- **Supabase Support**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
