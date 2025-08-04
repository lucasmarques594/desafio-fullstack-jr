import { FastifyRequest, FastifyReply } from "fastify";
import { CreateBillUseCase } from "../../../application/usecases/CreateBill";
import { GetAllBillsUseCase } from "../../../application/usecases/GetAllBills";
import { GetBillByIdUseCase } from "../../../application/usecases/GetBillById";
import { DeleteBillUseCase } from "../../../application/usecases/DeleteBill";

interface CreateBillRequest extends FastifyRequest {
  body: { file: string };
}

interface BillIdRequest extends FastifyRequest {
  params: { id: string };
}

export class BillController {
  constructor(
    private createBillUseCase: CreateBillUseCase,
    private getAllBillsUseCase: GetAllBillsUseCase,
    private getBillByIdUseCase: GetBillByIdUseCase,
    private deleteBillUseCase: DeleteBillUseCase
  ) {}

  async create(request: CreateBillRequest, reply: FastifyReply) {
    try {
      const { file } = request.body;
      if (!file) {
        return reply.status(400).send({ error: 'O campo "file" com a string base64 é obrigatório.' });
      }
      const bill = await this.createBillUseCase.execute(file);
      return reply.status(201).send(bill);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message || 'Erro interno do servidor.' });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const bills = await this.getAllBillsUseCase.execute();
      return reply.status(200).send(bills);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message || 'Erro interno do servidor.' });
    }
  }

  async getById(request: BillIdRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const bill = await this.getBillByIdUseCase.execute(id);
      if (!bill) {
        return reply.status(404).send({ error: 'Conta não encontrada.' });
      }
      return reply.status(200).send(bill);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message || 'Erro interno do servidor.' });
    }
  }

  async delete(request: BillIdRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      await this.deleteBillUseCase.execute(id);
      return reply.status(204).send();
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: error.message || 'Erro interno do servidor.' });
    }
  }
}