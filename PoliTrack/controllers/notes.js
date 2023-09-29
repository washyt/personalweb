const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser')

let notes_json=path.join(__dirname, "..", "data", "notes.json");

router = express.Router();

function loggedIn(request, response, next){
  if (request.user){
    next();
  }
  else{
    response.redirect('/login')
    ;
  }
}

router.get('/notebook', loggedIn, function(request, response) {
  let userID = request.user._json.email;
  let userPhoto = request.user._json.picture;
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("notebook", {
    notesdata: JSON.parse(fs.readFileSync(notes_json, "utf8")),
    userid: userID,
    userphoto: userPhoto,

  });
});



module.exports = router;
