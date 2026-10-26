import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  Laptop, 
  KeyRound, 
  ShieldCheck, 
  Sliders, 
  Map, 
  Trash2, 
  RotateCcw, 
  Save, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    resetSettings, 
    userEmail, 
    updatePassword, 
    clearAllHistory, 
    addToast 
  } = useApp();

  // Local state for pending changes
  const [theme, setTheme] = useState(settings.theme || 'dark');
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidenceThreshold || 0.35);
  const [processingQuality, setProcessingQuality] = useState(settings.processingQuality || 'High Quality');
  const [defaultMapView, setDefaultMapView] = useState(settings.defaultMapView || 'Satellite');
  const [mapProvider, setMapProvider] = useState(settings.mapProvider || 'Leaflet (OpenStreetMap)');

  // Change password modal / form state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Clear data confirmation modal
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Apply theme immediately on button click
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleSaveAll = () => {
    updateSettings({
      theme,
      confidenceThreshold: parseFloat(confidenceThreshold),
      processingQuality,
      defaultMapView,
      mapProvider
    });
    addToast('Preferences saved successfully!', 'success');
  };

  const handleReset = () => {
    resetSettings();
    setTheme('dark');
    setConfidenceThreshold(0.35);
    setProcessingQuality('High Quality');
    setDefaultMapView('Satellite');
    setMapProvider('Leaflet (OpenStreetMap)');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!oldPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    updatePassword(oldPassword, newPassword);
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleConfirmClearHistory = () => {
    clearAllHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="settings-header">
        <h1 className="title-xl">Settings</h1>
        <p className="subtitle">
          Configure application appearance, model detection parameters, and workspace preferences.
        </p>
      </div>

      <div className="settings-grid">
        {/* Left Column: Appearance & Detection Settings */}
        <div className="settings-column">
          {/* A. Appearance Section matching Reference 7 */}
          <div className="settings-card card">
            <h3 className="section-title">Appearance</h3>
            <div className="theme-toggle-group">
              <button
                type="button"
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <Sun size={16} />
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
              <button
                type="button"
                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <Laptop size={16} />
                <span>System</span>
              </button>
            </div>
            <span className="setting-hint">Choose your preferred application color theme.</span>
          </div>

          {/* C. Detection Settings matching Reference 7 */}
          <div className="settings-card card">
            <h3 className="section-title">Detection Settings</h3>
            
            <div className="setting-item">
              <div className="slider-header-row">
                <label className="setting-label">Confidence Threshold</label>
                <span className="slider-value-pill font-mono">{parseFloat(confidenceThreshold).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(e.target.value)}
                className="slider-input"
              />
              <span className="setting-hint">Minimum detection confidence required to identify tiny vessels.</span>
            </div>

            <div className="setting-item" style={{ marginTop: '16px' }}>
              <label className="setting-label">Default Processing</label>
              <select
                value={processingQuality}
                onChange={(e) => setProcessingQuality(e.target.value)}
                className="form-select"
              >
                <option value="High Quality">High Quality (Multi-Scale)</option>
                <option value="Standard">Standard Balance</option>
                <option value="Fast">Fast Preview (Lower Latency)</option>
              </select>
              <span className="setting-hint">Adjust detection sensitivity and processing preferences.</span>
            </div>
          </div>

          {/* E. Data Management matching Reference 7 */}
          <div className="settings-card card">
            <h3 className="section-title">Data Management</h3>
            <div className="data-management-row">
              <div>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={15} />
                  <span>Clear Detection History</span>
                </button>
                <span className="setting-hint" style={{ marginTop: '6px', display: 'block' }}>
                  This will remove all your detection history and saved route searches.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Settings & Map Settings */}
        <div className="settings-column">
          {/* B. Account Settings matching Reference 7 */}
          <div className="settings-card card">
            <h3 className="section-title">Account Settings</h3>
            <div className="account-info-box">
              <div className="account-email-row">
                <span className="setting-label">Email:</span>
                <span className="user-email-text font-mono">{userEmail}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="btn btn-secondary btn-sm change-pass-btn"
              >
                <KeyRound size={14} />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* D. Map Settings matching Reference 7 */}
          <div className="settings-card card">
            <h3 className="section-title">Map Settings</h3>
            
            <div className="setting-item">
              <label className="setting-label">Default Map View</label>
              <select
                value={defaultMapView}
                onChange={(e) => setDefaultMapView(e.target.value)}
                className="form-select"
              >
                <option value="Satellite">Satellite World Imagery (Esri)</option>
                <option value="Dark">Dark Carto Canvas</option>
                <option value="Street">Standard Street (OpenStreetMap)</option>
              </select>
            </div>

            <div className="setting-item" style={{ marginTop: '16px' }}>
              <label className="setting-label">Map Provider</label>
              <input
                type="text"
                readOnly
                value="Leaflet (OpenStreetMap / Esri Tiles)"
                className="form-input"
                style={{ opacity: 0.8, cursor: 'default' }}
              />
              <span className="setting-hint">Configure map rendering engine and tile provider.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions matching Reference 7 */}
      <div className="settings-bottom-actions">
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary reset-btn"
        >
          <RotateCcw size={15} />
          <span>Reset to Defaults</span>
        </button>
        <button
          type="button"
          onClick={handleSaveAll}
          className="btn btn-primary save-btn"
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-card small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-lg">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                {passwordError && (
                  <div className="form-error-alert">{passwordError}</div>
                )}
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)} 
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-card small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-lg text-danger">Confirm Deletion</h3>
              <button onClick={() => setShowClearConfirm(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to clear all saved detection history and monitoring searches? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowClearConfirm(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={handleConfirmClearHistory} className="btn btn-danger btn-sm">
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .settings-page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .settings-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .section-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .setting-label {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .setting-hint {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Theme Toggle Buttons */
        .theme-toggle-group {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 4px;
          gap: 4px;
        }

        .theme-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 12.5px;
          font-weight: 500;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-btn:hover {
          color: var(--text-primary);
        }

        .theme-btn.active {
          background: var(--bg-card);
          color: var(--primary-cyan);
          border: 1px solid var(--border-highlight);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        /* Slider */
        .slider-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .slider-value-pill {
          background: rgba(34, 211, 238, 0.15);
          color: var(--primary-cyan);
          border: 1px solid rgba(34, 211, 238, 0.35);
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
        }

        .slider-input {
          width: 100%;
          accent-color: var(--primary-cyan);
          cursor: pointer;
          margin-top: 4px;
        }

        /* Account */
        .account-info-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: var(--bg-panel);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .account-email-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-email-text {
          font-size: 13px;
          color: var(--text-primary);
        }

        /* Bottom Actions matching Reference 7 */
        .settings-bottom-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 12px;
        }

        .reset-btn {
          font-size: 13px;
          padding: 9px 18px;
        }

        .save-btn {
          font-size: 13px;
          padding: 9px 24px;
        }

        .form-error-alert {
          background: rgba(255, 69, 69, 0.15);
          border: 1px solid rgba(255, 69, 69, 0.4);
          color: var(--detection-red);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          margin-bottom: 14px;
        }

        .small-modal {
          max-width: 420px;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
