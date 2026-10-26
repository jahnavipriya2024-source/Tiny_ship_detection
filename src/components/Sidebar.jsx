import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Radar, 
  Map, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export default function Sidebar() {
  const { userName, userEmail, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Ship Detection', path: '/ship-detection', icon: Radar },
    { name: 'Ship Monitoring Map', path: '/ship-monitoring', icon: Map },
    { name: 'Detection History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="mobile-nav-header">
        <div className="logo-group">
          <img src="/radar-icon.svg" alt="ShipDetect AI Logo" className="logo-img" />
          <span className="logo-text">ShipDetect <span className="logo-accent">AI</span></span>
        </div>
        <button 
          className="btn-icon mobile-menu-btn" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobile} />
      )}

      {/* Main Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <img src="/radar-icon.svg" alt="ShipDetect AI" className="brand-icon" />
          </div>
          <div className="brand-text">
            <h2>ShipDetect <span className="text-cyan">AI</span></h2>
            <span className="brand-sub">Maritime Monitoring</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="link-icon" />
                <span className="link-title">{item.name}</span>
                <span className="active-glow-indicator" />
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              <span>{userName ? userName.charAt(0).toUpperCase() : 'J'}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-email" title={userEmail}>{userEmail}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="sidebar-logout-btn"
            title="Log out of application"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        .mobile-nav-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--bg-sidebar);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-img {
          width: 32px;
          height: 32px;
        }

        .logo-text {
          font-weight: 700;
          font-size: 16px;
          color: var(--text-primary);
        }

        .logo-accent {
          color: var(--primary-cyan);
        }

        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 998;
        }

        .app-sidebar {
          width: var(--sidebar-width);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          z-index: 999;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .brand-logo-container {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
        }

        .brand-text h2 {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-primary);
        }

        .brand-sub {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sidebar-menu {
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
        }

        .sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }

        .sidebar-link.active {
          color: var(--primary-cyan);
          background-color: rgba(34, 211, 238, 0.12);
          border-color: rgba(34, 211, 238, 0.35);
          font-weight: 600;
        }

        .sidebar-link.active .active-glow-indicator {
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3.5px;
          background-color: var(--primary-cyan);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px var(--primary-cyan);
        }

        .link-icon {
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
          background-color: rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .user-profile-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px;
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-cyan), var(--secondary-teal));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #041321;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-email {
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .sidebar-logout-btn:hover {
          color: var(--detection-red);
          border-color: rgba(255, 69, 69, 0.4);
          background: rgba(255, 69, 69, 0.1);
        }

        @media (max-width: 900px) {
          .mobile-nav-header {
            display: flex;
          }

          .app-sidebar {
            transform: translateX(-100%);
            top: 60px;
          }

          .app-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
