// jshint esversion: 8
require('dotenv').config();

//========================================= requiring modules ========================================//
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// custom user modules
const db = require('./config/db.config');

// creating mongoose connection to db
mongoose.Promise = global.Promise;

const connectDB = async () => {
    mongoose.connect(db.url, db.options);
};

connectDB().then(() => {
    console.log(`Connected to Db ...`);
}).catch(() => {
    console.log(`Could not connect to Db ...`);
});

//creating app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//====================================== requiring list routes ========================================//
require('./routes/user.routes')(app);

// define a simple route
app.all('/', (req, res) => {
    res.redirect('/defaultDisplay');
});

// listening port
let port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`App started on port: ${port}`);
    console.log(`http://localhost:8080/`);
});