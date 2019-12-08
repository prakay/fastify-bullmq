module.exports = {
    name: 'sample_named',
    options: {},
    handlers: {
        one: function(fastify, job) {
            console.log('job sample named one', job.data);
        }
    }
};
