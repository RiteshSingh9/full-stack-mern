const path = require('path'); 
const http = require('http');
const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { default: mongoose } = require('mongoose');

// Import Routes
const apiRouter = require('./routes/api');

// load configuration file based on environment 
if(process.env.NODE_ENV === 'production') {
    dotenv.config({path: path.join(__dirname, 'config/prod.env')})
} else if( process.env.NODE_ENV === 'development') {
    dotenv.config({path: path.join(__dirname, 'config/dev.env')})
}

// import connnection file
require(path.join(__dirname, 'utilities/conn.js'));
require(path.join(__dirname, 'utilities/process.js'));



// define PORT
const PORT = process.env.PORT || 3000;

// Initialize app
const app = express();

// apply middlewares
app.use(cors());
app.use(helmet())

// cookie middlewares
app.use(cookieParser(process.env.SECRE_KEY_COOKIE));

// logging
if(process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'))
} else if( process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use('/api', apiRouter)

// Error Hanling
// throw error 404
app.use((req, res, next) => {
    next(createError(404, 'Not Found'))
})

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    })
})

const server = http.createServer(app);

server.on('error', (err) => {
    console.log(`Error: ${err.name} ${err.message}`)
})

server.on('listening', () => {
    console.log(`Listening on ${PORT}`);
})

server.on('close', () => {
    console.log(`Closed server running on ${PORT}`);
})

mongoose.connection.on('connected', async () => {
    console.log(`Connected to MongoDB server on port ${mongoose.connection.host}:${mongoose.connection.port}`)
    await server.listen(PORT);
})

module.exports = server;