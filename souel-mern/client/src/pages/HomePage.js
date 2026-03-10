import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Souel Cafe</h1>
          <p>Experience the finest coffee crafted with passion</p>
          <Link to="/menu" className="cta-button">Explore Menu</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card glass-card">
          <div className="feature-image coffee-bg"></div>
          <div className="feature-content">
            <div className="feature-icon">☕</div>
            <h3>Premium Coffee</h3>
            <p>Handpicked beans from around the world</p>
          </div>
        </div>

        <div className="feature-card glass-card">
          <div className="feature-image pastry-bg"></div>
          <div className="feature-content">
            <div className="feature-icon">🥐</div>
            <h3>Fresh Pastries</h3>
            <p>Baked fresh daily by our expert bakers</p>
          </div>
        </div>

        <div className="feature-card glass-card">
          <div className="feature-image community-bg"></div>
          <div className="feature-content">
            <div className="feature-icon">🤝</div>
            <h3>Community</h3>
            <p>A welcoming space for everyone</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <h2>Ready to Order?</h2>
          <p>Browse our menu and place your order today</p>
          <Link to="/menu" className="cta-button">Order Now</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
