/**
 * DRIFTMAP // UNDERGROUND
 * Location Data
 *
 * Structure:
 * - id: unique identifier
 * - name: location name
 * - lat: latitude
 * - lng: longitude
 * - description: text description
 * - images: array of image URLs (first one used for preview)
 * - tags: optional array of tags
 */

const LOCATIONS = [
  {
    id: 1,
    name: "Rotondita",
    lat: -34.4493333,
    lng: -58.74275,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    images: ["/imgs/locations/rotondita.jpeg", "/imgs/locations/rotondita.jpeg"],
    tags: ["underground", "urban"],
  },
  {
    id: 2,
    name: "Tecnopolis",
    lat: -34.5615668,
    lng: -58.5076549,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    images: [
      "/imgs/locations/tecnopolis.jpeg",
      "/imgs/locations/tecnopolis.jpeg",
    ],
    tags: ["underground", "urban"],
  },
  {
    id: 3,
    name: "Rotonda Grande",
    lat: -34.5333179,
    lng: -58.4649936,
    description:
      "A third underground location waiting to be explored. The city's hidden network continues to reveal itself.",
    images: [
      "/imgs/locations/rotonda-grande.jpeg",
      "/imgs/locations/rotonda-grande.jpeg",
    ],
    tags: ["underground", "urban"],
  },
  {
    id: 4,
    name: "Location 4",
    lat: -34.2033057,
    lng: -58.9592798,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 5,
    name: "Location 5",
    lat: -34.1214029,
    lng: -59.0177208,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 6,
    name: "Location 6",
    lat: -34.3894907,
    lng: -59.0357579,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 7,
    name: "Location 7",
    lat: -34.6058728,
    lng: -59.1733605,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 8,
    name: "Location 8",
    lat: -34.4876945,
    lng: -59.0834426,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 9,
    name: "Location 9",
    lat: -34.4638477,
    lng: -59.3981664,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 10,
    name: "Location 10",
    lat: -34.4639519,
    lng: -59.3959591,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 11,
    name: "Location 11",
    lat: -34.5668079,
    lng: -58.8488137,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 12,
    name: "Location 12",
    lat: -34.0918472,
    lng: -59.0726274,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 13,
    name: "Location 13",
    lat: -34.0757125,
    lng: -59.0449121,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 14,
    name: "Location 14",
    lat: -34.0608571,
    lng: -59.0936217,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 15,
    name: "Location 15",
    lat: -34.1056972,
    lng: -59.098743,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 16,
    name: "Location 16",
    lat: -34.0988031,
    lng: -59.0857007,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 17,
    name: "Location 17",
    lat: -34.0978795,
    lng: -59.0840006,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 18,
    name: "Location 18",
    lat: -34.4526839,
    lng: -58.7231058,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 19,
    name: "Location 19",
    lat: -34.431898,
    lng: -58.7199396,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 20,
    name: "Location 20",
    lat: -34.4613248,
    lng: -58.7285883,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 21,
    name: "Location 21",
    lat: -34.4299297,
    lng: -58.7171589,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
  {
    id: 22,
    name: "Location 22",
    lat: -34.4356772,
    lng: -58.719171,
    description:
      "A hidden underground space in Buenos Aires. Explore the depths beneath the city streets.",
    tags: ["underground", "urban"],
  },
  {
    id: 23,
    name: "Location 23",
    lat: -34.4277127,
    lng: -58.7251006,
    description:
      "Another underground discovery in the urban maze of Buenos Aires. Where the city's secrets lie hidden.",
    tags: ["underground", "urban"],
  },
];

// Export for ES modules (if needed later)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LOCATIONS };
}
