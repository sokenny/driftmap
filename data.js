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
];

// Export for ES modules (if needed later)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LOCATIONS };
}
