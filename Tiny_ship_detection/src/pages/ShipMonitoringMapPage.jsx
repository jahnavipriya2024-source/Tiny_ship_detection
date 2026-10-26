import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  AlertTriangle, 
  Ship, 
  Compass, 
  Search, 
  Trash2, 
  Save, 
  Layers, 
  CheckCircle2, 
  RotateCw,
  ExternalLink
} from 'lucide-react';

// Location Geocoding database for maritime routes
const GEOLOCATIONS = {
  Singapore: { lat: 1.290270, lng: 103.851959 },
  Colombo: { lat: 6.927079, lng: 79.861244 },
  Dubai: { lat: 25.204849, lng: 55.270783 },
  Mumbai: { lat: 18.922000, lng: 72.834700 },
  Chennai: { lat: 13.082680, lng: 80.270718 },
  Muscat: { lat: 23.588000, lng: 58.382900 },
  'Port Blair': { lat: 11.623400, lng: 92.726500 },
  Male: { lat: 4.175500, lng: 73.509300 },
  Gibraltar: { lat: 36.140800, lng: -5.353600 },
  Suez: { lat: 29.966800, lng: 32.549800 }
};

export default function ShipMonitoringMapPage() {
  const { 
    settings, 
    addRouteRecord, 
    addToast, 
    recentRoutes, 
    preloadedRoute, 
    setPreloadedRoute 
  } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  // Search input controls
  const [startLocation, setStartLocation] = useState('Singapore');
  const [endLocation, setEndLocation] = useState('Colombo');
  const [searchDate, setSearchDate] = useState('2025-04-10');

  // Active route and monitored ships
  const [activeRouteInfo, setActiveRouteInfo] = useState({
    start: 'Singapore',
    end: 'Colombo',
    distance: '1,570 NM',
    estimatedDuration: '3.8 Days',
    totalShips: 8,
    activeShips: 7,
    sinkingAlerts: 1
  });

  // Check if a preloaded route was passed (e.g. from Recent Areas or History)
  useEffect(() => {
    if (preloadedRoute) {
      setStartLocation(preloadedRoute.start);
      setEndLocation(preloadedRoute.end);
      setPreloadedRoute(null);
    }
  }, [preloadedRoute, setPreloadedRoute]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: [10.5, 88.0],
        zoom: 5,
        minZoom: 2,
        maxZoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Choose tile layer based on settings
      let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      let attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';

      if (settings.defaultMapView === 'Satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      }

      L.tileLayer(tileUrl, {
        attribution,
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    // Render initial route
    renderRoute(startLocation, endLocation);

    return () => {
      // Map cleanup if component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [settings.defaultMapView]);

  // Function to render route, waypoints, and vessels
  const renderRoute = (startName, endName) => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const layers = layersGroupRef.current;
    layers.clearLayers();

    const startCoord = GEOLOCATIONS[startName] || { lat: 1.29, lng: 103.85 };
    const endCoord = GEOLOCATIONS[endName] || { lat: 6.92, lng: 79.86 };

    // 1. Create waypoint icons
    const startIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background:#35D399; width:16px; height:16px; border-radius:50%; border:2px solid #FFFFFF; box-shadow:0 0 10px #35D399;"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const endIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background:#FF4545; width:16px; height:16px; border-radius:50%; border:2px solid #FFFFFF; box-shadow:0 0 10px #FF4545;"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add Start & End Markers with popups
    L.marker([startCoord.lat, startCoord.lng], { icon: startIcon })
      .bindPopup(`<b>Starting Location: ${startName}</b><br>Lat: ${startCoord.lat.toFixed(4)}, Lng: ${startCoord.lng.toFixed(4)}`)
      .addTo(layers);

    L.marker([endCoord.lat, endCoord.lng], { icon: endIcon })
      .bindPopup(`<b>Destination: ${endName}</b><br>Lat: ${endCoord.lat.toFixed(4)}, Lng: ${endCoord.lng.toFixed(4)}`)
      .addTo(layers);

    // 2. Compute route points (sea-navigation path)
    // Create an arched nautical route
    const midLat = (startCoord.lat + endCoord.lat) / 2 + (startCoord.lat > endCoord.lat ? -1.5 : 1.5);
    const midLng = (startCoord.lng + endCoord.lng) / 2;

    const routePoints = [
      [startCoord.lat, startCoord.lng],
      [startCoord.lat + (midLat - startCoord.lat) * 0.5, startCoord.lng + (midLng - startCoord.lng) * 0.4],
      [midLat, midLng],
      [midLat + (endCoord.lat - midLat) * 0.6, midLng + (endCoord.lng - midLng) * 0.6],
      [endCoord.lat, endCoord.lng]
    ];

    // Draw Route Polyline (dashed cyan path matching Reference Image 5)
    const routeLine = L.polyline(routePoints, {
      color: '#22D3EE',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(layers);

    // 3. Generate normal and distress vessels along the corridor
    const vessels = [
      { id: 'VS-01', name: 'Pacific Pioneer', lat: midLat + 0.8, lng: midLng - 4.2, speed: '14.2 kn', status: 'Underway' },
      { id: 'VS-02', name: 'Cosco Glory', lat: midLat - 0.5, lng: midLng - 1.8, speed: '16.8 kn', status: 'Underway' },
      { id: 'VS-03', name: 'Maersk Mc-Kinney', lat: midLat + 1.2, lng: midLng + 2.5, speed: '18.1 kn', status: 'Underway' },
      { id: 'VS-04', name: 'Ever Forward', lat: startCoord.lat + 1.2, lng: startCoord.lng - 3.0, speed: '12.4 kn', status: 'Underway' },
      { id: 'VS-05', name: 'Nordic Explorer', lat: endCoord.lat - 1.0, lng: endCoord.lng + 2.2, speed: '15.0 kn', status: 'Underway' },
      { id: 'VS-06', name: 'Silver Ray', lat: midLat - 1.4, lng: midLng + 0.5, speed: '11.6 kn', status: 'Underway' },
      { id: 'VS-07', name: 'Ocean Titan', lat: startCoord.lat + 2.0, lng: startCoord.lng - 6.5, speed: '13.9 kn', status: 'Underway' }
    ];

    // Standard vessel icon (Cyan Ship Marker)
    const shipIcon = L.divIcon({
      className: 'ship-map-marker',
      html: `
        <div style="background:#09243A; border:2px solid #22D3EE; width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px rgba(34,211,238,0.5);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2.5"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/></svg>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    // Add normal vessel markers
    vessels.forEach(v => {
      L.marker([v.lat, v.lng], { icon: shipIcon })
        .bindPopup(`
          <div style="font-family:sans-serif; min-width:140px;">
            <b style="color:#0284C7;">${v.name}</b><br>
            <span style="font-size:11px; color:#555;">ID: ${v.id} | Status: ${v.status}</span><br>
            <span style="font-size:11px;">Speed: <b>${v.speed}</b></span><br>
            <span style="font-size:10px; color:#888;">Simulated AIS Telemetry</span>
          </div>
        `)
        .addTo(layers);
    });

    // 4. Potentially Sinking Vessel Warning Marker (Pulsing Red Marker matching Reference 5)
    const sinkingVessel = {
      id: 'EMERGENCY-01',
      name: 'Straits Falcon',
      lat: midLat - 0.2,
      lng: midLng + 1.0,
      alert: 'Potentially Sinking — Simulated Alert',
      severity: 'Critical Distress',
      timestamp: '10:52:14 UTC'
    };

    const sinkingIcon = L.divIcon({
      className: 'sinking-map-marker',
      html: `
        <div class="pulse-red" style="background:#FF4545; border:2px solid #FFFFFF; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px #FF4545; cursor:pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    L.marker([sinkingVessel.lat, sinkingVessel.lng], { icon: sinkingIcon })
      .bindPopup(`
        <div style="font-family:sans-serif; min-width:170px;">
          <b style="color:#DC2626; font-size:13px;">⚠️ ${sinkingVessel.alert}</b><br>
          <span style="font-size:11px; font-weight:600;">Vessel: ${sinkingVessel.name}</span><br>
          <span style="font-size:11px; color:#666;">Distress Signal: EPIRB Active</span><br>
          <span style="font-size:10px; color:#DC2626;">Simulated distress indicator</span>
        </div>
      `)
      .addTo(layers);

    // Fit map bounds to view all points comfortably
    const bounds = L.latLngBounds([
      [startCoord.lat, startCoord.lng],
      [endCoord.lat, endCoord.lng],
      [sinkingVessel.lat, sinkingVessel.lng]
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
  };

  // Handle route search click
  const handleRouteSearch = () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      addToast('Please enter both Starting Location and Destination.', 'error');
      return;
    }
    if (startLocation.trim().toLowerCase() === endLocation.trim().toLowerCase()) {
      addToast('Starting location and destination cannot be identical.', 'error');
      return;
    }

    renderRoute(startLocation, endLocation);

    // Compute approximate nautical miles
    const startCoord = GEOLOCATIONS[startLocation] || { lat: 1.29, lng: 103.85 };
    const endCoord = GEOLOCATIONS[endLocation] || { lat: 6.92, lng: 79.86 };
    const degDist = Math.hypot(startCoord.lat - endCoord.lat, startCoord.lng - endCoord.lng);
    const approxNM = Math.round(degDist * 60 * 1.15);

    setActiveRouteInfo({
      start: startLocation,
      end: endLocation,
      distance: `${approxNM.toLocaleString()} NM`,
      estimatedDuration: `${(approxNM / (16 * 24)).toFixed(1)} Days`,
      totalShips: 8,
      activeShips: 7,
      sinkingAlerts: 1
    });

    addToast(`Route calculated: ${startLocation} → ${endLocation}`, 'info');
  };

  // Clear inputs
  const handleClear = () => {
    setStartLocation('');
    setEndLocation('');
    addToast('Cleared location inputs.', 'info');
  };

  // Save search to history
  const handleSaveSearch = () => {
    if (!startLocation || !endLocation) {
      addToast('No active route to save.', 'error');
      return;
    }

    addRouteRecord({
      start: startLocation,
      end: endLocation,
      date: searchDate,
      distance: activeRouteInfo.distance,
      estimatedDuration: activeRouteInfo.estimatedDuration,
      shipsCount: activeRouteInfo.totalShips,
      sinkingAlerts: activeRouteInfo.sinkingAlerts
    });
  };

  // Re-use route from history
  const handleUseHistoryRoute = (route) => {
    setStartLocation(route.start);
    setEndLocation(route.end);
    renderRoute(route.start, route.end);
    setActiveRouteInfo({
      start: route.start,
      end: route.end,
      distance: route.distance || '1,570 NM',
      estimatedDuration: route.estimatedDuration || '3.8 Days',
      totalShips: route.shipsCount || 8,
      activeShips: (route.shipsCount || 8) - (route.sinkingAlerts || 0),
      sinkingAlerts: route.sinkingAlerts || 0
    });
    addToast(`Loaded corridor: ${route.start} → ${route.end}`, 'info');
  };

  return (
    <div className="monitoring-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="title-xl">Ship Monitoring Map</h1>
          <p className="subtitle">
            Explore vessel positions and potential maritime risks between selected locations.
          </p>
        </div>
      </div>

      {/* Top Search Controls matching Reference Image 5 */}
      <div className="monitoring-search-bar card">
        <div className="search-field">
          <label className="field-label">From</label>
          <div className="field-input-box">
            <MapPin size={16} className="text-cyan field-icon" />
            <input 
              type="text" 
              list="locations-list"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="e.g. Singapore"
              className="route-input"
            />
          </div>
        </div>

        <div className="search-field">
          <label className="field-label">To</label>
          <div className="field-input-box">
            <Navigation size={16} className="text-cyan field-icon" />
            <input 
              type="text" 
              list="locations-list"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              placeholder="e.g. Colombo"
              className="route-input"
            />
          </div>
        </div>

        <div className="search-field date-field">
          <label className="field-label">Date</label>
          <div className="field-input-box">
            <Calendar size={16} className="text-muted field-icon" />
            <input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="route-input"
            />
          </div>
        </div>

        <datalist id="locations-list">
          {Object.keys(GEOLOCATIONS).map(loc => (
            <option key={loc} value={loc} />
          ))}
        </datalist>

        <div className="search-btn-actions">
          <button onClick={handleRouteSearch} className="btn btn-primary show-route-btn">
            <span>Show Route</span>
          </button>
          <button onClick={handleClear} className="btn btn-secondary clear-btn">
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Map & Information Side Panels Grid */}
      <div className="monitoring-main-grid">
        {/* Left Side: Interactive Leaflet Map */}
        <div className="map-view-card card">
          <div className="map-container-wrapper">
            <div ref={mapContainerRef} className="leaflet-map-element" />

            {/* Floating Map Legend Bar at Bottom matching Reference Image 5 */}
            <div className="map-legend-bar">
              <div className="legend-item">
                <span className="legend-dot green-dot" />
                <span>Start Location</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot red-dot" />
                <span>End Location</span>
              </div>
              <div className="legend-item">
                <span className="legend-line cyan-line" />
                <span>Route</span>
              </div>
              <div className="legend-item">
                <Ship size={14} className="text-cyan" />
                <span>Ship (Live)</span>
              </div>
              <div className="legend-item">
                <AlertTriangle size={14} className="text-danger" />
                <span>Sinking Alert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Information Panels */}
        <div className="monitoring-side-panels">
          {/* 1. Route Search History */}
          <div className="side-panel-card card">
            <div className="panel-title-row">
              <h3 className="panel-title">Route Search History</h3>
            </div>

            <div className="routes-history-list">
              {recentRoutes.map((rt) => (
                <div key={rt.id} className="route-history-item">
                  <div className="route-item-meta">
                    <span className="route-name-text">{rt.start} → {rt.end}</span>
                    <span className="route-date-text">{rt.date}, {rt.time}</span>
                  </div>
                  <button 
                    onClick={() => handleUseHistoryRoute(rt)} 
                    className="btn btn-secondary btn-sm use-route-btn"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Available Vessels */}
          <div className="side-panel-card card">
            <h3 className="panel-title">Available Vessels</h3>
            <div className="vessel-status-box">
              <Ship size={18} className="text-cyan" />
              <div className="vessel-status-text">
                <span className="vessel-status-title">Live vessel data is not configured.</span>
                <span className="vessel-status-sub">Simulated telemetry displayed for demo.</span>
              </div>
            </div>
          </div>

          {/* 3. Sinking Ship Alerts */}
          <div className="side-panel-card card alert-card-border">
            <div className="alert-header">
              <AlertTriangle size={18} className="text-danger" />
              <span className="alert-card-title">Sinking Ship Alerts</span>
            </div>
            <p className="alert-card-body">
              Sinking-ship alerts require a supported distress-data source. (Active demo emergency: Straits Falcon)
            </p>
          </div>

          {/* 4. Monitoring Summary & Save Action */}
          <div className="side-panel-card card">
            <h3 className="panel-title">Monitoring Summary</h3>
            <div className="summary-stats-list">
              <div className="summary-stat-row">
                <span className="stat-label">Total Ships Monitored:</span>
                <span className="stat-val font-mono">{activeRouteInfo.totalShips}</span>
              </div>
              <div className="summary-stat-row">
                <span className="stat-label">Active Ships:</span>
                <span className="stat-val font-mono">{activeRouteInfo.activeShips}</span>
              </div>
              <div className="summary-stat-row">
                <span className="stat-label">Potential Sinking:</span>
                <span className="stat-val font-mono text-danger">{activeRouteInfo.sinkingAlerts}</span>
              </div>
              <div className="summary-stat-row">
                <span className="stat-label">Estimated Distance:</span>
                <span className="stat-val font-mono">{activeRouteInfo.distance}</span>
              </div>
            </div>

            <button onClick={handleSaveSearch} className="btn btn-primary w-full save-search-btn">
              <Save size={16} />
              <span>Save Search</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .monitoring-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Top Search Bar matching Reference 5 */
        .monitoring-search-bar {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          padding: 16px 20px;
        }

        .search-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .date-field {
          flex: 0.8;
        }

        .field-label {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .field-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 12px;
          pointer-events: none;
        }

        .route-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 9px 12px 9px 36px;
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .route-input:focus {
          border-color: var(--primary-cyan);
        }

        .search-btn-actions {
          display: flex;
          gap: 10px;
        }

        .show-route-btn {
          padding: 9px 18px;
          font-size: 13px;
        }

        .clear-btn {
          padding: 9px 14px;
          font-size: 13px;
        }

        /* Map and Panels Grid */
        .monitoring-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          min-height: 580px;
        }

        .map-view-card {
          padding: 0;
          overflow: hidden;
          position: relative;
          min-height: 580px;
          display: flex;
        }

        .map-container-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 580px;
        }

        .leaflet-map-element {
          width: 100%;
          height: 100%;
          min-height: 580px;
          background: #041321;
        }

        /* Bottom Map Legend Bar */
        .map-legend-bar {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          background: rgba(6, 27, 45, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 500;
          flex-wrap: wrap;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .green-dot {
          background: var(--success-green);
          box-shadow: 0 0 6px var(--success-green);
        }

        .red-dot {
          background: var(--detection-red);
          box-shadow: 0 0 6px var(--detection-red);
        }

        .cyan-line {
          width: 18px;
          height: 3px;
          background: var(--primary-cyan);
          border-radius: 2px;
        }

        /* Side Panels */
        .monitoring-side-panels {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .side-panel-card {
          padding: 16px;
        }

        .panel-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .routes-history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .route-history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: var(--bg-panel);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .route-item-meta {
          display: flex;
          flex-direction: column;
        }

        .route-name-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .route-date-text {
          font-size: 10.5px;
          color: var(--text-muted);
        }

        .use-route-btn {
          padding: 4px 10px;
          font-size: 11px;
        }

        .vessel-status-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px;
          background: var(--bg-panel);
          border-radius: var(--radius-sm);
        }

        .vessel-status-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .vessel-status-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .vessel-status-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .alert-card-border {
          border-color: rgba(255, 69, 69, 0.4);
          background: rgba(255, 69, 69, 0.05);
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .alert-card-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--detection-red);
        }

        .alert-card-body {
          font-size: 11.5px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .summary-stats-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .summary-stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(22, 75, 101, 0.3);
        }

        .stat-label {
          color: var(--text-secondary);
        }

        .stat-val {
          font-weight: 600;
        }

        .save-search-btn {
          font-size: 13px;
          padding: 9px;
        }

        @media (max-width: 992px) {
          .monitoring-search-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .monitoring-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
