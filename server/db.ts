// server/db.ts  (NOUVELLE VERSION)

// 1) Client Postgres “postgres-js”
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@shared/schema";

// 2) Vérification de l’URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set (Supabase connection string).");
}

/**
 * Supabase → string du type :
 *   postgres://<user>:<password>@<host>:5432/postgres?sslmode=require
 * Le paramètre `ssl: 'require'` est indispensable.
 */
export const queryClient = postgres(process.env.DATABASE_URL, {
  max: 20,          // connexions simultanées
  idle_timeout: 30, // secondes
  connect_timeout: 10,
  ssl: "require",
});

// 3) Instanciation Drizzle
export const db = drizzle(queryClient, { schema });
