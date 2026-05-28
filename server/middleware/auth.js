import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - require authentication via JWT cookie.
 */
const protect = async (req, res, next) => {
  let token;

  // Extract token from httpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Inicia sesión para acceder.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado. Token inválido.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
};

export default protect;
