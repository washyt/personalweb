// Import the Express module
const express = require('express');

// Create an instance of an Express application
const app = express();
const router = (require('./controllers/controllers.js'));
app.use(router)

// Mount App1
const app1 = require('./LG/server.js');
var router1 = require('./LG/controllers/verifying.js')
// Mounts App1 at the '/app1' endpoint
//app1.set('views', './LG/views')
app1.use('/LG', router1);
app.use('/', app1);

// Mount App2
const app2 = require('./PoliTrack/server.js');
const router2 = (require('./PoliTrack/controllers/index.js'));

app2.use('/PT', router2)
app.use('/', app2)
var http = require("http").Server(app);
const port = process.env.PORT || 8000;
var io = require('socket.io')(http);

app.set('port', port);
io.on('connection', function (socket){
  console.log('someone connected')
  io.emit('hi', 'Hello eveeryone!')
});
//let socketapi = require('api/data', './Politrack/controllers/socketConnections.js');
//socketapi.io.attach(http);



//app.use(express.static(__dirname + '/public'));//specify location of static assests
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)

app.use(express.urlencoded());
app.set("views", __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library
// Start the server
http.listen(port, '0.0.0.0', () => {
    console.log(`CombinedApp is listening on port ${port}`);
});
