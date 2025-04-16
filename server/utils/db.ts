import pg from 'pg';

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.NUXT_DATABASE_URL, // ⬅️ .env file required
  ssl: {
    rejectUnauthorized: false, // needed for Neon, Supabase, etc.
  },
});
