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

export async function getStations(): Promise<Station[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<Station>(
      `SELECT ${fieldList}
      FROM station`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getStationGeometries(): Promise<StationCollection> {
  const client = await pool.connect();
  try {
    const result = await client.query<Station & { geometry: MultiPolygon }>(
      `SELECT ${fieldList},
        ST_AsGeoJSON(geom, 5)::json AS geometry
      FROM station`
    );
    const features: StationFeature[] = result.rows.map((row) => ({
      type: "Feature",
      id: row.id,
      properties: row,
      geometry: row.geometry,
    }));
    return {
      type: "FeatureCollection",
      features,
    };
  } finally {
    client.release();
  }
}
