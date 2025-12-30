import { data } from "react-router";
import type { Route } from "./+types/station";
import { getStationDetails } from "~/db/stations";
import { getCrimes } from "~/db/crimes";
import StationView from "~/station-view";
import { getAnnualStats } from "~/db/stats";
import { makeMetaTags } from "~/utils/meta-tags";

export function headers(): HeadersInit {
  return {
    "Cache-Control": "public, max-age=600",
  };
}

export async function loader({ params }: Route.LoaderArgs) {
  const [station, crimes, stats] = await Promise.all([
    getStationDetails(params.stationSlug),
    getCrimes(),
    getAnnualStats({ stationSlug: params.stationSlug, groupBy: "station" }),
  ]);

  if (station == null) {
    throw data("Station Not Found", { status: 404 });
  }
  return { station, crimes, stats };
}

export function meta({ location, loaderData }: Route.MetaArgs) {
  return makeMetaTags({
    title: `Crime Stats: ${loaderData.station.properties.name}`,
    description: `Crime statistics for ${loaderData.station.properties.name} police station, ${loaderData.station.properties.prov_name}`,
    pathname: location.pathname,
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <StationView {...loaderData} />;
}
