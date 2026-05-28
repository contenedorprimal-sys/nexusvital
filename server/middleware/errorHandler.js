/**
 * Global error handler middleware.
 * Handles Mongoose validation errors, duplicate key errors, cast errors,
 * and returns structured JSON error responses.
 */
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Mongoose CastError - invalid ObjectId
  if (err.name === 'CastError') {
    error.message = 'Recurso no encontrado. ID inválido.';
    error.statusCode = 404;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join('. ');
    error.statusCode = 400;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    error.message = `Valor duplicado para el campo: ${field}. Por favor usa otro valor.`;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Token inválido.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expirado. Inicia sesión nuevamente.';
    error.statusCode = 401;
  }

  const statusCode = error.statusCode || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
