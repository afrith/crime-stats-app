import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getCrimes } from "~/db/crimes";
import { getAnnualStats } from "~/db/stats";
import { getProvinces } from "~/db/structures";

export function headers(): HeadersInit {
  return {
    "Cache-Control": "public, max-age=86400",
  };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Crime Stats: South Africa" }];
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
