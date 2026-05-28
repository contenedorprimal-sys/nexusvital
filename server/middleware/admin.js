/**
 * Admin authorization middleware.
 * Must be used after the protect middleware (requires req.user).
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.',
    });
  }

  next();
};

export default admin;
