import Task from '../models/Task.js';
import User from '../models/User.js';
import { calculateLevel } from '../utils/levelSystem.js';

/**
 * @desc    Get tasks for current user
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    let tasks = await Task.find(query).sort({ createdAt: -1 });

    // Seed default gamer-fit tasks if the user's task list is empty (personalized by gender and goal)
    if (tasks.length === 0 && !req.query.category && !req.query.status) {
      const user = await User.findById(req.user._id);
      const gender = user?.gender || 'femenino';
      const goal = user?.goal || 'salud';

      // Seed preset tasks based on the user's goal (ignoring gender to match the frontend goals exactly)
      let defaultTasks = [];
      if (goal === 'belleza') {
        defaultTasks = [
          { title: 'Core-Sculpt: Abdomen y Cintura', category: 'ejercicio', xpReward: 35, status: 'pendiente' },
          { title: 'Hidratación activa: 2.5 L de agua + colágeno', category: 'dieta', xpReward: 20, status: 'pendiente' },
          { title: 'Ritual de relajación y reducción de cortisol', category: 'meditacion', xpReward: 25, status: 'pendiente' },
          { title: 'Yoga de glúteos y piernas', category: 'ejercicio', xpReward: 40, status: 'pendiente' },
          { title: 'Journaling de gratitud y autoestima', category: 'mindfulness', xpReward: 20, status: 'pendiente' },
          { title: 'Snack nutritivo: frutas antioxidantes', category: 'dieta', xpReward: 15, status: 'pendiente' }
        ];
      } else if (goal === 'perder_peso') {
        defaultTasks = [
          { title: 'HIIT Full-Body Quema Grasa — 30 min', category: 'ejercicio', xpReward: 55, status: 'pendiente' },
          { title: 'Déficit calórico: desayuno proteico bajo en carbs', category: 'dieta', xpReward: 20, status: 'pendiente' },
          { title: 'Caminata activa de 45 minutos', category: 'ejercicio', xpReward: 40, status: 'pendiente' },
          { title: 'Hidratación de déficit: 2.5 L de agua hoy', category: 'dieta', xpReward: 15, status: 'pendiente' },
          { title: 'Meditación de control de ansiedad alimentaria', category: 'meditacion', xpReward: 20, status: 'pendiente' },
          { title: 'Registro de progreso corporal', category: 'mindfulness', xpReward: 15, status: 'pendiente' }
        ];
      } else {
        defaultTasks = [
          { title: 'Rutina de fuerza y estabilidad — 25 min', category: 'ejercicio', xpReward: 40, status: 'pendiente' },
          { title: 'Almuerzo equilibrado: proteína + verduras + carbos complejos', category: 'dieta', xpReward: 20, status: 'pendiente' },
          { title: 'Meditación de sueño reparador — 15 min', category: 'meditacion', xpReward: 25, status: 'pendiente' },
          { title: 'Estiramientos de movilidad articular — 15 min', category: 'ejercicio', xpReward: 20, status: 'pendiente' },
          { title: 'Hidratación basal: 2 L de agua hoy', category: 'dieta', xpReward: 15, status: 'pendiente' },
          { title: 'Journaling de gratitud consciente — 10 min', category: 'mindfulness', xpReward: 20, status: 'pendiente' }
        ];
      }

      // Assign userId to all
      defaultTasks.forEach(t => { t.userId = req.user._id; });

      tasks = await Task.insertMany(defaultTasks);
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;

    // Free users: limit to 1 custom non-completed task
    if (req.user.subscription === 'free') {
      const activeTaskCount = await Task.countDocuments({
        userId: req.user._id,
        status: { $ne: 'completada' },
      });

      if (activeTaskCount >= 1) {
        return res.status(403).json({
          success: false,
          message:
            'Los usuarios gratuitos solo pueden tener 1 tarea activa. Actualiza tu suscripción para agregar más.',
        });
      }
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada.',
      });
    }

    // Verify ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta tarea.',
      });
    }

    const wasCompleted = task.status === 'completada';

    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If completing task, award XP to user and update level
    if (!wasCompleted && task.status === 'completada') {
      const user = await User.findById(req.user._id);
      user.xp += task.xpReward;
      user.level = calculateLevel(user.xp);
      await user.save();
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada.',
      });
    }

    // Verify ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta tarea.',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tarea eliminada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};
