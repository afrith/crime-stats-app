type Year = "2020" | "2021" | "2022" | "2023" | "2024" | "2025";
type Measure = "count" | "rate" | "density";

export interface MapOptions {
  crimeSlug: string;
  year: Year;
  measure: Measure;
}

export const defaultMapOptions: MapOptions = {
  crimeSlug: "murder",
  year: "2024",
  measure: "rate",
};

export const yearOptions: Year[] = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

export const yearLabels: Record<Year, string> = {
  "2020": "2020",
  "2021": "2021",
  "2022": "2022",
  "2023": "2023",
  "2024": "2024",
  "2025": "2025 (Jan – Jun)",
};

export const measureOptions: Measure[] = ["count", "rate", "density"];

export const measureLabels: Record<Measure, string> = {
  count: "Number of incidents",
  rate: "Incidents per 100,000 population",
  density: "Incidents per square kilometer",
};
