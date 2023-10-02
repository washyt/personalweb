const ejs = require('ejs');
const fs = require('fs');
const express = require('express');
const billsmodel = require('../models/bills_model');
router = express.Router();

//billsmodel.fetchBill();

router.get('/bills', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  let userID = request.user._json.email;
  response.render("billspage", {
    "userid": userID,
  });
});

router.get('/billspage', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("billspageten");
});


module.exports = router;
