import { Client } from 'pg'; 
import { Bill } from '../../../domain/entities/Bill';
import { IBillRepository } from '../../../domain/repositories/IBillRepository';
import { getPostgresClient } from '../postgres';
import { randomUUID } from 'crypto';

export class BillRepository implements IBillRepository {
  private client: Client;
  private isConnected = false;

  constructor() {
    this.client = getPostgresClient();
  }

  private async connectIfNotConnected() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.log('Conectado ao PostgreSQL com pg!');
    }
  }

  async setup(): Promise<void> {
    await this.connectIfNotConnected();

    await this.client.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id UUID PRIMARY KEY,
        nome_cliente VARCHAR(255) NOT NULL,
        vencimento DATE NOT NULL,
        valor NUMERIC(10, 2) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        descricao TEXT
      );
    `);
    console.log("Tabela 'bills' verificada/criada com sucesso.");
  }

  async create(billData: Omit<Bill, 'id'>): Promise<Bill> {
    const id = randomUUID();
    const newBill: Bill = { id, ...billData };

    const query = {
      text: `INSERT INTO bills (id, nome_cliente, vencimento, valor, tipo, descricao)
             VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [newBill.id, newBill.nome_cliente, newBill.vencimento, newBill.valor, newBill.tipo, newBill.descricao]
    };

    await this.client.query(query);
    return newBill;
  }

  async findById(id: string): Promise<Bill | null> {
    const result = await this.client.query('SELECT * FROM bills WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new Bill(row.id, row.nome_cliente, new Date(row.vencimento), parseFloat(row.valor), row.tipo, row.descricao);
  }

  async findAll(): Promise<Bill[]> {
    const result = await this.client.query('SELECT * FROM bills ORDER BY vencimento DESC');
    return result.rows.map(row =>
      new Bill(row.id, row.nome_cliente, new Date(row.vencimento), parseFloat(row.valor), row.tipo, row.descricao)
    );
  }

  async delete(id: string): Promise<void> {
    await this.client.query('DELETE FROM bills WHERE id = $1', [id]);
  }
}