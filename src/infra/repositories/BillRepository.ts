import { Pool } from "pg";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill } from "../../domain/entities/Bill";

export class BillRepository implements IBillRepository {
  constructor(readonly db: Pool) {}

  async create(billData: Bill): Promise<Bill> {
    const newBill = Bill.create(billData);

    await this.db.query(
      "INSERT INTO bills (id, nome_cliente, vencimento, valor, tipo, descricao) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        newBill.id,
        newBill.nome_cliente,
        newBill.vencimento,
        newBill.valor,
        newBill.tipo,
        newBill.descricao,
      ]
    );

    return newBill;
  }

  async findById(id: string): Promise<Bill | null> {
    const result = await this.db.query("SELECT * FROM bills WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return Bill.with({
      id: row.id,
      nome_cliente: row.nome_cliente,
      vencimento: new Date(row.vencimento),
      valor: parseFloat(row.valor),
      tipo: row.tipo,
      descricao: row.descricao,
    });
  }

  async findAll(): Promise<Bill[]> {
    const result = await this.db.query(
      "SELECT * FROM bills ORDER BY vencimento DESC"
    );

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows.map((row) =>
      Bill.with({
        id: row.id,
        nome_cliente: row.nome_cliente,
        vencimento: new Date(row.vencimento),
        valor: parseFloat(row.valor),
        tipo: row.tipo,
        descricao: row.descricao,
      })
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query("DELETE FROM bills WHERE id = $1", [id]);
  }
}
