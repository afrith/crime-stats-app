import { useEffect, useState, useMemo } from "react";
import { useFetcher, Link } from "react-router";
import ClientOnly from "~/utils/client-only";

import type { MapOptions } from "~/utils/map-options";
import CrimeMap from "~/map/crime-map.client";
import ControlPane from "./control-pane";
import CrimeTable from "~/crime-table";
import Legend from "./legend";
import SpinnerFill from "~/utils/spinner-fill";
import { Row, Col } from "react-bootstrap";
import "./map-view.css";

import type { Crime } from "~/db/crimes";
import type { CrimeStat } from "~/db/stats";
import type { StationCollection } from "~/db/stations";
import type { loader } from "~/routes/stats";
import { calculateBreakpoints } from "~/utils/breakpoints";
import type { Province } from "~/db/structures";

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
  crimes: Crime[];
  provinces: Province[];
  stats: CrimeStat[];
  geomPromise: Promise<StationCollection>;
  structure?: {
    name: string;
    type: string;
    code: string;
  };
}

export default function MapView(props: MapViewProps) {
  const { crimes, provinces, stats, geomPromise, structure } = props;
  const [options, setOptions] = useState<MapOptions>({
    crimeSlug: "murder",
    year: "2024",
    measure: "rate",
  });

  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("crime", options.crimeSlug);
    params.append("year", options.year);
    if (structure != null) {
      params.append(structure.type, structure.code);
    }
    fetcher.load(`/stats/annual?${params.toString()}`);
  }, [
    options.crimeSlug,
    options.year,
    structure?.type,
    structure?.code,
    fetcher.load,
  ]);

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
      return colors[colors.length - 1];
    };

    const coloredData = fetcher.data.stats.map((stat) => ({
      ...stat,
      color: colorFn(stat[options.measure]) ?? "#ffffff",
    }));

    return { breakpoints, colors, coloredData };
  }, [fetcher.data?.stats, options.measure]);

  const sortedProvinces = [...provinces].sort((a, b) =>
    a.prov_name.localeCompare(b.prov_name)
  );

  return (
    <main className="p-3">
      <div>
        <h1>Crime Stats: {structure?.name ?? "South Africa"}</h1>
      </div>
      <div className="py-2 text-center">
        <span className="me-4">
          {structure == null ? (
            <strong>South Africa</strong>
          ) : (
            <Link to="/">South Africa</Link>
          )}
        </span>
        {sortedProvinces.map((prov) => (
          <span key={prov.prov_code} className="me-4">
            {structure?.code === prov.prov_code ? (
              <strong>{prov.prov_name}</strong>
            ) : (
              <Link to={`/province/${prov.prov_code}`}>{prov.prov_name}</Link>
            )}
          </span>
        ))}
      </div>
      <Row className="gx-lg-4 gy-4 gy-lg-0">
        <Col md={8} sm={12} className="map-container">
          <ClientOnly fallback={<SpinnerFill />}>
            <CrimeMap
              key={`map-${structure?.code ?? "ZA"}`}
              geomPromise={geomPromise}
              data={coloredData}
            />
          </ClientOnly>
        </Col>
        <Col md={4} sm={12}>
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
        </Col>
      </Row>
      <div className="pt-4">
        <CrimeTable crimes={crimes} stats={stats} />
      </div>
    </main>
  );
}
