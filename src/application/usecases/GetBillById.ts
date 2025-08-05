import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { BillResponse } from "../../domain/types/bills";

export class GetBillByIdUseCase {
  constructor(private billRepository: IBillRepository) {}
  async execute(id: string): Promise<BillResponse | null> {
    const Bill = await this.billRepository.findById(id);

    return {
      id: Bill.id,
      nome_cliente: Bill.nome_cliente,
      vencimento: Bill.vencimento,
      valor: Bill.valor,
      tipo: Bill.tipo,
      descricao: Bill.descricao,
    };
  }
}
