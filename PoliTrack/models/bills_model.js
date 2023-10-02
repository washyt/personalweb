const axios = require('axios');
const fs = require('fs');
const path = require('path');
let billwritelocation = path.join(__dirname, "..", "data", "bills.json");
/*
exports.fetchBill = function fetchBill(){
nodefetch.fetch(' https://api.propublica.org/congress/v1/bills/search.json?query=' + userInput,{//opening fetch function.
	headers: new Headers({//opening headers.
		"X-API-Key": "rGAZ6C77Cn1BKLZ0qmYlQNpylB6e2EJG5f50g4pS"
	})//closing headers.
})//closing fetch function.
	.then(function(res) {
		return res.json();

	})
let billdata = JSON.stringify(res.json());


	fs.writeFile(billwritelocation, billdata, err => {
		if(err) throw err;
	});
}
*/
exports.fetchBill = async function fetchBill(){
try{
		let billres = await axios.get("https://api.propublica.org/congress/v1/bills/search.json?query=healthcare", {
			headers: {
				"X-API-Key": "WvGgBMslb9WJMYUNtiBtpWV82vkFG5jvUc3dcHTk"
			}
		});
		let billdata = JSON.stringify(billres.data);
		fs.writeFile(billwritelocation, billdata, err => {
			// error checking
		});}
catch (error) {
    console.error(error);
  }
}
