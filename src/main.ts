import Fastify from "fastify";

import { BillRepository } from "./infra/database/repositories/BillRepository";
import { GeminiService } from "./infra/ia/GeminiService";
import { BillController } from "./infra/http/controllers/BillController";
import { billRoutes } from "./infra/http/routes/BillRoutes"
import { CreateBillUseCase } from "./application/usecases/CreateBill";
import { GetAllBillsUseCase } from "./application/usecases/GetAllBills";
import { GetBillByIdUseCase } from "./application/usecases/GetBillById";
import { DeleteBillUseCase } from "./application/usecases/DeleteBill";

async function bootstrap() {
  const server = Fastify({
    logger: true,
    bodyLimit: 30 * 1024 * 1024,
  });

  try {
    const billRepository = new BillRepository();
    const geminiService = new GeminiService();

    await billRepository.setup();
    const createBillUseCase = new CreateBillUseCase(billRepository, geminiService);
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

    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info(`🚀 Servidor HTTP rodando em http://localhost:3000`);

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();