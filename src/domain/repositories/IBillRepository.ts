import { Bill } from "../entities/Bill";

export interface IBillRepository {
  create(bill: Omit<Bill, "id">): Promise<Bill>;
  findById(id: string): Promise<Bill | null>;
  findAll(): Promise<Bill[]>;
  delete(id: string): Promise<void>;
}
