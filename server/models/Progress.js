import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    activitiesCompleted: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    measurements: {
      weight: Number,
      height: Number,
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
    },
    mood: {
      type: Number,
      min: [1, 'El estado de ánimo mínimo es 1'],
      max: [10, 'El estado de ánimo máximo es 10'],
    },
    sleep: {
      type: Number,
    },
    fatigue: {
      type: Number,
      min: [1, 'La fatiga mínima es 1'],
      max: [10, 'La fatiga máxima es 10'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: one progress entry per user per day
ProgressSchema.index({ userId: 1, date: 1 });

const Progress = mongoose.model('Progress', ProgressSchema);

export default Progress;
