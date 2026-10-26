import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  IS_LOGGED_IN: 'shipDetectAI_isLoggedIn',
  USER_EMAIL: 'shipDetectAI_userEmail',
  USER_NAME: 'shipDetectAI_userName',
  HISTORY: 'shipDetectAI_history',
  SETTINGS: 'shipDetectAI_settings',
  RECENT_ROUTES: 'shipDetectAI_recentRoutes',
  ACTIVE_PRELOAD: 'shipDetectAI_activePreload'
};

const DEFAULT_SETTINGS = {
  theme: 'dark', // 'light' | 'dark' | 'system'
  confidenceThreshold: 0.35,
  processingQuality: 'High Quality',
  defaultMapView: 'Satellite',
  mapProvider: 'Leaflet (OpenStreetMap)'
};

const INITIAL_HISTORY = [
  {
    id: 'det-001',
    type: 'detection',
    name: 'satellite_001.jpg',
    date: 'Apr 10, 2025',
    time: '10:24 AM',
    timestamp: new Date('2025-04-10T10:24:00').getTime(),
    shipsDetected: 5,
    status: 'Completed',
    imageUrl: '/images/satellite_001.svg',
    fileSize: '2.4 MB',
    processingTime: '12.4 seconds',
    model: 'DRENet',
    mode: 'Simulated Demo',
    confidenceThreshold: 0.35,
    ships: [
      { id: 'Ship 01', conf: 0.92, coords: [124, 88, 32, 28], norm: { x: 0.19, y: 0.18, w: 0.05, h: 0.06 }, lat: 13.0827, lng: 80.2707, status: 'Detected' },
      { id: 'Ship 02', conf: 0.87, coords: [210, 142, 30, 32], norm: { x: 0.32, y: 0.29, w: 0.05, h: 0.07 }, lat: 13.1124, lng: 80.3115, status: 'Detected' },
      { id: 'Ship 03', conf: 0.81, coords: [342, 221, 28, 24], norm: { x: 0.53, y: 0.46, w: 0.05, h: 0.05 }, lat: 13.1450, lng: 80.3421, status: 'Detected' },
      { id: 'Ship 04', conf: 0.76, coords: [438, 317, 40, 36], norm: { x: 0.67, y: 0.65, w: 0.06, h: 0.08 }, lat: 13.1890, lng: 80.3802, status: 'Detected' },
      { id: 'Ship 05', conf: 0.68, coords: [512, 403, 32, 28], norm: { x: 0.79, y: 0.82, w: 0.05, h: 0.06 }, lat: 13.2205, lng: 80.4120, status: 'Detected' }
    ]
  },
  {
    id: 'det-002',
    type: 'detection',
    name: 'ocean_view.jpg',
    date: 'Apr 08, 2025',
    time: '02:17 PM',
    timestamp: new Date('2025-04-08T14:17:00').getTime(),
    shipsDetected: 3,
    status: 'Completed',
    imageUrl: '/images/ocean_view.svg',
    fileSize: '3.1 MB',
    processingTime: '10.1 seconds',
    model: 'DRENet',
    mode: 'Simulated Demo',
    confidenceThreshold: 0.35,
    ships: [
      { id: 'Ship 01', conf: 0.94, coords: [170, 130, 30, 30], norm: { x: 0.26, y: 0.27, w: 0.05, h: 0.06 }, lat: 14.2100, lng: 81.1200, status: 'Detected' },
      { id: 'Ship 02', conf: 0.89, coords: [310, 250, 34, 30], norm: { x: 0.48, y: 0.52, w: 0.05, h: 0.06 }, lat: 14.3500, lng: 81.2500, status: 'Detected' },
      { id: 'Ship 03', conf: 0.83, coords: [450, 330, 32, 28], norm: { x: 0.70, y: 0.68, w: 0.05, h: 0.06 }, lat: 14.4800, lng: 81.4000, status: 'Detected' }
    ]
  },
  {
    id: 'det-003',
    type: 'detection',
    name: 'harbor_scan.jpg',
    date: 'Apr 02, 2025',
    time: '11:34 AM',
    timestamp: new Date('2025-04-02T11:34:00').getTime(),
    shipsDetected: 2,
    status: 'Completed',
    imageUrl: '/images/harbor_scan.svg',
    fileSize: '1.8 MB',
    processingTime: '8.8 seconds',
    model: 'DRENet',
    mode: 'Simulated Demo',
    confidenceThreshold: 0.35,
    ships: [
      { id: 'Ship 01', conf: 0.91, coords: [270, 100, 30, 30], norm: { x: 0.42, y: 0.21, w: 0.05, h: 0.06 }, lat: 12.9800, lng: 80.1900, status: 'Detected' },
      { id: 'Ship 02', conf: 0.85, coords: [240, 210, 32, 28], norm: { x: 0.37, y: 0.44, w: 0.05, h: 0.06 }, lat: 12.9400, lng: 80.2200, status: 'Detected' }
    ]
  },
  {
    id: 'det-004',
    type: 'detection',
    name: 'coastal_scan.jpg',
    date: 'Mar 25, 2025',
    time: '09:21 AM',
    timestamp: new Date('2025-03-25T09:21:00').getTime(),
    shipsDetected: 4,
    status: 'Completed',
    imageUrl: '/images/coastal_scan.svg',
    fileSize: '4.2 MB',
    processingTime: '11.2 seconds',
    model: 'DRENet',
    mode: 'Simulated Demo',
    confidenceThreshold: 0.35,
    ships: [
      { id: 'Ship 01', conf: 0.95, coords: [150, 110, 30, 28], norm: { x: 0.23, y: 0.23, w: 0.05, h: 0.06 }, lat: 15.1100, lng: 73.8100, status: 'Detected' },
      { id: 'Ship 02', conf: 0.88, coords: [200, 200, 30, 30], norm: { x: 0.31, y: 0.42, w: 0.05, h: 0.06 }, lat: 15.1900, lng: 73.8900, status: 'Detected' },
      { id: 'Ship 03', conf: 0.82, coords: [130, 330, 32, 30], norm: { x: 0.20, y: 0.69, w: 0.05, h: 0.06 }, lat: 15.2800, lng: 73.9600, status: 'Detected' },
      { id: 'Ship 04', conf: 0.79, coords: [290, 370, 34, 30], norm: { x: 0.45, y: 0.77, w: 0.05, h: 0.06 }, lat: 15.3600, lng: 74.0200, status: 'Detected' }
    ]
  },
  {
    id: 'det-005',
    type: 'detection',
    name: 'test_image.png',
    date: 'Mar 16, 2025',
    time: '04:10 PM',
    timestamp: new Date('2025-03-16T16:10:00').getTime(),
    shipsDetected: 0,
    status: 'Completed',
    imageUrl: '/images/test_image.svg',
    fileSize: '1.2 MB',
    processingTime: '7.5 seconds',
    model: 'DRENet',
    mode: 'Simulated Demo',
    confidenceThreshold: 0.35,
    ships: []
  }
];

const INITIAL_ROUTES = [
  {
    id: 'route-001',
    start: 'Singapore',
    end: 'Colombo',
    date: 'Apr 10, 2025',
    time: '10:54 AM',
    timestamp: new Date('2025-04-10T10:54:00').getTime(),
    distance: '1,570 NM',
    estimatedDuration: '3.8 Days',
    shipsCount: 6,
    sinkingAlerts: 1
  },
  {
    id: 'route-002',
    start: 'Dubai',
    end: 'Mumbai',
    date: 'Mar 28, 2025',
    time: '04:15 PM',
    timestamp: new Date('2025-03-28T16:15:00').getTime(),
    distance: '1,050 NM',
    estimatedDuration: '2.5 Days',
    shipsCount: 4,
    sinkingAlerts: 0
  },
  {
    id: 'route-003',
    start: 'Chennai',
    end: 'Singapore',
    date: 'Mar 20, 2025',
    time: '11:20 AM',
    timestamp: new Date('2025-03-20T11:20:00').getTime(),
    distance: '1,560 NM',
    estimatedDuration: '3.7 Days',
    shipsCount: 5,
    sinkingAlerts: 0
  }
];

export function AppProvider({ children }) {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || 'jahnavi@example.com';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Jahnavi';
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // History
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HISTORY;
  });

  // Recent Routes
  const [recentRoutes, setRecentRoutes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_ROUTES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ROUTES;
  });

  // Active Preload (used when clicking "Search Again" or "View Result" across pages)
  const [preloadedDetection, setPreloadedDetection] = useState(null);
  const [preloadedRoute, setPreloadedRoute] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync theme to DOM
  useEffect(() => {
    const applyTheme = (theme) => {
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    };
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Auth functions
  const login = (email) => {
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserName(formattedName || 'Jahnavi');
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, formattedName || 'Jahnavi');
    addToast(`Welcome back, ${formattedName || 'Jahnavi'}!`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    addToast('You have been logged out successfully.', 'info');
  };

  const updatePassword = (oldPass, newPass) => {
    if (newPass.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }
    addToast('Password updated successfully (demo state).', 'success');
    return true;
  };

  // Settings functions
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    addToast('Settings updated successfully.', 'success');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    addToast('Settings reset to system defaults.', 'info');
  };

  // History functions
  const addDetectionRecord = (record) => {
    const newRecord = {
      id: `det-${Date.now()}`,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      type: 'detection',
      ...record
    };
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    addToast('Detection result saved to history.', 'success');
    return newRecord;
  };

  const addRouteRecord = (routeData) => {
    const newRoute = {
      id: `route-${Date.now()}`,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'monitoring',
      ...routeData
    };
    const updatedRoutes = [newRoute, ...recentRoutes];
    setRecentRoutes(updatedRoutes);
    localStorage.setItem(STORAGE_KEYS.RECENT_ROUTES, JSON.stringify(updatedRoutes));

    // Also add to global history table so history page lists monitoring search
    const historyItem = {
      id: `hist-rt-${Date.now()}`,
      type: 'monitoring',
      name: `${routeData.start} → ${routeData.end}`,
      date: newRoute.date,
      time: newRoute.time,
      timestamp: newRoute.timestamp,
      shipsDetected: routeData.shipsCount || 6,
      status: 'Completed',
      imageUrl: '/images/ocean_view.svg',
      routeDetails: routeData
    };
    const updatedHistory = [historyItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));

    addToast('Route monitoring search saved.', 'success');
    return newRoute;
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    addToast('Record removed from history.', 'info');
  };

  const clearAllHistory = () => {
    setHistory([]);
    setRecentRoutes([]);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.RECENT_ROUTES, JSON.stringify([]));
    addToast('All detection and monitoring history cleared.', 'info');
  };

  const exportHistoryCSV = () => {
    if (history.length === 0) {
      addToast('No records to export.', 'error');
      return;
    }
    const headers = ['ID', 'Type', 'Name / Route', 'Date', 'Time', 'Ships Detected', 'Status'];
    const rows = history.map(item => [
      item.id,
      item.type,
      `"${item.name}"`,
      item.date,
      item.time,
      item.shipsDetected,
      item.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shipdetect_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exported history as CSV file.', 'success');
  };

  // Greeting helper based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      userEmail,
      userName,
      login,
      logout,
      updatePassword,
      settings,
      updateSettings,
      resetSettings,
      history,
      recentRoutes,
      addDetectionRecord,
      addRouteRecord,
      deleteHistoryItem,
      clearAllHistory,
      exportHistoryCSV,
      preloadedDetection,
      setPreloadedDetection,
      preloadedRoute,
      setPreloadedRoute,
      getGreeting,
      addToast,
      toasts
    }}>
      {children}
      {/* Global Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
