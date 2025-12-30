import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getCrimes } from "~/db/crimes";
import { getAnnualStats } from "~/db/stats";
import { getProvinces } from "~/db/structures";
import { makeMetaTags } from "~/utils/meta-tags";

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
  const [crimes, provinces, stats] = await Promise.all([
    getCrimes(),
    getProvinces(),
    getAnnualStats({}),
  ]);
  return {
    crimes,
    provinces,
    stats,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <MapView {...loaderData} />;
}
