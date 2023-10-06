const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(request, response){
  response.render("home", {

  });
});
router.get('/projects', function(request, response){
  response.render("projects", {

  });
});

module.exports = router
