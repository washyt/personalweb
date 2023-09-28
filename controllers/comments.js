const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
let location4=path.join(__dirname, "..", "data", "comments.json");
const indexmodel = require('../models/index_model');
const Comment = require('../models/comment_model');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

router = express.Router();
let location = path.join(__dirname, "..", "data", "data.json");
let location2 = path.join(__dirname, "..", "data", "bills.json");
let location3 = path.join(__dirname, "..", "data", "notes.json");

indexmodel.makeGetRequest();

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});


io.on('connection', (socket) => {
  console.log('a user connected');
});

router.post('/forum', urlencodedParser, function(request, response){
  let userComment = request.body.comment;
  let commentDate = request.body.time;
  let bill_id = request.params.bill_id;
  let userIDS = request.user._json.email;
  let billInfo = JSON.parse(fs.readFileSync(location2));
  let postComments = JSON.parse(fs.readFileSync(location4));
  let userID = request.user._json.email;
  let deleting = request.body.deleter;
  let billcontent = request.body.billcontent;
if(request.body.asks == 'Post'){
  Comment.createComm(userComment,commentDate,userID,billcontent);
    response.status(200);
    response.render('forum',{
      bill: billInfo.results[0].bills,
      id: bill_id,
      "userid": userIDS,
      "notesdata": JSON.parse(notesdata),
      "comments":JSON.parse(fs.readFileSync(location4))
    });}
    else{
      Comment.delComm(deleting);
        response.status(200);
        response.render('forum',{
          bill: billInfo.results[0].bills,
          id: bill_id,
          "userid": userIDS,
          "notesdata": JSON.parse(notesdata),
          "comments":JSON.parse(fs.readFileSync(location4)),
        });}

});

module.exports = router;
