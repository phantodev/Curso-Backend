# Curso Backend - API REST

Este é um projeto de exemplo para o curso de Backend, desenvolvido com Node.js, TypeScript, Fastify e MongoDB.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Fastify** - Framework web
- **MongoDB** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm run start
```

## 🌐 Deploy no Render.com

### 1. Configuração do Repositório
- Conecte seu repositório GitHub ao Render.com
- Configure como "Web Service"

### 2. Configurações do Build
- **Build Command**: `npm run build`
- **Start Command**: `npm run render`

### 3. Variáveis de Ambiente
Configure as seguintes variáveis no Render.com:

```env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_secret_jwt_super_seguro
HOST=0.0.0.0
```

**Nota:** O Render.com fornece automaticamente a variável `PORT`.

### 4. Deploy
- Clique em "Deploy" e aguarde a conclusão
- Sua API estará disponível em: `https://seu-app.onrender.com`

## 📚 Documentação

- [Variáveis de Ambiente](ENVIRONMENT.md)
- [Autenticação](AUTH.md)

## 🛠️ Estrutura do Projeto

```
src/
├── config/          # Configurações (database, jwt)
├── controller/      # Controladores da API
├── middleware/      # Middlewares (auth)
├── model/          # Schemas do MongoDB
├── routes/         # Rotas da API
├── types/          # Tipos TypeScript
└── zod-schemas/    # Schemas de validação
```

---

##ATENÇÃO RECRUTADORES##

Ignorem os exemplos simples que estão aqui em meu GIT de modo público. São arquivos relacionados as aulas que eu leciono na empresa ELABORATA para meus alunos de BACKEND e FRONT-END. 

Esses códigos são simples, devido a grade programática de cada curso. 

Meus códigos profissionais estão todos privados obviamente.

Obrigado pela atenção!
