import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/apiRoutes.js';

export const app = express();
const PORT = parseInt(process.env.PORT || '8081', 10);

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Endpoints
app.use('/api', apiRouter);

// Root redirect / status
app.get('/', (_req, res) => {
  res.json({
    service: 'Dollar Shave Club CXAS Backend API',
    version: '1.0.0',
    documentation: '/api/openapi.json',
    health: '/api/health'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DSC API] Server listening on http://0.0.0.0:${PORT}`);
  });
}
