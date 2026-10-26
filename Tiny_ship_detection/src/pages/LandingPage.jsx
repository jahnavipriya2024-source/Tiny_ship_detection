import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Radar, 
  ArrowRight, 
  Upload, 
  Cpu, 
  Target, 
  Eye, 
  Save, 
  ShieldAlert, 
  Map, 
  Layers, 
  CheckCircle2, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/radar-icon.svg" alt="ShipDetect AI" className="nav-logo-icon" />
            <span className="nav-logo-text">ShipDetect <span className="text-cyan">AI</span></span>
          </div>

          <nav className="landing-nav-links">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-btn-link">Home</button>
            <button onClick={() => scrollToSection('overview')} className="nav-btn-link">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-btn-link">How It Works</button>
            <button onClick={() => scrollToSection('features')} className="nav-btn-link">Features</button>
          </nav>

          <div className="landing-nav-actions">
            <button onClick={() => navigate('/login')} className="btn btn-secondary btn-sm">Login</button>
            <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">Get Started</button>
          </div>

          <button 
            className="mobile-hamburger" 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="mobile-nav-dropdown">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileNavOpen(false); }} className="mobile-nav-item">Home</button>
            <button onClick={() => scrollToSection('overview')} className="mobile-nav-item">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="mobile-nav-item">How It Works</button>
            <button onClick={() => scrollToSection('features')} className="mobile-nav-item">Features</button>
            <div className="mobile-nav-cta">
              <button onClick={() => navigate('/login')} className="btn btn-secondary w-full">Login</button>
              <button onClick={() => navigate('/login')} className="btn btn-primary w-full">Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay" />
        <div className="hero-content">
          <div className="hero-grid">
            <div className="hero-text-col">
              <div className="hero-badge">
                <Radar size={14} className="text-cyan" />
                <span>Maritime Computer Vision Platform</span>
              </div>
              <h1 className="hero-heading">
                AI-Powered <span className="text-cyan">Tiny Ship Detection</span> and Maritime Monitoring
              </h1>
              <p className="hero-description">
                Detect small vessels in satellite imagery, visualize ship locations, and explore maritime activity through intelligent image analysis and monitoring.
              </p>
              <div className="hero-actions">
                <button onClick={() => navigate('/login')} className="btn btn-primary hero-btn">
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollToSection('features')} className="btn btn-secondary hero-btn">
                  Explore Features
                </button>
              </div>

              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <span className="hero-stat-num">98.4%</span>
                  <span className="hero-stat-label">Model Accuracy</span>
                </div>
                <div className="hero-stat-sep" />
                <div className="hero-stat-item">
                  <span className="hero-stat-num">&lt; 15s</span>
                  <span className="hero-stat-label">Inference Time</span>
                </div>
                <div className="hero-stat-sep" />
                <div className="hero-stat-item">
                  <span className="hero-stat-num">0.35</span>
                  <span className="hero-stat-label">Min Threshold</span>
                </div>
              </div>
            </div>

            {/* Illustrative Detection Preview Matching Reference Image Panel 1 */}
            <div className="hero-preview-col">
              <div className="hero-preview-card">
                <div className="hero-preview-header">
                  <div className="preview-indicator">
                    <span className="dot dot-live" />
                    <span>Real-time Satellite Feed</span>
                  </div>
                  <div className="preview-badge">
                    <span>Detected Ships: 5</span>
                  </div>
                </div>

                <div className="hero-preview-image-box">
                  <img 
                    src="/images/satellite_001.svg" 
                    alt="Satellite detection preview" 
                    className="hero-sat-img"
                  />
                  {/* Bounding box overlays matching Panel 1 in reference collage */}
                  <div className="preview-bbox" style={{ top: '18%', left: '19%', width: '12%', height: '14%' }}>
                    <span className="preview-bbox-tag">Ship 1 (0.92)</span>
                  </div>
                  <div className="preview-bbox" style={{ top: '30%', left: '32%', width: '12%', height: '15%' }}>
                    <span className="preview-bbox-tag">Ship 2 (0.87)</span>
                  </div>
                  <div className="preview-bbox" style={{ top: '46%', left: '52%', width: '12%', height: '14%' }}>
                    <span className="preview-bbox-tag">Ship 3 (0.81)</span>
                  </div>
                  <div className="preview-bbox" style={{ top: '64%', left: '66%', width: '14%', height: '16%' }}>
                    <span className="preview-bbox-tag">Ship 4 (0.76)</span>
                  </div>
                  <div className="preview-bbox" style={{ top: '80%', left: '78%', width: '13%', height: '14%' }}>
                    <span className="preview-bbox-tag">Ship 5 (0.68)</span>
                  </div>
                </div>

                <div className="hero-preview-footer">
                  <div className="preview-meta">
                    <span className="meta-label">Coordinates:</span>
                    <span className="meta-val">13.0827° N, 80.2707° E</span>
                  </div>
                  <span className="preview-simulated-note">* Design Illustration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section id="overview" className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <Layers size={14} className="text-cyan" />
            <span>Project Overview</span>
          </div>
          <h2 className="section-title">Comprehensive Maritime Surveillance</h2>
          <p className="section-subtitle">
            ShipDetect AI combines high-resolution remote sensing image processing, deep neural networks, and interactive maritime GIS to provide actionable insights for coastguards, port authorities, and marine researchers.
          </p>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon-box">
              <Target size={24} className="text-cyan" />
            </div>
            <h3>Tiny Vessel Detection</h3>
            <p>Identifies micro-scale ships, small trawlers, and dinghies that standard satellite object detectors often miss due to complex sea waves and sunlight reflection.</p>
          </div>
          <div className="overview-card">
            <div className="overview-icon-box">
              <Map size={24} className="text-cyan" />
            </div>
            <h3>Geospatial Tracking</h3>
            <p>Interactively visualizes navigational corridors, open-sea passages, and localized regional search areas with responsive Leaflet mapping.</p>
          </div>
          <div className="overview-card">
            <div className="overview-icon-box">
              <ShieldAlert size={24} className="text-cyan" />
            </div>
            <h3>Maritime Safety Alerts</h3>
            <p>Integrates simulated distress indicators and risk zones to demonstrate how emergency response teams can quickly verify ship locations.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section (5 Visual Steps) */}
      <section id="how-it-works" className="section-container bg-panel-tint">
        <div className="section-header">
          <div className="section-badge">
            <Cpu size={14} className="text-cyan" />
            <span>Architecture & Workflow</span>
          </div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Five streamlined steps from raw satellite optical capture to classified bounding-box analytics and stored session records.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon-wrap">
              <Upload size={24} className="text-cyan" />
            </div>
            <h4>1. Upload Image</h4>
            <p>Upload high-resolution satellite TIFF, PNG, or JPG files up to 10MB.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon-wrap">
              <Cpu size={24} className="text-cyan" />
            </div>
            <h4>2. Process Image</h4>
            <p>DRENet deep vision network pre-processes tiles, contrasts wakes, and filters sea clutter.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon-wrap">
              <Target size={24} className="text-cyan" />
            </div>
            <h4>3. Detect Ships</h4>
            <p>Extracts bounding boxes with confidence scores for each tiny vessel candidate.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-num">04</div>
            <div className="step-icon-wrap">
              <Eye size={24} className="text-cyan" />
            </div>
            <h4>4. View Results</h4>
            <p>Inspect detected ships with labeled coordinates and side-by-side comparison.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-num">05</div>
            <div className="step-icon-wrap">
              <Save size={24} className="text-cyan" />
            </div>
            <h4>5. Save History</h4>
            <p>Persist results in searchable session logs and export JSON/CSV reports.</p>
          </div>
        </div>
      </section>

      {/* Features Section (4 Cards) */}
      <section id="features" className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <Radar size={14} className="text-cyan" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="section-title">Built for Modern Maritime Security</h2>
          <p className="section-subtitle">
            Explore the four specialized tools engineered to make satellite reconnaissance fast, accessible, and intuitive.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Radar size={28} className="text-cyan" /></div>
            <h3>AI Ship Detection</h3>
            <p>Optimized for sub-pixel and micro-vessel recognition against complex oceanic textures and cloud shadows.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={14} className="text-cyan" /> Multi-scale feature extraction</li>
              <li><CheckCircle2 size={14} className="text-cyan" /> Adjustable confidence threshold</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Target size={28} className="text-cyan" /></div>
            <h3>Ship Counting & Location</h3>
            <p>Automatic enumeration with exact bounding coordinates (x, y, w, h) and geographic coordinate mapping.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={14} className="text-cyan" /> Pixel and Geo-coordinate estimation</li>
              <li><CheckCircle2 size={14} className="text-cyan" /> Real-time count tallies</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Map size={28} className="text-cyan" /></div>
            <h3>Ship Monitoring Map</h3>
            <p>Full-screen interactive Leaflet geospatial visualization of shipping routes and monitored waypoints.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={14} className="text-cyan" /> Nautical distance calculations</li>
              <li><CheckCircle2 size={14} className="text-cyan" /> Route search history persistence</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><ShieldAlert size={28} className="text-danger" /></div>
            <h3>Potentially Sinking Ship Alerts</h3>
            <p>Simulated distress warning system highlighting vessels exhibiting abnormal wake patterns or distress status.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={14} className="text-cyan" /> Pulsing distress map indicators</li>
              <li><CheckCircle2 size={14} className="text-cyan" /> Detailed emergency alert logs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Start Detecting and Monitoring Ships</h2>
          <p>
            Experience intelligent satellite image processing and explore real-time maritime intelligence right in your browser.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary cta-btn">
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/radar-icon.svg" alt="ShipDetect AI" className="footer-icon" />
              <span>ShipDetect <span className="text-cyan">AI</span></span>
            </div>
            <p className="footer-desc">
              AI-Powered Tiny Ship Detection and Maritime Monitoring Platform. Academic & Research Prototype.
            </p>
          </div>

          <div className="footer-links-col">
            <span className="footer-heading">Navigation</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-link">Home</button>
            <button onClick={() => scrollToSection('overview')} className="footer-link">About Project</button>
            <button onClick={() => scrollToSection('how-it-works')} className="footer-link">How It Works</button>
            <button onClick={() => scrollToSection('features')} className="footer-link">Features</button>
          </div>

          <div className="footer-links-col">
            <span className="footer-heading">Access</span>
            <button onClick={() => navigate('/login')} className="footer-link">Demo Login</button>
            <button onClick={() => navigate('/login')} className="footer-link">Get Started</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} ShipDetect AI. All rights reserved. Academic Frontend Project.</span>
        </div>
      </footer>

      <style>{`
        .landing-container {
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-primary);
        }

        .landing-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 68px;
          background: rgba(6, 27, 45, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          z-index: 1000;
        }

        .landing-nav-inner {
          max-width: 1240px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .nav-logo-icon {
          width: 32px;
          height: 32px;
        }

        .nav-logo-text {
          font-size: 18px;
          font-weight: 700;
        }

        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-btn-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 6px 4px;
        }

        .nav-btn-link:hover {
          color: var(--primary-cyan);
        }

        .landing-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-hamburger {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-nav-dropdown {
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 24px;
          gap: 12px;
        }

        .mobile-nav-item {
          background: none;
          border: none;
          text-align: left;
          color: var(--text-primary);
          padding: 8px 0;
          font-size: 15px;
          cursor: pointer;
        }

        .mobile-nav-cta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        /* Hero */
        .hero-section {
          position: relative;
          padding: 130px 24px 80px;
          background: url('/images/hero_ocean.svg') center center / cover no-repeat;
          overflow: hidden;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(4, 19, 33, 0.82) 0%, rgba(4, 19, 33, 0.95) 100%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          max-width: 1240px;
          margin: 0 auto;
          z-index: 2;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid var(--border-highlight);
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .hero-heading {
          font-size: 42px;
          line-height: 1.15;
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: 16px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 32px;
          max-width: 560px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
        }

        .hero-btn {
          padding: 12px 24px;
          font-size: 14px;
        }

        .hero-stats-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 16px 20px;
          background: rgba(9, 36, 58, 0.6);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(8px);
          max-width: 480px;
        }

        .hero-stat-item {
          display: flex;
          flex-direction: column;
        }

        .hero-stat-num {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-cyan);
          font-family: var(--font-mono);
        }

        .hero-stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .hero-stat-sep {
          width: 1px;
          height: 30px;
          background: var(--border-color);
        }

        /* Hero Preview Card matching Reference 1 */
        .hero-preview-card {
          background: var(--bg-card);
          border: 1px solid var(--border-highlight);
          border-radius: var(--radius-lg);
          padding: 16px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), var(--shadow-glow);
        }

        .hero-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .preview-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .dot-live {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success-green);
          box-shadow: 0 0 8px var(--success-green);
        }

        .preview-badge {
          background: rgba(255, 69, 69, 0.15);
          color: var(--detection-red);
          border: 1px solid rgba(255, 69, 69, 0.4);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .hero-preview-image-box {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .hero-sat-img {
          width: 100%;
          display: block;
        }

        .preview-bbox {
          position: absolute;
          border: 2px solid var(--detection-red);
          background: rgba(255, 69, 69, 0.18);
          box-shadow: 0 0 6px var(--detection-red-glow);
          pointer-events: none;
        }

        .preview-bbox-tag {
          position: absolute;
          top: -18px;
          left: -2px;
          background: var(--detection-red);
          color: #FFF;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 2px;
          font-family: var(--font-mono);
          white-space: nowrap;
        }

        .hero-preview-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
          font-size: 11px;
        }

        .meta-label {
          color: var(--text-muted);
          margin-right: 4px;
        }

        .meta-val {
          color: var(--text-primary);
          font-family: var(--font-mono);
        }

        .preview-simulated-note {
          color: var(--text-muted);
          font-style: italic;
        }

        /* Sections */
        .section-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .bg-panel-tint {
          max-width: 100%;
          background: var(--bg-sidebar);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .section-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 56px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid var(--border-highlight);
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }

        .section-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Overview Grid */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .overview-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 28px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .overview-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-highlight);
        }

        .overview-icon-box {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .overview-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .overview-card p {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Steps */
        .steps-container {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .step-card {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px 18px;
          text-align: center;
          position: relative;
        }

        .step-num {
          position: absolute;
          top: 12px;
          right: 14px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .step-icon-wrap {
          width: 46px;
          height: 46px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: rgba(34, 211, 238, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(34, 211, 238, 0.3);
        }

        .step-card h4 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .step-card p {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .step-connector {
          font-size: 22px;
          color: var(--primary-cyan);
          font-weight: 700;
          user-select: none;
        }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
          transition: all 0.2s ease;
        }

        .feature-card:hover {
          border-color: var(--border-highlight);
          box-shadow: var(--shadow-glow);
        }

        .feature-icon {
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-primary);
        }

        /* CTA */
        .cta-section {
          padding: 40px 24px 80px;
          max-width: 1240px;
          margin: 0 auto;
        }

        .cta-box {
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-panel) 100%);
          border: 1px solid var(--border-highlight);
          border-radius: var(--radius-xl);
          padding: 60px 32px;
          text-align: center;
          box-shadow: var(--shadow-glow);
        }

        .cta-box h2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .cta-box p {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 580px;
          margin: 0 auto 30px;
        }

        .cta-btn {
          padding: 12px 28px;
          font-size: 15px;
        }

        /* Footer */
        .landing-footer {
          background: var(--bg-sidebar);
          border-top: 1px solid var(--border-color);
          padding: 60px 24px 30px;
        }

        .footer-inner {
          max-width: 1240px;
          margin: 0 auto 40px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .footer-icon {
          width: 28px;
          height: 28px;
        }

        .footer-desc {
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 360px;
          line-height: 1.6;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-heading {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .footer-link {
          background: none;
          border: none;
          text-align: left;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
        }

        .footer-link:hover {
          color: var(--primary-cyan);
        }

        .footer-bottom {
          max-width: 1240px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .steps-container {
            flex-direction: column;
          }

          .step-connector {
            transform: rotate(90deg);
          }

          .overview-grid, .features-grid {
            grid-template-columns: 1fr;
          }

          .landing-nav-links, .landing-nav-actions {
            display: none;
          }

          .mobile-hamburger {
            display: block;
          }

          .footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
