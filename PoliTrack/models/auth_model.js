let  parsed_accounts = JSON.parse(fs.readFileSync(accounts));

exports.createUser = function () {
  response.redirect('/profile');
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
    let newUser = {
      "email": request.user._json.email,
      "displayName": 0,
      "datecreated": today,
      "profilepic": 0,
    }
  parsed_accounts[request.user._json.email] = newUser;
  fs.writeFileSync(accounts, JSON.stringify(parsed_accounts));
}
