import { data } from "react-router";
import type { Route } from "./+types/province";
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

export async function loader({ params }: Route.LoaderArgs) {
  const { provCode } = params;
  const [crimes, provinces, stats] = await Promise.all([
    getCrimes(),
    getProvinces(),
    getAnnualStats({ provCode }),
  ]);

  const province = provinces.find((p) => p.prov_code === provCode);
  if (province == null) {
    throw data("Province Not Found", { status: 404 });
  }
  return {
    province,
    provinces,
    crimes,
    stats,
  };
}

export function meta({ location, loaderData }: Route.MetaArgs) {
  return makeMetaTags({
    title: `Crime Stats: ${loaderData.province.prov_name}`,
    description: `Crime statistics for ${loaderData.province.prov_name} with interactive maps`,
    pathname: location.pathname,
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { prov_code: code, prov_name: name } = loaderData.province;
  return (
    <MapView {...loaderData} structure={{ name, type: "province", code }} />
  );
}
