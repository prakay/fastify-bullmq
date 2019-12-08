module.exports = {
    name: 'sample',
    options: {},
    handler: (fastify, job) => {
        console.log('job sample', job.data);
    }
};
