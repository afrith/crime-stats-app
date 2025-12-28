import { useRef, useEffect, useState } from "react";
import Map, {
  type MapRef,
  Layer,
  Source,
  type FillLayerSpecification,
  type LineLayerSpecification,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StationFeature } from "~/db/stations";

interface StationMapProps {
  station: StationFeature;
}

const fillLayer: FillLayerSpecification = {
  id: "station-fill",
  type: "fill",
  source: "station",
  paint: {
    "fill-color": "rgb(0, 79, 163)",
    "fill-opacity": 0.6,
  },
};

const lineLayer: LineLayerSpecification = {
  id: "station-line",
  type: "line",
  source: "station",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "rgb(0, 79, 163)",
    "line-width": 2,
  },
};

export default function StationMap({ station }: StationMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded && station.geometry.bbox != null && mapRef.current != null) {
      const bbox = station.geometry.bbox as [number, number, number, number];
      mapRef.current.fitBounds(bbox, { padding: 20, animate: false });
    }
  }, [loaded, station]);

  return (
    <Map
      initialViewState={{
        longitude: 24.66667,
        latitude: -28.5,
        zoom: 5,
      }}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://vector.openstreetmap.org/styles/shortbread/colorful.json"
      onLoad={() => setLoaded(true)}
    >
      <Source id="station" type="geojson" data={station}>
        <Layer {...fillLayer} beforeId="station-line" />
        <Layer {...lineLayer} beforeId="label-address-housenumber" />
      </Source>
    </Map>
  );
}
