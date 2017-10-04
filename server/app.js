const express = require('express');
const app =express();
// const morgan = require('morgan');
const volleyball = require('volleyball')
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer();
const path = require('path');
const routes = require('../routes')

const db = require("../models").db;

// Any routes or other various middlewares should go here
// logging and body-parsing

app.use(volleyball);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', function (req, res, next) {
//         res.send('whats up')
// })
app.use('/', routes)

// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "public")));







// failed to catch req above means 404, forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// handle any errors
app.use(function(err, req, res, next) {
    console.error(err, err.stack);
    res.status(err.status || 500);
    res.send("Something went wrong: " + err.message);
});

// listen on a port
var port = 3000;
app.listen(port, function() {
    console.log("The server is listening closely on port", port);
    db.sync()
        .then(function() {
            console.log("Synchronated the database");
        })
        .catch(function(err) {
            console.error("Trouble right here in River City", err, err.stack);
        });
});