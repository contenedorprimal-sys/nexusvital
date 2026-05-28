import React, { useState } from 'react';
import {
  ShoppingCart, Plus, Minus, Trash2, Star, Crown, Lock,
  Package, Tag, Filter, Sparkles, ShoppingBag, X,
  ChevronRight, Zap, Award, Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import '../styles/shop.css';

/* ─── Products data ─── */
const products = [
  { id: 1, name: 'Proteína Whey Premium', description: 'Proteína de suero de leche de alta calidad, 2kg', price: 899, category: 'suplementos', featured: true, rating: 4.8 },
  { id: 2, name: 'Mancuernas Ajustables', description: 'Set de mancuernas ajustables de 2-24kg', price: 2499, category: 'equipo', featured: true, rating: 4.9 },
  { id: 3, name: 'Camiseta Dry-Fit NexusVital', description: 'Camiseta deportiva con tecnología moisture-wicking', price: 349, category: 'ropa', featured: false, rating: 4.5 },
  { id: 4, name: 'Banda de Resistencia Pro', description: 'Set de 5 bandas con diferentes resistencias', price: 199, category: 'accesorios', featured: false, rating: 4.7 },
  { id: 5, name: 'Creatina Monohidratada', description: 'Creatina pura para mejor rendimiento, 500g', price: 449, category: 'suplementos', featured: false, rating: 4.6 },
  { id: 6, name: 'Mat de Yoga Premium', description: 'Tapete antideslizante de 6mm, perfecto para yoga y meditación', price: 599, category: 'equipo', featured: true, rating: 4.8 },
  { id: 7, name: 'Hoodie Gamer NexusVital', description: 'Sudadera con capucha diseño gamer exclusivo', price: 699, category: 'ropa', featured: false, rating: 4.4 },
  { id: 8, name: 'Botella Inteligente', description: 'Botella con recordatorio de hidratación LED', price: 399, category: 'accesorios', featured: false, rating: 4.3 },
];

/* ─── Category config ─── */
const categoryConfig = {
  suplementos: { gradient: 'linear-gradient(135deg, #00b894, #55efc4)', icon: Package },
  equipo:      { gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', icon: Award },
  ropa:        { gradient: 'linear-gradient(135deg, #e17055, #fab1a0)', icon: Tag },
  accesorios:  { gradient: 'linear-gradient(135deg, #fdcb6e, #ffeaa7)', icon: Gift },
};

const categoryLabels = { suplementos: 'Suplementos', equipo: 'Equipo', ropa: 'Ropa', accesorios: 'Accesorios' };

const filterOptions = [
  { key: 'todos',       label: 'Todos',        icon: Filter },
  { key: 'suplementos', label: 'Suplementos',  icon: Package },
  { key: 'equipo',      label: 'Equipo',       icon: Award },
  { key: 'ropa',        label: 'Ropa',         icon: Tag },
  { key: 'accesorios',  label: 'Accesorios',   icon: Gift },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Shop = () => {
  const { isPremium } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [cart, setCart] = useState([]); // { productId, quantity }
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  /* ─── Cart helpers ─── */
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === product.id);
      if (existing) {
        return prev.map(c => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    setToast({ message: `${product.name} agregado al carrito`, type: 'success' });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  };

  const updateQty = (productId, delta) => {
    setCart(prev => prev.map(c => {
      if (c.productId !== productId) return c;
      const newQty = c.quantity + delta;
      return newQty <= 0 ? null : { ...c, quantity: newQty };
    }).filter(Boolean));
  };

  const cartItems = cart.map(c => {
    const product = products.find(p => p.id === c.productId);
    return { ...product, quantity: c.quantity };
  }).filter(Boolean);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  /* ─── Filtered products ─── */
  const featured = products.filter(p => p.featured);
  const filtered = products.filter(p => activeFilter === 'todos' || p.category === activeFilter);

  /* ─── Render stars ─── */
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return (
      <div className="product-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={12} className={i < full ? 'star--filled' : 'star--empty'} />
        ))}
        <span>{rating}</span>
      </div>
    );
  };

  /* ━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━ */
  return (
    <div className="shop-page">
      {/* ── Premium lock overlay ── */}
      {!isPremium && (
        <div className="shop-lock-overlay">
          <div className="shop-lock-overlay__content">
            <Lock size={48} />
            <h2>Tienda Premium</h2>
            <p>Necesitas una suscripción Premium para acceder a la tienda exclusiva de NexusVital.</p>
            <Button variant="primary" icon={<Crown size={18} />} onClick={() => window.location.href = '/profile'}>
              Actualizar a Premium
            </Button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="shop-header">
        <div className="shop-header__bg" />
        <div className="shop-header__content">
          <div className="shop-header__left">
            <ShoppingBag size={32} className="shop-header__icon" />
            <div>
              <h1 className="shop-header__title">Tienda NexusVital</h1>
              <p className="shop-header__subtitle">Equipo y suplementos para tu evolución</p>
            </div>
          </div>
          <button className="cart-toggle" onClick={() => setCartOpen(!cartOpen)}>
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-toggle__badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ── Featured ── */}
      <section className="shop-featured">
        <h2 className="section-title"><Sparkles size={20} /> Productos Destacados</h2>
        <div className="featured-grid">
          {featured.map(product => {
            const cat = categoryConfig[product.category];
            return (
              <div key={product.id} className="featured-card" style={{ '--card-gradient': cat.gradient }}>
                <div className="featured-card__thumb" style={{ background: cat.gradient }}>
                  <Zap size={36} />
                  <span className="featured-card__badge">Destacado</span>
                </div>
                <div className="featured-card__body">
                  <span className="featured-card__category">{categoryLabels[product.category]}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {renderStars(product.rating)}
                  <div className="featured-card__footer">
                    <span className="featured-card__price">${product.price.toLocaleString()}</span>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => addToCart(product)}>
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Filter pills ── */}
      <section className="shop-toolbar">
        <div className="filter-pills">
          {filterOptions.map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                className={`filter-pill ${activeFilter === f.key ? 'filter-pill--active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                <Icon size={16} /> {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="products-grid">
        {filtered.map(product => {
          const cat = categoryConfig[product.category];
          const CatIcon = cat.icon;
          return (
            <article key={product.id} className="product-card">
              <div className="product-card__thumb" style={{ background: cat.gradient }}>
                <CatIcon size={28} />
              </div>
              <div className="product-card__body">
                <div className="product-card__category">{categoryLabels[product.category]}</div>
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__desc">{product.description}</p>
                {renderStars(product.rating)}
              </div>
              <div className="product-card__footer">
                <span className="product-card__price">${product.price.toLocaleString()}</span>
                <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => addToCart(product)}>
                  Agregar
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── Cart Sidebar ── */}
      <div className={`cart-sidebar ${cartOpen ? 'cart-sidebar--open' : ''}`}>
        <div className="cart-sidebar__header">
          <h3><ShoppingCart size={20} /> Carrito</h3>
          <button className="cart-sidebar__close" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-sidebar__empty">
            <ShoppingBag size={40} />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="cart-sidebar__items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__info">
                    <h4>{item.name}</h4>
                    <span className="cart-item__price">${item.price.toLocaleString()}</span>
                  </div>
                  <div className="cart-item__controls">
                    <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                    <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-sidebar__footer">
              <div className="cart-sidebar__total">
                <span>Total</span>
                <span className="cart-sidebar__total-value">${cartTotal.toLocaleString()}</span>
              </div>
              <Button
                variant="primary"
                fullWidth
                icon={<ShoppingCart size={16} />}
                onClick={() => setToast({ message: '¡Compra simulada exitosa!', type: 'success' })}
              >
                Finalizar compra
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ── Cart backdrop ── */}
      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)} />}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Shop;
