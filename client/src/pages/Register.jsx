import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import '../styles/auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    goal: 'salud',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGoalSelect = (goal) => {
    setFormData({ ...formData, goal });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError('Nombre y correo son obligatorios');
        return;
      }
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        goal: formData.goal,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    { value: 'belleza', icon: '✨', label: 'Belleza', desc: 'Mejorar apariencia física' },
    { value: 'perder_peso', icon: '⚡', label: 'Perder Peso', desc: 'Pérdida de peso saludable' },
    { value: 'salud', icon: '❤️', label: 'Salud General', desc: 'Bienestar integral' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-left">
          <div className="auth-left-content">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">⚡</div>
              NexusVital
            </Link>
            <h1>Comienza tu viaje</h1>
            <p>Crea tu cuenta y transforma tu bienestar con herramientas inteligentes.</p>
            <div className="auth-features-list">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🎯</span>
                <span>Define tu objetivo personal</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">📈</span>
                <span>Seguimiento en tiempo real</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🏅</span>
                <span>Sistema de niveles y recompensas</span>
              </div>
            </div>
          </div>
          <div className="auth-left-bg" />
        </div>

        {/* Right Side */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>Crear Cuenta</h2>
              <p>Paso {step} de 2 — {step === 1 ? 'Información básica' : 'Seguridad y objetivo'}</p>
              <div className="auth-steps">
                <div className={`auth-step ${step >= 1 ? 'active' : ''}`} />
                <div className={`auth-step ${step >= 2 ? 'active' : ''}`} />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {step === 1 ? (
                <>
                  <div className="auth-input-group">
                    <label htmlFor="name">Nombre Completo *</label>
                    <div className="auth-input-wrapper">
                      <User size={18} className="auth-input-icon" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="reg-email">Correo Electrónico *</label>
                    <div className="auth-input-wrapper">
                      <Mail size={18} className="auth-input-icon" />
                      <input
                        id="reg-email"
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Continuar <ArrowRight size={18} />
                  </button>
                </>
              ) : (
                <>
                  <div className="auth-input-group">
                    <label htmlFor="reg-password">Contraseña *</label>
                    <div className="auth-input-wrapper">
                      <Lock size={18} className="auth-input-icon" />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                    <div className="auth-input-wrapper">
                      <Lock size={18} className="auth-input-icon" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label>Selecciona tu objetivo</label>
                    <div className="auth-goals">
                      {goals.map((goal) => (
                        <button
                          key={goal.value}
                          type="button"
                          className={`auth-goal-card ${formData.goal === goal.value ? 'selected' : ''}`}
                          onClick={() => handleGoalSelect(goal.value)}
                        >
                          <span className="auth-goal-icon">{goal.icon}</span>
                          <span className="auth-goal-label">{goal.label}</span>
                          <span className="auth-goal-desc">{goal.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                      type="button"
                      className="auth-back-btn"
                      onClick={() => setStep(1)}
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="auth-submit-btn"
                      disabled={loading}
                      style={{ flex: 1 }}
                    >
                      {loading ? (
                        <>
                          <div className="auth-spinner" />
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear Cuenta <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="auth-divider">
              <span>¿Ya tienes cuenta?</span>
            </div>

            <Link to="/login" className="auth-link-btn">
              Iniciar Sesión
            </Link>

            <p className="auth-footer-text">
              Al registrarte, aceptas nuestra{' '}
              <Link to="/privacy">Política de Privacidad</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
