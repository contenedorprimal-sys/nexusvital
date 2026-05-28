import Activity from '../models/Activity.js';
import User from '../models/User.js';
import { calculateXpForActivity } from '../utils/levelSystem.js';

/**
 * @desc    Get all activities for current user
 * @route   GET /api/activities
 * @access  Private
 */
export const getActivities = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by completed status
    if (req.query.completed !== undefined) {
      query.completed = req.query.completed === 'true';
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const activities = await Activity.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single activity by ID
 * @route   GET /api/activities/:id
 * @access  Private
 */
export const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada.',
      });
    }

    // Verify ownership
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta actividad.',
      });
    }

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new activity
 * @route   POST /api/activities
 * @access  Private
 */
export const createActivity = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;

    const activity = await Activity.create(req.body);

    // If created as completed, add XP to user
    if (activity.completed && activity.xpEarned > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { xp: activity.xpEarned },
      });
    }

    res.status(201).json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an activity
 * @route   PUT /api/activities/:id
 * @access  Private
 */
export const updateActivity = async (req, res, next) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada.',
      });
    }

    // Verify ownership
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta actividad.',
      });
    }

    const wasCompleted = activity.completed;

    // Apply updates
    Object.assign(activity, req.body);

    // If marking as completed for the first time
    if (!wasCompleted && activity.completed) {
      activity.completedAt = new Date();
      const xp = calculateXpForActivity(
        activity.type,
        activity.intensity,
        activity.duration
      );
      activity.xpEarned = xp;

      // Add XP to user
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { xp },
      });
    }

    await activity.save();

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an activity
 * @route   DELETE /api/activities/:id
 * @access  Private
 */
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada.',
      });
    }

    // Verify ownership
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta actividad.',
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Actividad eliminada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated activity stats
 * @route   GET /api/activities/stats
 * @access  Private
 */
export const getActivityStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total by type
    const byType = await Activity.aggregate([
      { $match: { userId, completed: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
          totalXp: { $sum: '$xpEarned' },
          avgDuration: { $avg: '$duration' },
        },
      },
    ]);

    // Overall stats
    const overall = await Activity.aggregate([
      { $match: { userId, completed: true } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
          totalXp: { $sum: '$xpEarned' },
          avgDuration: { $avg: '$duration' },
          avgCalories: { $avg: '$calories' },
        },
      },
    ]);

    // By intensity
    const byIntensity = await Activity.aggregate([
      { $match: { userId, completed: true } },
      {
        $group: {
          _id: '$intensity',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        byType,
        overall: overall[0] || {
          totalActivities: 0,
          totalDuration: 0,
          totalCalories: 0,
          totalXp: 0,
          avgDuration: 0,
          avgCalories: 0,
        },
        byIntensity,
      },
    });
  } catch (error) {
    next(error);
  }
};
