import { Bill } from "../../domain/entities/Bill";
import { IBillRepository } from "../../domain/repositories/IBillRepository";

export class GetBillByIdUseCase {
  constructor(private billRepository: IBillRepository) {}
  async execute(id: string): Promise<Bill | null> {
    return this.billRepository.findById(id);
  }
}