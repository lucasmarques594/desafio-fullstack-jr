import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { BillResponse } from "../../domain/types/bills";

export class GetAllBillsUseCase {
  constructor(private billRepository: IBillRepository) {}
  async execute(): Promise<BillResponse[]> {
    const bills = await this.billRepository.findAll();

    return bills.map((bill) => ({
      id: bill.id,
      nome_cliente: bill.nome_cliente,
      vencimento: bill.vencimento,
      valor: bill.valor,
      tipo: bill.tipo,
      descricao: bill.descricao,
    }));
  }
}
