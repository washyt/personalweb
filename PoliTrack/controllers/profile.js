//modules
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const indexmodel = require('../models/index_model');
const Note = require('../models/notes_model');
const User = require('../models/user_model');
const multer = require('multer');

const bodyParser = require('body-parser')
let location = path.join(__dirname, "..", "data", "data.json");
let bills_json = path.join(__dirname, "..", "data", "bills.json");
let notes_json = path.join(__dirname, "..", "data", "notes.json");
let comments_json = path.join(__dirname, "..", "data", "comments.json");
let accounts = path.join(__dirname, "..", "data", "accounts.json");
let File = require('../models/file_model')


//Setting storage.

let privateStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, Date.now() + '-' + file.originalname.replace(' ', '-'));
  }
});

let privateUpload = multer({
  storage: privateStorage
});

let publicStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images')
  },

  filename: function(req, file, cb) {
    console.log(file)
    cb(null, Date.now() + '-' + file.originalname.replace(' ', '-'));
  }
});

let publicUpload = multer({
  storage: publicStorage
});

//models
router = express.Router();
const auth = require('../controllers/auth');
router.use(require('../controllers/auth'));

// create application/x-www-form-urlencoded parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

router.get('/profile', function(req, res) {
  res.render("profile");
});

router.get('/profileupload', function(req, res) {
  let accountdata1 = fs.readFileSync(accounts, "utf8");
  let parsed_accounts1 = JSON.parse(accountdata1);
  let userID1 = req.user._json.email;
  let name1 = parsed_accounts1[userID1].displayName;

  res.render('profileupload', {
    "name":name1,
  });
  console.log(name1);
});

router.post('/profileupload', function(req, res) {
  res.redirect("/");
});

var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

router.get('/PT/users/:name', function(request, response) {
  let accountdata = fs.readFileSync(accounts, "utf8");
  let userID = request.user._json.email;
  let parsed_accounts = JSON.parse(accountdata);
  let name = parsed_accounts[userID].displayName;
  let profilepic = parsed_accounts[userID].profilepic;
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("userview", {
    "data": JSON.parse(accountdata),
    "userid": userID,
    photoLocation: profilepic,

  });
});

router.post('/PT/users/:name', publicUpload.single('picture'), async (request, response, next) => {
  const file = request.file;
  let accountdata = fs.readFileSync(accounts, "utf8");
  let parsed_accounts = JSON.parse(accountdata);
  let userID = request.user._json.email;
  let name = parsed_accounts[userID].displayName;

  if (!file) {
    const error = {
      'httpStatusCode': 400,
      'message': 'Please upload a file.'
    }
    response.send(error);
  }
  let photoLocations = [];
  let fileURL = await File.uploadFile(file);
  accountdatas = fs.readFileSync(accounts, "utf8");
  let userIDs = request.user._json.email;
  photoLocations.push(fileURL);
 parsed_accounts[userID].profilepic = "/images/" + file.filename;
 fs.writeFileSync(accounts, JSON.stringify(parsed_accounts));

  response.render('userview', {
    photoLocation: "/images/" + file.filename,
    "data": JSON.parse(accountdatas),
    "userid": userIDs,
  });
})
module.exports = router;
