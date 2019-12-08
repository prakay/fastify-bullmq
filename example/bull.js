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

fastify.listen(3001, function(err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});
