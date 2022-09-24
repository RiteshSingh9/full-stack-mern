const mongoose = require('mongoose');
const server = require('../app');

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    await server.close;
    process.exit(0);
})
