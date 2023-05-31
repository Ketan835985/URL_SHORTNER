const express = require('express');
const router = require('./src/routes/routes.js')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router)

module.exports = app;