// services/db.ts

import mysql from 'mysql2/promise';

// 1. Configure your database connection pool
export const pool = mysql.createPool({
    host: 'localhost',       // Replace with your host
    user: 'Admin',           // Replace with your DB user
    password: 'Zodiark92!',  // Replace with your DB password
    database: 'layouts',     // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// 2. Generic query function with typed rows
export async function query<T extends Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
): Promise<T[]> {
    // pool.query returns [rows, fields], so we cast to the expected tuple
    const [rows] = (await pool.query(sql, params)) as [T[], unknown];
    return rows;
}

export async function loadLayout(
    layoutId: string | number
): Promise<string | null> {
    const sql = 'SELECT layout_config FROM tbl_layouts WHERE id = ? LIMIT 1';
    const rows = await query<{ layout_config: string | Buffer }>(sql, [layoutId]);

    const value = rows[0]?.layout_config;
    if (!value) return null;

    return Buffer.isBuffer(value) ? value.toString("utf8") : value;
}
export async function saveLayout(layoutId: string, layoutJson: string) {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            `UPDATE tbl_layouts SET layout_config = ?, updated_at = NOW() WHERE id = ?`,
            [layoutJson, layoutId]
        );
    } finally {
        conn.release();
    }
}

