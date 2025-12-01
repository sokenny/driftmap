/**
 * DRIFTMAP // UNDERGROUND
 * Main Application
 *
 * Hybrid approach: 3D Globe intro → 2D Street Map
 */

// =========================================
// CONFIGURATION
// =========================================

const CONFIG = {
  // Buenos Aires center
  centerLat: -34.6118,
  centerLng: -58.4173,

  // Globe settings
  globe: {
    startAltitude: 3.5,
    zoomAltitude: 0.8,
    zoomDuration: 2500,
    introDelay: 2000,
    transitionDelay: 5000, // When to switch to 2D map
  },

  // Map settings
  map: {
    initialZoom: 13,
    minZoom: 11,
    maxZoom: 18,
    // Dark map tiles
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },

  // Pin styling
  pinColor: "#00ff88",
};

// =========================================
// STATE
// =========================================

let globe = null;
let map = null;
let currentView = "globe"; // 'globe' or 'map'
let hoveredLocation = null;
let selectedLocation = null;
let backgroundMusic = null;
let markers = [];

// DOM Elements
const globeContainer = document.getElementById("globe-container");
const mapContainer = document.getElementById("map-container");
const previewPanel = document.getElementById("preview-panel");
const detailPanel = document.getElementById("detail-panel");
const previewTitle = document.getElementById("preview-title");
const previewCoords = document.getElementById("preview-coords");
const previewImage = document.getElementById("preview-image");
const detailTitle = document.getElementById("detail-title");
const detailCoords = document.getElementById("detail-coords");
const detailDesc = document.getElementById("detail-desc");
const detailGallery = document.getElementById("detail-gallery");
const detailClose = document.getElementById("detail-close");
const cameraLat = document.getElementById("camera-lat");
const cameraLng = document.getElementById("camera-lng");

// =========================================
// INITIALIZATION
// =========================================

function init() {
  // Initialize globe for intro
  initGlobe();

  // Initialize 2D map (hidden initially)
  initMap();

  // Setup event listeners
  setupEventListeners();

  // Start background music
  initBackgroundMusic();

  // Start intro sequence
  startIntroSequence();
}

// =========================================
// GLOBE (3D Intro)
// =========================================

function initGlobe() {
  globe = Globe()
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
    .showAtmosphere(true)
    .atmosphereColor("#8b5cf6")
    .atmosphereAltitude(0.25)
    // Points (pins)
    .pointsData(LOCATIONS)
    .pointLat("lat")
    .pointLng("lng")
    .pointColor(() => CONFIG.pinColor)
    .pointAltitude(0.1)
    .pointRadius(0.8)
    .pointResolution(32)
    // Rings (pulsing effect)
    .ringsData(LOCATIONS)
    .ringLat("lat")
    .ringLng("lng")
    .ringColor(() => (t) => `rgba(0, 255, 136, ${1 - t})`)
    .ringMaxRadius(3)
    .ringPropagationSpeed(3)
    .ringRepeatPeriod(1500)(globeContainer);

  // Initial position - zoomed out view
  globe.pointOfView(
    {
      lat: 10,
      lng: -60,
      altitude: CONFIG.globe.startAltitude,
    },
    0
  );

  // Controls
  globe.controls().enableDamping = true;
  globe.controls().dampingFactor = 0.05;
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;

  // Custom globe material
  const globeMaterial = globe.globeMaterial();
  globeMaterial.bumpScale = 10;
}

// =========================================
// MAP (2D Street View)
// =========================================

function initMap() {
  // Create Leaflet map
  map = L.map("map-container", {
    center: [CONFIG.centerLat, CONFIG.centerLng],
    zoom: CONFIG.map.initialZoom,
    minZoom: CONFIG.map.minZoom,
    maxZoom: CONFIG.map.maxZoom,
    zoomControl: true,
    attributionControl: false,
  });

  // Add dark tile layer
  L.tileLayer(CONFIG.map.tileUrl, {
    attribution: CONFIG.map.attribution,
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  // Add custom markers for each location
  LOCATIONS.forEach((location) => {
    const marker = createCustomMarker(location);
    markers.push(marker);
  });

  // Update coordinates display on map move
  map.on("move", updateMapCoordinates);
  map.on("moveend", updateMapCoordinates);
}

function createCustomMarker(location) {
  // Custom HTML marker
  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-pin" data-id="${location.id}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const marker = L.marker([location.lat, location.lng], {
    icon: markerIcon,
  }).addTo(map);

  // Hover events
  marker.on("mouseover", () => {
    if (currentView === "map") {
      showPreviewPanel(location);
    }
  });

  marker.on("mouseout", () => {
    if (currentView === "map" && !selectedLocation) {
      hidePreviewPanel();
    }
  });

  // Click event
  marker.on("click", () => {
    if (currentView === "map") {
      showDetailPanel(location);
      map.flyTo([location.lat, location.lng], 16, { duration: 1 });
    }
  });

  return marker;
}

function updateMapCoordinates() {
  if (map && currentView === "map") {
    const center = map.getCenter();
    cameraLat.textContent = `LAT: ${center.lat.toFixed(2)}°`;
    cameraLng.textContent = `LNG: ${center.lng.toFixed(2)}°`;
  }
}

// =========================================
// INTRO SEQUENCE
// =========================================

function startIntroSequence() {
  // Phase 1: After intro delay, zoom to Buenos Aires
  setTimeout(() => {
    globe.controls().autoRotate = false;

    globe.pointOfView(
      {
        lat: CONFIG.centerLat,
        lng: CONFIG.centerLng,
        altitude: CONFIG.globe.zoomAltitude,
      },
      CONFIG.globe.zoomDuration
    );
  }, CONFIG.globe.introDelay);

  // Phase 2: Transition to 2D map
  setTimeout(() => {
    transitionToMap();
  }, CONFIG.globe.transitionDelay);
}

function transitionToMap() {
  // Fade out globe
  globeContainer.classList.add("fade-out");

  // Fade in map
  mapContainer.classList.add("visible");

  // Update state
  currentView = "map";

  // Force map resize (fixes rendering issues)
  setTimeout(() => {
    map.invalidateSize();
    updateMapCoordinates();
  }, 100);

  // Clean up globe after transition
  setTimeout(() => {
    if (globe) {
      globe.controls().autoRotate = false;
    }
  }, 1500);
}

// =========================================
// AUDIO
// =========================================

function initBackgroundMusic() {
  backgroundMusic = new Audio("getlow.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.4;

  const playPromise = backgroundMusic.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      const startMusic = () => {
        backgroundMusic.play();
        document.removeEventListener("click", startMusic);
        document.removeEventListener("keydown", startMusic);
      };
      document.addEventListener("click", startMusic);
      document.addEventListener("keydown", startMusic);
    });
  }
}

// =========================================
// PANELS
// =========================================

function showPreviewPanel(location) {
  if (!location || selectedLocation) return;

  hoveredLocation = location;

  previewTitle.textContent = location.name;
  previewCoords.textContent = `${location.lat.toFixed(
    4
  )}° / ${location.lng.toFixed(4)}°`;
  previewImage.src = location.images[0];

  previewPanel.classList.remove("hidden");
  previewPanel.classList.add("visible");
}

function hidePreviewPanel() {
  hoveredLocation = null;
  previewPanel.classList.remove("visible");
  previewPanel.classList.add("hidden");
}

function showDetailPanel(location) {
  if (!location) return;

  selectedLocation = location;
  hidePreviewPanel();

  detailTitle.textContent = location.name;
  detailCoords.textContent = `LAT ${location.lat.toFixed(
    4
  )}° // LNG ${location.lng.toFixed(4)}°`;
  detailDesc.textContent = location.description;

  // Build gallery
  detailGallery.innerHTML = "";
  location.images.forEach((imgUrl, index) => {
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `${location.name} - Image ${index + 1}`;
    img.loading = "lazy";
    detailGallery.appendChild(img);
  });

  detailPanel.classList.remove("hidden");
  detailPanel.classList.add("visible");
}

function hideDetailPanel() {
  selectedLocation = null;
  detailPanel.classList.remove("visible");
  detailPanel.classList.add("hidden");

  // Zoom back out on map
  if (currentView === "map") {
    map.flyTo([CONFIG.centerLat, CONFIG.centerLng], CONFIG.map.initialZoom, {
      duration: 1,
    });
  }
}

// =========================================
// EVENT LISTENERS
// =========================================

function setupEventListeners() {
  // Close detail panel
  detailClose.addEventListener("click", hideDetailPanel);

  // Close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideDetailPanel();
    }
  });

  // Window resize
  window.addEventListener("resize", () => {
    if (globe) {
      globe.width(window.innerWidth);
      globe.height(window.innerHeight);
    }
    if (map) {
      map.invalidateSize();
    }
  });
}

// =========================================
// START
// =========================================

document.addEventListener("DOMContentLoaded", init);
