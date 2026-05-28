import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxLength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minLength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    goal: {
      type: String,
      enum: ['belleza', 'perder_peso', 'salud'],
      default: 'salud',
    },
    gender: {
      type: String,
      enum: ['masculino', 'femenino', 'otro'],
      default: 'femenino',
    },
    subscription: {
      type: String,
      enum: ['free', 'monthly', 'annual'],
      default: 'free',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['cobre', 'plata', 'oro', 'platino'],
      default: 'cobre',
    },
    measurements: {
      weight: Number,
      height: Number,
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
    },
    preferences: {
      dashboardType: {
        type: String,
        default: 'default',
      },
      theme: {
        type: String,
        default: 'dark',
      },
    },
    cookieConsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual: Calculate level based on XP thresholds.
 */
UserSchema.virtual('calculatedLevel').get(function () {
  if (this.xp >= 3500) return 'platino';
  if (this.xp >= 1500) return 'oro';
  if (this.xp >= 500) return 'plata';
  return 'cobre';
});

/**
 * Pre-save middleware: Hash password if modified.
 * Also sync level with current XP.
 */
UserSchema.pre('save', async function () {
  // Sync level with XP
  if (this.isModified('xp')) {
    if (this.xp >= 3500) this.level = 'platino';
    else if (this.xp >= 1500) this.level = 'oro';
    else if (this.xp >= 500) this.level = 'plata';
    else this.level = 'cobre';
  }

  // Only hash if password was modified
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare entered password with the hashed password in the database.
 * @param {string} enteredPassword - The plain-text password to compare.
 * @returns {Promise<boolean>}
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate a signed JWT token for this user.
 * @returns {string} JWT token
 */
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model('User', UserSchema);

export default User;
