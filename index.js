"use strict";

const path = require("path");
const fp = require("fastify-plugin");
const fg = require("fast-glob");
const Queue = require("bullmq").Queue;
const Worker = require("bullmq").Worker;

function createHundler(fastify, opts) {
  if (!!opts.handlers) {
    return job => opts.handlers[job.name](fastify, job);
  }

  return job => opts.handler(fastify, job);
}

function fastifyBullmq(fastify, opts, next) {
  const files = fg.sync(opts.path);
  const connection = opts.connection;
  const isWorker = opts.worker;

  const queues = {};
  const workers = {};

  for (let i = 0; i < files.length; i++) {
    const queueConfig = require(path.resolve(files[i]));
    const filename = path.basename(files[i]);
    const options = queueConfig.options || {};
    const name = queueConfig.name || filename.split(".")[0];

    queues[name] = new Queue(name, {
      connection
    });

    if (isWorker) {
      workers[name] = new Worker(name, createHundler(fastify, queueConfig), {
        connection,
        ...options
      });
    }
  }

  fastify.decorate("jobs", {
    get: name => queues[name]
  });
  next();
}

module.exports = fp(fastifyBullmq, {
  name: "fastify-bullmq"
});
