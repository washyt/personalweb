//Packages.
const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const app = express();
//console.log({path: __dirname + '\\controllerss\\home.js'})
const axios = require('axios');
const stripe = require('stripe')('sk_test_51LXJXCLvpfSRZZdVvF8II2tRWLkzZP4mcSVVE6plIjMjRO5Xjy5z5T9hwkbSQ4fUE24AgqjdBGAY1LWaJMwDdQYR003e0GLeyR'); // Add your Secret Key Here
const env = require('dotenv').config({path: __dirname + '/config.env'})
let server = require('http').Server(app);
const router = (require('./controllers/verifying.js'));
app.use(router)
//router.use('/projects', home)
app.use(express.static(__dirname + '/public'));//specify location of static assests
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
// app.use(require('./controllers/router')); //need middleware
//app.use(require('./controllers/user_controller'))
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(cookieParser());
app.set("views", __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library
module.exports = app;
