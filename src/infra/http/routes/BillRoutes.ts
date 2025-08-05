import { FastifyInstance } from "fastify";
import { BillController } from "../controllers/BillController";

export async function billRoutes(
  fastify: FastifyInstance,
  options: { controller: BillController }
) {
  const { controller } = options;

  fastify.post("/", controller.create.bind(controller));
  fastify.get("/", controller.getAll.bind(controller));
  fastify.get("/:id", controller.getById.bind(controller));
  fastify.delete("/:id", controller.delete.bind(controller));
}
