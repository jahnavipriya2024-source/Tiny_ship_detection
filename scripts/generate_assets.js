import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const imagesDir = path.resolve('public/images');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// 1. Radar Icon SVG (Favicon & Brand Logo)
const radarIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.3"/>
      <stop offset="80%" stop-color="#06B6D4" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#041321" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beam" x1="50%" y1="50%" x2="100%" y2="20%">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="#061B2D" stroke="#164B65" stroke-width="2"/>
  <circle cx="50" cy="50" r="35" fill="none" stroke="#164B65" stroke-width="1.5" stroke-dasharray="3 3"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="#164B65" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="10" fill="#22D3EE" fill-opacity="0.2" stroke="#22D3EE" stroke-width="2"/>
  <circle cx="50" cy="50" r="46" fill="url(#radarGlow)"/>
  <line x1="50" y1="4" x2="50" y2="96" stroke="#164B65" stroke-width="1.5"/>
  <line x1="4" y1="50" x2="96" y2="50" stroke="#164B65" stroke-width="1.5"/>
  <path d="M 50 50 L 92 30 A 46 46 0 0 0 50 4 Z" fill="url(#beam)"/>
  <!-- Blips -->
  <circle cx="70" cy="28" r="2.5" fill="#22D3EE"/>
  <circle cx="34" cy="62" r="2" fill="#35D399"/>
  <circle cx="62" cy="72" r="2" fill="#FF4545"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'radar-icon.svg'), radarIconSvg);

// 2. High-res Satellite Imagery SVG generator
function generateSatelliteSvg({ width, height, title, baseColor1, baseColor2, islands = [], ships = [], wavePattern = true, clouds = true }) {
  let islandElements = islands.map(isl => `
    <path d="${isl.d}" fill="${isl.color || '#1A3F22'}" stroke="#2D5A34" stroke-width="2" opacity="${isl.opacity || 0.9}"/>
    <path d="${isl.d}" fill="#2E6B3C" opacity="0.4" transform="scale(0.95) translate(4, 3)"/>
    <path d="${isl.d}" fill="#D4B483" stroke="none" opacity="0.3" transform="scale(1.03) translate(-2, -1)"/>
  `).join('');

  let waveLines = '';
  if (wavePattern) {
    for (let y = 15; y < height; y += 22) {
      waveLines += `<path d="M 0 ${y} Q ${width * 0.25} ${y + 8}, ${width * 0.5} ${y} T ${width} ${y}" fill="none" stroke="#22D3EE" stroke-width="0.8" opacity="0.12"/>`;
    }
  }

  let cloudElements = '';
  if (clouds) {
    cloudElements = `
      <g filter="blur(8px)" opacity="0.25">
        <ellipse cx="${width * 0.2}" cy="${height * 0.3}" rx="70" ry="25" fill="#FFFFFF"/>
        <ellipse cx="${width * 0.7}" cy="${height * 0.7}" rx="90" ry="35" fill="#FFFFFF"/>
        <ellipse cx="${width * 0.8}" cy="${height * 0.25}" rx="50" ry="20" fill="#FFFFFF"/>
      </g>
    `;
  }

  let shipElements = ships.map((s, idx) => `
    <g transform="translate(${s.x}, ${s.y}) rotate(${s.angle || 35})">
      <!-- Ship Wake -->
      <path d="M 0 0 L -8 18 L 8 18 Z" fill="#E0F2FE" opacity="0.4" filter="blur(1px)"/>
      <path d="M 0 0 L -18 36 L 18 36 Z" fill="#38BDF8" opacity="0.2" filter="blur(2px)"/>
      <!-- Tiny Ship Hull -->
      <path d="M 0 -8 L 3.5 4 L 3 10 L -3 10 L -3.5 4 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="0.75"/>
      <circle cx="0" cy="1" r="1.5" fill="#EF4444"/>
    </g>
  `).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="deepSeaGrad_${title}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${baseColor1}"/>
        <stop offset="60%" stop-color="${baseColor2}"/>
        <stop offset="100%" stop-color="#020B14"/>
      </linearGradient>
      <radialGradient id="sunGlint" cx="70%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Ocean Floor / Water Surface -->
    <rect width="${width}" height="${height}" fill="url(#deepSeaGrad_${title})"/>
    <rect width="${width}" height="${height}" fill="url(#sunGlint)"/>
    ${waveLines}
    ${islandElements}
    ${shipElements}
    ${cloudElements}
  </svg>`;
}

// Generate satellite_001.svg (Open ocean with 5 detected tiny ships)
const sat001 = generateSatelliteSvg({
  width: 640,
  height: 480,
  title: 'sat001',
  baseColor1: '#0E3854',
  baseColor2: '#062033',
  ships: [
    { x: 140, y: 100, angle: 42 },
    { x: 220, y: 160, angle: 38 },
    { x: 350, y: 235, angle: 45 },
    { x: 440, y: 325, angle: 50 },
    { x: 520, y: 410, angle: 40 }
  ]
});
fs.writeFileSync(path.join(imagesDir, 'satellite_001.svg'), sat001);

// Generate ocean_view.svg (3 ships)
const oceanView = generateSatelliteSvg({
  width: 640,
  height: 480,
  title: 'oceanView',
  baseColor1: '#0B3350',
  baseColor2: '#051A2C',
  ships: [
    { x: 180, y: 140, angle: 120 },
    { x: 320, y: 260, angle: 85 },
    { x: 460, y: 340, angle: 110 }
  ]
});
fs.writeFileSync(path.join(imagesDir, 'ocean_view.svg'), oceanView);

// Generate harbor_scan.svg (harbor coast + 2 boats)
const harborScan = generateSatelliteSvg({
  width: 640,
  height: 480,
  title: 'harborScan',
  baseColor1: '#0F415D',
  baseColor2: '#08253A',
  islands: [
    { d: 'M 0 0 L 260 0 Q 240 120, 180 180 T 110 320 L 0 480 Z', color: '#1B3828' },
    { d: 'M 190 70 L 250 85 L 245 98 L 185 83 Z', color: '#64748B' }, // pier
    { d: 'M 160 140 L 225 155 L 220 166 L 155 152 Z', color: '#64748B' } // pier 2
  ],
  ships: [
    { x: 280, y: 110, angle: 75 },
    { x: 250, y: 220, angle: 135 }
  ]
});
fs.writeFileSync(path.join(imagesDir, 'harbor_scan.svg'), harborScan);

// Generate coastal_scan.svg (coastal inlet + 4 boats)
const coastalScan = generateSatelliteSvg({
  width: 640,
  height: 480,
  title: 'coastalScan',
  baseColor1: '#0D3D58',
  baseColor2: '#072438',
  islands: [
    { d: 'M 400 0 Q 360 140, 430 240 T 480 480 L 640 480 L 640 0 Z', color: '#244530' },
    { d: 'M 410 0 Q 370 140, 440 240 T 490 480 L 475 480 Q 425 240, 355 140 T 395 0 Z', color: '#D4B483', opacity: 0.6 } // sandy coast
  ],
  ships: [
    { x: 160, y: 120, angle: 25 },
    { x: 210, y: 210, angle: 30 },
    { x: 140, y: 340, angle: 15 },
    { x: 300, y: 380, angle: 340 }
  ]
});
fs.writeFileSync(path.join(imagesDir, 'coastal_scan.svg'), coastalScan);

// Generate test_image.svg (Empty sea, 0 ships)
const testImage = generateSatelliteSvg({
  width: 640,
  height: 480,
  title: 'testImage',
  baseColor1: '#08253B',
  baseColor2: '#041523',
  wavePattern: true,
  clouds: true,
  ships: [] // 0 ships
});
fs.writeFileSync(path.join(imagesDir, 'test_image.svg'), testImage);

// Generate Recent Areas SVGs:
// 1. Bay of Bengal
const bayOfBengal = generateSatelliteSvg({
  width: 500,
  height: 320,
  title: 'bayOfBengal',
  baseColor1: '#0C3754',
  baseColor2: '#051B2E',
  islands: [
    { d: 'M 0 0 L 160 0 Q 140 100, 110 200 T 50 320 L 0 320 Z', color: '#1B3D2B' }, // East coast of India
    { d: 'M 380 0 L 500 0 L 500 240 Q 440 200, 410 120 Z', color: '#244733' }, // Myanmar coast
    { d: 'M 350 200 Q 360 250, 350 300 L 340 300 Q 348 250, 340 200 Z', color: '#2A523B' } // Andaman Islands
  ],
  ships: [{ x: 240, y: 160, angle: 45 }]
});
fs.writeFileSync(path.join(imagesDir, 'bay_of_bengal.svg'), bayOfBengal);

// 2. Arabian Sea
const arabianSea = generateSatelliteSvg({
  width: 500,
  height: 320,
  title: 'arabianSea',
  baseColor1: '#0E3957',
  baseColor2: '#051D30',
  islands: [
    { d: 'M 0 0 L 180 0 Q 110 50, 60 120 T 0 200 Z', color: '#3A3F33' }, // Arabian Peninsula
    { d: 'M 360 0 L 500 0 L 500 320 L 380 320 Q 360 200, 340 100 Z', color: '#21422E' } // West coast of India
  ],
  ships: [{ x: 260, y: 180, angle: 120 }]
});
fs.writeFileSync(path.join(imagesDir, 'arabian_sea.svg'), arabianSea);

// 3. Indian Ocean
const indianOcean = generateSatelliteSvg({
  width: 500,
  height: 320,
  title: 'indianOcean',
  baseColor1: '#082D4A',
  baseColor2: '#031422',
  islands: [
    { d: 'M 240 40 Q 260 60, 250 85 T 235 70 Z', color: '#20462F' }, // Sri Lanka tip
    { d: 'M 220 180 Q 223 200, 221 220 L 219 220 Z', color: '#325C43' } // Maldives chain
  ],
  ships: [{ x: 300, y: 150, angle: 70 }]
});
fs.writeFileSync(path.join(imagesDir, 'indian_ocean.svg'), indianOcean);

// 4. Mediterranean Sea
const mediterraneanSea = generateSatelliteSvg({
  width: 500,
  height: 320,
  title: 'mediterraneanSea',
  baseColor1: '#0B3F63',
  baseColor2: '#051E32',
  islands: [
    { d: 'M 0 0 L 500 0 L 500 70 Q 380 90, 260 60 T 120 80 L 0 50 Z', color: '#284632' }, // Southern Europe
    { d: 'M 0 250 Q 160 220, 320 260 T 500 240 L 500 320 L 0 320 Z', color: '#4D4733' }, // North Africa
    { d: 'M 250 120 Q 280 130, 275 145 T 245 135 Z', color: '#2F5038' } // Sicily / Crete
  ],
  ships: [{ x: 210, y: 140, angle: 95 }]
});
fs.writeFileSync(path.join(imagesDir, 'mediterranean_sea.svg'), mediterraneanSea);

// 5. Landing Page Hero Ocean background
const heroOcean = generateSatelliteSvg({
  width: 1440,
  height: 900,
  title: 'heroOcean',
  baseColor1: '#06253D',
  baseColor2: '#020C17',
  islands: [
    { d: 'M 0 0 L 320 0 Q 280 180, 220 320 T 140 600 L 0 900 Z', color: '#163622', opacity: 0.8 },
    { d: 'M 1180 900 L 1440 900 L 1440 450 Q 1320 540, 1260 680 Z', color: '#1A3F28', opacity: 0.7 }
  ],
  ships: [
    { x: 420, y: 280, angle: 35 },
    { x: 620, y: 390, angle: 40 },
    { x: 740, y: 460, angle: 45 },
    { x: 910, y: 560, angle: 38 },
    { x: 1040, y: 640, angle: 42 }
  ],
  wavePattern: true,
  clouds: true
});
fs.writeFileSync(path.join(imagesDir, 'hero_ocean.svg'), heroOcean);

console.log('Successfully generated all satellite & maritime SVG assets!');
