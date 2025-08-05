import { BillType } from "../entities/Bill";

export type BillResponse = {
  id: string;
  nome_cliente: string;
  vencimento: Date;
  valor: number;
  tipo: BillType;
  descricao: string;
};
