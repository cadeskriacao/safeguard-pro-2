# 🚀 Guia de Deploy no Vercel

## ✅ Arquivos Configurados

Os seguintes arquivos foram criados/atualizados para garantir o funcionamento correto no Vercel:

1. ✅ `vercel.json` - Configuração de SPA routing
2. ✅ `vite.config.ts` - Adicionado `base: '/'` e otimização de chunks
3. ✅ `.env.example` - Template de variáveis de ambiente

## 📋 Passo a Passo para Deploy

### 1️⃣ Configurar Variáveis de Ambiente no Vercel

**IMPORTANTE**: Você DEVE configurar estas variáveis no painel do Vercel:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Como configurar:**
1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis acima
4. Cole os valores do seu arquivo `.env.local`
5. Selecione **Production**, **Preview** e **Development**
6. Clique em **Save**

### 2️⃣ Fazer Deploy

```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

O Vercel vai automaticamente:
- Detectar o framework Vite
- Rodar `npm install`
- Rodar `npm run build`
- Fazer deploy da pasta `dist/`

### 3️⃣ Verificar se Funcionou

Após o deploy:
1. Acesse a URL do projeto
2. Abra o **Console do Navegador** (F12)
3. Verifique se não há erros
4. Teste fazer login

## 🔍 Troubleshooting

### Tela Branca?
- ✅ Verifique se as variáveis de ambiente estão configuradas no Vercel
- ✅ Abra o Console (F12) e veja os erros
- ✅ Verifique os logs de build no Vercel

### Erro 404 ao navegar?
- ✅ O arquivo `vercel.json` deve estar no repositório
- ✅ Faça um novo deploy após adicionar o arquivo

### Erro de Conexão com Supabase?
- ✅ Confirme que as variáveis de ambiente estão corretas
- ✅ Verifique se começam com `VITE_` (obrigatório para Vite)

## 📝 Resumo das Mudanças

### `vercel.json`
```json
{
  "rewrites": [{
    "source": "/(.*)",
    "destination": "/index.html"
  }]
}
```
Garante que todas as rotas sejam redirecionadas para index.html (necessário para SPA)

### `vite.config.ts`
- ✅ `base: '/'` - Define o caminho base
- ✅ `chunkSizeWarningLimit: 1000` - Aumenta limite de chunk
- ✅ `manualChunks` - Separa React e Supabase em chunks dedicados

---

**Dica**: Após configurar as variáveis de ambiente, force um novo deploy clicando em "Redeploy" no painel do Vercel.
