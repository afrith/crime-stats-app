import { Pool, types } from "pg";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/crimestats";

types.setTypeParser(1700, (val) => parseFloat(val)); // Parse numeric as float

export const pool = new Pool({
  connectionString: databaseUrl,
});
