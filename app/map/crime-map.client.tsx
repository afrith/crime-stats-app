import { useCallback } from "react";
import Map, {
  Layer,
  Source,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StationCollection, StationFeature } from "~/db/stations";

interface CrimeMapProps {
  stations: StationCollection;
  onClick?: (station?: StationFeature) => void;
}

const fillLayer: FillLayerSpecification = {
  id: "station-fills",
  type: "fill",
  source: "stations",
  paint: {
    "fill-opacity": 0,
  },
};

const lineLayer: LineLayerSpecification = {
  id: "station-lines",
  type: "line",
  source: "stations",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#666",
    "line-width": 1,
    "line-opacity": 0.6,
  },
};

const interactiveLayerIds = ["station-fills"];

export default function CrimeMap({ stations, onClick }: CrimeMapProps) {
  const handleClick = useCallback((e: MapLayerMouseEvent) => {
    if (e?.features?.[0] == null) {
      onClick?.(undefined);
    } else {
      const feature = e.features[0];
      onClick?.(feature as unknown as StationFeature);
    }
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: 24.66667,
        latitude: -28.5,
        zoom: 5,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://vector.openstreetmap.org/styles/shortbread/colorful.json"
      onClick={handleClick}
      interactiveLayerIds={interactiveLayerIds}
    >
      <Source id="stations" type="geojson" data={stations}>
        <Layer {...fillLayer} />
        <Layer {...lineLayer} />
      </Source>
    </Map>
  );
}
