import Activity from '../models/Activity.js';
import Progress from '../models/Progress.js';
import { generateRecommendations, generateDailySuggestion } from '../utils/aiEngine.js';

/**
 * @desc    Get personalized AI recommendations
 * @route   GET /api/ai/recommendations
 * @access  Private
 */
export const getRecommendations = async (req, res, next) => {
  try {
    // Fetch recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activities, progress] = await Promise.all([
      Activity.find({
        userId: req.user._id,
        createdAt: { $gte: thirtyDaysAgo },
      }).sort({ createdAt: -1 }),
      Progress.find({
        userId: req.user._id,
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: 1 }),
    ]);

    const recommendations = generateRecommendations(
      req.user,
      activities,
      progress
    );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single daily suggestion
 * @route   GET /api/ai/daily-suggestion
 * @access  Private
 */
export const getDailySuggestion = async (req, res, next) => {
  try {
    // Get today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayProgress = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    const suggestion = generateDailySuggestion(req.user, todayProgress);

    res.status(200).json({
      success: true,
      suggestion,
    });
  } catch (error) {
    next(error);
  }
};
