import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import type { PathOptions } from "leaflet";

interface CrimeMapProps {
  stations: FeatureCollection;
}

const geoJsonStyle: PathOptions = {
  color: "black",
  weight: 1,
  opacity: 1,
  fill: false,
};

export default function CrimeMap({ stations }: CrimeMapProps) {
  return (
    <MapContainer
      center={[-28.5, 24.66667]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={stations} style={geoJsonStyle} />
    </MapContainer>
  );
}
