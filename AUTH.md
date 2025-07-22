A) QUAIS SÃO OS PADRÕES QUE TEM?

1 - jwt (TOKEN)
2 - Sessões com REDIS (Banco de dados de CACHE. Usa a memória do computador)
3 - OAuth 2.0 + OpenID Connect
4 - API Key - EuAmoMinhaQUeridaVovozina@2025
5 - Multi-Factor Auth - Google Autheticator ou Microsoft Auth

B) QUAIS OS PACOTES DE LIB QUE PRECISO USAR COM FASTIFY E MONGO USANDO A TÉCNICA APENAS DO JWT?

1 - jsonwebtoken - Criar e verificar os TOKENS JWT
2 - bcryptjs - Tony@2025 (È um erro gravar isso direto no MONGO). Precisamos salvar CRIPTOGRAFADO. wqefd78wfd5w41rf6ew416df4ewqdf4qwdv45q4wvd (HASH)
3 - @types/jsonwebtoken @types/bcryptjs - Se os projetos forem usar TYPESCRIPT
4 - @fastify/jwt @fastify/cookie @fastify/rate-limit helmet


C) QUAL É A ESTRUTURA DE AUTENTICAÇÃO RECOMENDADA EM APLICAÇÕES FASTIFY

src/
├── config/
│   ├── database.ts
│   └── jwt.ts          # Configuração do JWT
├── middleware/
│   └── auth.ts         # Middleware de autenticação
├── routes/
│   ├── auth.ts         # Rotas de login/registro
│   └── users.ts
├── controller/
│   └── authController.ts  # Lógica de autenticação
└── types/
    └── auth.ts         # Tipos para autenticação


D) Já sei qual o padrão de sistema de autenticação que vou usar. JWT. Já instalei os pacotes necessários. Já tenho os arquivos na estrutura padronizada. Você pode me listar qual serão os próximo passos? Me liste apenas atraves de BULLETS com pequena descrição.     

Próximos Passos para Implementar Autenticação JWT
1. Configuração do JWT
Criar arquivo src/config/jwt.ts com configurações de secret, expiração e refresh tokens
2. Atualizar User Schema
Adicionar campos para autenticação (refreshToken, lastLogin, role, isActive)
Implementar métodos para hash de senha e validação
3. Criar Tipos TypeScript
Definir interfaces para Request/Response de autenticação
Tipos para payload JWT e dados de usuário
4. Implementar Auth Service
Criar funções para registro, login, logout e refresh token
Lógica de hash/verificação de senhas com bcryptjs
5. Criar Middleware de Autenticação
Middleware para verificar JWT em rotas protegidas
Extrair dados do usuário do token
6. Implementar Rotas de Autenticação
POST /auth/register - Cadastro de usuário
POST /auth/login - Login com email/senha
POST /auth/refresh - Renovar token
POST /auth/logout - Logout (invalidar refresh token)
7. Configurar Fastify JWT Plugin
Registrar plugin @fastify/jwt no servidor
Configurar secret e opções de token
8. Proteger Rotas Existentes
Aplicar middleware de autenticação nas rotas que precisam de proteção
Atualizar rotas de usuários para usar dados do token
9. Implementar Validação com Zod
Schemas de validação para entrada de dados
Validação de email, senha, nome, etc.
10. Testar Fluxo Completo
Testar registro → login → acesso a rota protegida → logout
Verificar expiração e renovação de tokens
11. Configurar Variáveis de Ambiente
JWT_SECRET e JWT_REFRESH_SECRET no .env
Configurações de expiração de tokens