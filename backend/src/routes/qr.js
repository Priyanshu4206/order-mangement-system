import express from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/qr/all - Download all table QR codes as a zip (admin only)
router.get('/all', auth(['admin']), (req, res) => {
  const uploadsDir = path.resolve('uploads');
  if (!fs.existsSync(uploadsDir)) {
    return res.status(404).json({ status: 'error', message: 'No QR codes found.' });
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="table-qrcodes.zip"');
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  archive.directory(uploadsDir, false);
  archive.finalize();
});

export default router; 