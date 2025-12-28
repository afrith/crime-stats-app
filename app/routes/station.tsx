import { data } from "react-router";
import type { Route } from "./+types/station";
import { getStationDetails } from "~/db/stations";
import StationView from "~/station-view";

export async function loader({ params }: Route.LoaderArgs) {
  const station = await getStationDetails(params.stationSlug);
  if (station == null) {
    throw data("Station Not Found", { status: 404 });
  }
  return { station };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `Crime Stats: ${loaderData.station.properties.name}` }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <StationView {...loaderData} />;
}
