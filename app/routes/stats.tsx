import { data } from "react-router";
import type { Route } from "./+types/stats";
import { getAnnualStats } from "~/db/stats";

export function headers(): HeadersInit {
  return {
    "Cache-Control": "public, max-age=86400",
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const crimeSlug = url.searchParams.get("crime") ?? undefined;
  const year = url.searchParams.get("year") ?? undefined;
  const provCode = url.searchParams.get("province") ?? undefined;

  const stats = await getAnnualStats({
    crimeSlug,
    year: year != null ? parseInt(year) : undefined,
    provCode,
    groupBy: "station",
  });

  return data({ stats });
}
