import { IBillRepository } from "../../domain/repositories/IBillRepository";

export class DeleteBillUseCase {
  constructor(private billRepository: IBillRepository) {}
  async execute(id: string): Promise<void> {
    await this.billRepository.delete(id);
  }
}