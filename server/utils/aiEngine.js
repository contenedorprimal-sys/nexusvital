/**
 * NexusVital AI Engine
 * Rule-based recommendation system that analyzes user data to generate
 * personalized health and wellness recommendations.
 */

import {
  calculateFatigueIndex,
  detectStagnation,
  calculateRecoveryRecommendation,
} from './mathAnalysis.js';
import { calculateLevel, getNextLevelProgress } from './levelSystem.js';

/**
 * Generate personalized recommendations based on user data.
 * @param {object} user - User document.
 * @param {Array} activities - Recent activities.
 * @param {Array} progress - Recent progress entries.
 * @returns {Array} Array of recommendation objects.
 */
export const generateRecommendations = (user, activities, progress) => {
  const recommendations = [];

  // --- 1. Goal-based recommendations ---
  const goalRecommendations = getGoalRecommendations(user.goal);
  recommendations.push(...goalRecommendations);

  // --- 2. Activity balance analysis ---
  const balanceRecs = analyzeActivityBalance(activities);
  recommendations.push(...balanceRecs);

  // --- 3. Fatigue and recovery ---
  if (progress && progress.length > 0) {
    const latestProgress = progress[progress.length - 1];
    const avgSleep =
      progress.reduce((sum, p) => sum + (p.sleep || 7), 0) / progress.length;
    const highIntensityDays = activities.filter(
      (a) => a.intensity === 'alta' && a.completed
    ).length;

    const fatigueIndex = calculateFatigueIndex(
      avgSleep,
      highIntensityDays > activities.length * 0.5 ? 'alta' : 'media',
      Math.max(0, 7 - progress.filter((p) => p.activitiesCompleted === 0).length)
    );

    const recovery = calculateRecoveryRecommendation(fatigueIndex, activities);
    if (recovery.level !== 'low') {
      recommendations.push({
        type: 'recovery',
        title: 'Recuperación recomendada',
        description: recovery.suggestions[0],
        priority: recovery.level === 'critical' ? 'high' : 'medium',
        category: 'ejercicio',
      });
    }

    // --- 4. Sleep recommendations ---
    if (avgSleep < 7) {
      recommendations.push({
        type: 'sleep',
        title: 'Mejora tu descanso',
        description: `Tu promedio de sueño es ${avgSleep.toFixed(1)}h. Intenta dormir al menos 7-8 horas para optimizar tu rendimiento.`,
        priority: avgSleep < 6 ? 'high' : 'medium',
        category: 'mindfulness',
      });
    }

    // --- 5. Mood tracking ---
    const avgMood =
      progress.reduce((sum, p) => sum + (p.mood || 5), 0) / progress.length;
    if (avgMood < 5) {
      recommendations.push({
        type: 'wellness',
        title: 'Cuidado emocional',
        description:
          'Tu estado de ánimo ha estado bajo últimamente. Las sesiones de meditación y mindfulness pueden ayudarte a sentirte mejor.',
        priority: 'high',
        category: 'meditacion',
      });
    }

    // --- 6. Stagnation detection ---
    const stagnation = detectStagnation(progress);
    if (stagnation.isStagnated) {
      recommendations.push({
        type: 'stagnation',
        title: 'Rompe la meseta',
        description: stagnation.suggestions[0],
        priority: 'high',
        category: 'ejercicio',
      });
    }
  }

  // --- 7. Level progression ---
  const levelProgress = getNextLevelProgress(user.xp);
  if (levelProgress.nextLevel && levelProgress.progress > 75) {
    recommendations.push({
      type: 'motivation',
      title: `¡Casi alcanzas el nivel ${levelProgress.nextLevel}!`,
      description: `Solo necesitas ${levelProgress.xpNeeded} XP más. ¡Sigue así!`,
      priority: 'low',
      category: 'ejercicio',
    });
  }

  // --- 8. Consistency ---
  if (activities && activities.length > 0) {
    const completedActivities = activities.filter((a) => a.completed);
    const completionRate =
      activities.length > 0 ? completedActivities.length / activities.length : 0;

    if (completionRate < 0.5) {
      recommendations.push({
        type: 'consistency',
        title: 'Mejora tu consistencia',
        description:
          'Completa más actividades para obtener mejores resultados. Intenta empezar con sesiones cortas.',
        priority: 'medium',
        category: 'ejercicio',
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort(
    (a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
  );

  return recommendations;
};

/**
 * Generate a single daily suggestion based on current state.
 * @param {object} user - User document.
 * @param {object} todayProgress - Today's progress entry (may be null).
 * @returns {object} Daily suggestion.
 */
export const generateDailySuggestion = (user, todayProgress) => {
  const suggestions = [];
  const hour = new Date().getHours();

  // Time-based suggestions
  if (hour < 12) {
    suggestions.push({
      type: 'morning',
      title: 'Buenos días 🌅',
      description:
        'Comienza tu día con 10 minutos de meditación para establecer una intención positiva.',
      priority: 'medium',
      category: 'meditacion',
    });
    suggestions.push({
      type: 'morning',
      title: 'Energía matutina ⚡',
      description:
        'Una sesión de ejercicio por la mañana puede aumentar tu energía durante todo el día.',
      priority: 'medium',
      category: 'ejercicio',
    });
  } else if (hour < 18) {
    suggestions.push({
      type: 'afternoon',
      title: 'Pausa activa 🧘',
      description:
        'Toma 5 minutos para estiramientos o respiración profunda. Tu cuerpo te lo agradecerá.',
      priority: 'low',
      category: 'mindfulness',
    });
  } else {
    suggestions.push({
      type: 'evening',
      title: 'Reflexión nocturna 🌙',
      description:
        'Antes de dormir, practica 5 minutos de mindfulness. Revisa tus logros del día.',
      priority: 'low',
      category: 'mindfulness',
    });
  }

  // Goal-based suggestion
  if (user.goal === 'perder_peso') {
    suggestions.push({
      type: 'goal',
      title: 'Hidratación 💧',
      description:
        'Beber suficiente agua es clave para tu objetivo. Intenta tomar al menos 8 vasos hoy.',
      priority: 'medium',
      category: 'dieta',
    });
  } else if (user.goal === 'belleza') {
    suggestions.push({
      type: 'goal',
      title: 'Nutrición para tu piel ✨',
      description:
        'Incluye alimentos ricos en antioxidantes como frutas y verduras de colores vivos.',
      priority: 'medium',
      category: 'dieta',
    });
  } else {
    suggestions.push({
      type: 'goal',
      title: 'Balance integral 🌿',
      description:
        'Mantener un equilibrio entre ejercicio, alimentación y descanso es la clave de la salud.',
      priority: 'medium',
      category: 'dieta',
    });
  }

  // If no progress today, encourage to start
  if (!todayProgress || todayProgress.activitiesCompleted === 0) {
    suggestions.push({
      type: 'motivation',
      title: '¡Empieza hoy! 🚀',
      description:
        'Aún no has registrado actividades hoy. Incluso 15 minutos marcan la diferencia.',
      priority: 'high',
      category: 'ejercicio',
    });
  }

  // Pick the highest priority suggestion
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort(
    (a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
  );

  return suggestions[0];
};

// ──────────────────────────────────────
//  Internal helper functions
// ──────────────────────────────────────

/**
 * Get recommendations based on user goal.
 */
function getGoalRecommendations(goal) {
  const recs = [];

  switch (goal) {
    case 'perder_peso':
      recs.push({
        type: 'goal',
        title: 'Plan de pérdida de peso',
        description:
          'Combina ejercicios cardiovasculares con una alimentación balanceada. Apunta a un déficit calórico moderado.',
        priority: 'medium',
        category: 'ejercicio',
      });
      recs.push({
        type: 'goal',
        title: 'Control de porciones',
        description:
          'Registra tu alimentación diaria. La conciencia sobre lo que comes es el primer paso.',
        priority: 'medium',
        category: 'dieta',
      });
      break;

    case 'belleza':
      recs.push({
        type: 'goal',
        title: 'Rutina de cuidado integral',
        description:
          'El ejercicio regular mejora la circulación y la salud de tu piel. Combina con meditación para reducir el estrés.',
        priority: 'medium',
        category: 'ejercicio',
      });
      recs.push({
        type: 'goal',
        title: 'Alimentación para la piel',
        description:
          'Incluye alimentos ricos en vitamina C, E y omega-3 para una piel saludable.',
        priority: 'medium',
        category: 'dieta',
      });
      break;

    case 'salud':
    default:
      recs.push({
        type: 'goal',
        title: 'Salud integral',
        description:
          'Mantén un equilibrio entre ejercicio, nutrición y bienestar mental para una salud óptima.',
        priority: 'medium',
        category: 'ejercicio',
      });
      break;
  }

  return recs;
}

/**
 * Analyze balance between different activity types.
 */
function analyzeActivityBalance(activities) {
  const recs = [];
  if (!activities || activities.length === 0) {
    recs.push({
      type: 'balance',
      title: 'Empieza tu viaje',
      description:
        'Registra tu primera actividad para comenzar a recibir recomendaciones personalizadas.',
      priority: 'high',
      category: 'ejercicio',
    });
    return recs;
  }

  const typeCounts = { ejercicio: 0, dieta: 0, meditacion: 0, mindfulness: 0 };
  activities.forEach((a) => {
    if (typeCounts[a.type] !== undefined) typeCounts[a.type]++;
  });

  const total = activities.length;

  // Check for missing categories
  if (typeCounts.meditacion === 0 && typeCounts.mindfulness === 0) {
    recs.push({
      type: 'balance',
      title: 'Incorpora bienestar mental',
      description:
        'No tienes actividades de meditación o mindfulness. Estos son fundamentales para tu bienestar integral.',
      priority: 'medium',
      category: 'meditacion',
    });
  }

  if (typeCounts.ejercicio === 0) {
    recs.push({
      type: 'balance',
      title: 'Añade ejercicio a tu rutina',
      description:
        'El ejercicio regular es esencial. Empieza con 20 minutos de actividad moderada.',
      priority: 'medium',
      category: 'ejercicio',
    });
  }

  if (typeCounts.dieta === 0) {
    recs.push({
      type: 'balance',
      title: 'Monitorea tu alimentación',
      description:
        'Registrar tu dieta te ayudará a alcanzar tus objetivos más rápido.',
      priority: 'low',
      category: 'dieta',
    });
  }

  // Over-reliance on one type
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count / total > 0.7 && total >= 5) {
      recs.push({
        type: 'balance',
        title: 'Diversifica tus actividades',
        description: `El ${Math.round((count / total) * 100)}% de tus actividades son de tipo "${type}". Intenta variar para un mejor equilibrio.`,
        priority: 'medium',
        category: type,
      });
    }
  }

  return recs;
}
