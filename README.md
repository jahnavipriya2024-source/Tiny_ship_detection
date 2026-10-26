# ShipDetect AI — AI-Based Tiny Ship Detection & Maritime Monitoring

> **Academic & Research Prototype**: A comprehensive, responsive frontend web application for satellite-based tiny vessel detection, maritime corridor monitoring, and geospatial tracking.

---

## 🌟 Visual Design Reference
Follows the attached 7-panel maritime surveillance interface collage:
- **Palette**: Deep Navy (`#041321`), Sidebar (`#061B2D`), Panels (`#09243A`, `#0C2D45`), Primary Cyan (`#22D3EE`), Secondary Teal (`#06B6D4`), Detection Red (`#FF4545`), Success Green (`#35D399`).
- **Typography**: Clean sans-serif (`Inter`) with monospace coordinates (`JetBrains Mono`).
- **Imagery**: Satellite remote sensing ocean imagery, coastal inlets, wakes, and harbor tiles.

---

## 🧭 Exact Seven Application Pages

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | **Landing Page** | `/` | Cinematic hero, satellite preview with red bounding boxes, overview, 5 visual workflow steps, 4 core feature cards, footer. |
| 2 | **Login Page** | `/login` | Translucent glassmorphism login panel, email/password validation, show/hide password, Remember Me, demo Google login button. |
| 3 | **Home Dashboard** | `/home` | Time-based personalized greeting ("Good morning, Jahnavi 👋"), **Recent Searches** image row, **Recent Areas** maritime cards, compact statistics. |
| 4 | **Ship Detection** | `/ship-detection` | Drag & drop upload (JPG, PNG, WEBP, TIFF), selected image card, side-by-side Original vs Detected comparison with red bounding box overlays, detected ships coordinate table, JSON export, and persistent save. |
| 5 | **Ship Monitoring Map** | `/ship-monitoring` | Interactive Leaflet geospatial map, corridor trajectory line, Start & Destination pins, normal vessels, pulsing distress warning markers, Route History, and live telemetry cards. |
| 6 | **Detection History** | `/history` | **Mandatory Table Layout**: Thumbnail, Date, Time, Ships count, Status badge, "Search Again" (restores workflow), "View Result" (modal preview with bounding boxes), and CSV export. |
| 7 | **Settings** | `/settings` | Real-time theme toggle (Light / Dark / System), Confidence threshold slider (0.10–0.95), map tile provider preferences, password change modal, and reset/clear data options. |

---

## 🛠️ Technology Stack
- **Framework**: React.js 18 (Functional components, Hooks)
- **Routing**: React Router DOM v6 with `ProtectedRoute`
- **State & Storage**: React Context API (`AppProvider`) + browser `localStorage`
- **Icons**: Lucide React
- **Geospatial Mapping**: Leaflet v1.9.4 with Carto Dark & Esri Satellite Tile Layers
- **Build Tool**: Vite 5

---

## 🚀 Windows Installation & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18, v20, or v22+)
- Windows Command Prompt or PowerShell

### Step-by-Step Run Commands

1. **Open PowerShell or CMD in the project folder:**
   ```powershell
   cd d:\Tiny_ship_detection
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the local development server:**
   ```powershell
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 🧪 Demo Credentials & Testing
- **Email**: `jahnavi@example.com` (or any valid email format)
- **Password**: `password123` (or any 6+ characters)
- **Zero Detection Testing**: Try uploading or selecting `test_image.png` to verify the zero-detection handling.
- **Search Again Testing**: Click "Search Again" on any card or table row to automatically restore the file and rerun the detection.
