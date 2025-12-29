import { data } from "react-router";
import type { Route } from "./+types/station";
import { getStationDetails } from "~/db/stations";
import { getCrimes } from "~/db/crimes";
import StationView from "~/station-view";
import { getAnnualStats } from "~/db/stats";

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

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `Crime Stats: ${loaderData.station.properties.name}` }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <StationView {...loaderData} />;
}
