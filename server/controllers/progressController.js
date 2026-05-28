import Progress from '../models/Progress.js';

/**
 * @desc    Get progress entries for current user
 * @route   GET /api/progress
 * @access  Private
 */
export const getProgress = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };
    const now = new Date();

    // Subscription-based access restrictions
    if (req.user.subscription === 'free') {
      // Free: current week only
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      query.date = { $gte: startOfWeek };
    } else if (req.user.subscription === 'monthly') {
      // Monthly: current month only
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query.date = { $gte: startOfMonth };
    }
    // Annual: no date restriction (all history)

    // Additional date range filters from query params
    if (req.query.startDate || req.query.endDate) {
      if (!query.date) query.date = {};
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }

    const progress = await Progress.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update daily progress entry
 * @route   POST /api/progress
 * @access  Private
 */
export const createProgress = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if entry already exists for today
    let progress = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    if (progress) {
      // Update existing entry
      Object.assign(progress, req.body);
      progress.userId = req.user._id; // Ensure ownership
      await progress.save();
    } else {
      // Create new entry
      progress = await Progress.create({
        ...req.body,
        userId: req.user._id,
        date: new Date(),
      });
    }

    res.status(progress.isNew !== false ? 201 : 200).json({
      success: true,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly progress (last 7 days)
 * @route   GET /api/progress/weekly
 * @access  Private
 */
export const getWeeklyProgress = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const entries = await Progress.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Aggregate stats
    const totalXp = entries.reduce((sum, e) => sum + (e.xpEarned || 0), 0);
    const totalActivities = entries.reduce(
      (sum, e) => sum + (e.activitiesCompleted || 0),
      0
    );
    const avgMood =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + (e.mood || 0), 0) / entries.length
        : 0;
    const avgSleep =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + (e.sleep || 0), 0) / entries.length
        : 0;
    const avgFatigue =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + (e.fatigue || 0), 0) / entries.length
        : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalXp,
        totalActivities,
        avgMood: Math.round(avgMood * 10) / 10,
        avgSleep: Math.round(avgSleep * 10) / 10,
        avgFatigue: Math.round(avgFatigue * 10) / 10,
        daysTracked: entries.length,
      },
      entries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly progress (last 30 days) - Premium only
 * @route   GET /api/progress/monthly
 * @access  Private (monthly/annual subscription)
 */
export const getMonthlyProgress = async (req, res, next) => {
  try {
    // Check subscription
    if (req.user.subscription === 'free') {
      return res.status(403).json({
        success: false,
        message:
          'El progreso mensual está disponible solo para suscripciones mensual o anual.',
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const entries = await Progress.find({
      userId: req.user._id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    // Weekly breakdowns
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weekEntries = entries.filter(
        (e) => new Date(e.date) >= weekStart && new Date(e.date) < weekEnd
      );

      weeks.unshift({
        week: 4 - i,
        xpEarned: weekEntries.reduce((s, e) => s + (e.xpEarned || 0), 0),
        activitiesCompleted: weekEntries.reduce(
          (s, e) => s + (e.activitiesCompleted || 0),
          0
        ),
        avgMood:
          weekEntries.length > 0
            ? Math.round(
                (weekEntries.reduce((s, e) => s + (e.mood || 0), 0) /
                  weekEntries.length) *
                  10
              ) / 10
            : 0,
        daysTracked: weekEntries.length,
      });
    }

    const totalXp = entries.reduce((s, e) => s + (e.xpEarned || 0), 0);
    const totalActivities = entries.reduce(
      (s, e) => s + (e.activitiesCompleted || 0),
      0
    );

    res.status(200).json({
      success: true,
      summary: {
        totalXp,
        totalActivities,
        daysTracked: entries.length,
        weeks,
      },
      entries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate improvement trends - Annual premium only
 * @route   GET /api/progress/trends
 * @access  Private (annual subscription)
 */
export const getTrends = async (req, res, next) => {
  try {
    // Check subscription
    if (req.user.subscription !== 'annual') {
      return res.status(403).json({
        success: false,
        message: 'Las tendencias están disponibles solo para suscripción anual.',
      });
    }

    const entries = await Progress.find({ userId: req.user._id }).sort({
      date: 1,
    });

    if (entries.length < 7) {
      return res.status(200).json({
        success: true,
        message: 'Se necesitan al menos 7 días de datos para calcular tendencias.',
        trends: null,
      });
    }

    // Calculate trends comparing recent vs older data
    const midpoint = Math.floor(entries.length / 2);
    const olderHalf = entries.slice(0, midpoint);
    const recentHalf = entries.slice(midpoint);

    const calcAvg = (arr, field) =>
      arr.length > 0
        ? arr.reduce((s, e) => s + (e[field] || 0), 0) / arr.length
        : 0;

    const trends = {
      xpEarned: {
        older: Math.round(calcAvg(olderHalf, 'xpEarned')),
        recent: Math.round(calcAvg(recentHalf, 'xpEarned')),
        change: 0,
      },
      activitiesCompleted: {
        older: Math.round(calcAvg(olderHalf, 'activitiesCompleted') * 10) / 10,
        recent: Math.round(calcAvg(recentHalf, 'activitiesCompleted') * 10) / 10,
        change: 0,
      },
      mood: {
        older: Math.round(calcAvg(olderHalf, 'mood') * 10) / 10,
        recent: Math.round(calcAvg(recentHalf, 'mood') * 10) / 10,
        change: 0,
      },
      sleep: {
        older: Math.round(calcAvg(olderHalf, 'sleep') * 10) / 10,
        recent: Math.round(calcAvg(recentHalf, 'sleep') * 10) / 10,
        change: 0,
      },
      fatigue: {
        older: Math.round(calcAvg(olderHalf, 'fatigue') * 10) / 10,
        recent: Math.round(calcAvg(recentHalf, 'fatigue') * 10) / 10,
        change: 0,
      },
    };

    // Calculate percentage changes
    for (const key of Object.keys(trends)) {
      const { older, recent } = trends[key];
      trends[key].change =
        older > 0 ? Math.round(((recent - older) / older) * 100) : 0;
    }

    res.status(200).json({
      success: true,
      trends,
      totalEntries: entries.length,
    });
  } catch (error) {
    next(error);
  }
};
