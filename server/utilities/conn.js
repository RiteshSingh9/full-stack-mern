/**
 * create connection with database
 */

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'prj1',
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
})

mongoose.connection.on('disconnected', () => {
    console.log(`Disconnected to MongoDB`);
})
