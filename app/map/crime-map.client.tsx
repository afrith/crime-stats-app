import { useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMapEvent } from "react-leaflet";
import type { PathOptions, Layer } from "leaflet";
import type { StationCollection, StationFeature } from "~/db/stations";

interface CrimeMapProps {
  stations?: StationCollection;
  onClick?: (station?: StationFeature) => void;
}

const geoJsonStyle: PathOptions = {
  color: "black",
  weight: 1,
  opacity: 1,
  fill: true,
  fillOpacity: 0,
};

export default function CrimeMap(props: CrimeMapProps) {
  return (
    <MapContainer
      center={[-28.5, 24.66667]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <MapContent {...props} />
    </MapContainer>
  );
}

function MapContent({ stations, onClick }: CrimeMapProps) {
  const handleEachFeature = useCallback(
    (feature: StationFeature, layer: Layer) => {
      layer.on("click", (event) => {
        onClick?.(feature);
      });
    },
    [onClick]
  );

  useMapEvent("click", () => {
    onClick?.(undefined);
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations && (
        <GeoJSON
          data={stations}
          style={geoJsonStyle}
          onEachFeature={handleEachFeature}
          bubblingMouseEvents={false}
        />
      )}
    </>
  );
}
