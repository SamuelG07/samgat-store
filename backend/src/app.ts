import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { generalRateLimiter } from './middleware/rateLimiter';
import { securityHeaders, securityLogger } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import { logger } from './utils/logger';
import { config } from './config';
import routes from './routes';

dotenv.config();

const app = express();

// Render usa proxy reverso — confiar no X-Forwarded-Proto
// Sem isto, Express pensa que é HTTP e recusa enviar cookies com secure: true
app.set('trust proxy', 1);

// Compressão
app.use(compression());

// Segurança
app.use(securityHeaders);
app.use(securityLogger);

// CORS - aceitar múltiplas origens
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origem (curl, Postman)
      if (!origin) return callback(null, true);
      
      // Verificar se a origem está na lista permitida
      if (config.cors.origins.includes(origin)) {
        return callback(null, true);
      }
      
      // Em desenvolvimento, aceitar qualquer localhost
      if (config.isDevelopment && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      
      return callback(new Error('CORS não permitido'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalRateLimiter);
app.use(logger.http.bind(logger));

// Rotas
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Samgat Store API está online!',
    timestamp: new Date().toISOString(),
  });
});

// 404 e tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
