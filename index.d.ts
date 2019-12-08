import { FastifyInstance } from "fastify";
import { Queue } from "bullmq";

declare module "fastify" {
  interface FastifyInstance {
    jobs: {
      get: (string) => Queue;
    };
  }
}
