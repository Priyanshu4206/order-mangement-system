import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import apiRoutes from './routes/index.js';
import logger from './middleware/logger.js';
import { successResponse } from './utils/response.js';
import os from 'os';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();



function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localFrontend = `http://${getLocalIp()}:5173`;

app.use(cors({
  origin: [localFrontend, 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(logger);
app.use('/api', apiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json(successResponse({ status: 'ok' }, 'Backend is running.'));
});

// TODO: Add API routes for menu, orders, payments, etc.

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
}); 