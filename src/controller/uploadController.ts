import axios from 'axios';
import { FastifyRequest, FastifyReply } from 'fastify';

// Configurações do Bunny CDN
const REGION = process.env.BUNNY_REGION || ''; // Se região alemã, deixe vazio: ''
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME || '';
const ACCESS_KEY = process.env.BUNNY_STORAGE_API_KEY || '';

interface UploadOptions {
  filename: string;
  fileBuffer: Buffer;
  contentType?: string;
}

const uploadFileToBunny = async (options: UploadOptions): Promise<boolean> => {
  const { filename, fileBuffer, contentType = 'application/octet-stream' } = options;

  try {
    const url = `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${filename}`;
    
    const response = await axios.put(url, fileBuffer, {
      headers: {
        'AccessKey': ACCESS_KEY,
        'Content-Type': contentType,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.status === 200 || response.status === 201) {
      console.log('Upload realizado com sucesso:', response.data);
      return true;
    } else {
      console.error('Erro no upload:', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

export const uploadFile = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // Verificar se o arquivo foi enviado
    if (!req.body || !Buffer.isBuffer(req.body)) {
      return res.status(400).send({
        success: false,
        message: 'Arquivo binário é obrigatório'
      });
    }

    // Pegar o filename do query parameter ou header
    const filename = (req.query as any)?.filename || (req.headers as any)['filename'];
    
    if (!filename) {
      return res.status(400).send({
        success: false,
        message: 'Filename é obrigatório (use query parameter ?filename=arquivo.jpg ou header filename)'
      });
    }

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
      return res.status(500).send({
        success: false,
        message: 'Configurações do Bunny CDN não encontradas'
      });
    }

    const uploadOptions: UploadOptions = {
      filename,
      fileBuffer: req.body as Buffer,
    };

    const success = await uploadFileToBunny(uploadOptions);

    if (success) {
      return res.status(200).send({
        success: true,
        message: 'Arquivo enviado com sucesso',
        data: {
          filename,
          url: `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${filename}`
        }
      });
    } else {
      return res.status(500).send({
        success: false,
        message: 'Falha no upload do arquivo'
      });
    }
  } catch (error) {
    console.error('Erro no controller de upload:', error);
    return res.status(500).send({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const uploadMultipleFiles = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const files = await req.files();

    if (!files) {
      return res.status(400).send({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
      return res.status(500).send({
        success: false,
        message: 'Configurações do Bunny CDN não encontradas'
      });
    }

    // Processar cada arquivo
    const uploadPromises: Promise<boolean>[] = [];
    const fileData: Array<{filename: string, contentType: string}> = [];

    for await (const file of files) {
      if (file.file) {
        const buffer = await file.toBuffer();
        const filename = file.filename || `file_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        fileData.push({
          filename,
          contentType: 'application/octet-stream'
        });

        uploadPromises.push(
          uploadFileToBunny({
            filename,
            fileBuffer: buffer,
            contentType: 'application/octet-stream'
          })
        );
      }
    }

    if (uploadPromises.length === 0) {
      return res.status(400).send({
        success: false,
        message: 'Nenhum arquivo válido encontrado'
      });
    }

    // Executar todos os uploads em paralelo
    const results = await Promise.allSettled(uploadPromises);
    
    // Contar sucessos e falhas
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    const failed = results.length - successful;

    return res.status(200).send({
      success: true,
      message: `Upload concluído: ${successful} sucessos, ${failed} falhas`,
      data: {
        total: fileData.length,
        successful,
        failed,
        results: results.map((result, index) => ({
          filename: fileData[index].filename,
          status: result.status,
          success: result.status === 'fulfilled' && result.value === true,
          error: result.status === 'rejected' ? result.reason.message : null,
          url: result.status === 'fulfilled' && result.value === true 
            ? `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${fileData[index].filename}`
            : null
        }))
      }
    });
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    return res.status(500).send({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
