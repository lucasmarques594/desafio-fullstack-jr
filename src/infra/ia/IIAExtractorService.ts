import { BillType } from "../../domain/entities/Bill";

export interface ExtractedData {
  nome_cliente: string;
  vencimento: string;
  valor: number;
  tipo: BillType;
  descricao: string;
}

export interface IIAExtractorService {
  extractDataFromFile(base64File: string): Promise<ExtractedData>;
}
