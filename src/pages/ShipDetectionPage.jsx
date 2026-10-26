import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  Radar, 
  Trash2, 
  Download, 
  Save, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Info,
  Maximize2
} from 'lucide-react';

export default function ShipDetectionPage() {
  const { 
    settings, 
    addDetectionRecord, 
    addToast, 
    preloadedDetection, 
    setPreloadedDetection 
  } = useApp();

  const fileInputRef = useRef(null);

  // Uploaded / Selected image state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/images/satellite_001.svg');
  const [fileName, setFileName] = useState('satellite_001.jpg');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [isDragOver, setIsDragOver] = useState(false);

  // Detection processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [activeShipHighlight, setActiveShipHighlight] = useState(null);

  // Check if there is a preloaded item from "Search Again"
  useEffect(() => {
    if (preloadedDetection) {
      setPreviewUrl(preloadedDetection.imageUrl || '/images/satellite_001.svg');
      setFileName(preloadedDetection.name);
      setFileSize(preloadedDetection.fileSize || '2.4 MB');
      setDetectionResult(preloadedDetection);
      // Clear preload context after applying
      setPreloadedDetection(null);
    } else {
      // By default load the initial sample detection result matching Reference Image 4
      setDetectionResult({
        name: 'satellite_001.jpg',
        fileSize: '2.4 MB',
        imageUrl: '/images/satellite_001.svg',
        shipsDetected: 5,
        processingStatus: 'Completed',
        processingTime: '12.4 seconds',
        model: 'DRENet (Simulated Demo)',
        confidenceThreshold: settings.confidenceThreshold || 0.35,
        ships: [
          { id: '1', conf: 0.92, coords: '(124, 88, 32, 28)', norm: { x: 0.19, y: 0.18, w: 0.08, h: 0.09 }, lat: 13.0827, lng: 80.2707 },
          { id: '2', conf: 0.87, coords: '(210, 142, 30, 32)', norm: { x: 0.32, y: 0.29, w: 0.08, h: 0.10 }, lat: 13.1124, lng: 80.3115 },
          { id: '3', conf: 0.81, coords: '(342, 221, 28, 24)', norm: { x: 0.53, y: 0.46, w: 0.08, h: 0.08 }, lat: 13.1450, lng: 80.3421 },
          { id: '4', conf: 0.76, coords: '(438, 317, 40, 36)', norm: { x: 0.67, y: 0.65, w: 0.09, h: 0.11 }, lat: 13.1890, lng: 80.3802 },
          { id: '5', conf: 0.68, coords: '(512, 403, 32, 28)', norm: { x: 0.79, y: 0.82, w: 0.08, h: 0.09 }, lat: 13.2205, lng: 80.4120 }
        ]
      });
    }
  }, [preloadedDetection, setPreloadedDetection, settings.confidenceThreshold]);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|tiff|tif|svg)$/i)) {
      addToast('Unsupported file type. Please upload JPG, PNG, WEBP, or TIFF.', 'error');
      return;
    }
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      addToast('File exceeds 10MB limit.', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    setDetectionResult(null); // Reset detection for new file
    addToast(`Loaded ${file.name}. Ready for detection.`, 'info');
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Clear selected image
  const handleClear = () => {
    if (selectedFile && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('/images/satellite_001.svg');
    setFileName('satellite_001.jpg');
    setFileSize('2.4 MB');
    setDetectionResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Cleared current image workspace.', 'info');
  };

  // Run mock ship detection
  const runDetection = () => {
    if (!previewUrl) {
      addToast('Please select or upload an image first.', 'error');
      return;
    }

    setIsProcessing(true);
    setDetectionResult(null);

    // Simulate DRENet AI inference processing time
    setTimeout(() => {
      // Deterministic or pseudo-realistic detection count based on filename
      let ships = [];
      const threshold = settings.confidenceThreshold || 0.35;

      if (fileName.includes('test_image')) {
        // Zero detection test case
        ships = [];
      } else if (fileName.includes('ocean_view')) {
        ships = [
          { id: '1', conf: 0.94, coords: '(170, 130, 30, 30)', norm: { x: 0.26, y: 0.27, w: 0.08, h: 0.08 }, lat: 14.2100, lng: 81.1200 },
          { id: '2', conf: 0.89, coords: '(310, 250, 34, 30)', norm: { x: 0.48, y: 0.52, w: 0.08, h: 0.08 }, lat: 14.3500, lng: 81.2500 },
          { id: '3', conf: 0.83, coords: '(450, 330, 32, 28)', norm: { x: 0.70, y: 0.68, w: 0.08, h: 0.08 }, lat: 14.4800, lng: 81.4000 }
        ];
      } else if (fileName.includes('harbor_scan')) {
        ships = [
          { id: '1', conf: 0.91, coords: '(270, 100, 30, 30)', norm: { x: 0.42, y: 0.21, w: 0.08, h: 0.08 }, lat: 12.9800, lng: 80.1900 },
          { id: '2', conf: 0.85, coords: '(240, 210, 32, 28)', norm: { x: 0.37, y: 0.44, w: 0.08, h: 0.08 }, lat: 12.9400, lng: 80.2200 }
        ];
      } else if (fileName.includes('coastal_scan')) {
        ships = [
          { id: '1', conf: 0.95, coords: '(150, 110, 30, 28)', norm: { x: 0.23, y: 0.23, w: 0.08, h: 0.08 }, lat: 15.1100, lng: 73.8100 },
          { id: '2', conf: 0.88, coords: '(200, 200, 30, 30)', norm: { x: 0.31, y: 0.42, w: 0.08, h: 0.08 }, lat: 15.1900, lng: 73.8900 },
          { id: '3', conf: 0.82, coords: '(130, 330, 32, 30)', norm: { x: 0.20, y: 0.69, w: 0.08, h: 0.08 }, lat: 15.2800, lng: 73.9600 },
          { id: '4', conf: 0.79, coords: '(290, 370, 34, 30)', norm: { x: 0.45, y: 0.77, w: 0.08, h: 0.08 }, lat: 15.3600, lng: 74.0200 }
        ];
      } else {
        // Standard / User uploaded image detection
        ships = [
          { id: '1', conf: 0.92, coords: '(124, 88, 32, 28)', norm: { x: 0.19, y: 0.18, w: 0.08, h: 0.09 }, lat: 13.0827, lng: 80.2707 },
          { id: '2', conf: 0.87, coords: '(210, 142, 30, 32)', norm: { x: 0.32, y: 0.29, w: 0.08, h: 0.10 }, lat: 13.1124, lng: 80.3115 },
          { id: '3', conf: 0.81, coords: '(342, 221, 28, 24)', norm: { x: 0.53, y: 0.46, w: 0.08, h: 0.08 }, lat: 13.1450, lng: 80.3421 },
          { id: '4', conf: 0.76, coords: '(438, 317, 40, 36)', norm: { x: 0.67, y: 0.65, w: 0.09, h: 0.11 }, lat: 13.1890, lng: 80.3802 },
          { id: '5', conf: 0.68, coords: '(512, 403, 32, 28)', norm: { x: 0.79, y: 0.82, w: 0.08, h: 0.09 }, lat: 13.2205, lng: 80.4120 }
        ];
      }

      // Filter by confidence threshold
      const filteredShips = ships.filter(s => s.conf >= threshold);

      const result = {
        name: fileName,
        fileSize: fileSize,
        imageUrl: previewUrl,
        shipsDetected: filteredShips.length,
        processingStatus: 'Completed',
        processingTime: `${(9.5 + Math.random() * 4).toFixed(1)} seconds`,
        model: 'DRENet (Simulated Demo)',
        confidenceThreshold: threshold,
        ships: filteredShips
      };

      setDetectionResult(result);
      setIsProcessing(false);
      addToast(`Detection complete! ${filteredShips.length} ships found.`, 'success');
    }, 1800);
  };

  // Save detection to persistent history
  const handleSaveToHistory = () => {
    if (!detectionResult) {
      addToast('No detection result available to save.', 'error');
      return;
    }
    addDetectionRecord({
      name: detectionResult.name,
      fileSize: detectionResult.fileSize,
      imageUrl: detectionResult.imageUrl,
      shipsDetected: detectionResult.shipsDetected,
      status: 'Completed',
      processingTime: detectionResult.processingTime,
      model: detectionResult.model,
      confidenceThreshold: detectionResult.confidenceThreshold,
      ships: detectionResult.ships
    });
  };

  // Download JSON report
  const handleDownloadResult = () => {
    if (!detectionResult) {
      addToast('No result available for export.', 'error');
      return;
    }

    const reportData = {
      project: 'ShipDetect AI — Tiny Ship Detection',
      timestamp: new Date().toISOString(),
      imageName: detectionResult.name,
      fileSize: detectionResult.fileSize,
      modelArchitecture: 'DRENet',
      mode: 'Simulated Demo Detection',
      confidenceThreshold: detectionResult.confidenceThreshold,
      totalShipsDetected: detectionResult.shipsDetected,
      processingTime: detectionResult.processingTime,
      detectedShips: detectionResult.ships.map(s => ({
        shipId: `Ship ${s.id}`,
        confidence: s.conf,
        pixelBoxCoordinates: s.coords,
        normalizedCoordinates: s.norm,
        estimatedLatitude: s.lat,
        estimatedLongitude: s.lng
      }))
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `detection_report_${fileName.replace(/\.[^/.]+$/, '')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Downloaded detection JSON report.', 'success');
  };

  return (
    <div className="detection-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="title-xl">Ship Detection</h1>
          <p className="subtitle">
            Upload a satellite image to detect small vessels and inspect their locations.
          </p>
        </div>
      </div>

      {/* Top Section: Upload Box & Selected Image Preview Card matching Reference 4 */}
      <div className="detection-top-grid">
        {/* Drag & Drop Upload Zone */}
        <div 
          className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".jpg,.jpeg,.png,.webp,.tiff,.tif,.svg"
            style={{ display: 'none' }} 
          />
          <div className="upload-icon-circle">
            <Upload size={28} className="text-cyan" />
          </div>
          <p className="upload-main-text">
            Drag & drop an image here <br />
            <span className="upload-sub-text">or click to browse</span>
          </p>
          <span className="upload-support-meta">
            Supports: JPG, PNG, WEBP, TIFF (Max 10MB)
          </span>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm browse-btn"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current && fileInputRef.current.click();
            }}
          >
            Browse Files
          </button>
        </div>

        {/* Selected Image Card */}
        <div className="selected-image-card">
          <div className="card-top-info">
            <span className="section-label">Selected Image</span>
            {previewUrl && (
              <button 
                onClick={handleClear} 
                className="clear-icon-btn" 
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="selected-thumb-row">
            <div className="selected-thumb-box">
              <img src={previewUrl} alt="Selected preview" className="selected-thumb-img" />
            </div>
            <div className="selected-file-meta">
              <span className="selected-filename" title={fileName}>{fileName}</span>
              <span className="selected-filesize">{fileSize}</span>
            </div>
          </div>

          <div className="selected-action-buttons">
            <button 
              onClick={runDetection} 
              disabled={isProcessing} 
              className="btn btn-primary run-detect-btn"
            >
              {isProcessing ? (
                <>
                  <RotateCw size={16} className="spinner" />
                  <span>Analyzing satellite image...</span>
                </>
              ) : (
                <>
                  <Radar size={16} />
                  <span>Run Ship Detection</span>
                </>
              )}
            </button>
            <button 
              onClick={handleClear} 
              disabled={isProcessing} 
              className="btn btn-secondary clear-btn"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Detection Workspace */}
      <div className="detection-workspace-grid">
        {/* Left Side: Original Image & Detected Image */}
        <div className="comparison-card">
          <div className="comparison-images-row">
            {/* Original Image Panel */}
            <div className="image-panel">
              <div className="panel-header">
                <span className="panel-title">Original Image</span>
              </div>
              <div className="panel-img-box">
                <img src={previewUrl} alt="Original input" className="panel-img" />
              </div>
            </div>

            {/* Detected Image Panel with Red Bounding Boxes */}
            <div className="image-panel">
              <div className="panel-header">
                <span className="panel-title">Detected Image</span>
                {detectionResult && (
                  <span className="badge badge-danger">
                    {detectionResult.shipsDetected} vessels
                  </span>
                )}
              </div>

              <div className="panel-img-box detected-box">
                <img src={previewUrl} alt="Detected output" className="panel-img" />

                {/* Overlaid Red Rectangular Bounding Boxes */}
                {detectionResult && detectionResult.ships.map((ship) => (
                  <div
                    key={ship.id}
                    className={`bbox-rect ${activeShipHighlight === ship.id ? 'active-highlight' : ''}`}
                    style={{
                      left: `${ship.norm.x * 100}%`,
                      top: `${ship.norm.y * 100}%`,
                      width: `${ship.norm.w * 100}%`,
                      height: `${ship.norm.h * 100}%`
                    }}
                    onMouseEnter={() => setActiveShipHighlight(ship.id)}
                    onMouseLeave={() => setActiveShipHighlight(null)}
                    title={`Ship ${ship.id} | Conf: ${(ship.conf * 100).toFixed(0)}%`}
                  >
                    <span className="bbox-tag">Ship {ship.id}</span>
                  </div>
                ))}

                {isProcessing && (
                  <div className="processing-overlay">
                    <div className="processing-spinner-box">
                      <RotateCw size={32} className="text-cyan spinner" />
                      <p>DRENet running tiny vessel inference...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Table inside Comparison Card: Detected Ships Table */}
          <div className="detected-ships-table-box">
            <div className="table-box-header">
              <h4 className="table-box-title">Detected Ships</h4>
              <span className="table-box-sub">
                {detectionResult ? `${detectionResult.shipsDetected} ships confirmed` : 'Awaiting detection run'}
              </span>
            </div>

            <div className="table-wrapper">
              <table className="ships-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Confidence</th>
                    <th>Coordinates (x, y, w, h)</th>
                  </tr>
                </thead>
                <tbody>
                  {detectionResult && detectionResult.ships.length > 0 ? (
                    detectionResult.ships.map((ship) => (
                      <tr 
                        key={ship.id} 
                        className={activeShipHighlight === ship.id ? 'row-highlighted' : ''}
                        onMouseEnter={() => setActiveShipHighlight(ship.id)}
                        onMouseLeave={() => setActiveShipHighlight(null)}
                      >
                        <td className="ship-id-cell">{ship.id}</td>
                        <td className="ship-conf-cell">
                          <span className="conf-value">{ship.conf.toFixed(2)}</span>
                          <div className="conf-bar-bg">
                            <div className="conf-bar-fill" style={{ width: `${ship.conf * 100}%` }} />
                          </div>
                        </td>
                        <td className="ship-coord-cell font-mono">{ship.coords}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-ships-cell">
                        {isProcessing 
                          ? 'Extracting vessel candidate coordinates...' 
                          : 'No ships detected in this image tile.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Detection Results Panel */}
        <div className="detection-results-panel">
          <div className="results-header">
            <h3 className="results-heading">Detection Results</h3>
          </div>

          <div className="results-meta-list">
            <div className="meta-row">
              <span className="meta-title">Total Ships Detected</span>
              <span className="meta-value-bold text-cyan">
                {detectionResult ? detectionResult.shipsDetected : '—'}
              </span>
            </div>

            <div className="meta-row">
              <span className="meta-title">Processing Status</span>
              {detectionResult ? (
                <span className="badge badge-success">
                  <CheckCircle2 size={12} />
                  <span>{detectionResult.processingStatus}</span>
                </span>
              ) : isProcessing ? (
                <span className="badge badge-warning">Processing</span>
              ) : (
                <span className="badge badge-cyan">Ready</span>
              )}
            </div>

            <div className="meta-row">
              <span className="meta-title">Processing Time</span>
              <span className="meta-val font-mono">
                {detectionResult ? detectionResult.processingTime : '—'}
              </span>
            </div>

            <div className="meta-row">
              <span className="meta-title">Model</span>
              <span className="meta-val">{detectionResult ? detectionResult.model : 'DRENet'}</span>
            </div>

            <div className="meta-row">
              <span className="meta-title">Confidence Threshold</span>
              <span className="meta-val font-mono">
                {detectionResult ? detectionResult.confidenceThreshold : (settings.confidenceThreshold || 0.35)}
              </span>
            </div>
          </div>

          <div className="results-actions-group">
            <button 
              onClick={handleDownloadResult} 
              disabled={!detectionResult} 
              className="btn btn-secondary w-full"
            >
              <Download size={16} />
              <span>Download Result</span>
            </button>
            <button 
              onClick={handleSaveToHistory} 
              disabled={!detectionResult} 
              className="btn btn-primary w-full"
            >
              <Save size={16} />
              <span>Save to History</span>
            </button>
          </div>

          <div className="simulated-notice-card">
            <Info size={16} className="text-cyan flex-shrink-0" />
            <p>
              Academic Frontend Demonstration: DRENet inference is simulated. Bounding coordinates and confidence ratings are mapped for demonstration.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .detection-page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Top Grid */
        .detection-top-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
        }

        .upload-zone {
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          min-height: 180px;
        }

        .upload-zone:hover, .upload-zone.drag-over {
          border-color: var(--primary-cyan);
          background: rgba(34, 211, 238, 0.04);
        }

        .upload-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .upload-main-text {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .upload-sub-text {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .upload-support-meta {
          font-size: 11px;
          color: var(--text-muted);
          margin: 8px 0 14px;
        }

        .browse-btn {
          font-size: 11.5px;
          padding: 5px 14px;
        }

        /* Selected Image Card */
        .selected-image-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-top-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .clear-icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }

        .clear-icon-btn:hover {
          color: var(--detection-red);
        }

        .selected-thumb-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 14px 0;
          padding: 10px;
          background: var(--bg-panel);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .selected-thumb-box {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #020C17;
          flex-shrink: 0;
        }

        .selected-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .selected-file-meta {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .selected-filename {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .selected-filesize {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .selected-action-buttons {
          display: flex;
          gap: 10px;
        }

        .run-detect-btn {
          flex: 2;
          font-size: 13px;
        }

        .clear-btn {
          flex: 1;
          font-size: 13px;
        }

        /* Workspace Grid */
        .detection-workspace-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .comparison-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .comparison-images-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .image-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .panel-img-box {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #020C17;
          border: 1px solid var(--border-color);
          line-height: 0;
        }

        .panel-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .detected-box {
          position: relative;
        }

        .active-highlight {
          border-color: #FFFFFF !important;
          background-color: rgba(255, 69, 69, 0.45) !important;
          box-shadow: 0 0 16px var(--detection-red) !important;
        }

        .processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(4, 19, 33, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .processing-spinner-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          color: var(--text-primary);
          font-size: 13px;
        }

        /* Detected Ships Table */
        .detected-ships-table-box {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        .table-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .table-box-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .table-box-sub {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .ships-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }

        .ships-data-table th {
          text-align: left;
          padding: 8px 12px;
          font-size: 11px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          text-transform: uppercase;
        }

        .ships-data-table td {
          padding: 8px 12px;
          border-bottom: 1px solid rgba(22, 75, 101, 0.4);
          vertical-align: middle;
        }

        .ships-data-table tr:hover, .row-highlighted {
          background-color: var(--bg-hover);
        }

        .ship-id-cell {
          font-weight: 700;
          color: var(--primary-cyan);
          width: 40px;
        }

        .ship-conf-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .conf-value {
          font-family: var(--font-mono);
          width: 34px;
        }

        .conf-bar-bg {
          width: 60px;
          height: 5px;
          background: rgba(22, 75, 101, 0.5);
          border-radius: 9999px;
          overflow: hidden;
        }

        .conf-bar-fill {
          height: 100%;
          background: var(--primary-cyan);
          border-radius: 9999px;
        }

        .ship-coord-cell {
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        .no-ships-cell {
          text-align: center;
          padding: 24px;
          color: var(--text-muted);
          font-style: italic;
        }

        /* Results Panel */
        .detection-results-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .results-heading {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .results-meta-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(22, 75, 101, 0.4);
          font-size: 12.5px;
        }

        .meta-title {
          color: var(--text-secondary);
        }

        .meta-value-bold {
          font-size: 18px;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .meta-val {
          color: var(--text-primary);
          font-weight: 500;
        }

        .results-actions-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .simulated-notice-card {
          background: rgba(9, 36, 58, 0.6);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .detection-top-grid, .detection-workspace-grid {
            grid-template-columns: 1fr;
          }
          .comparison-images-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
