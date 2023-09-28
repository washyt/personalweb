const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser')

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

router.get('/chat', loggedIn, function(request, response) {
  let userID = request.user._json.email;
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("chat", {
    userid: userID,
    userFirstName: request.user._json.given_name,
  });
});



module.exports = router;
