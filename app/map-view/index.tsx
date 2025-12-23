import { Suspense, useState } from "react";
import { Await } from "react-router";
import SpinnerFill from "~/utils/spinner-fill";
import CrimeMap from "~/map/crime-map.client";
import ClientOnly from "~/utils/client-only";
import type { Station, StationCollection } from "~/db/stations";
import type { Crime } from "~/db/crimes";
import ControlPane, { type MapOptions } from "./control-pane";

interface MapViewProps {
  stations: Station[];
  crimes: Crime[];
  geomPromise: Promise<StationCollection>;
}

const fallback = (
  <SpinnerFill>
    <span>Loading map...</span>
  </SpinnerFill>
);

export default function MapView({ crimes, geomPromise }: MapViewProps) {
  const [selectedStation, setSelectedStation] = useState<Station | undefined>(
    undefined
  );
  const [options, setOptions] = useState<MapOptions>({
    crimeSlug: "murder",
    year: "2024",
    measure: "rate",
  });

  return (
    <main className="p-3 vh-100">
      <div className="d-flex flex-column h-100">
        <div>
          <h1>Crime Stats SA</h1>
        </div>
        <div className="flex-grow-1 d-flex flex-row w-100 overflow-hidden">
          <div className="flex-grow-1 h-100" style={{ width: "65%" }}>
            <Suspense fallback={fallback}>
              <ClientOnly fallback={fallback}>
                <Await resolve={geomPromise}>
                  {(stations) => (
                    <CrimeMap
                      stations={stations}
                      onClick={(station) =>
                        setSelectedStation(station?.properties)
                      }
                    />
                  )}
                </Await>
              </ClientOnly>
            </Suspense>
          </div>
          <div
            className="flex-grow-1 ps-3 overflow-y-auto"
            style={{ width: "35%" }}
          >
            <ControlPane
              crimes={crimes}
              options={options}
              onOptionsChange={(newOptions) =>
                setOptions((prev) => ({ ...prev, ...newOptions }))
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
