const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(request, response){
  response.render("home", {
    
  });
});

module.exports = router
