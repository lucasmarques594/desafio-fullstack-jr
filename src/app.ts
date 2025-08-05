import Fastify from "fastify";

export const app = Fastify({
  logger: true,
  bodyLimit: 30 * 1024 * 1024,
});

app.addHook("preHandler", (req, reply, done) => {
  reply.header("Access-Control-Allow-Origin", "*");
  done();
});

app.options("*", (req, reply) => {
  reply.header(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH, OPTIONS"
  );
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return reply.code(204).send();
});
