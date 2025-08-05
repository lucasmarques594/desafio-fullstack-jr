import { GeminiService } from "./infra/ia/GeminiService";
import { BillController } from "./infra/http/controllers/BillController";
import { billRoutes } from "./infra/http/routes/BillRoutes";
import { CreateBillUseCase } from "./application/usecases/CreateBill";
import { GetAllBillsUseCase } from "./application/usecases/GetAllBills";
import { GetBillByIdUseCase } from "./application/usecases/GetBillById";
import { DeleteBillUseCase } from "./application/usecases/DeleteBill";
import { BillRepository } from "./infra/repositories/BillRepository";
import { pool } from "./infra/database/postgres";
import { app } from "./app";

const PORT = Number(process.env.PORT) || 3333;

const billRepository = new BillRepository(pool);
const geminiService = new GeminiService();

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

app.register(billRoutes, { prefix: "/bills", controller: billController });

app
  .listen({
    port: PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(
      `🚀 HTTP Server started on http://localhost:${PORT} | Environment: ${
        process.env.NODE_ENV || "development"
      }`
    );
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
