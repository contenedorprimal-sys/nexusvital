/**
 * goalActivities.js
 * Catálogo central de actividades pre-establecidas por meta de bienestar.
 * Usado por Dashboard y Activities para mostrar objetivos personalizados.
 */

export const GOAL_META = {
  belleza: {
    label: 'Belleza',
    icon: '✨',
    color: '#e17055',
    gradient: 'linear-gradient(135deg, #e17055, #fab1a0)',
    tagline: 'Rutina de belleza y autocuidado',
    description: 'Actividades para realzar tu apariencia y cuidar tu piel',
  },
  perder_peso: {
    label: 'Perder Peso',
    icon: '⚡',
    color: '#6c5ce7',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    tagline: 'Plan de quema de grasa activo',
    description: 'Actividades para alcanzar tu peso ideal de forma saludable',
  },
  salud: {
    label: 'Salud General',
    icon: '❤️',
    color: '#00b894',
    gradient: 'linear-gradient(135deg, #00b894, #55efc4)',
    tagline: 'Bienestar integral mente y cuerpo',
    description: 'Actividades para mantener un equilibrio perfecto de salud',
  },
};

export const GOAL_ACTIVITIES = {
  belleza: [
    {
      id: 'b1',
      type: 'ejercicio',
      title: 'Core-Sculpt: Abdomen y Cintura',
      description: 'Tonifica tu abdomen y define tu cintura con ejercicios funcionales específicos para modelar la figura.',
      duration: 20,
      intensity: 'media',
      xpReward: 35,
      icon: '🏋️',
      tips: 'Enfócate en sentir el músculo en cada repetición.',
    },
    {
      id: 'b2',
      type: 'dieta',
      title: 'Hidratación activa: 2.5 L de agua + colágeno',
      description: 'Mantén la piel hidratada y elástica bebiendo al menos 2.5 litros de agua. Agrega colágeno en polvo si es posible.',
      duration: 0,
      intensity: 'baja',
      xpReward: 20,
      icon: '💧',
      tips: 'Empieza con un vaso grande al levantarte.',
    },
    {
      id: 'b3',
      type: 'meditacion',
      title: 'Ritual de relajación y reducción de cortisol',
      description: 'El estrés envejece. Dedica 10 minutos a una meditación guiada para reducir cortisol y favorecer la regeneración celular.',
      duration: 10,
      intensity: 'baja',
      xpReward: 25,
      icon: '🧘',
      tips: 'Respira profundamente: inhala 4 s, mantén 4 s, exhala 6 s.',
    },
    {
      id: 'b4',
      type: 'ejercicio',
      title: 'Yoga de glúteos y piernas',
      description: 'Activa y tonifica glúteos y piernas con una rutina de yoga de 25 minutos para lucir piernas firmes.',
      duration: 25,
      intensity: 'media',
      xpReward: 40,
      icon: '🧎',
      tips: 'Mantén cada postura por al menos 30 segundos.',
    },
    {
      id: 'b5',
      type: 'mindfulness',
      title: 'Journaling de gratitud y autoestima',
      description: 'Escribe 3 cosas que aprecias de ti hoy. La belleza empieza por dentro.',
      duration: 10,
      intensity: 'baja',
      xpReward: 20,
      icon: '📝',
      tips: 'Sé específica: evita respuestas genéricas.',
    },
    {
      id: 'b6',
      type: 'dieta',
      title: 'Snack nutritivo: frutas antioxidantes',
      description: 'Come una ración de frutas ricas en antioxidantes (arándanos, fresas, kiwi) para proteger tu piel del daño oxidativo.',
      duration: 0,
      intensity: 'baja',
      xpReward: 15,
      icon: '🍓',
      tips: 'Los antioxidantes combaten el envejecimiento celular.',
    },
  ],

  perder_peso: [
    {
      id: 'p1',
      type: 'ejercicio',
      title: 'HIIT Full-Body Quema Grasa — 30 min',
      description: 'Entrenamiento de alta intensidad por intervalos para maximizar la quema de calorías y acelerar el metabolismo.',
      duration: 30,
      intensity: 'alta',
      xpReward: 55,
      icon: '🔥',
      tips: 'Descansa solo 15 s entre series para mantener el pulso alto.',
    },
    {
      id: 'p2',
      type: 'dieta',
      title: 'Déficit calórico: desayuno proteico bajo en carbs',
      description: 'Prepara un desayuno rico en proteínas (huevos, yogur griego, claras) que te mantenga satisfecho y active el metabolismo.',
      duration: 15,
      intensity: 'baja',
      xpReward: 20,
      icon: '🥗',
      tips: 'Las proteínas aumentan la saciedad hasta 3 horas más que los carbos.',
    },
    {
      id: 'p3',
      type: 'ejercicio',
      title: 'Caminata activa de 45 minutos',
      description: 'Sal a caminar a paso rápido. La zona de quema de grasa se activa entre 60-70% de tu frecuencia cardíaca máxima.',
      duration: 45,
      intensity: 'media',
      xpReward: 40,
      icon: '🚶',
      tips: 'Mantén la espalda recta y los brazos en movimiento activo.',
    },
    {
      id: 'p4',
      type: 'dieta',
      title: 'Hidratación de déficit: 2.5 L de agua hoy',
      description: 'El agua acelera el metabolismo hasta un 30% durante 1 hora. Bebe 2.5 litros distribuidos a lo largo del día.',
      duration: 0,
      intensity: 'baja',
      xpReward: 15,
      icon: '💧',
      tips: 'Toma un vaso de agua antes de cada comida para reducir el apetito.',
    },
    {
      id: 'p5',
      type: 'meditacion',
      title: 'Meditación de control de ansiedad alimentaria',
      description: 'Practica 10 minutos de meditación guiada para controlar el hambre emocional y fortalecer tu willpower.',
      duration: 10,
      intensity: 'baja',
      xpReward: 20,
      icon: '🧠',
      tips: 'Antes de comer algo fuera de plan, espera 10 minutos.',
    },
    {
      id: 'p6',
      type: 'mindfulness',
      title: 'Registro de progreso corporal',
      description: 'Anota tus medidas o peso del día. El tracking consciente aumenta la adherencia al 87%.',
      duration: 5,
      intensity: 'baja',
      xpReward: 15,
      icon: '📊',
      tips: 'Registra siempre a la misma hora y bajo las mismas condiciones.',
    },
  ],

  salud: [
    {
      id: 's1',
      type: 'ejercicio',
      title: 'Rutina de fuerza y estabilidad — 25 min',
      description: 'Fortalece los músculos estabilizadores y mejora la postura con ejercicios de peso corporal funcional.',
      duration: 25,
      intensity: 'media',
      xpReward: 40,
      icon: '💪',
      tips: 'La respiración correcta es clave: exhala en el esfuerzo.',
    },
    {
      id: 's2',
      type: 'dieta',
      title: 'Almuerzo equilibrado: proteína + verduras + carbos complejos',
      description: 'Asegúrate de que tu almuerzo incluya una fuente de proteína, verduras variadas y carbohidratos de índice glucémico bajo.',
      duration: 20,
      intensity: 'baja',
      xpReward: 20,
      icon: '🥦',
      tips: 'Usa el método del plato: ½ verduras, ¼ proteína, ¼ carbos.',
    },
    {
      id: 's3',
      type: 'meditacion',
      title: 'Meditación de sueño reparador — 15 min',
      description: 'El sueño de calidad es el pilar más importante de la salud. Prepara tu mente para descansar profundamente.',
      duration: 15,
      intensity: 'baja',
      xpReward: 25,
      icon: '😴',
      tips: 'Realízala 30 min antes de dormir para mejores resultados.',
    },
    {
      id: 's4',
      type: 'ejercicio',
      title: 'Estiramientos de movilidad articular — 15 min',
      description: 'Mantén tus articulaciones saludables con una rutina de movilidad y estiramientos que mejore tu rango de movimiento.',
      duration: 15,
      intensity: 'baja',
      xpReward: 20,
      icon: '🤸',
      tips: 'No rebotes en los estiramientos: mantén la posición suavemente.',
    },
    {
      id: 's5',
      type: 'dieta',
      title: 'Hidratación basal: 2 L de agua hoy',
      description: 'Una hidratación adecuada mejora la energía, la concentración y la función de todos los órganos.',
      duration: 0,
      intensity: 'baja',
      xpReward: 15,
      icon: '💧',
      tips: 'Configura alarmas cada 2 horas para recordar beber.',
    },
    {
      id: 's6',
      type: 'mindfulness',
      title: 'Journaling de gratitud consciente — 10 min',
      description: 'Escribe 3 cosas por las que estás agradecido hoy. El mindfulness reduce el estrés crónico y mejora la inmunidad.',
      duration: 10,
      intensity: 'baja',
      xpReward: 20,
      icon: '📖',
      tips: 'Sé específico en lo que describes: los detalles amplifican el efecto.',
    },
  ],
};

/**
 * Devuelve las actividades pre-establecidas para la meta del usuario.
 * @param {string} goal - 'belleza' | 'perder_peso' | 'salud'
 * @returns {Array}
 */
export function getGoalActivities(goal) {
  return GOAL_ACTIVITIES[goal] ?? GOAL_ACTIVITIES.salud;
}

/**
 * Devuelve la metadata de la meta del usuario.
 * @param {string} goal
 */
export function getGoalMeta(goal) {
  return GOAL_META[goal] ?? GOAL_META.salud;
}
