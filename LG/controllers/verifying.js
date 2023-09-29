//modules
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const bodyParser = require('body-parser')
const axios = require('axios');
const User = require('../models/verifying');

var router = express.Router();
router.use(require('../controllers/home'));
// create application/x-www-form-urlencoded parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

router.post('/login',urlencodedParser, async function(request, response) {

  if(request.body.userRequestType=="register"){
  let username =  request.body.username;
  let email =  request.body.email;
  let pwd =  request.body.pswd;
  let originality = "0";
  originality = await User.verifyOriginality(username,email);
  if(originality==true){
  User.createUser(username,email,pwd);
  response.redirect("/home");

}
  else{
    response.render("login", {
      animation: "",
      feedback: originality.toString(),
      visibility: "none",
    });

 }
}
if(request.body.userRequestType=="login"){
let username =  request.body.username;
let pwd =  request.body.pswd;
if(await User.verifyLogin(username,pwd)){
  response.redirect("/home");
}
else{
  response.render("login", {
    animation: "",
    feedback: "Incorrect Username or Password",
    visibility: "none",
  });
}
}
});

module.exports = router;
