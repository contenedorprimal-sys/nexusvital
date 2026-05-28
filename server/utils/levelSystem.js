/**
 * NexusVital Level System
 *
 * XP Thresholds:
 * - Cobre:   0   – 499
 * - Plata:   500 – 1499
 * - Oro:     1500 – 3499
 * - Platino: 3500+
 */

const LEVELS = {
  cobre: {
    name: 'Cobre',
    minXp: 0,
    maxXp: 499,
    color: '#CD7F32',
    icon: '🥉',
    tier: 1,
  },
  plata: {
    name: 'Plata',
    minXp: 500,
    maxXp: 1499,
    color: '#C0C0C0',
    icon: '🥈',
    tier: 2,
  },
  oro: {
    name: 'Oro',
    minXp: 1500,
    maxXp: 3499,
    color: '#FFD700',
    icon: '🥇',
    tier: 3,
  },
  platino: {
    name: 'Platino',
    minXp: 3500,
    maxXp: Infinity,
    color: '#E5E4E2',
    icon: '💎',
    tier: 4,
  },
};

/**
 * Calculate level string based on XP.
 * @param {number} xp - Current experience points.
 * @returns {string} Level key.
 */
export const calculateLevel = (xp) => {
  if (xp >= 3500) return 'platino';
  if (xp >= 1500) return 'oro';
  if (xp >= 500) return 'plata';
  return 'cobre';
};

/**
 * Get detailed level information.
 * @param {string} level - Level key (cobre, plata, oro, platino).
 * @returns {object} Level info object.
 */
export const getLevelInfo = (level) => {
  return LEVELS[level] || LEVELS.cobre;
};

/**
 * Calculate XP earned for a completed activity.
 * @param {string} type - Activity type.
 * @param {string} intensity - Activity intensity.
 * @param {number} duration - Duration in minutes.
 * @returns {number} XP amount.
 */
export const calculateXpForActivity = (type, intensity, duration = 0) => {
  const typeXp = {
    ejercicio: 30,
    dieta: 20,
    meditacion: 25,
    mindfulness: 15,
  };

  const intensityMultiplier = {
    baja: 0.75,
    media: 1.0,
    alta: 1.5,
  };

  const base = typeXp[type] || 20;
  const multiplier = intensityMultiplier[intensity] || 1.0;
  const durationBonus = duration > 15 ? Math.floor((duration - 15) / 5) : 0;

  return Math.round(base * multiplier + durationBonus);
};

/**
 * Get progress towards next level.
 * @param {number} xp - Current XP.
 * @returns {object} Progress info.
 */
export const getNextLevelProgress = (xp) => {
  const currentLevel = calculateLevel(xp);
  const currentInfo = getLevelInfo(currentLevel);

  // If max level, return 100% progress
  if (currentLevel === 'platino') {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      xpNeeded: 0,
    };
  }

  const levelOrder = ['cobre', 'plata', 'oro', 'platino'];
  const currentIndex = levelOrder.indexOf(currentLevel);
  const nextLevel = levelOrder[currentIndex + 1];
  const nextInfo = getLevelInfo(nextLevel);

  const xpInCurrentLevel = xp - currentInfo.minXp;
  const xpRange = nextInfo.minXp - currentInfo.minXp;
  const progress = Math.min(100, Math.round((xpInCurrentLevel / xpRange) * 100));
  const xpNeeded = nextInfo.minXp - xp;

  return {
    currentLevel,
    nextLevel,
    progress,
    xpNeeded,
  };
};
