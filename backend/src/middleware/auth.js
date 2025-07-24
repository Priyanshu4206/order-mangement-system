import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'devsecret';

const auth = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

export default auth; 