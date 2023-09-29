//Packages.
const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const app = express();

const router = (require('./controllers/index.js'));
app.use(router)

app.use(express.static(__dirname + '/public'));
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
// app.use(require('./controllers/router')); //need middleware
//app.use(require('./controllers/user_controller'))
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(cookieParser());
app.set("views", __dirname + '/views'); //specify location of static assests
//app.set("home", __dirname + '/home'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library //specify location of templates
// app.set("login", __dirname + '/views/login')



//app.use("", function(request, response) {
  //response.redirect('/error?code=400');
//});



//Socket.io chat...

module.exports = app;
