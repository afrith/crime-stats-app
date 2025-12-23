import { pool } from "./pool.server";
import type { FeatureCollection, Feature, MultiPolygon } from "geojson";

export interface Station {
  id: number;
  code: string;
  slug: string;
  name: string;
  dc_code: string;
  muni_code: string;
  prov_code: string;
  population: number;
  area_km2: number;
}

export type StationFeature = Feature<MultiPolygon, Station>;
export type StationCollection = FeatureCollection<MultiPolygon, Station>;

const fieldNames = [
  "id",
  "code",
  "slug",
  "name",
  "dc_code",
  "muni_code",
  "prov_code",
  "population",
  "area_km2",
];
const fieldList = fieldNames.join(", ");

interface StationQueryParams {
  slug?: string;
}

function buildWhereClause(params: StationQueryParams): {
  clause: string;
  values: any[];
} {
  const conditions: string[] = [];
  const values: any[] = [];

  if (params.slug) {
    conditions.push(`slug = $${values.length + 1}`);
    values.push(params.slug);
  }

  const clause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { clause, values };
}

export async function getStations(
  params: StationQueryParams = {}
): Promise<Station[]> {
  const whereClause = buildWhereClause(params);
  const client = await pool.connect();
  try {
    const result = await client.query<Station>(
      `SELECT ${fieldList}
      FROM station
      ${whereClause.clause}`,
      whereClause.values
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getStationGeometries(
  params: StationQueryParams = {}
): Promise<StationCollection> {
  const whereClause = buildWhereClause(params);
  const client = await pool.connect();
  try {
    const result = await client.query<Station & { geometry: MultiPolygon }>(
      `SELECT ${fieldList},
        ST_AsGeoJSON(geom_simp, 4, 1)::json AS geometry
      FROM station
      ${whereClause.clause}`,
      whereClause.values
    );
    const features: StationFeature[] = result.rows.map(
      ({ geometry, ...row }) => ({
        type: "Feature",
        id: row.id,
        properties: row,
        geometry: geometry,
      })
    );
    return {
      type: "FeatureCollection",
      features,
    };
  } finally {
    client.release();
  }
}
