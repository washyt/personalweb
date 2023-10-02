const multer = require('multer');
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');

router = express.Router();

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

//Creating route.
router.get('/upload', function(request, response) {
  response.render("upload");
});

//Uploading a single file with multer specific methods.
router.post('/uploadfile', privateUpload.any(), async (request, response) => {
  console.log("This is the /uploadfile route.");
  const file = request.files[0];
  if (!file) {
    const error = {
      'httpStatusCode': 400,
      'message': 'Upload a file please, not anything else.'
    }
    response.send(error);
  }
  let photoLocations = [];
  let fileURL = await File.uploadFile(file);
  photoLocations.push(fileURL);
  response.render('confirmation', {
    photoLocation: photoLocations
  });
});

//Uploading multiple files with multer specific methods.
router.post('/uploadmultiple', privateUpload.any(), async (request, response, next) => {
  const files = request.files;

  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  let photoLocations = await File.uploadFiles(files);
  console.log(photoLocations)
  response.render('confirmation', {
    photoLocation: photoLocations
  });
});

//Uploading an image with multer specific methods.
router.post('/upload/photo', publicUpload.single('picture'), async (request, response, next) => {
  const file = request.file;

  if (!file) {
    const error = {
      'httpStatusCode': 400,
      'message': 'Please upload a file.'
    }
    response.send(error);
  }
  let photoLocations = [];
  let fileURL = await File.uploadFile(file);
  photoLocations.push(fileURL);

  response.render('confirmation', {
    photoLocation: "/images/" + file.filename
  });

})


module.exports = router;
