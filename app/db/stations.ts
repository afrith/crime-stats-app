import { pool } from "./pool.server";
import type { FeatureCollection, Feature, MultiPolygon } from "geojson";

export interface Station {
  id: number;
  slug: string;
  name: string;
  population: number;
  area_km2: number;
}

export interface StationDetails extends Station {
  code: string;
  former_name: string;
  muni_code: string;
  muni_name: string;
  dc_code: string;
  dc_name: string;
  prov_code: string;
  prov_name: string;
}

export type StationFeature = Feature<MultiPolygon, Station>;
export type StationCollection = FeatureCollection<MultiPolygon, Station>;

const fieldNames = [
  "station.id",
  "station.slug",
  "station.name",
  "station.population",
  "station.area_km2",
];
const fieldList = fieldNames.join(", ");

const extraFieldNames = [
  "station.code",
  "station.former_name",
  "station.muni_code",
  "local_muni.muni_name",
  "station.dc_code",
  "district_muni.dc_name",
  "station.prov_code",
  "province.prov_name",
];
const detailFieldList = [...fieldNames, ...extraFieldNames].join(", ");

interface StationQueryParams {
  slug?: string;
  provCode?: string;
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

  if (params.provCode) {
    conditions.push(`prov_code = $${values.length + 1}`);
    values.push(params.provCode);
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

export async function getStationDetails(
  slug: string
): Promise<Feature<MultiPolygon, StationDetails> | null> {
  const client = await pool.connect();
  try {
    const result = await client.query<
      StationDetails & { geometry: MultiPolygon }
    >(
      `SELECT ${detailFieldList},
        ST_AsGeoJSON(geom_simp, 4, 1)::json AS geometry
      FROM station
        JOIN province ON station.prov_code = province.prov_code
        JOIN district_muni ON station.dc_code = district_muni.dc_code
        JOIN local_muni ON station.muni_code = local_muni.muni_code
      WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const { geometry, ...properties } = result.rows[0];

    return {
      type: "Feature",
      geometry,
      id: properties.id,
      properties,
    };
  } finally {
    client.release();
  }
}
