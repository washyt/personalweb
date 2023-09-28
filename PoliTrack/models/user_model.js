const fs = require('fs');
const path = require('path');
let userwritelocation = path.join(__dirname, "..", "data", "users.json");

exports.createUser = function (userID){
  let allUsers =
  JSON.parse(fs.readFileSync(__dirname + '/../data/users.json'));
  if(!allUsers[userID]){
    let newUser = {
      'user': userID
    }
    allUsers[userID] = newUser;
    fs.writeFileSync(__dirname+ '/../data/users.json', JSON.stringify(allPlayers));
  }
}

exports.getUser =  function (userID){
  let allUsers = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  if(allUsers[userID]){
    return allUsers[userID];
  }

  return {};
}
