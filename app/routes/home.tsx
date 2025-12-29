import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getStationGeometries } from "~/db/stations";
import { getCrimes } from "~/db/crimes";
import { getAnnualStats } from "~/db/stats";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Crime Stats: South Africa" }];
}

export async function loader() {
  const [crimes, stats] = await Promise.all([getCrimes(), getAnnualStats({})]);
  return {
    crimes,
    stats,
    geomPromise: getStationGeometries(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <MapView {...loaderData} />;
}
