import type { Route } from "./+types/geom";
import { data } from "react-router";
import { getStationGeometries } from "~/db/stations";

export function headers(): HeadersInit {
  return {
    "Cache-Control": "public, max-age=86400",
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const provCode = url.searchParams.get("province") ?? undefined;
  return data({
    geometry: await getStationGeometries({ provCode }),
  });
}
