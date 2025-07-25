# Variáveis de Ambiente

Este arquivo documenta todas as variáveis de ambiente necessárias para executar a aplicação.

## Configurações Obrigatórias

### Servidor
```env
PORT=4500                    # Porta do servidor (Render.com fornece automaticamente)
HOST=0.0.0.0                # Host do servidor (0.0.0.0 para aceitar conexões externas)
```

### Banco de Dados
```env
MONGODB_URI=mongodb://localhost:27017/curso-backend
```

### Autenticação
```env
JWT_SECRET=seu-secret-super-seguro-aqui-2025
```

## Configurações Opcionais

### Bunny CDN (para upload de arquivos)
```env
BUNNY_REGION=               # Região do Bunny CDN (deixe vazio para região alemã)
BUNNY_STORAGE_ZONE_NAME=    # Nome da zona de storage
BUNNY_STORAGE_API_KEY=      # Chave de API do storage
```

### Amazon S3 (alternativa para upload de arquivos)
```env
AWS_REGION=us-east-1        # Região do S3
AWS_S3_BUCKET_NAME=         # Nome do bucket
AWS_ACCESS_KEY_ID=          # Access Key ID
AWS_SECRET_ACCESS_KEY=      # Secret Access Key
```

## Configuração no Render.com

1. Vá para as configurações do seu serviço no Render.com
2. Configure como "Web Service"
3. **Build Command**: `npm run build`
4. **Start Command**: `npm run render`
5. Na seção "Environment Variables", adicione:
   - `MONGODB_URI` (sua string de conexão do MongoDB)
   - `JWT_SECRET` (uma string secreta para JWT)
   - `HOST=0.0.0.0`

**Nota:** O Render.com fornece automaticamente a variável `PORT`, então você não precisa configurá-la. 