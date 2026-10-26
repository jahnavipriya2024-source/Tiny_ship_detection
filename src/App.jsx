import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomeDashboard from './pages/HomeDashboard';
import ShipDetectionPage from './pages/ShipDetectionPage';
import ShipMonitoringMapPage from './pages/ShipMonitoringMapPage';
import DetectionHistoryPage from './pages/DetectionHistoryPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Authenticated Pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomeDashboard />} />
        <Route path="/ship-detection" element={<ShipDetectionPage />} />
        <Route path="/ship-monitoring" element={<ShipMonitoringMapPage />} />
        <Route path="/history" element={<DetectionHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
