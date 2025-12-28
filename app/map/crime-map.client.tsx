import { memo, useCallback, useEffect, useState, useRef } from "react";
import Map, {
  type MapRef,
  Layer,
  Source,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StationCollection, StationFeature } from "~/db/stations";
import StationPopup from "./station-popup.client";
import type { MapOptions } from "~/utils/map-options";
import type { CrimeStat } from "~/db/stats";

interface ColoredStat extends CrimeStat {
  color: string;
}

interface CrimeMapProps {
  stations: StationCollection;
  options: MapOptions;
  data?: ColoredStat[];
  colors?: string[];
  breakpoints?: number[];
  onClick?: (station?: StationFeature) => void;
}

const fillLayer: FillLayerSpecification = {
  id: "station-fills",
  type: "fill",
  source: "stations",
  paint: {
    "fill-color": ["get", "color"],
    "fill-opacity": 0.5,
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
    "line-color": "#777777",
    "line-width": 1,
    "line-opacity": 1,
  },
};

const interactiveLayerIds = ["station-fills"];

interface ClickData {
  feature: StationFeature;
  stat?: ColoredStat;
  latitude: number;
  longitude: number;
}

function CrimeMap({ stations, data, onClick }: CrimeMapProps) {
  // Fit map to South Africa bbox on load
  const mapRef = useRef<MapRef>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (loaded && mapRef.current != null) {
      mapRef.current.fitBounds([16.45, -34.83333, 32.9, -22.13333], {
        padding: 20,
        animate: true,
      });
    }
  }, [loaded]);

  // this is a bit of a hack to force re-rendering the layer when data changes
  const [keyCount, setKeyCount] = useState(0);
  useEffect(() => {
    setKeyCount((count) => count + 1);
  }, [data]);

  // Augment stations with color property from data
  const stationsWithColors: StationCollection = {
    ...stations,
    features: stations.features.map((feature) => {
      const stat = data?.find(
        (s) => s.stationSlug === feature.properties?.slug
      );
      return {
        ...feature,
        properties: {
          ...feature.properties,
          color: stat?.color ?? "#ffffff",
        },
      };
    }),
  };

  // handle clicking on map features
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
          stat: data?.find?.((s) => s.stationSlug === feature.properties.slug),
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      }
    },
    [onClick, data]
  );

  return (
    <Map
      initialViewState={{
        longitude: 24.66667,
        latitude: -28.5,
        zoom: 4,
      }}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://vector.openstreetmap.org/styles/shortbread/colorful.json"
      onLoad={() => setLoaded(true)}
      onClick={handleClick}
      interactiveLayerIds={interactiveLayerIds}
    >
      <Source id="stations" type="geojson" data={stationsWithColors}>
        <Layer {...lineLayer} beforeId="label-address-housenumber" />
        <Layer
          key={`data-${keyCount}`}
          {...fillLayer}
          beforeId="station-lines"
        />
      </Source>
      {clicked != null && <StationPopup {...clicked} />}
    </Map>
  );
}

export default memo(CrimeMap);
