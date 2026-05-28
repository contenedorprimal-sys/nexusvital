import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-left">
          <div className="auth-left-content">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">⚡</div>
              NexusVital
            </Link>
            <h1>Bienvenido de vuelta</h1>
            <p>Continúa tu viaje hacia el bienestar. Tu progreso te espera.</p>
            <div className="auth-features-list">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">📊</span>
                <span>Revisa tu progreso diario</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🏆</span>
                <span>Sigue subiendo de nivel</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🤖</span>
                <span>Obtén recomendaciones IA</span>
              </div>
            </div>
          </div>
          <div className="auth-left-bg" />
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para acceder</p>
            </div>

            {error && (
              <div className="auth-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="email">Correo Electrónico</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="email"
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

              <div className="auth-input-group">
                <label htmlFor="password">Contraseña</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="current-password"
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

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="auth-spinner" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>¿No tienes cuenta?</span>
            </div>

            <Link to="/register" className="auth-link-btn">
              Crear una cuenta nueva
            </Link>

            <p className="auth-footer-text">
              Al iniciar sesión, aceptas nuestra{' '}
              <Link to="/privacy">Política de Privacidad</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
