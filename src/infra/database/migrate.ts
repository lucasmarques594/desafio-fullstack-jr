import { createBillsTable } from "./migrations/create-bills-table";
import { pool } from "./postgres";

async function runMigrations() {
  await createBillsTable(pool);
}

runMigrations();
