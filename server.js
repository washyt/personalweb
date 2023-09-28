//Packages.
const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const app = express();
const axios = require('axios');
let server = require('http').Server(app);
let io = require('socket.io')(server);


app.use(require('./controllers/auth'));
app.use(require('./controllers/index'));
app.use(require('./controllers/notes'));
app.use(require('./controllers/forum'));
app.use(require('./controllers/bills'));
app.use(require('./controllers/comments'));
app.use(require('./controllers/upload'));
app.use(require('./controllers/profile'));
app.use(require('./controllers/chat'));

app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
// app.use(require('./controllers/router')); //need middleware
//app.use(require('./controllers/user_controller'))
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('public')); //specify location of static assests
app.set("home", __dirname + '/home'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library



app.use("", function(request, response) {
  response.redirect('/error?code=400');
});


const port = process.env.PORT || 3000;
app.set('port', port);

//Socket.io chat...
let socketapi = require('./controllers/socketConnections');
socketapi.io.attach(server);

server.listen(port, function() {
  console.log('Server started at http://localhost:' + port + '.')
});
