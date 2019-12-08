"use strict";

const fastify = require("fastify")({
  logger: true
});
const fastifyBullmq = require("..");
var Redis = require("ioredis");
const connection = new Redis();

fastify.register(fastifyBullmq, {
  path: "./jobs/**.js",
  connection,
  worker: true
});

fastify.get("/", function(req, reply) {
  fastify.jobs.get("sample").add("default", "hello world");
  fastify.jobs.get("sample_named").add("one", "hello one");
  reply.send({ hello: "world" });
});

fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
