/**
 * NexusVital — Helper Utilities
 */

// Format date to locale string
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Date(date).toLocaleDateString('es-MX', defaultOptions);
}

// Format time elapsed
export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `hace ${interval} ${unit}${interval > 1 ? (unit === 'mes' ? 'es' : 's') : ''}`;
    }
  }
  return 'justo ahora';
}

// Format duration in minutes to readable string
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// Get category info
export function getCategoryInfo(category) {
  const categories = {
    ejercicio: {
      label: 'Ejercicio',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      icon: '💪',
      description: 'Actividad física y entrenamiento',
    },
    dieta: {
      label: 'Dieta',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      icon: '🥗',
      description: 'Alimentación y nutrición',
    },
    meditacion: {
      label: 'Meditación',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
      icon: '🧘',
      description: 'Meditación y relajación',
    },
    mindfulness: {
      label: 'Mindfulness',
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.15)',
      icon: '🌿',
      description: 'Conciencia plena y bienestar mental',
    },
  };
  return categories[category] || categories.ejercicio;
}

// Get goal info
export function getGoalInfo(goal) {
  const goals = {
    belleza: {
      label: 'Belleza',
      icon: '✨',
      description: 'Enfocado en mejorar tu apariencia y bienestar físico',
    },
    perder_peso: {
      label: 'Perder Peso',
      icon: '⚡',
      description: 'Enfocado en pérdida de peso saludable',
    },
    salud: {
      label: 'Salud General',
      icon: '❤️',
      description: 'Enfocado en mejorar tu salud integral',
    },
  };
  return goals[goal] || goals.salud;
}

// Get subscription info
export function getSubscriptionInfo(subscription) {
  const subs = {
    free: {
      label: 'Gratuito',
      color: '#94a3b8',
      icon: '🆓',
      features: ['Seguimiento básico', '1 tarea personalizada', 'Historial semanal'],
    },
    monthly: {
      label: 'Premium Mensual',
      color: '#f59e0b',
      icon: '⭐',
      features: ['Todo lo gratuito', 'Tareas ilimitadas', 'Historial mensual', 'Análisis de tendencias', 'Dashboard personalizable'],
    },
    annual: {
      label: 'Premium Anual',
      color: '#8b5cf6',
      icon: '👑',
      features: ['Todo lo mensual', 'Historial completo', 'Detección de estancamiento', 'Análisis sueño/fatiga', 'Tienda fitness'],
    },
  };
  return subs[subscription] || subs.free;
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate greeting based on time of day
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '¡Buenos días';
  if (hour < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
}

// Calculate streak
export function calculateStreak(progressEntries) {
  if (!progressEntries || progressEntries.length === 0) return 0;

  const sorted = [...progressEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const entryDate = new Date(sorted[i].date);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
