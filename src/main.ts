// src/main.ts
import Fastify from "fastify";
import { GeminiService } from "./infra/ia/GeminiService";
import { BillController } from "./infra/http/controllers/BillController";
import { billRoutes } from "./infra/http/routes/BillRoutes";
import { CreateBillUseCase } from "./application/usecases/CreateBill";
import { GetAllBillsUseCase } from "./application/usecases/GetAllBills";
import { GetBillByIdUseCase } from "./application/usecases/GetBillById";
import { DeleteBillUseCase } from "./application/usecases/DeleteBill";
import { BillRepository } from "./infra/repositories/BillRepository";

// --- Criação da App em uma função separada ---
export async function buildServer() {
  const server = Fastify({
    logger: true,
    bodyLimit: 30 * 1024 * 1024,
  });

  // --- Configuração de CORS ---
  server.addHook("preHandler", (req, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    done();
  });

  server.options("*", (req, reply) => {
    reply.header(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, PUT, PATCH, OPTIONS"
    );
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return reply.code(204).send();
  });

  // --- Injeção de Dependências e Registro de Rotas ---
  try {
    const billRepository = new BillRepository();
    await billRepository.setup();

    const geminiService = new GeminiService();

    const createBillUseCase = new CreateBillUseCase(
      billRepository,
      geminiService
    );
    const getAllBillsUseCase = new GetAllBillsUseCase(billRepository);
    const getBillByIdUseCase = new GetBillByIdUseCase(billRepository);
    const deleteBillUseCase = new DeleteBillUseCase(billRepository);

    const billController = new BillController(
      createBillUseCase,
      getAllBillsUseCase,
      getBillByIdUseCase,
      deleteBillUseCase
    );

    server.register(billRoutes, { controller: billController });
  } catch (error) {
    server.log.error(error, "Erro durante a configuração dos plugins e rotas.");
    process.exit(1);
  }

  return server;
}

// --- Função para iniciar o servidor ---
async function start() {
  const server = await buildServer();

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`🚀 Servidor HTTP rodando em http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// --- Ponto de Entrada da Aplicação ---
start();
