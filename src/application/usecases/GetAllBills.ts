import { Bill } from "../../domain/entities/Bill";
import { IBillRepository } from "../../domain/repositories/IBillRepository";

export class GetAllBillsUseCase {
  constructor(private billRepository: IBillRepository) {}
  async execute(): Promise<Bill[]> {
    return this.billRepository.findAll();
  }
}