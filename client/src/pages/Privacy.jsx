import React, { useState, useEffect } from 'react';
import {
  Shield, ArrowLeft, FileText, Database, Eye, Cookie,
  Lock, UserCheck, Server, Users, RefreshCw, Mail,
  ChevronRight, X, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import '../styles/privacy.css';

/* ─── Table of Contents ─── */
const tocItems = [
  { id: 'introduccion',      label: 'Introducción',             icon: FileText },
  { id: 'datos-recopilados', label: 'Datos que recopilamos',    icon: Database },
  { id: 'uso-datos',         label: 'Uso de los datos',         icon: Eye },
  { id: 'cookies',           label: 'Cookies',                  icon: Cookie },
  { id: 'seguridad',         label: 'Seguridad',                icon: Lock },
  { id: 'derechos',          label: 'Derechos del usuario',     icon: UserCheck },
  { id: 'servidor',          label: 'Política del servidor',    icon: Server },
  { id: 'menores',           label: 'Menores de edad',          icon: Users },
  { id: 'cambios',           label: 'Cambios a la política',    icon: RefreshCw },
  { id: 'contacto',          label: 'Contacto',                 icon: Mail },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Privacy = () => {
  const [activeSection, setActiveSection] = useState('introduccion');
  const [cookieConsent, setCookieConsent] = useState(false);

  /* ─── Check cookie consent ─── */
  useEffect(() => {
    const consent = localStorage.getItem('nexusvital_cookie_consent');
    if (consent === 'true') setCookieConsent(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('nexusvital_cookie_consent', 'true');
    setCookieConsent(true);
  };

  /* ─── Scroll spy ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━ */
  return (
    <div className="privacy-page">
      {/* ── Back link ── */}
      <Link to="/" className="privacy-back">
        <ArrowLeft size={18} /> Volver al inicio
      </Link>

      {/* ── Header ── */}
      <header className="privacy-header">
        <Shield size={36} className="privacy-header__icon" />
        <h1>Política de Privacidad</h1>
        <p>Última actualización: Mayo 2026</p>
      </header>

      <div className="privacy-layout">
        {/* ── Table of Contents (sidebar) ── */}
        <nav className="privacy-toc">
          <h3 className="privacy-toc__title">Contenido</h3>
          <ul>
            {tocItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    className={`toc-item ${activeSection === item.id ? 'toc-item--active' : ''}`}
                    onClick={() => scrollTo(item.id)}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                    <ChevronRight size={12} className="toc-item__arrow" />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Content ── */}
        <main className="privacy-content">
          {/* 1 — Introducción */}
          <section id="introduccion" className="privacy-section">
            <div className="privacy-section__header">
              <FileText size={22} />
              <h2>1. Introducción</h2>
            </div>
            <p>
              Bienvenido a <strong>NexusVital</strong>, una plataforma de bienestar integral que combina seguimiento de actividades
              físicas, meditación, nutrición y mindfulness con un sistema de gamificación que motiva tu progreso diario.
            </p>
            <p>
              Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal
              cuando utilizas nuestra plataforma. Al registrarte y usar NexusVital, aceptas las prácticas descritas en este documento.
            </p>
            <p>
              Nos comprometemos a proteger tu privacidad y a ser transparentes sobre cómo manejamos tus datos. Si tienes alguna
              pregunta, no dudes en contactarnos.
            </p>
          </section>

          {/* 2 — Datos que recopilamos */}
          <section id="datos-recopilados" className="privacy-section">
            <div className="privacy-section__header">
              <Database size={22} />
              <h2>2. Datos que Recopilamos</h2>
            </div>
            <p>Recopilamos los siguientes tipos de información:</p>
            <div className="privacy-list">
              <div className="privacy-list__item">
                <strong>Información de registro:</strong> Nombre completo, dirección de correo electrónico y contraseña (almacenada de forma encriptada).
              </div>
              <div className="privacy-list__item">
                <strong>Datos de actividad:</strong> Tipo de actividad, duración, intensidad, calorías quemadas, fecha y hora de realización.
              </div>
              <div className="privacy-list__item">
                <strong>Medidas corporales:</strong> Peso, altura, medidas de pecho, cintura, caderas y brazos (proporcionadas voluntariamente).
              </div>
              <div className="privacy-list__item">
                <strong>Datos de progreso:</strong> Experiencia (XP), nivel, racha de actividad, logros y estadísticas de rendimiento.
              </div>
              <div className="privacy-list__item">
                <strong>Preferencias:</strong> Meta personal, tipo de dashboard, configuración de la cuenta.
              </div>
              <div className="privacy-list__item">
                <strong>Datos de suscripción:</strong> Tipo de plan, fecha de inicio y estado de la suscripción.
              </div>
            </div>
          </section>

          {/* 3 — Uso de los datos */}
          <section id="uso-datos" className="privacy-section">
            <div className="privacy-section__header">
              <Eye size={22} />
              <h2>3. Uso de los Datos</h2>
            </div>
            <p>Utilizamos tu información para:</p>
            <ul className="privacy-bullets">
              <li><strong>Personalización:</strong> Adaptar tu experiencia según tus metas y preferencias.</li>
              <li><strong>Recomendaciones:</strong> Generar sugerencias de actividades y contenido basadas en tu historial.</li>
              <li><strong>Seguimiento de progreso:</strong> Calcular tu XP, nivel, rachas y estadísticas de rendimiento.</li>
              <li><strong>Comunicaciones:</strong> Enviar notificaciones relevantes sobre tu cuenta y progreso.</li>
              <li><strong>Mejora del servicio:</strong> Analizar patrones de uso para mejorar la plataforma.</li>
              <li><strong>Inteligencia Artificial:</strong> Si eres usuario Premium, utilizamos tus datos de actividad de forma anonimizada para generar recomendaciones personalizadas a través de nuestra integración con IA.</li>
            </ul>
          </section>

          {/* 4 — Cookies */}
          <section id="cookies" className="privacy-section">
            <div className="privacy-section__header">
              <Cookie size={22} />
              <h2>4. Cookies</h2>
            </div>
            <p>
              NexusVital utiliza cookies estrictamente necesarias para el funcionamiento de la plataforma:
            </p>
            <div className="privacy-table-wrapper">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Cookie</th>
                    <th>Propósito</th>
                    <th>Tipo</th>
                    <th>Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>token</code></td>
                    <td>Autenticación de sesión (JWT)</td>
                    <td>HttpOnly, Secure</td>
                    <td>7 días</td>
                  </tr>
                  <tr>
                    <td><code>nexusvital_cookie_consent</code></td>
                    <td>Registro de consentimiento de cookies</td>
                    <td>localStorage</td>
                    <td>Permanente</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Nuestra cookie de autenticación es <strong>HttpOnly</strong>, lo que significa que no es accesible desde JavaScript
              del navegador, proporcionando una capa adicional de seguridad contra ataques XSS.
            </p>
            <p>
              No utilizamos cookies de seguimiento, publicidad ni de terceros. No rastreamos tu navegación fuera de NexusVital.
            </p>
          </section>

          {/* 5 — Seguridad */}
          <section id="seguridad" className="privacy-section">
            <div className="privacy-section__header">
              <Lock size={22} />
              <h2>5. Seguridad</h2>
            </div>
            <p>Implementamos múltiples capas de seguridad para proteger tus datos:</p>
            <div className="security-features">
              <div className="security-feature">
                <Lock size={18} />
                <div>
                  <strong>Encriptación de contraseñas</strong>
                  <p>Todas las contraseñas se almacenan usando bcrypt con salt rounds, haciendo imposible la recuperación del texto original.</p>
                </div>
              </div>
              <div className="security-feature">
                <Shield size={18} />
                <div>
                  <strong>Cookies HttpOnly</strong>
                  <p>Los tokens de sesión se almacenan en cookies HttpOnly y Secure, protegiéndolos contra ataques XSS y CSRF.</p>
                </div>
              </div>
              <div className="security-feature">
                <Server size={18} />
                <div>
                  <strong>Rate Limiting</strong>
                  <p>Implementamos límites de velocidad en las solicitudes para prevenir ataques de fuerza bruta y abuso del servicio.</p>
                </div>
              </div>
              <div className="security-feature">
                <Shield size={18} />
                <div>
                  <strong>CORS configurado</strong>
                  <p>Solo se aceptan solicitudes desde orígenes autorizados, previniendo acceso no autorizado a la API.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6 — Derechos del usuario */}
          <section id="derechos" className="privacy-section">
            <div className="privacy-section__header">
              <UserCheck size={22} />
              <h2>6. Derechos del Usuario</h2>
            </div>
            <p>Como usuario de NexusVital, tienes los siguientes derechos:</p>
            <ul className="privacy-bullets">
              <li><strong>Acceso:</strong> Puedes ver y consultar todos tus datos personales desde tu perfil en cualquier momento.</li>
              <li><strong>Rectificación:</strong> Puedes modificar tu nombre, avatar, medidas corporales y metas desde la página de perfil.</li>
              <li><strong>Eliminación:</strong> Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados desde la sección "Zona de Peligro" en tu perfil.</li>
              <li><strong>Exportación:</strong> Puedes solicitar una copia de todos tus datos en formato descargable contactándonos directamente.</li>
              <li><strong>Retiro de consentimiento:</strong> Puedes retirar tu consentimiento en cualquier momento eliminando tu cuenta.</li>
              <li><strong>Limitación de procesamiento:</strong> Puedes solicitar que limitemos el uso de tus datos contactándonos.</li>
            </ul>
          </section>

          {/* 7 — Política del servidor */}
          <section id="servidor" className="privacy-section">
            <div className="privacy-section__header">
              <Server size={22} />
              <h2>7. Política del Servidor</h2>
            </div>
            <p>
              Nuestros servidores siguen las mejores prácticas de seguridad y privacidad:
            </p>
            <ul className="privacy-bullets">
              <li><strong>Retención de datos:</strong> Tus datos se conservan mientras mantengas tu cuenta activa. Al eliminar tu cuenta, todos los datos se eliminan permanentemente en un plazo máximo de 30 días.</li>
              <li><strong>No compartimos con terceros:</strong> No vendemos, alquilamos ni compartimos tus datos personales con empresas o servicios de terceros para fines publicitarios o comerciales.</li>
              <li><strong>Cifrado en tránsito:</strong> Todas las comunicaciones entre tu navegador y nuestros servidores se realizan a través de HTTPS con cifrado TLS.</li>
              <li><strong>Backups seguros:</strong> Las copias de seguridad de la base de datos se almacenan de forma encriptada y se eliminan automáticamente después de 30 días.</li>
              <li><strong>Ubicación:</strong> Los servidores se encuentran en infraestructura segura con acceso restringido.</li>
            </ul>
          </section>

          {/* 8 — Menores de edad */}
          <section id="menores" className="privacy-section">
            <div className="privacy-section__header">
              <Users size={22} />
              <h2>8. Menores de Edad</h2>
            </div>
            <p>
              NexusVital no está dirigido a menores de 13 años. No recopilamos intencionalmente información personal
              de niños menores de 13 años.
            </p>
            <p>
              Para usuarios entre 13 y 18 años, se requiere el consentimiento de un padre o tutor legal para crear
              una cuenta y utilizar la plataforma.
            </p>
            <p>
              Si descubrimos que hemos recopilado datos de un menor sin el consentimiento apropiado, eliminaremos
              esa información de inmediato. Si crees que un menor ha proporcionado datos sin autorización, por favor
              contáctanos.
            </p>
          </section>

          {/* 9 — Cambios a la política */}
          <section id="cambios" className="privacy-section">
            <div className="privacy-section__header">
              <RefreshCw size={22} />
              <h2>9. Cambios a la Política</h2>
            </div>
            <p>
              Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cuando
              realicemos cambios significativos:
            </p>
            <ul className="privacy-bullets">
              <li>Actualizaremos la fecha de "última actualización" en la parte superior del documento.</li>
              <li>Notificaremos a los usuarios registrados por correo electrónico sobre cambios materiales.</li>
              <li>Mostraremos un aviso visible en la plataforma durante al menos 30 días.</li>
            </ul>
            <p>
              Tu uso continuado de NexusVital después de la publicación de cambios constituye tu aceptación
              de la política actualizada.
            </p>
          </section>

          {/* 10 — Contacto */}
          <section id="contacto" className="privacy-section">
            <div className="privacy-section__header">
              <Mail size={22} />
              <h2>10. Contacto</h2>
            </div>
            <p>Si tienes preguntas sobre esta Política de Privacidad o sobre el manejo de tus datos, puedes contactarnos a través de:</p>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={18} />
                <span>privacidad@nexusvital.com</span>
              </div>
              <div className="contact-item">
                <FileText size={18} />
                <span>Formulario de contacto en la plataforma</span>
              </div>
            </div>
            <p className="privacy-note">
              Responderemos a todas las solicitudes en un plazo máximo de 30 días hábiles.
            </p>
          </section>
        </main>
      </div>

      {/* ── Cookie Consent Banner ── */}
      {!cookieConsent && (
        <div className="cookie-banner">
          <div className="cookie-banner__content">
            <Cookie size={24} />
            <div>
              <h4>Uso de Cookies</h4>
              <p>
                NexusVital utiliza cookies esenciales para la autenticación y el funcionamiento de la plataforma.
                No usamos cookies de seguimiento ni de publicidad.
              </p>
            </div>
          </div>
          <div className="cookie-banner__actions">
            <Button variant="primary" icon={<CheckCircle size={16} />} onClick={acceptCookies}>
              Aceptar
            </Button>
            <button className="cookie-banner__dismiss" onClick={acceptCookies}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Privacy;
