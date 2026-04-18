import dotenv from  'dotenv';
import express from 'express';
import urlRoutes from './routes/url.routes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for correct IP behind load balancers (Phase 4+)
app.set('trust proxy', 1);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/', urlRoutes);
app.use(errorHandler);

export default app;