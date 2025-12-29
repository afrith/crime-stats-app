import { data } from "react-router";
import type { Route } from "./+types/province";
import MapView from "~/map-view";
import { getStationGeometries } from "~/db/stations";
import { getCrimes } from "~/db/crimes";
import { getAnnualStats } from "~/db/stats";
import { getProvinces } from "~/db/structures";

export async function loader({ params }: Route.LoaderArgs) {
  const { provCode } = params;
  const [provinces, crimes, stats] = await Promise.all([
    getProvinces({ provCode }),
    getCrimes(),
    getAnnualStats({ provCode }),
  ]);
  if (provinces.length === 0) {
    throw data("Province Not Found", { status: 404 });
  }
  return {
    province: provinces[0],
    crimes,
    stats,
    geomPromise: getStationGeometries({ provCode }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `Crime Stats: ${loaderData.province.prov_name}` }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { prov_code: code, prov_name: name } = loaderData.province;
  return (
    <MapView {...loaderData} structure={{ name, type: "province", code }} />
  );
}
