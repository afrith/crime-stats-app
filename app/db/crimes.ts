import { pool } from "./pool.server";

export interface Crime {
  id: number;
  code: string;
  slug: string;
  name: string;
  parent_id?: number;
  sort_order: number;
}

const fieldNames: Array<keyof Crime> = [
  "id",
  "code",
  "slug",
  "name",
  "parent_id",
  "sort_order",
];
const fieldList = fieldNames.map((name) => `crime.${name}`).join(", ");

export async function getCrimes(): Promise<Crime[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<Crime>(
      `SELECT ${fieldList} FROM crime ORDER BY sort_order`
    );
    return result.rows;
  } finally {
    client.release();
  }
}
