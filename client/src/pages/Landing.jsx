import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Heart, Brain, Leaf, BarChart3, Sparkles, Check, X as XIcon, Menu, X } from 'lucide-react';
import '../styles/landing.css';

function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: '💪', title: 'Ejercicio', desc: 'Registra y da seguimiento a tus rutinas de ejercicio. Desde cardio hasta pesas, controla cada sesión.', iconClass: 'feature-icon-exercise' },
    { icon: '🥗', title: 'Dieta', desc: 'Lleva un control de tu alimentación diaria. Registra comidas y calorías para alcanzar tus metas.', iconClass: 'feature-icon-diet' },
    { icon: '🧘', title: 'Meditación', desc: 'Practica la calma interior con sesiones guiadas. Mejora tu concentración y reduce el estrés.', iconClass: 'feature-icon-meditation' },
    { icon: '🌿', title: 'Mindfulness', desc: 'Conecta con el presente a través de ejercicios de conciencia plena y bienestar mental.', iconClass: 'feature-icon-mindfulness' },
    { icon: '📊', title: 'Progreso Real', desc: 'Visualiza tu avance con gráficos interactivos. Barras diarias, semanales y mensuales.', iconClass: 'feature-icon-tracking' },
    { icon: '🤖', title: 'IA Personalizada', desc: 'Recibe recomendaciones inteligentes basadas en tu perfil, rendimiento y objetivos.', iconClass: 'feature-icon-ai' },
  ];

  const levels = [
    { name: 'Cobre', icon: '🥉', tier: 'Principiante', xp: '0 - 499 XP', cls: 'level-card-cobre' },
    { name: 'Plata', icon: '🥈', tier: 'Medio', xp: '500 - 1,499 XP', cls: 'level-card-plata' },
    { name: 'Oro', icon: '🥇', tier: 'Avanzado', xp: '1,500 - 3,499 XP', cls: 'level-card-oro' },
    { name: 'Platino', icon: '💎', tier: 'Pro', xp: '3,500+ XP', cls: 'level-card-platino' },
  ];

  const pricingPlans = [
    {
      name: 'Gratuito',
      price: '$0',
      period: '/siempre',
      features: [
        { text: 'Seguimiento de actividades', included: true },
        { text: 'Progreso diario y semanal', included: true },
        { text: '1 tarea personalizada', included: true },
        { text: 'Recursos de YouTube', included: true },
        { text: 'Historial mensual', included: false },
        { text: 'Análisis de tendencias', included: false },
        { text: 'Dashboard personalizable', included: false },
        { text: 'Tienda fitness', included: false },
      ],
      featured: false,
      btnClass: 'btn-secondary',
    },
    {
      name: 'Premium Mensual',
      price: '$99',
      period: '/mes',
      features: [
        { text: 'Todo lo gratuito', included: true },
        { text: 'Tareas ilimitadas', included: true },
        { text: 'Historial del mes', included: true },
        { text: 'Análisis de tendencias', included: true },
        { text: 'Dashboard personalizable', included: true },
        { text: 'IA completa', included: true },
        { text: 'Detección de estancamiento', included: false },
        { text: 'Análisis sueño/fatiga', included: false },
      ],
      featured: true,
      btnClass: 'btn-primary',
    },
    {
      name: 'Premium Anual',
      price: '$799',
      period: '/año',
      features: [
        { text: 'Todo lo mensual', included: true },
        { text: 'Historial completo', included: true },
        { text: 'Detección de estancamiento', included: true },
        { text: 'Análisis sueño/fatiga/rendimiento', included: true },
        { text: 'Tienda fitness gamer', included: true },
        { text: 'Soporte prioritario', included: true },
        { text: 'IA avanzada con historial', included: true },
        { text: 'Estadísticas de por vida', included: true },
      ],
      featured: false,
      btnClass: 'btn-primary',
    },
  ];

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-logo">
          <div className="landing-logo-icon">⚡</div>
          NexusVital
        </div>
        <ul className="landing-nav-links">
          <li><a href="#features">Características</a></li>
          <li><a href="#levels">Niveles</a></li>
          <li><a href="#pricing">Planes</a></li>
          <li><Link to="/privacy">Privacidad</Link></li>
        </ul>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none' }}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none' }}>
            Registrarse
          </Link>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          background: 'rgba(10, 14, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: 'var(--space-6)',
          zIndex: 'var(--z-sidebar)',
          borderBottom: '1px solid var(--color-border)',
          animation: 'fadeInDown 0.3s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-3) 0' }}>Características</a>
            <a href="#levels" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-3) 0' }}>Niveles</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-3) 0' }}>Planes</a>
            <Link to="/privacy" style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-3) 0' }}>Privacidad</Link>
            <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
              <Link to="/login" className="btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Iniciar Sesión</Link>
              <Link to="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Registrarse</Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-floating hero-floating-1" />
        <div className="hero-floating hero-floating-2" />
        <div className="hero-floating hero-floating-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Plataforma de Bienestar Integral
          </div>

          <h1>
            Tu camino hacia el{' '}
            <span className="gradient-text">bienestar total</span>
          </h1>

          <p className="hero-subtitle">
            Registra tu ejercicio, dieta, meditación y mindfulness.
            Visualiza tu progreso, sube de nivel y recibe recomendaciones
            personalizadas con inteligencia artificial.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary">
              Comenzar Gratis <ArrowRight size={20} />
            </Link>
            <a href="#features" className="hero-btn-secondary">
              Descubrir Más
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">4</div>
              <div className="hero-stat-label">Áreas de Bienestar</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">4</div>
              <div className="hero-stat-label">Niveles de Progreso</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">∞</div>
              <div className="hero-stat-label">Potencial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-label">Características</span>
          <h2 className="section-title">Todo lo que necesitas para tu bienestar</h2>
          <p className="section-subtitle">
            NexusVital integra las herramientas más importantes para que lleves un control completo de tu salud.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`feature-icon ${feature.iconClass}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels Section */}
      <section className="levels-section" id="levels">
        <div className="section-header">
          <span className="section-label">Gamificación</span>
          <h2 className="section-title">Sube de nivel con cada logro</h2>
          <p className="section-subtitle">
            Completa actividades, gana XP y desbloquea niveles. ¿Puedes llegar a Platino?
          </p>
        </div>

        <div className="levels-grid">
          {levels.map((level, index) => (
            <div key={index} className={`level-card ${level.cls}`}>
              <div className="level-icon">{level.icon}</div>
              <h3>{level.name}</h3>
              <div className="level-tier">{level.tier}</div>
              <span className="level-xp">{level.xp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <span className="section-label">Planes</span>
          <h2 className="section-title">Elige tu plan perfecto</h2>
          <p className="section-subtitle">
            Comienza gratis y mejora cuando estés listo. Sin compromisos.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              <div className="pricing-header">
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">
                  {plan.price}<span>{plan.period}</span>
                </div>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className={feature.included ? '' : 'disabled'}>
                    <span className={feature.included ? 'check' : 'cross'}>
                      {feature.included ? <Check size={16} /> : <XIcon size={16} />}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`pricing-btn ${plan.btnClass}`}>
                {plan.featured ? 'Comenzar Ahora' : 'Seleccionar Plan'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para transformar tu vida?</h2>
          <p>Únete a NexusVital y comienza tu camino hacia el bienestar total hoy mismo.</p>
          <Link to="/register" className="hero-btn-primary" style={{ display: 'inline-flex' }}>
            Crear Cuenta Gratis <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo">
              <div className="landing-logo-icon">⚡</div>
              NexusVital
            </div>
            <p>Tu plataforma integral de salud y bienestar. Ejercicio, dieta, meditación y mindfulness en un solo lugar.</p>
          </div>
          <div className="footer-column">
            <h4>Plataforma</h4>
            <ul>
              <li><a href="#features">Características</a></li>
              <li><a href="#pricing">Planes</a></li>
              <li><a href="#levels">Niveles</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Recursos</h4>
            <ul>
              <li><Link to="/resources">Videos</Link></li>
              <li><Link to="/resources">Meditación</Link></li>
              <li><Link to="/resources">Ejercicios</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacidad</Link></li>
              <li><Link to="/privacy">Términos</Link></li>
              <li><Link to="/privacy">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NexusVital. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ para tu bienestar</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
