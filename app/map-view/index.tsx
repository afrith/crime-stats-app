import { Suspense, useEffect, useState, useMemo } from "react";
import { Await, useFetcher } from "react-router";
import SpinnerFill from "~/utils/spinner-fill";
import CrimeMap from "~/map/crime-map.client";
import ClientOnly from "~/utils/client-only";
import type { Station, StationCollection } from "~/db/stations";
import type { Crime } from "~/db/crimes";
import ControlPane from "./control-pane";
import type { loader } from "~/routes/stats";
import { calculateBreakpoints } from "~/utils/breakpoints";
import Legend from "./legend";
import type { MapOptions } from "./map-options";

// OrRd from colorbrewer2.org
const colorScheme = {
  3: ["#fee8c8", "#fdbb84", "#e34a33"],
  4: ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
  5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
  6: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
  7: [
    "#fef0d9",
    "#fdd49e",
    "#fdbb84",
    "#fc8d59",
    "#ef6548",
    "#d7301f",
    "#990000",
  ],
  8: [
    "#fff7ec",
    "#fee8c8",
    "#fdd49e",
    "#fdbb84",
    "#fc8d59",
    "#ef6548",
    "#d7301f",
    "#990000",
  ],
  9: [
    "#fff7ec",
    "#fee8c8",
    "#fdd49e",
    "#fdbb84",
    "#fc8d59",
    "#ef6548",
    "#d7301f",
    "#b30000",
    "#7f0000",
  ],
};

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

export default function MapView({
  crimes,
  stations,
  geomPromise,
}: MapViewProps) {
  const [options, setOptions] = useState<MapOptions>({
    crimeSlug: "murder",
    year: "2024",
    measure: "rate",
  });

  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    fetcher.load(`/stats/annual/${options.crimeSlug}/${options.year}`);
  }, [options.crimeSlug, options.year, fetcher.load]);

  const { breakpoints, colors, coloredData } = useMemo(() => {
    if (fetcher.data?.stats == null) {
      return { breakpoints: undefined, colors: undefined };
    }
    const breakpoints = calculateBreakpoints(
      fetcher.data.stats.map((x) => x[options.measure]),
      8
    );
    const colors =
      colorScheme[(breakpoints.length - 1) as 3 | 4 | 5 | 6 | 7 | 8];

    const colorFn = (value: number) => {
      for (let i = 1; i < breakpoints.length; i++) {
        if (value < breakpoints[i]) {
          return colors[i - 1];
        }
      }
    };

    const coloredData = fetcher.data.stats.map((stat) => ({
      ...stat,
      color: colorFn(stat[options.measure]) ?? "#ffffff",
    }));

    return { breakpoints, colors, coloredData };
  }, [fetcher.data?.stats, options.measure]);

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
                      options={options}
                      data={coloredData}
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
            {breakpoints != null && colors != null && (
              <Legend
                options={options}
                breakpoints={breakpoints}
                colors={colors}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
