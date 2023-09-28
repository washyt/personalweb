const axios = require('axios');
const fs = require('fs');
const path = require('path');
let writelocation=path.join(__dirname, "..", "data", "data.json");
let writelocationnotes=path.join(__dirname, "..", "data", "notes.json");

exports.makeGetRequest = async function makeGetRequest() {

  let res = await axios.get('https://newsapi.org/v2/everything?q=health&apiKey=02951409c4104386b21d0b052aeb2078');

  let data = JSON.stringify(res.data);
  fs.writeFile(writelocation, data, err => {
    // error checking
    if (err) throw err;
  });
}
exports.createNote = function (userID,name,date,notes){
  let allNotes = JSON.parse(fs.readFileSync(writelocationnotes));
  let specificID = (Object.keys(allNotes).length)+1;

  let newNote = {
    "owner": userID,
    "name": name,
    "date": date,
    "notes": notes,
  }

allNotes[name] = newNote;
fs.writeFileSync(writelocationnotes, JSON.stringify(allNotes));

}
