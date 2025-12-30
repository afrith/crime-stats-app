import { createContext, useContext, useState, useMemo } from "react";
import type { MapOptions } from "./index";

interface MapOptionsContextValue {
  options: MapOptions;
  setOptions: (options: MapOptions) => void;
}

const MapOptionsContext = createContext<MapOptionsContextValue | undefined>(
  undefined
);

export function MapOptionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [options, setOptions] = useState<MapOptions>({
    crimeSlug: "17-community-reported-serious-crime",
    year: "2024",
    measure: "rate",
  });

  const value = useMemo(() => ({ options, setOptions }), [options]);

  return <MapOptionsContext value={value}>{children}</MapOptionsContext>;
}

export const useMapOptions = (): MapOptionsContextValue => {
  const context = useContext(MapOptionsContext);
  if (!context) {
    throw new Error("useMapOptions must be used within a MapOptionsProvider");
  }
  return context;
};
