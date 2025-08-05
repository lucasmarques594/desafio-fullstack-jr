import { Pool } from "pg";

export async function createBillsTable(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bills (
      id UUID PRIMARY KEY,
      nome_cliente VARCHAR(255) NOT NULL,
      vencimento DATE NOT NULL,
      valor NUMERIC(10, 2) NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      descricao TEXT
    );
  `);
}
