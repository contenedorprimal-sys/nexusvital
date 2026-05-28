import User from '../models/User.js';

/**
 * Helper: Create JWT token, set httpOnly cookie, and send response.
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;

  const options = {
    httpOnly: true,
    secure: true, // Always true for cross-site cookies
    sameSite: 'none', // Required for cross-site cookies between different Vercel domains
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
  };

  // Remove password from response
  const userData = user.toObject();
  delete userData.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userData,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, goal } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona nombre, email y contraseña.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta con ese email.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      goal: goal || 'salud',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña.',
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (clear cookie)
 * @route   GET /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1, // expire immediately
  });

  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente.',
  });
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona la contraseña actual y la nueva.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres.',
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta.',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
