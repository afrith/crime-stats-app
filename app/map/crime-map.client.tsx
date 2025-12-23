import { useCallback, useState } from "react";
import Map, {
  Layer,
  Source,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StationCollection, StationFeature } from "~/db/stations";
import StationPopup from "./station-popup.client";

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

interface ClickData {
  feature: StationFeature;
  latitude: number;
  longitude: number;
}

export default function CrimeMap({ stations, onClick }: CrimeMapProps) {
  const [clicked, setClicked] = useState<ClickData | null>(null);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (e?.features?.[0] == null) {
        onClick?.(undefined);
        setClicked(null);
      } else {
        const feature = e.features[0] as unknown as StationFeature;
        onClick?.(feature);
        setClicked({
          feature,
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      }
    },
    [onClick]
  );

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
      {clicked != null && <StationPopup {...clicked} />}
    </Map>
  );
}
