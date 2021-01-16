require('dotenv').config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fs = require('fs');
const util = require('util');
const path = require('path');
const mime = require('mime');
const status = require('./src/status/status');
const dbConnection = require('./src/db/db-conn');



// write console logs or errors to server file
const log_file = fs.createWriteStream(__dirname + '/logs/debug.log', { flags: 'a+' });
const error_file = fs.createWriteStream(__dirname + '/logs/error.log', { flags: 'a+' });
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a+' })
const log_stdout = process.stdout;

console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

console.error = function (d) { //
    error_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

// connect to mongodb
dbConnection.connection();

// Routes
const stockService = require("./src/services/stocks-service");
const userService = require("./src/services/user-service");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Morgan
app.use(morgan("combined", { stream: accessLogStream }));
// Cors
app.use(cors());

// health-check
app.get("/", (req, res, next) => {
    res.status(200).json(`Server Running on port` + process.env.PORT);
});

//  Routes which should handle requests
app.use("*/user", userService);
app.use("*/stock", stockService);

// download logs
app.use('/logs/download', function (req, res, next) {
    let logPath = '/logs/debug.log';
    if (req.query.type === 'ERROR') {
        logPath = '/logs/error.log';
    }

    var file = __dirname + logPath;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    const fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
});

//  Morgan Handling errors
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(status.invalidRequestStatus(error.status, 'Not Found'));
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).send(status.invalidRequestStatus(error.status || 500, error.message));
});

module.exports = app;