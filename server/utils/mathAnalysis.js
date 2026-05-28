/**
 * NexusVital Mathematical Analysis Utilities
 * Provides data-driven health analysis functions.
 */

/**
 * Calculate XP gain rate over time from progress entries.
 * @param {Array} progressEntries - Array of progress documents sorted by date.
 * @returns {object} Rate information.
 */
export const calculateProgressRate = (progressEntries) => {
  if (!progressEntries || progressEntries.length < 2) {
    return {
      dailyRate: 0,
      weeklyRate: 0,
      trend: 'insufficient_data',
      totalXp: progressEntries?.[0]?.xpEarned || 0,
    };
  }

  const sorted = [...progressEntries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const totalXp = sorted.reduce((sum, entry) => sum + (entry.xpEarned || 0), 0);
  const daysDiff =
    (new Date(sorted[sorted.length - 1].date) - new Date(sorted[0].date)) /
    (1000 * 60 * 60 * 24);

  const dailyRate = daysDiff > 0 ? Math.round(totalXp / daysDiff) : totalXp;
  const weeklyRate = dailyRate * 7;

  // Trend: compare first half vs second half
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint);
  const secondHalf = sorted.slice(midpoint);

  const firstAvg =
    firstHalf.reduce((s, e) => s + (e.xpEarned || 0), 0) / firstHalf.length;
  const secondAvg =
    secondHalf.reduce((s, e) => s + (e.xpEarned || 0), 0) / secondHalf.length;

  let trend = 'stable';
  if (secondAvg > firstAvg * 1.15) trend = 'improving';
  else if (secondAvg < firstAvg * 0.85) trend = 'declining';

  return { dailyRate, weeklyRate, trend, totalXp };
};

/**
 * Calculate fatigue index based on sleep, activity intensity, and recovery.
 * @param {number} sleep - Hours of sleep (0-24).
 * @param {string} activityIntensity - 'baja', 'media', or 'alta'.
 * @param {number} recoveryDays - Days since last rest day.
 * @returns {number} Fatigue score 0-100 (higher = more fatigued).
 */
export const calculateFatigueIndex = (sleep, activityIntensity, recoveryDays) => {
  // Sleep factor: 8h is optimal, less sleep = more fatigue
  const optimalSleep = 8;
  const sleepScore = Math.min(
    40,
    Math.max(0, ((optimalSleep - (sleep || 0)) / optimalSleep) * 40)
  );

  // Intensity factor
  const intensityScores = { baja: 10, media: 20, alta: 35 };
  const intensityScore = intensityScores[activityIntensity] || 20;

  // Recovery factor: more days without rest = more fatigue
  const recoveryScore = Math.min(25, (recoveryDays || 0) * 5);

  return Math.min(100, Math.max(0, Math.round(sleepScore + intensityScore + recoveryScore)));
};

/**
 * Calculate probability of good performance based on recent progress.
 * @param {Array} recentProgress - Recent progress entries (last 7 days).
 * @returns {number} Probability 0-100.
 */
export const calculatePerformanceProbability = (recentProgress) => {
  if (!recentProgress || recentProgress.length === 0) return 50;

  let score = 50; // Baseline

  // Sleep quality factor
  const avgSleep =
    recentProgress.reduce((sum, p) => sum + (p.sleep || 7), 0) /
    recentProgress.length;
  if (avgSleep >= 7 && avgSleep <= 9) score += 15;
  else if (avgSleep >= 6) score += 5;
  else score -= 10;

  // Consistency factor: more active days = better
  const activeDays = recentProgress.filter(
    (p) => (p.activitiesCompleted || 0) > 0
  ).length;
  score += Math.min(20, (activeDays / recentProgress.length) * 20);

  // Mood factor
  const avgMood =
    recentProgress.reduce((sum, p) => sum + (p.mood || 5), 0) /
    recentProgress.length;
  score += (avgMood - 5) * 3; // +/- 3 per mood point from neutral

  // Fatigue factor
  const avgFatigue =
    recentProgress.reduce((sum, p) => sum + (p.fatigue || 5), 0) /
    recentProgress.length;
  score -= (avgFatigue - 5) * 2; // Higher fatigue reduces performance

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Detect if user is stagnating based on progress entries.
 * @param {Array} progressEntries - Progress entries sorted by date.
 * @returns {object} Stagnation analysis.
 */
export const detectStagnation = (progressEntries) => {
  if (!progressEntries || progressEntries.length < 5) {
    return {
      isStagnated: false,
      duration: 0,
      suggestions: ['Continúa registrando tu progreso para obtener análisis precisos.'],
    };
  }

  const recentEntries = progressEntries.slice(-7);
  const olderEntries = progressEntries.slice(-14, -7);

  if (olderEntries.length === 0) {
    return {
      isStagnated: false,
      duration: 0,
      suggestions: ['Necesitamos más datos históricos para detectar estancamiento.'],
    };
  }

  const recentAvgXp =
    recentEntries.reduce((s, e) => s + (e.xpEarned || 0), 0) / recentEntries.length;
  const olderAvgXp =
    olderEntries.reduce((s, e) => s + (e.xpEarned || 0), 0) / olderEntries.length;

  // Stagnation: less than 10% change in XP gain
  const changeRate =
    olderAvgXp > 0 ? Math.abs(recentAvgXp - olderAvgXp) / olderAvgXp : 0;
  const isStagnated = changeRate < 0.1 && recentEntries.length >= 5;

  // Calculate duration of stagnation
  const duration = isStagnated ? recentEntries.length : 0;

  const suggestions = [];
  if (isStagnated) {
    suggestions.push('Intenta variar la intensidad de tus ejercicios.');
    suggestions.push('Incorpora un nuevo tipo de actividad a tu rutina.');
    suggestions.push('Considera aumentar la duración de tus sesiones gradualmente.');
    suggestions.push('Revisa tu alimentación y patrones de sueño.');
  } else {
    suggestions.push('¡Buen progreso! Mantén la consistencia.');
  }

  return { isStagnated, duration, suggestions };
};

/**
 * Generate recovery recommendations based on fatigue and recent activities.
 * @param {number} fatigueIndex - Current fatigue index (0-100).
 * @param {Array} recentActivities - Recent activities.
 * @returns {object} Recovery recommendations.
 */
export const calculateRecoveryRecommendation = (fatigueIndex, recentActivities) => {
  const recommendations = {
    level: 'normal',
    restDays: 0,
    suggestions: [],
  };

  if (fatigueIndex >= 80) {
    recommendations.level = 'critical';
    recommendations.restDays = 2;
    recommendations.suggestions = [
      'Tu nivel de fatiga es crítico. Toma 2 días de descanso completo.',
      'Prioriza el sueño: intenta dormir al menos 8 horas.',
      'Hidrátate adecuadamente y consume alimentos nutritivos.',
      'Considera actividades de baja intensidad como caminar o estiramientos suaves.',
    ];
  } else if (fatigueIndex >= 60) {
    recommendations.level = 'high';
    recommendations.restDays = 1;
    recommendations.suggestions = [
      'Tu fatiga es alta. Considera un día de descanso activo.',
      'Reduce la intensidad de tus entrenamientos temporalmente.',
      'Incorpora sesiones de meditación o mindfulness.',
      'Asegúrate de dormir al menos 7-8 horas.',
    ];
  } else if (fatigueIndex >= 40) {
    recommendations.level = 'moderate';
    recommendations.restDays = 0;
    recommendations.suggestions = [
      'Niveles de fatiga moderados. Escucha a tu cuerpo.',
      'Alterna entre entrenamientos intensos y suaves.',
      'Incluye estiramientos post-entrenamiento.',
    ];
  } else {
    recommendations.level = 'low';
    recommendations.restDays = 0;
    recommendations.suggestions = [
      '¡Excelente recuperación! Estás listo para entrenar.',
      'Puedes aumentar gradualmente la intensidad.',
    ];
  }

  // Check activity distribution
  if (recentActivities && recentActivities.length > 0) {
    const highIntensityCount = recentActivities.filter(
      (a) => a.intensity === 'alta'
    ).length;
    const ratio = highIntensityCount / recentActivities.length;

    if (ratio > 0.6) {
      recommendations.suggestions.push(
        'Tienes demasiadas actividades de alta intensidad. Balancea con ejercicios suaves.'
      );
    }
  }

  return recommendations;
};
