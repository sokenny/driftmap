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
    name: "Subte Line A - Primera Junta",
    lat: -34.6275,
    lng: -58.4442,
    description:
      "The oldest subway line in Latin America, opened in 1913. The wooden carriages and Belgian tiles tell stories of a century underground. A living museum beneath the streets of Buenos Aires.",
    images: [
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&q=80",
      "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&q=80",
    ],
    tags: ["subway", "historic", "transit"],
  },
  {
    id: 2,
    name: "Túneles de la Manzana de las Luces",
    lat: -34.6125,
    lng: -58.3745,
    description:
      "Colonial-era tunnels beneath the historic block. These 18th century passages connected churches, government buildings, and escape routes. Mysteries of old Buenos Aires lie in the darkness below.",
    images: [
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&q=80",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80",
    ],
    tags: ["tunnels", "colonial", "historic"],
  },
  {
    id: 3,
    name: "El Zanjón de Granados",
    lat: -34.618,
    lng: -58.372,
    description:
      "An underground archaeological site in San Telmo. Tunnels, cisterns, and foundations dating back to 1730. The hidden river beneath the city, now a haunting gallery of urban history.",
    images: [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80",
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?w=600&q=80",
    ],
    tags: ["archaeology", "historic", "museum"],
  },
  {
    id: 4,
    name: "Estación Federico Lacroze",
    lat: -34.5833,
    lng: -58.4538,
    description:
      "Underground terminus of the Urquiza line. Art deco architecture meets brutalist expansion. Where commuter trains dive beneath Chacarita's surface into the city's depths.",
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?w=600&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80",
    ],
    tags: ["station", "transit", "architecture"],
  },
  {
    id: 5,
    name: "Pasaje Barolo - Basement Level",
    lat: -34.6095,
    lng: -58.3856,
    description:
      "The subterranean levels of Buenos Aires' most esoteric building. Designed with Dante's Inferno in mind, the basement represents Hell itself. Sacred geometry in concrete and shadow.",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80",
    ],
    tags: ["architecture", "esoteric", "landmark"],
  },
];

// Export for ES modules (if needed later)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LOCATIONS };
}
