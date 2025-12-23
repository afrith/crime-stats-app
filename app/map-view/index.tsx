import { Suspense, useState } from "react";
import { Await, Link } from "react-router";
import SpinnerFill from "~/utils/spinner-fill";
import CrimeMap from "~/map/crime-map.client";
import ClientOnly from "~/utils/client-only";
import type { Station, StationCollection } from "~/db/stations";

interface MapViewProps {
  stations: Station[];
  geomPromise?: Promise<StationCollection | undefined>;
}

const fallback = (
  <SpinnerFill>
    <span>Loading map...</span>
  </SpinnerFill>
);

export default function MapView({ geomPromise }: MapViewProps) {
  const [selectedStation, setSelectedStation] = useState<Station | undefined>(
    undefined
  );
  return (
    <main className="p-3 vh-100">
      <div className="d-flex flex-column h-100">
        <div>
          <h1>Crime Stats SA</h1>
        </div>
        <div className="flex-grow-1 d-flex flex-row w-100">
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
          <div className="flex-grow-1 ps-3" style={{ width: "35%" }}>
            {selectedStation != null ? (
              <>
                <h3>{selectedStation?.name}</h3>
                <p>
                  <Link to={`/station/${selectedStation.slug}`}>
                    View details
                  </Link>
                </p>
              </>
            ) : (
              <p>Click a station on the map to see details here.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
