import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Task from '../models/Task.js';
import Progress from '../models/Progress.js';

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
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
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'avatar', 'goal', 'gender', 'measurements', 'preferences', 'cookieConsent'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const goalChanged = updates.goal !== undefined || updates.gender !== undefined;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (goalChanged) {
      // Clear current tasks to force automatic re-seeding matching the new goal
      await Task.deleteMany({ userId: req.user._id });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update subscription type (simulated)
 * @route   PUT /api/users/subscription
 * @access  Private
 */
export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !['free', 'monthly', 'annual'].includes(subscription)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de suscripción inválido. Opciones: free, monthly, annual.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Suscripción actualizada a "${subscription}" exitosamente.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete current user account and all related data
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Delete all related data
    await Promise.all([
      Activity.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      Progress.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    // Clear auth cookie
    res.cookie('token', 'none', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1,
    });

    res.status(200).json({
      success: true,
      message: 'Cuenta eliminada exitosamente junto con todos los datos asociados.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin only) with pagination
 * @route   GET /api/users/admin/all
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update any user (admin only)
 * @route   PUT /api/users/admin/:id
 * @access  Private/Admin
 */
export const adminUpdateUser = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'email',
      'role',
      'subscription',
      'goal',
      'xp',
      'level',
      'avatar',
    ];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete any user (admin only)
 * @route   DELETE /api/users/admin/:id
 * @access  Private/Admin
 */
export const adminDeleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    // Delete all related data
    await Promise.all([
      Activity.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      Progress.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.status(200).json({
      success: true,
      message: 'Usuario y datos asociados eliminados exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};
