import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['ejercicio', 'dieta', 'meditacion', 'mindfulness'],
      required: [true, 'La categoría es obligatoria'],
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pendiente', 'en_progreso', 'completada'],
      default: 'pendiente',
    },
    dueDate: {
      type: Date,
    },
    xpReward: {
      type: Number,
      default: 25,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
