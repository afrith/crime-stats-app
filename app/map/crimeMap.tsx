import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";

interface CrimeMapProps {
  stations: FeatureCollection;
}

export default function CrimeMap({ stations }: CrimeMapProps) {
  return (
    <MapContainer
      center={[-28.5, 24.66667]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={stations} />
    </MapContainer>
  );
}
