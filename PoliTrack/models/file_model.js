//Packages...
const fs = require('fs');
const {google} = require('googleapis');

//Key file...
const KEYS = __dirname + "/../config/credentials.js";

//Accessing Drive

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYS,
  scopes: SCOPES
});

const driveService = google.drive({version: 'v3', auth});

let fileMetadata = {
  'name': Date.now() + '_content.png',
  'parents': ['1NKewvKyYD7wO3nMXAC6SlCyp9HSgpO0b'] //Link to PoliTrack uploads folder.
};

//Methods...

exports.uploadFile = async function(file){
  let fileURL = "";
  let filePath = __dirname + "/../" + file.path;

  let media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath)
  };

  let response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  });

  switch(response.status){
    case 200:
    fileURL = "https://drive.google.com/uc?export=view&id="+response.data.id;
    console.log(fileURL);
    console.log(response.data.id);
    break;
    default:
    console.error('Error creating the file, ' + response.errors);
    break;
  }
  return fileURL;
}

exports.uploadFiles = async function(files){
  let fileURLs = [];

  for(let i = 0; i < files.length; i++){
    let fileURL = await  exports.uploadFile(files[i]);
    fileURLs.push(fileURL);
  }

  return fileURLs;
}
