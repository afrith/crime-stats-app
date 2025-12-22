import { data } from "react-router";
import type { Route } from "./+types/station";
import { getStations } from "~/db/stations";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Crime Stats: ${params.stationSlug}` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const stations = await getStations({ slug: params.stationSlug });
  if (stations.length === 0) {
    throw data("Station Not Found", { status: 404 });
  }
  return { station: stations[0] };
}

export default function Home({ params, loaderData }: Route.ComponentProps) {
  const { station } = loaderData;
  return <div>Station Page for {station.name}</div>;
}
