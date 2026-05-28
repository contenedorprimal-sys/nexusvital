import React, { useState, useEffect } from 'react';
import {
  BookOpen, Play, ExternalLink, Clock, Dumbbell, Brain,
  Heart, Apple, Filter, Sparkles, Search, Star, Eye,
  Loader2, Video, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';
import '../styles/resources.css';

/* ─── Hardcoded video resources (Mapped to correct CSS classes) ─── */
const videoResources = [
  { id: 1, title: 'Rutina HIIT 20 minutos - Quemar grasa rápido', channel: 'Fitness Plus', duration: '20:00', category: 'ejercicio', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI', description: 'Rutina intensa de intervalos de alta intensidad para quemar grasa.' },
  { id: 2, title: 'Yoga para principiantes - Flexibilidad total', channel: 'Yoga con Adriene', duration: '30:00', category: 'ejercicio', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', description: 'Clase de yoga ideal para quienes comienzan.' },
  { id: 3, title: 'Meditación guiada para reducir el estrés', channel: 'Calm Español', duration: '15:00', category: 'meditacion', url: 'https://www.youtube.com/watch?v=inpok4MKVLM', description: 'Sesión de meditación guiada para la calma interior.' },
  { id: 4, title: 'Mindfulness - 10 minutos de conciencia plena', channel: 'Headspace', duration: '10:00', category: 'mindfulness', url: 'https://www.youtube.com/watch?v=ZToicYcHIqo', description: 'Práctica corta de mindfulness para el día a día.' },
  { id: 5, title: 'Meal Prep saludable para la semana', channel: 'Cocina Fit', duration: '25:00', category: 'dieta', url: 'https://www.youtube.com/watch?v=wy9IhFMrPCg', description: 'Prepara tus comidas de la semana de forma saludable.' },
  { id: 6, title: 'Rutina de pesas para espalda y bíceps', channel: 'GymVirtual', duration: '35:00', category: 'ejercicio', url: 'https://www.youtube.com/watch?v=UBMk30rjy0o', description: 'Entrenamiento completo de espalda y bíceps.' },
  { id: 7, title: 'Respiración 4-7-8 para dormir mejor', channel: 'Bienestar Total', duration: '8:00', category: 'meditacion', url: 'https://www.youtube.com/watch?v=PmBYdfv5RSk', description: 'Técnica de respiración para mejorar el sueño.' },
  { id: 8, title: 'Body Scan - Relajación corporal completa', channel: 'Mindful Life', duration: '20:00', category: 'mindfulness', url: 'https://www.youtube.com/watch?v=ihwcw_ofuME', description: 'Escaneo corporal para relajación profunda.' },
  { id: 9, title: 'Batidos proteicos caseros fáciles', channel: 'NutriVida', duration: '12:00', category: 'dieta', url: 'https://www.youtube.com/watch?v=fOjZdkvRYP0', description: 'Recetas rápidas de batidos ricos en proteínas.' },
  { id: 10, title: 'Entrenamiento funcional sin equipo', channel: 'FitBody', duration: '40:00', category: 'ejercicio', url: 'https://www.youtube.com/watch?v=Tn8nr0GLZZ4', description: 'Ejercicio funcional usando solo tu peso corporal.' },
  { id: 11, title: 'Meditación para la ansiedad', channel: 'Paz Mental', duration: '18:00', category: 'meditacion', url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8', description: 'Meditación especial para manejar la ansiedad.' },
  { id: 12, title: 'Gratitud consciente - Ejercicio diario', channel: 'Mindful Moments', duration: '5:00', category: 'mindfulness', url: 'https://www.youtube.com/watch?v=qzR62JJCMBQ', description: 'Ejercicio diario de gratitud y mindfulness.' },
];

/* ─── Category config ─── */
const categoryConfig = {
  ejercicio:   { icon: Dumbbell, color: '#6c5ce7', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', label: 'Ejercicio' },
  meditacion:  { icon: Brain,    color: '#fdcb6e', gradient: 'linear-gradient(135deg, #fdcb6e, #ffeaa7)', label: 'Meditación' },
  mindfulness: { icon: Heart,    color: '#e17055', gradient: 'linear-gradient(135deg, #e17055, #fab1a0)', label: 'Mindfulness' },
  dieta:       { icon: Apple,    color: '#00b894', gradient: 'linear-gradient(135deg, #00b894, #55efc4)', label: 'Nutrición' },
};

const filterOptions = [
  { key: 'todos',       label: 'Todos',       icon: Filter },
  { key: 'ejercicio',   label: 'Ejercicio',   icon: Dumbbell },
  { key: 'meditacion',  label: 'Meditación',  icon: Brain },
  { key: 'mindfulness', label: 'Mindfulness', icon: Heart },
  { key: 'dieta',       label: 'Nutrición',   icon: Apple },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Resources = () => {
  const { user, isPremium } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  /* ─── Fetch AI suggestion ─── */
  useEffect(() => {
    const fetchAiSuggestion = async () => {
      if (!isPremium) return;
      setLoadingAi(true);
      try {
        const res = await aiAPI.getRecommendations();
        setAiSuggestion(res.data?.recommendation || null);
      } catch {
        setAiSuggestion({
          title: 'Recomendación personalizada',
          text: 'Basado en tu actividad reciente, te recomendamos incluir sesiones de meditación en tu rutina para mejorar tu recuperación y enfoque.',
        });
      } finally {
        setLoadingAi(false);
      }
    };
    fetchAiSuggestion();
  }, [isPremium]);

  /* ─── Filtered videos ─── */
  const filtered = videoResources.filter(v => {
    if (activeFilter !== 'todos' && v.category !== activeFilter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.channel.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ─── Dynamic Counts Helper ─── */
  const getCategoryCount = (categoryKey) => {
    if (categoryKey === 'todos') return videoResources.length;
    return videoResources.filter(v => v.category === categoryKey).length;
  };

  /* ─── YouTube Helpers ─── */
  const getYoutubeThumbnail = (url, category) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    const stockImages = {
      ejercicio: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600',
      meditacion: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
      mindfulness: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600',
      dieta: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600',
    };
    return stockImages[category] || stockImages.ejercicio;
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  /* ━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━ */
  return (
    <div className="resources-page">
      {/* ── Header ── */}
      <header className="resources-header">
        <div className="resources-header__left">
          <BookOpen className="resources-header__icon" style={{ color: 'var(--color-accent-primary-light)', marginRight: 'var(--space-2)' }} size={28} />
          <div>
            <h1>Recursos y Videos</h1>
            <p>Contenido curado para tu bienestar físico y mental</p>
          </div>
        </div>
      </header>

      {/* ── AI Suggestion ── */}
      {aiSuggestion && (
        <div className="ai-suggestion">
          <div className="ai-icon">
            <Sparkles size={32} style={{ color: 'var(--color-accent-primary-light)' }} />
          </div>
          <div className="ai-content">
            <h3>Sugerencia IA Personalizada</h3>
            <p>{aiSuggestion.text || aiSuggestion.title}</p>
          </div>
          {isPremium && (
            <button className="ai-action" onClick={() => setActiveFilter('meditacion')}>
              Explorar Meditación
            </button>
          )}
        </div>
      )}

      {/* ── Toolbar ── */}
      <section className="resources-toolbar">
        <div className="resources-tabs">
          {filterOptions.map(f => {
            const Icon = f.icon;
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                className={`resources-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                <Icon size={16} /> 
                <span>{f.label}</span>
                <span className="tab-count">{getCategoryCount(f.key)}</span>
              </button>
            );
          })}
        </div>
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Buscar recurso o canal…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </section>

      {/* ── Video Grid ── */}
      {filtered.length === 0 ? (
        <div className="resources-empty">
          <Video className="empty-icon" size={48} />
          <h3>No se encontraron recursos</h3>
          <p>Intenta cambiar los filtros o los términos de búsqueda</p>
        </div>
      ) : (
        <section className="resources-grid">
          {filtered.map(video => {
            const cat = categoryConfig[video.category] || categoryConfig.ejercicio;
            const CatIcon = cat.icon;
            return (
              <article key={video.id} className="video-card" onClick={() => setSelectedVideo(video)}>
                {/* Thumbnail */}
                <div className="video-thumbnail">
                  <img src={getYoutubeThumbnail(video.url, video.category)} alt={video.title} />
                  <span className="video-duration">
                    <Clock size={10} style={{ marginRight: '2px', display: 'inline' }} /> {video.duration}
                  </span>
                </div>

                <div className="video-info">
                  <div className={`video-category ${video.category}`}>
                    <CatIcon size={12} /> <span>{cat.label}</span>
                  </div>
                  <h3>{video.title}</h3>
                  <p style={{ 
                    fontSize: '12px', 
                    color: 'var(--color-text-secondary)', 
                    margin: 'var(--space-2) 0', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {video.description}
                  </p>
                  <div className="video-meta">
                    <Star size={12} style={{ color: '#fdcb6e', fill: '#fdcb6e' }} />
                    <span>{video.channel}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ── Video Player Lightbox Modal ── */}
      {selectedVideo && (
        <div className="video-player-modal" onClick={() => setSelectedVideo(null)}>
          <div className="player-container" onClick={(e) => e.stopPropagation()}>
            <div className="player-header">
              <h3>{selectedVideo.title}</h3>
              <button className="btn-close-player" onClick={() => setSelectedVideo(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="player-embed">
              <iframe
                src={getEmbedUrl(selectedVideo.url)}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
