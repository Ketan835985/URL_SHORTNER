const dotenv = require('dotenv').config();
const app = require('./app');
const startServer = require('./src/db/mongoose');

const { PORT,MONGO_URI} = process.env;
startServer(app, PORT, MONGO_URI);
