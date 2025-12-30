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
  // Parque Saavedra, Saavedra, CABA (initial map center)
  centerLat: -34.55,
  centerLng: -58.48,

  // Buenos Aires center (for globe zoom)
  buenosAiresLat: -34.6118,
  buenosAiresLng: -58.4173,

  // Globe settings
  globe: {
    startAltitude: 3.5,
    zoomAltitude: 0.8,
    zoomDuration: 2500,
    introDelay: 1000, // Zoom starts 1 second after mounting
    transitionDelay: 2750, // When to switch to 2D map (introDelay + zoomDuration + 500ms buffer)
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

  // Street View API (optional - leave empty for basic usage)
  streetViewApiKey: "",
};

// =========================================
// HELPER FUNCTIONS
// =========================================

/**
 * Generate Google Street View thumbnail URL from coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} width - Image width (default: 400)
 * @param {number} height - Image height (default: 300)
 * @param {number} fov - Field of view (default: 90)
 * @param {number} heading - Camera heading in degrees (default: 0)
 * @param {number} pitch - Camera pitch in degrees (default: 0)
 * @returns {string} Street View image URL
 */
function getStreetViewUrl(lat, lng, width = 400, height = 300, fov = 90, heading = 0, pitch = 0) {
  const baseUrl = "https://maps.googleapis.com/maps/api/streetview";
  const params = new URLSearchParams({
    size: `${width}x${height}`,
    location: `${lat},${lng}`,
    fov: fov.toString(),
    heading: heading.toString(),
    pitch: pitch.toString(),
  });

  // Add API key if provided
  if (CONFIG.streetViewApiKey) {
    params.append("key", CONFIG.streetViewApiKey);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Get images for a location (uses Street View if no images provided)
 * @param {Object} location - Location object
 * @returns {Array} Array of image URLs
 */
function getLocationImages(location) {
  // If location has images array with local paths, use those
  if (location.images && location.images.length > 0) {
    const firstImage = location.images[0];
    // Check if it's a local path (starts with /) or a data URL
    if (typeof firstImage === "string" && (firstImage.startsWith("/") || firstImage.startsWith("data:"))) {
      return location.images;
    }
  }
  
  // Otherwise, generate Street View thumbnails
  // Generate multiple angles for gallery view
  const images = [
    getStreetViewUrl(location.lat, location.lng, 800, 600, 90, 0, 0),      // Front
    getStreetViewUrl(location.lat, location.lng, 800, 600, 90, 90, 0),     // Right
    getStreetViewUrl(location.lat, location.lng, 800, 600, 90, 180, 0),   // Back
    getStreetViewUrl(location.lat, location.lng, 800, 600, 90, 270, 0),   // Left
  ];
  
  return images;
}

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
const previewMapLink = document.getElementById("preview-map-link");
const detailTitle = document.getElementById("detail-title");
const detailCoords = document.getElementById("detail-coords");
const detailDesc = document.getElementById("detail-desc");
const detailGallery = document.getElementById("detail-gallery");
const detailClose = document.getElementById("detail-close");
const detailMapLink = document.getElementById("detail-map-link");
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
  // Clean globe without pins - Buenos Aires will be highlighted naturally through the zoom animation
  globe = Globe()
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
    .showAtmosphere(true)
    .atmosphereColor("#8b5cf6")
    .atmosphereAltitude(0.25)(globeContainer);

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
        lat: CONFIG.buenosAiresLat,
        lng: CONFIG.buenosAiresLng,
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
  
  // Use Street View thumbnail if available
  const images = getLocationImages(location);
  previewImage.src = images[0];

  // Set Google Maps link
  previewMapLink.href = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

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

  // Set Google Maps link
  detailMapLink.href = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  // Build gallery using Street View images
  detailGallery.innerHTML = "";
  const images = getLocationImages(location);
  images.forEach((imgUrl, index) => {
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `${location.name} - Street View ${index + 1}`;
    img.loading = "lazy";
    img.onerror = function() {
      // Fallback to a placeholder if Street View is not available
      this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2312121a' width='400' height='300'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Street View Available%3C/text%3E%3C/svg%3E";
    };
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
