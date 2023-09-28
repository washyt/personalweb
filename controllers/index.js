//modules
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const indexmodel = require('../models/index_model');
const Note = require('../models/notes_model');
const User = require('../models/user_model');

const bodyParser = require('body-parser')
const axios = require('axios');
let location = path.join(__dirname, "..", "data", "data.json");
let bills_json = path.join(__dirname, "..", "data", "bills.json");
let notes_json = path.join(__dirname, "..", "data", "notes.json");
let comments_json = path.join(__dirname, "..", "data", "comments.json");
let accounts = path.join(__dirname, "..", "data", "accounts.json");

//models
router = express.Router();
const auth = require('../controllers/auth');
router.use(require('../controllers/auth'));

// create application/x-www-form-urlencoded parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

newsdata = fs.readFileSync(location, "utf8");
billdata = fs.readFileSync(bills_json, "utf8");
notesdata = fs.readFileSync(notes_json, "utf8");


indexmodel.makeGetRequest();

//Logged in function for locking away features for non-logged in users.
function loggedIn(request, response, next){
  if (request.user){
    next();
  }
  else{
    response.redirect('/login')
    ;
  }
}
//Default route.


router.get('/', loggedIn, function(request, response) {
  let userID = request.user._json.email;
  let user = User.getUser(request.user._json.email);
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("home", {
    "data": JSON.parse(newsdata),
    "data2": JSON.parse(billdata),
    "notesdata": JSON.parse(notesdata),
    "userid": userID,
    userFirstName: user.firstName,



  });
});

router.post('/', loggedIn, urlencodedParser, function(request, response) {
  let allnotes = JSON.parse(fs.readFileSync(notes_json));
  var names = (Object.keys(allnotes).length);
  var name = request.body.newName
  var date = request.body.newDate
  var notes = request.body.newNotes
  var type = request.body.ask
  let userID = request.user._json.email;

  if(request.body.ask == 'Create'){
  Note.createNote(userID,name,date,notes,names);
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("home", {
    "data": JSON.parse(newsdata),
    "data2": JSON.parse(billdata),
    "notesdata": JSON.parse(fs.readFileSync(notes_json, "utf8")),
    "userid": userID,
  });}

{
  if(request.body.ask == ("Save (keep consistent username)")){  Note.editNote(userID,name,date,notes,names);
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("home", {
      "data": JSON.parse(newsdata),
      "data2": JSON.parse(billdata),
      "notesdata": JSON.parse(fs.readFileSync(notes_json, "utf8")),
      "userid": userID,
    });
  }}

  if(request.body.ask == 'display'){
    let  parsed_accounts = JSON.parse(fs.readFileSync(accounts));
    let displayName = request.body.displayname;
    parsed_accounts[userID].displayName = displayName.toString();
    fs.writeFileSync(accounts, JSON.stringify(parsed_accounts));
    response.redirect("/profileupload");
  }

  else{
    Note.deleteNote(name);
    response.render("home", {
      "data": JSON.parse(newsdata),
      "data2": JSON.parse(billdata),
      "notesdata": JSON.parse(fs.readFileSync(notes_json, "utf8")),
      "userid": userID,
    });
  }
});

router.get('/login', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("login", {
  user: request.user,
  });
});

router.get('/bills/:bill_id', loggedIn, urlencodedParser, function(request,response){
  comments = fs.readFileSync(comments_json, "utf8");
  response.status(200);
  let billInfo = JSON.parse(fs.readFileSync(bills_json));
  accountdatas = fs.readFileSync(accounts, "utf8");

  let bill_id = request.params.bill_id;
  let userID = request.user._json.email;
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('micro',{
    bill: billInfo.results[0].bills,
    id: bill_id,
    "userid": userID,
    "data": JSON.parse(newsdata),
    "data2": JSON.parse(billdata),
    "notesdata": JSON.parse(notesdata),
    "comments": JSON.parse(comments),
    "accounts": JSON.parse(accountdatas),
  });
});

router.get('/error', function(request, response) {
  const errorCode = request.query.code;
  if (!errorCode) errorCode = 400;
  const errors = {
    '400': "Unknown Client Error",
    '401': "Invalid Login",
    '404': "Resource Not Found",
    '500': "Server problem"
  }
});


module.exports = router;
