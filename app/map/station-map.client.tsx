import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { PathOptions } from "leaflet";
import type { StationFeature } from "~/db/stations";

interface StationMapProps {
  station: StationFeature;
}

const geoJsonStyle: PathOptions = {
  color: "rgb(0, 79, 163)",
  weight: 2,
  opacity: 1,
  fill: true,
};

export default function StationMap(props: StationMapProps) {
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

function MapContent({ station }: StationMapProps) {
  const map = useMap();
  useEffect(() => {
    if (station.geometry.bbox != null) {
      const [west, south, east, north] = station.geometry.bbox;
      map.fitBounds([
        [south, west],
        [north, east],
      ]);
    }
  }, [station]);
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={station} style={geoJsonStyle} />
    </>
  );
}
