import { useCallback, useState, useMemo } from "react";
import Map, {
  Layer,
  Popup,
  Source,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StationCollection, StationFeature } from "~/db/stations";
import { pointOnFeature } from "@turf/turf";
import { Link } from "react-router";

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
  const [selectedFeature, setSelectedFeature] = useState<StationFeature | null>(
    null
  );

  const handleClick = useCallback((e: MapLayerMouseEvent) => {
    if (e?.features?.[0] == null) {
      onClick?.(undefined);
      setSelectedFeature(null);
    } else {
      const feature = e.features[0] as unknown as StationFeature;
      onClick?.(feature);
      setSelectedFeature(feature);
    }
  }, []);

  const [longitude, latitude] = useMemo(() => {
    if (selectedFeature == null) return [0, 0];
    const pt = pointOnFeature(selectedFeature);
    return pt.geometry.coordinates as [number, number];
  }, [selectedFeature]);

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
      {selectedFeature != null && (
        <Popup
          key={`popup-${selectedFeature.properties.slug}`}
          longitude={longitude}
          latitude={latitude}
        >
          <div className="fw-bold">{selectedFeature.properties.name}</div>
          <div>
            <Link to={`/station/${selectedFeature.properties.slug}`}>
              View Details
            </Link>
          </div>
        </Popup>
      )}
    </Map>
  );
}
