import { pool } from "./pool.server";

export interface Province {
  prov_code: string;
  prov_name: string;
}

interface Params {
  provCode?: string;
}

export async function getProvinces(params: Params = {}): Promise<Province[]> {
  const whereClause = params.provCode != null ? `WHERE prov_code = $1` : "";
  const values = params.provCode != null ? [params.provCode] : [];

  const client = await pool.connect();
  try {
    const result = await client.query<Province>(
      `SELECT prov_code, prov_name
      FROM province ${whereClause}
      ORDER BY prov_name`,
      values
    );
    return result.rows;
  } finally {
    client.release();
  }
}
