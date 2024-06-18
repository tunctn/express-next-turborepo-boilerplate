import { ErrorMiddleware } from '@/middlewares/error.middleware';
import { logger, stream } from '@/utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import hpp from 'hpp';
import morgan from 'morgan';

// Dayjs settings
import { CORS_OPTIONS } from '@/config/cors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import helmet from 'helmet';

// V1
import { csrfMiddleware } from '@/middlewares/csrf.middleware';
import { env } from './lib/env';
import { v1Routes } from './v1/routes';

dayjs.extend(utc);

const app = express();

// Middlewares
app.use(morgan('dev', { stream }));
app.use(cors(CORS_OPTIONS));
app.use(hpp());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('cookie-parser'));
app.use(csrfMiddleware);

// Error handler
app.use(ErrorMiddleware);

// Health check
app.use('/health', (req, res) => res.status(200).send('OK'));

// Routes
v1Routes.forEach(({ router, path }) => app.use(`/v1${path}`, router));

const port = env.PORT;
const nodeEnv = env.NODE_ENV;
app.listen(port, async () => {
  logger.info(`=================================`);
  logger.info(`======= ENV: ${nodeEnv} =======`);
  logger.info(`🚀 App listening on the port ${port}`);
  logger.info(`=================================`);
});
