# Sistema de Estoque - Documentação

## Resumo das Implementações

### 1. API de Estoque Funcional (`/api/inventory`)
- **GET**: Retorna lista de materiais (com padrão inicial)
- **POST**: Cria novo material com cálculo automático de conversão
- **PUT**: Atualiza material existente
- **DELETE**: Remove material do estoque

### 2. Funcionalidades da Página de Estoque

#### Dashboard Cards
- Total de materiais cadastrados
- Materiais em estoque crítico (vermelho)
- Materiais em estoque baixo (amarelo)
- Valor total em estoque

#### Tabela de Materiais
- Busca por nome em tempo real
- Filtro por categoria
- Filtro por status (Crítico/Baixo/OK)
- Indicador visual de estoque com barra de progresso
- Conversão de unidades (gramas → unidades)

#### Ações por Material
- **Editar**: Abre diálogo para atualizar informações
- **Adicionar Entrada**: Para futuras movimentações
- **Ver Histórico**: Para rastreabilidade
- **Excluir**: Remove material com confirmação

### 3. Diálogo de Adição/Edição

#### Campos Obrigatórios
- Nome do material
- Categoria
- Preço de compra
- Estoque mínimo

#### Campos Opcionais
- Fornecedor
- Unidade de compra (gramas/pacote/unidade/metros)
- Peso do pacote (em gramas)
- Quantidade estimada de unidades

#### Cálculos Automáticos
- **Relação de Conversão**: `quantidade / peso`
- **Custo Unitário**: `preço / quantidade`
- Exemplo: 80g com 60 unidades = 0.75 un/g a R$ 0.42/un

### 4. Sincronização de Dados

- Usa SWR para cache e revalidação automática
- Mutação ao salvar/deletar para atualizar UI
- Toast notifications para feedback ao usuário

### 5. Status de Estoque

Cálculo: `(quantidade / estoque_mínimo) * 100`

- **Crítico** (vermelho): < 100%
- **Baixo** (amarelo): 100% - 150%
- **OK** (verde): >= 150%

## Estrutura Técnica

```
/api/inventory/route.ts       - API com CRUD completo
/app/admin/estoque/page.tsx   - UI da página de estoque
```

## Como Usar

### Adicionar Material
1. Clique em "Adicionar Material"
2. Preencha campos obrigatórios
3. Preencha conversão (opcional, será calculada)
4. Clique em "Salvar Material"

### Editar Material
1. Clique no menu de ações (...)
2. Selecione "Editar"
3. Altere os campos desejados
4. Clique em "Atualizar Material"

### Deletar Material
1. Clique no menu de ações (...)
2. Selecione "Excluir"
3. Confirme a exclusão

## Dados Iniciais

O sistema vem com um material padrão para testes:
- **Contas de Cristal 6mm - Transparente**
- 450 unidades disponíveis
- Estoque mínimo: 100
- Custo: R$ 0.42/unidade
