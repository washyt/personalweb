const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
let location4=path.join(__dirname, "..", "data", "comments.json");
const indexmodel = require('../models/index_model');
const commentsModel = require('../models/comment_model');

router = express.Router();
let location = path.join(__dirname, "..", "data", "data.json");
let location2 = path.join(__dirname, "..", "data", "bills.json");
let location3 = path.join(__dirname, "..", "data", "notes.json");

exports.createComm = function (userComment,commentDate,userID,billcontent) {
  let postComments = JSON.parse(fs.readFileSync(location4));

  let newComment = {
    "content": userComment,
    "date": commentDate,
    "userid": userID,
    "billcontent": billcontent,
  }

  postComments[userComment] = newComment;
  fs.writeFileSync(location4, JSON.stringify(postComments));
}

exports.delComm = function (deleting) {
  let postComments = JSON.parse(fs.readFileSync(location4));
  delete postComments[deleting];
  fs.writeFileSync(location4, JSON.stringify(postComments));
}
