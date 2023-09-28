const ejs = require('ejs');
const fs = require('fs');
const express = require('express');

router = express.Router();

router.get('/forum', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("forum");
});
module.exports = router;
