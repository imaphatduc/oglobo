interface WikidataItem {
  id: string; // Q-number
  type: "item";
  labels: { [lang: string]: { language: string; value: string } };
  descriptions: { [lang: string]: { language: string; value: string } };
  aliases: { [lang: string]: Array<{ language: string; value: string }> };
  claims: { [propertyId: string]: WikidataClaim[] };
  sitelinks: {
    [site: string]: { site: string; title: string; badges: string[] };
  };
}

export interface WikidataClaim {
  id: string;
  mainsnak: WikidataSnak;
  type: "statement";
  rank: "preferred" | "normal" | "deprecated";
  qualifiers?: { [propertyId: string]: WikidataSnak[] };
  // references?: WikidataReference[];
}

interface WikidataSnak {
  snaktype: "value" | "somevalue" | "novalue";
  property: string; // P-number
  datavalue?: {
    value: any; // Type depends on the property's datatype
    type: string; // e.g., "string", "wikibase-entityid", "time", "globecoordinate"
  };
  hash: string;
}

// ... and so on for other structures like properties, lexemes, references, etc.
