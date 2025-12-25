import { pool } from "./pool.server";

export interface CrimeStat {
  crimeSlug: string;
  stationSlug: string;
  year: number;
  count: number;
  rate: number;
  density: number;
}

interface Params {
  crimeSlug?: string;
  stationSlug?: string;
  year?: number;
}

export async function getAnnualStats(params: Params): Promise<CrimeStat[]> {
  const conditions: string[] = [];
  const values: any[] = [];

  if (params.crimeSlug) {
    conditions.push(`crime.slug = $${values.length + 1}`);
    values.push(params.crimeSlug);
  }

  if (params.stationSlug) {
    conditions.push(`station.slug = $${values.length + 1}`);
    values.push(params.stationSlug);
  }

  if (params.year) {
    conditions.push(`crime_stat.year = $${values.length + 1}`);
    values.push(params.year);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const client = await pool.connect();

  try {
    const result = await client.query<CrimeStat>(
      `
      SELECT 
        crime.slug AS "crimeSlug",
        station.slug AS "stationSlug",
        crime_stat.year,
        SUM(crime_stat.crimes)::int AS count,
        SUM(crime_stat.crimes) * 100000.0 /station.population AS rate,
        SUM(crime_stat.crimes) / station.area_km2 AS density
      FROM crime_stat JOIN crime ON crime_stat.crime_id = crime.id
                      JOIN station ON crime_stat.station_id = station.id
      ${whereClause}
      GROUP BY crime.slug, station.slug, station.population, station.area_km2, crime_stat.year
      ORDER BY crime_stat.year
      `,
      values
    );
    return result.rows;
  } finally {
    client.release();
  }
}
