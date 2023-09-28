const fs = require('fs');
const path = require('path');

let location = path.join(__dirname, "..", "data", "data.json");
let bills_json = path.join(__dirname, "..", "data", "bills.json");
let notes_json = path.join(__dirname, "..", "data", "notes.json");
let comments_json = path.join(__dirname, "..", "data", "comments.json");

exports.createNote = function (userID,name,date,notes,names) {
  let allnotes = JSON.parse(fs.readFileSync(notes_json));
  var names = (Object.keys(allnotes).length);
  var currentData = JSON.parse(fs.readFileSync(notes_json, "utf8"))

  let newNote = {
    "owner": userID,
    "name": name,
    "date": date,
    "notes": notes,
    "noteID": names,
  }

  allnotes[name] = newNote
  fs.writeFileSync(notes_json, JSON.stringify(allnotes));
}

exports.editNote = function (userID,name,date,notes,names) {
  let allnotes = JSON.parse(fs.readFileSync(notes_json));
  var names = (Object.keys(allnotes).length);
  var currentData = JSON.parse(fs.readFileSync(notes_json, "utf8"))

  let editedNote = {
    "owner": userID,
    "name": name,
    "date": date,
    "notes": notes,
    "noteID": names,
  }
  allnotes[name] = editedNote
  fs.writeFileSync(notes_json, JSON.stringify(allnotes));
}

exports.deleteNote = function (name){
  let allnotes = JSON.parse(fs.readFileSync(notes_json));
  delete allnotes[name];
  fs.writeFileSync(notes_json, JSON.stringify(allnotes));
}
