import { Bill } from "../../domain/entities/Bill";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IIAExtractorService } from "../../infra/ia/IIAExtractorService";

export class CreateBillUseCase {
  constructor(
    private billRepository: IBillRepository,
    private iaExtractorService: IIAExtractorService
  ) {}

  async execute(base64File: string): Promise<Bill> {
    const extractedData = await this.iaExtractorService.extractDataFromFile(base64File);

    const billData = {
      nome_cliente: extractedData.nome_cliente,
      vencimento: new Date(extractedData.vencimento),
      valor: extractedData.valor,
      tipo: extractedData.tipo,
      descricao: extractedData.descricao,
    };

    const newBill = await this.billRepository.create(billData);
    return newBill;
  }
}