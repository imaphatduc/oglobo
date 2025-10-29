export const CONTINENTS = {
  "Châu Âu": {
    regions: ["Đông Âu", "Bắc Âu", "Nam Âu", "Tây Âu"],
  },
  "Châu Á": {
    regions: ["Trung Á", "Đông Á", "Đông Nam Á", "Nam Á", "Tây Á"],
  },
  "Châu Mỹ": {
    regions: ["Vùng Caribe", "Trung Mỹ", "Bắc Mỹ", "Nam Mỹ"],
  },
  "Châu Phi": {
    regions: ["Đông Phi", "Trung Phi", "Bắc Phi", "Nam Phi", "Tây Phi"],
  },
  "Châu Đại Dương": {
    regions: ["Australasia", "Melanesia", "Micronesia", "Polynesia"],
  },
};

export const REGIONS = Object.values(CONTINENTS)
  .map((d) => d.regions)
  .flat();
