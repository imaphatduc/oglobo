export type IMF_CPI_SECTOR =
  | "Food and non-alcoholic beverages"
  | "Alcoholic beverages, tobacco and narcotics"
  | "Clothing and footwear"
  | "Housing, water, electricity, gas and other fuels"
  | "Furnishings, household equipment and routine household maintenance"
  | "Health"
  | "Transport"
  | "Communication"
  | "Recreation and culture"
  | "Education"
  | "Restaurants and hotels"
  | "Miscellaneous goods and services"
  | "All Items";

export type IMF_CPI = {
  countryId: string;
  sector: IMF_CPI_SECTOR;
  year: string;
  value: number;
};
