export type BillType = "AGUA" | "ENERGIA" | "INTERNET" | "OUTRO";

export class Bill {
  constructor(
    public readonly id: string,
    public nome_cliente: string,
    public vencimento: Date,
    public valor: number,
    public tipo: BillType,
    public descricao: string
  ) {}
}