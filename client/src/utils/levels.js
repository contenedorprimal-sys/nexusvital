/**
 * NexusVital — Level System Utilities
 * Manages XP thresholds, level names, and progression
 */

export const LEVELS = {
  cobre: {
    name: 'Cobre',
    minXp: 0,
    maxXp: 499,
    color: '#B87333',
    gradient: 'linear-gradient(135deg, #B87333 0%, #cd8c52 100%)',
    tier: 'Principiante',
    tierRange: '1-3 actividades',
    icon: '🥉',
    description: 'Estás comenzando tu viaje hacia el bienestar',
  },
  plata: {
    name: 'Plata',
    minXp: 500,
    maxXp: 1499,
    color: '#C0C0C0',
    gradient: 'linear-gradient(135deg, #A8A8A8 0%, #D4D4D4 100%)',
    tier: 'Medio',
    tierRange: '4-6 actividades',
    icon: '🥈',
    description: 'Tu constancia empieza a dar frutos',
  },
  oro: {
    name: 'Oro',
    minXp: 1500,
    maxXp: 3499,
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    tier: 'Avanzado',
    tierRange: '7-9 actividades',
    icon: '🥇',
    description: 'Eres un atleta dedicado del bienestar',
  },
  platino: {
    name: 'Platino',
    minXp: 3500,
    maxXp: Infinity,
    color: '#E5E4E2',
    gradient: 'linear-gradient(135deg, #E5E4E2 0%, #B8B8B8 50%, #E5E4E2 100%)',
    tier: 'Pro',
    tierRange: 'Todas las actividades',
    icon: '💎',
    description: '¡Has alcanzado la cima! Eres una leyenda',
  },
};

export function calculateLevel(xp) {
  if (xp >= 3500) return 'platino';
  if (xp >= 1500) return 'oro';
  if (xp >= 500) return 'plata';
  return 'cobre';
}

export function getLevelInfo(levelOrXp) {
  const level = typeof levelOrXp === 'number' ? calculateLevel(levelOrXp) : levelOrXp;
  return LEVELS[level] || LEVELS.cobre;
}

export function getNextLevelProgress(xp) {
  const currentLevel = calculateLevel(xp);
  const currentInfo = LEVELS[currentLevel];
  const levelOrder = ['cobre', 'plata', 'oro', 'platino'];
  const currentIndex = levelOrder.indexOf(currentLevel);

  if (currentLevel === 'platino') {
    return {
      currentLevel: currentInfo,
      nextLevel: null,
      progress: 100,
      xpNeeded: 0,
      xpInLevel: xp - currentInfo.minXp,
    };
  }

  const nextLevel = LEVELS[levelOrder[currentIndex + 1]];
  const xpInLevel = xp - currentInfo.minXp;
  const xpRange = nextLevel.minXp - currentInfo.minXp;
  const progress = Math.min(100, Math.round((xpInLevel / xpRange) * 100));

  return {
    currentLevel: currentInfo,
    nextLevel,
    progress,
    xpNeeded: nextLevel.minXp - xp,
    xpInLevel,
  };
}

export function calculateXpForActivity(type, intensity = 'media', duration = 30) {
  const baseXp = {
    ejercicio: 30,
    dieta: 20,
    meditacion: 25,
    mindfulness: 15,
  };

  const intensityMultiplier = {
    baja: 0.7,
    media: 1.0,
    alta: 1.5,
  };

  const durationBonus = Math.floor(duration / 15) * 5;
  const base = baseXp[type] || 20;
  const multiplier = intensityMultiplier[intensity] || 1.0;

  return Math.round(base * multiplier + durationBonus);
}

export function formatXp(xp) {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
}
