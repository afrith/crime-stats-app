import { data } from "react-router";
import type { Route } from "./+types/station";
import { getStationDetails, getStationGeometries } from "~/db/stations";
import StationView from "~/station-view";

export async function loader({ params }: Route.LoaderArgs) {
  const station = await getStationDetails(params.stationSlug);
  const geoms = await getStationGeometries({ slug: params.stationSlug });
  if (station == null || geoms.features.length === 0) {
    throw data("Station Not Found", { status: 404 });
  }
  return { station, feature: geoms.features[0] };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `Crime Stats: ${loaderData.station.name}` }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { station, feature } = loaderData;
  return <StationView station={station} feature={feature} />;
}
