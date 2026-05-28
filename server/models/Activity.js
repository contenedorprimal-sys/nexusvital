import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    type: {
      type: String,
      enum: ['ejercicio', 'dieta', 'meditacion', 'mindfulness'],
      required: [true, 'El tipo de actividad es obligatorio'],
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    intensity: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save: Calculate XP earned based on type and intensity when completed.
 */
ActivitySchema.pre('save', function () {
  if (this.completed && this.isModified('completed')) {
    // Base XP by type
    const typeXp = {
      ejercicio: 30,
      dieta: 20,
      meditacion: 25,
      mindfulness: 15,
    };

    // Intensity multiplier
    const intensityMultiplier = {
      baja: 0.75,
      media: 1.0,
      alta: 1.5,
    };

    const base = typeXp[this.type] || 20;
    const multiplier = intensityMultiplier[this.intensity] || 1.0;

    // Duration bonus: +1 XP per 5 minutes over 15 min
    const durationBonus = this.duration > 15 ? Math.floor((this.duration - 15) / 5) : 0;

    this.xpEarned = Math.round(base * multiplier + durationBonus);

    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }
});

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
