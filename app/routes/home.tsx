import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getCrimes } from "~/db/crimes";
import { getAnnualStats } from "~/db/stats";
import { getProvinces } from "~/db/structures";
import { makeMetaTags } from "~/utils/meta-tags";
import { getStations } from "~/db/stations";

export function headers(): HeadersInit {
  return {
    "Cache-Control": "public, max-age=600",
  };
}

export function meta({ location }: Route.MetaArgs) {
  return makeMetaTags({
    title: "Crime Stats: South Africa",
    description: "Crime statistics for South Africa with interactive maps",
    pathname: location.pathname,
  });
}

export async function loader() {
  const [crimes, provinces, stats, stations] = await Promise.all([
    getCrimes(),
    getProvinces(),
    getAnnualStats({}),
    getStations(),
  ]);
  return {
    crimes,
    provinces,
    stats,
    stations,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <MapView {...loaderData} />;
}
