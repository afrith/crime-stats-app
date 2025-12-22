import { Suspense, lazy, type FC } from "react";
import { Await } from "react-router";
import SpinnerFill from "~/display/spinner-fill";
import type { FeatureCollection } from "geojson";
import CrimeMap from "~/map/crimeMap.client";
import ClientOnly from "./clientOnly";

interface MapViewProps {
  stationsPromise?: Promise<FeatureCollection | undefined>;
}

const fallback = (
  <SpinnerFill>
    <span>Loading map...</span>
  </SpinnerFill>
);

export default function MapView({ stationsPromise }: MapViewProps) {
  return (
    <main className="p-4 vh-100">
      <div className="d-flex flex-column h-100 gx-4">
        <div>
          <h1>Crime Stats SA</h1>
        </div>
        <div className="flex-grow-1 d-flex flex-row w-100">
          <div className="flex-grow-1 h-100" style={{ width: "65%" }}>
            <Suspense fallback={fallback}>
              <ClientOnly fallback={fallback}>
                <Await resolve={stationsPromise}>
                  {(stations) => <CrimeMap stations={stations} />}
                </Await>
              </ClientOnly>
            </Suspense>
          </div>
          <div className="flex-grow-1" style={{ width: "35%" }} />
        </div>
      </div>
    </main>
  );
}
