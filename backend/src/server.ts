import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

const { port, nodeEnv } = config;

const server = app.listen(port, () => {
  logger.info(`🚀 Samgat Store Backend`);
  logger.info(`📡 Ambiente: ${nodeEnv}`);
  logger.info(`🔗 Porta: ${port}`);
  logger.info(`🏥 Health check: http://localhost:${port}/health`);
  logger.info(`🔍 Health check DB: http://localhost:${port}/api/health/db`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.warn(`Recebido ${signal}, fechando servidor...`);
  server.close(() => {
    logger.info('Servidor fechado com sucesso.');
    process.exit(0);
  });
};

// Capturar sinais de encerramento
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
