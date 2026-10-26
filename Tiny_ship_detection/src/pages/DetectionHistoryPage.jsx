import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Ship, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function DetectionHistoryPage() {
  const { 
    history, 
    deleteHistoryItem, 
    clearAllHistory, 
    exportHistoryCSV, 
    setPreloadedDetection, 
    setPreloadedRoute,
    addToast 
  } = useApp();
  
  const navigate = useNavigate();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // View Result Modal state
  const [viewingRecord, setViewingRecord] = useState(null);

  // Delete confirmation modal state
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter and sort records
  const filteredRecords = history.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    if (sortOrder === 'newest') {
      return (b.timestamp || 0) - (a.timestamp || 0);
    }
    return (a.timestamp || 0) - (b.timestamp || 0);
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Actions
  const handleSearchAgain = (record) => {
    if (record.type === 'monitoring') {
      const parts = record.name.split('→').map(p => p.trim());
      setPreloadedRoute({
        start: parts[0] || 'Singapore',
        end: parts[1] || 'Colombo'
      });
      navigate('/ship-monitoring');
    } else {
      setPreloadedDetection(record);
      navigate('/ship-detection');
    }
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      deleteHistoryItem(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  const handleConfirmClearAll = () => {
    clearAllHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="history-page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="title-xl">Detection History</h1>
          <p className="subtitle">
            View previous searches and rerun detections whenever you need.
          </p>
        </div>

        <div className="header-actions">
          <button onClick={exportHistoryCSV} className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setShowClearConfirm(true)} 
            disabled={history.length === 0}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={15} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar matching Reference Image 6 */}
      <div className="history-filter-bar card">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name or filename..."
            className="history-search-input"
          />
        </div>

        <div className="filter-controls-group">
          <select 
            value={typeFilter} 
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="All">All Types</option>
            <option value="detection">Satellite Detection</option>
            <option value="monitoring">Ship Monitoring</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Mandatory Table Layout matching Reference Image 6 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image / Search Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Ships Detected</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((item) => (
                <tr key={item.id}>
                  {/* Image / Search Name with Thumbnail */}
                  <td>
                    <div className="table-thumb-col">
                      <div className="table-thumb-box">
                        <img 
                          src={item.imageUrl || '/images/satellite_001.svg'} 
                          alt={item.name} 
                          className="table-thumb-img" 
                        />
                      </div>
                      <div className="table-item-title-meta">
                        <span className="table-item-name">{item.name}</span>
                        <span className="table-item-type-badge">
                          {item.type === 'monitoring' ? 'Route Monitoring' : 'Satellite Imagery'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="font-mono">{item.date}</td>

                  {/* Time */}
                  <td className="font-mono">{item.time}</td>

                  {/* Ships Detected */}
                  <td>
                    <div className="ships-count-cell">
                      <Ship size={14} className="text-cyan" />
                      <span className="font-mono font-bold">{item.shipsDetected}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} />
                      <span>{item.status}</span>
                    </span>
                  </td>

                  {/* Actions: Search Again, View Result, Delete */}
                  <td>
                    <div className="table-actions-cell">
                      <button 
                        onClick={() => handleSearchAgain(item)} 
                        className="btn btn-secondary btn-sm"
                        title="Rerun search with this input"
                      >
                        Search Again
                      </button>
                      <button 
                        onClick={() => setViewingRecord(item)} 
                        className="btn btn-outline btn-sm"
                        title="View details and bounding boxes"
                      >
                        View Result
                      </button>
                      <button 
                        onClick={() => setRecordToDelete(item)} 
                        className="btn-icon delete-row-btn"
                        title="Delete record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="table-empty-row">
                  <p>No detection history matching your filter criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls matching Reference Image 6 */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="btn btn-secondary btn-sm pagination-btn"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`pagination-number-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="btn btn-secondary btn-sm pagination-btn"
          >
            &gt;
          </button>
        </div>
      )}

      {/* View Result Modal */}
      {viewingRecord && (
        <div className="modal-overlay" onClick={() => setViewingRecord(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="title-lg">{viewingRecord.name}</h3>
                <span className="subtitle">
                  {viewingRecord.date} · {viewingRecord.time} · {viewingRecord.shipsDetected} vessels detected
                </span>
              </div>
              <button onClick={() => setViewingRecord(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-preview-box">
                <img 
                  src={viewingRecord.imageUrl || '/images/satellite_001.svg'} 
                  alt={viewingRecord.name} 
                  className="modal-preview-img" 
                />
                {/* Render bounding boxes if available */}
                {viewingRecord.ships && viewingRecord.ships.map((ship) => (
                  <div
                    key={ship.id}
                    className="bbox-rect"
                    style={{
                      left: `${ship.norm.x * 100}%`,
                      top: `${ship.norm.y * 100}%`,
                      width: `${ship.norm.w * 100}%`,
                      height: `${ship.norm.h * 100}%`
                    }}
                  >
                    <span className="bbox-tag">Ship {ship.id}</span>
                  </div>
                ))}
              </div>

              <div className="modal-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Model Architecture</span>
                  <span className="detail-value">{viewingRecord.model || 'DRENet'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Inference Mode</span>
                  <span className="detail-value">{viewingRecord.mode || 'Simulated Demo'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Confidence Threshold</span>
                  <span className="detail-value">{viewingRecord.confidenceThreshold || '0.35'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Processing Time</span>
                  <span className="detail-value">{viewingRecord.processingTime || '12.4s'}</span>
                </div>
              </div>

              {viewingRecord.ships && viewingRecord.ships.length > 0 && (
                <div className="modal-ships-list">
                  <span className="detail-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Detected Vessel Coordinates & Confidences
                  </span>
                  <div className="chips-row">
                    {viewingRecord.ships.map(s => (
                      <div key={s.id} className="ship-chip">
                        <span className="chip-id">Ship {s.id}:</span>
                        <span className="chip-conf">{(s.conf * 100).toFixed(0)}%</span>
                        <span className="chip-coords">{s.coords}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => {
                  const rec = viewingRecord;
                  setViewingRecord(null);
                  handleSearchAgain(rec);
                }} 
                className="btn btn-primary btn-sm"
              >
                Rerun in Workspace
              </button>
              <button onClick={() => setViewingRecord(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Confirmation Modal */}
      {recordToDelete && (
        <div className="modal-overlay" onClick={() => setRecordToDelete(null)}>
          <div className="modal-card small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-lg text-danger">Delete Record</h3>
              <button onClick={() => setRecordToDelete(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{recordToDelete.name}</strong> from your persistent history?</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setRecordToDelete(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={handleConfirmDelete} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-card small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-lg text-danger">Clear All History</h3>
              <button onClick={() => setShowClearConfirm(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>This will permanently erase all detection records and saved routes from browser localStorage.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowClearConfirm(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={handleConfirmClearAll} className="btn btn-danger btn-sm">Clear All History</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .history-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        /* Filter Bar */
        .history-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          gap: 16px;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .history-search-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px 12px 8px 36px;
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .history-search-input:focus {
          border-color: var(--primary-cyan);
        }

        .filter-controls-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-select {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          color: var(--text-primary);
          font-size: 12.5px;
          outline: none;
          cursor: pointer;
        }

        .filter-select:focus {
          border-color: var(--primary-cyan);
        }

        /* Table Specifics matching Reference 6 */
        .table-thumb-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-thumb-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #020C17;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .table-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .table-item-title-meta {
          display: flex;
          flex-direction: column;
        }

        .table-item-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 13px;
        }

        .table-item-type-badge {
          font-size: 10.5px;
          color: var(--text-muted);
        }

        .ships-count-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .table-actions-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .delete-row-btn {
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .delete-row-btn:hover {
          color: var(--detection-red);
        }

        .table-empty-row {
          text-align: center;
          padding: 48px;
          color: var(--text-muted);
        }

        /* Pagination */
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          margin-top: 8px;
        }

        .pagination-btn {
          padding: 6px 12px;
        }

        .pagination-number-btn {
          min-width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .pagination-number-btn:hover {
          border-color: var(--primary-cyan);
          color: var(--text-primary);
        }

        .pagination-number-btn.active {
          background: var(--primary-cyan);
          color: #041321;
          border-color: var(--primary-cyan);
        }

        /* Modal Preview */
        .modal-preview-box {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #020C17;
          border: 1px solid var(--border-color);
          line-height: 0;
          margin-bottom: 20px;
        }

        .modal-preview-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .modal-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
          padding: 14px;
          background: var(--bg-panel);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ship-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 11px;
        }

        .chip-id {
          font-weight: 700;
          color: var(--primary-cyan);
        }

        .chip-conf {
          color: var(--success-green);
          font-weight: 600;
        }

        .chip-coords {
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .small-modal {
          max-width: 420px;
        }

        @media (max-width: 992px) {
          .history-filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-controls-group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
