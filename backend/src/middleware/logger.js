const isLocal = process.env.NODE_ENV !== 'production';

const logger = (req, res, next) => {
  if (!isLocal) return next();
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log method, url, status, duration
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};

export default logger; 