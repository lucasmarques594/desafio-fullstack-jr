import { randomUUID } from "crypto";

export type BillType = "AGUA" | "ENERGIA" | "INTERNET" | "OUTRO";

interface BillProps {
  id?: string;
  nome_cliente: string;
  vencimento: Date;
  valor: number;
  tipo: BillType;
  descricao: string;
}

export class Bill {
  private props: BillProps;

  private constructor(props: BillProps) {
    this.props = props;
  }

  static create(props: BillProps) {
    const id = randomUUID();
    return new Bill({
      ...props,
      id,
    });
  }

  static with(props: BillProps) {
    return new Bill(props);
  }

  get id(): string {
    return this.props.id;
  }

  get nome_cliente(): string {
    return this.props.nome_cliente;
  }

  get vencimento(): Date {
    return this.props.vencimento;
  }

  get valor(): number {
    return this.props.valor;
  }

  get tipo(): BillType {
    return this.props.tipo;
  }

  get descricao(): string {
    return this.props.descricao;
  }
}
