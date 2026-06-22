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

function createPool(): Pool {
    if (!process.env.DATABASE_URL) {
        throw new Error(
            "DATABASE_URL environment variable is not set.\n" +
            "Add it to .env.local: DATABASE_URL=postgres://kashee:<password>@localhost:5432/kasheemilk2"
        );
    }
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,               // max connections in pool
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        ssl: process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
    });
}

// Reuse pool across hot-reloads in development
const pool = globalThis._pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalThis._pgPool = pool;

export default pool;

// ── Typed query helper ─────────────────────────────────────────────────────────
export async function query<T extends Record<string, unknown>>(
    sql: string,
    params?: unknown[]
): Promise<T[]> {
    const { rows } = await pool.query<T>(sql, params);
    return rows;
}

// lib/db.ts
export async function gquery<T extends object>(  // ← was: Record<string, unknown>
    sql: string,
    params?: unknown[]
): Promise<T[]> {
    const { rows } = await pool.query<T>(sql, params);
    return rows;
}

// ── Data fetcher ───────────────────────────────────────────────────────────────
export function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
}
