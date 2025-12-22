import { data } from "react-router";
import type { Route } from "./+types/station";
import { getStationGeometries } from "~/db/stations";
import StationView from "~/station-view";

export async function loader({ params }: Route.LoaderArgs) {
  const stations = await getStationGeometries({ slug: params.stationSlug });
  if (stations.features.length === 0) {
    throw data("Station Not Found", { status: 404 });
  }
  return { station: stations.features[0] };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `Crime Stats: ${loaderData.station.properties.name}` }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { station } = loaderData;
  return <StationView station={station} />;
}
