import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { BillController } from "../controllers/BillController";

export async function billRoutes(fastify: FastifyInstance, options: { controller: BillController }) {
  const { controller } = options;

  fastify.post('/bills', controller.create.bind(controller));
  fastify.get('/bills', controller.getAll.bind(controller));
  fastify.get('/bills/:id', controller.getById.bind(controller));
  fastify.delete('/bills/:id', controller.delete.bind(controller));
}