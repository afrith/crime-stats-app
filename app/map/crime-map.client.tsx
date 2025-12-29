import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { Await, useNavigation } from "react-router";
import Map, {
  type MapRef,
  Layer,
  Source,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import SpinnerFill from "~/utils/spinner-fill";
import type { StationCollection, StationFeature } from "~/db/stations";
import StationPopup from "./station-popup.client";
import type { CrimeStat } from "~/db/stats";
import { baseStyle } from "./base-style.client";
import bbox from "@turf/bbox";

interface ColoredStat extends CrimeStat {
  color: string;
}

interface CrimeMapProps {
  geomPromise: Promise<StationCollection>;
  data?: ColoredStat[];
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

function CrimeMap({ geomPromise, data, onClick }: CrimeMapProps) {
  const mapRef = useRef<MapRef>(null);

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

  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <Map
      initialViewState={{
        longitude: 24.66667,
        latitude: -28.5,
        zoom: 4,
      }}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      mapStyle={baseStyle}
      onClick={handleClick}
      interactiveLayerIds={interactiveLayerIds}
    >
      {isNavigating ? (
        <SpinnerFill />
      ) : (
        <Suspense fallback={<SpinnerFill />}>
          <Await resolve={geomPromise}>
            {(stations) => (
              <DataLayers stations={stations} data={data} mapRef={mapRef} />
            )}
          </Await>
        </Suspense>
      )}
      {clicked != null && <StationPopup {...clicked} />}
    </Map>
  );
}

interface DataLayersProps {
  stations: StationCollection;
  data?: ColoredStat[];
  mapRef: React.RefObject<MapRef | null>;
}

function DataLayers({ stations, data, mapRef }: DataLayersProps) {
  // fit map to the bounds of the geojson once it loads
  useEffect(() => {
    if (mapRef.current != null) {
      const bounds = bbox(stations) as [number, number, number, number];
      mapRef.current.fitBounds(bounds, { padding: 20, animate: false });
    }
  }, [stations]);

  // Augment stations with color property from data
  const stationsWithColors: StationCollection = useMemo(
    () =>
      data != null
        ? {
            ...stations,
            features: stations.features.map((feature) => {
              const stat = data.find(
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
          }
        : stations,
    [stations, data]
  );

  // this is a bit of a hack to force re-rendering the layer when data changes
  const [keyCount, setKeyCount] = useState(0);
  useEffect(() => {
    setKeyCount((count) => count + 1);
  }, [stationsWithColors]);

  return (
    <Source
      key={`data-${keyCount}`}
      id="stations"
      type="geojson"
      data={stationsWithColors}
    >
      <Layer {...lineLayer} beforeId="label-address-housenumber" />
      <Layer {...fillLayer} beforeId="station-lines" />
    </Source>
  );
}

export default CrimeMap;
