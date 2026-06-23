// lib/db.ts
// ─── PostgreSQL connection pool ────────────────────────────────────────────────
// Uses the `pg` package (node-postgres).
// Install: npm install pg && npm install -D @types/pg

import { Pool } from "pg";

declare global {
    // Prevent multiple pool instances during Next.js hot-reload in dev
    // eslint-disable-next-line no-var
    var _pgPool: Pool | undefined;
}

let pool: Pool;

function getPool(): Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
        if (!connectionString) {
            if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
                console.warn("DATABASE_URL not set, using empty pool");
            }
            return new Pool(); // Empty pool that won't connect
        }
        pool = new Pool({
            connectionString,
            max: 10,
            idleTimeoutMillis: 30_000,
            connectionTimeoutMillis: 5_000,
            ssl: process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
        });
    }
    return pool;
}

// Reuse pool across hot-reloads in development
if (process.env.NODE_ENV !== "production" && globalThis._pgPool) {
    pool = globalThis._pgPool;
}

if (process.env.NODE_ENV !== "production") {
    globalThis._pgPool = getPool();
}

export default getPool();

// ── Typed query helper ─────────────────────────────────────────────────────────
export async function query<T extends Record<string, unknown>>(
    sql: string,
    params?: unknown[]
): Promise<T[]> {
    const { rows } = await getPool().query<T>(sql, params);
    return rows;
}

// lib/db.ts
export async function gquery<T extends object>(  // ← was: Record<string, unknown>
    sql: string,
    params?: unknown[]
): Promise<T[]> {
    const { rows } = await getPool().query<T>(sql, params);
    return rows;
}

// ── Data fetcher ───────────────────────────────────────────────────────────────
export function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
}
