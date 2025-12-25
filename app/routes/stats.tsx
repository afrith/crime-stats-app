import { data } from "react-router";
import type { Route } from "./+types/stats";
import { getAnnualStats } from "~/db/stats";

export async function loader({ params }: Route.LoaderArgs) {
  const { crimeSlug, year } = params;
  const stats = await getAnnualStats({ crimeSlug, year: parseInt(year) });
  return data({ stats });
}
