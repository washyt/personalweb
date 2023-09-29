//modules
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const bodyParser = require('body-parser')
const axios = require('axios');
router = express.Router();
let users = path.join(__dirname, "..", "data", "users.json");
const env = require('dotenv').config({path: __dirname + '/config.env'})
var Publishable_Key = process.env['PUB_KEY'];
var Secret_Key = process.env['PRIV_KEY'];
var price_dict = {
  'black': process.env['BLACK_KEY'],
  'green': process.env['GREEN_KEY'],
  'pink': process.env['PINK_KEY'],
  'gold': process.env['GOLD_KEY'],
  'purple': process.env['PURPLE_KEY'],
  'clear':process.env['ClEAR_KEY'],
  'rose':process.env['ROSE_KEY'],
};


var image_dict = {
  'black':"../images/black-front.webp",
  'green':"../images/greencheckout.png",
  'pink':"../images/pink-front.webp",
  'gold':"../images/goldfront.webp",
  'purple':"../images/purpfront (1).webp",
  'clear':"../images/clearfront.webp",
  'rose':"../images/rosefront.webp",

}
var image_styles = {
  'black':108.3,
  'green':128,
  'pink':91,
  'gold':83.3,
  'purple':101.7,
  'clear': 95,
  'rose': 105,
}
var display_colors = ['Black Ivory', 'Emerald', "Pink Tea", "Golden Sun", 'Amethyst', 'Cl Amethyst', 'Rose Gold'];

const stripe = require('stripe')(Secret_Key)
// create application/x-www-form-urlencoded parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})
router.use(cookieParser());

router.get('/', function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  var checkNew = request.cookies;
  var whetherNew = JSON.stringify(checkNew)=='{}';
  if(!whetherNew){
    if(parsed_users[request.cookies['userid']]==undefined){
      response.clearCookie('userid');
      let newid = (Math.random() * (34293212321 - 7423821) + 7423821).toString();
      let newUser = {
        "userid": newid,
        "email": "none",
        "cart": "empty",
        "paid": "no",
      }
      parsed_users[newid] = newUser;
      fs.writeFileSync(users, JSON.stringify(parsed_users));
      response.cookie('userid', newid, { maxAge: 900000000, httpOnly: true });
    }
  }
  if(whetherNew){
  let newid = (Math.random() * (34293212321 - 7423821) + 7423821).toString();
  let newUser = {
    "userid": newid,
    "email": "none",
    "cart": "empty",
    "paid": "no",
  }
  parsed_users[newid] = newUser;
  fs.writeFileSync(users, JSON.stringify(parsed_users));
  response.cookie('userid', newid, { maxAge: 900000000, httpOnly: true });

}
  response.render("spinner", {
  });

});
router.get('/display', function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  let user_cart = parsed_users[userid].cart;
  let user_cart_num = user_cart.split(",").length;
  response.render("home", {
    cart_amount: parsed_users[userid].cart,
  });
});
router.get('/buy', function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  let user_cart = parsed_users[userid].cart;
  let user_cart_num = user_cart.split(",").length;
    response.render("product", {
    cart_amount: parsed_users[userid].cart,

  });
});
router.post('/buy', urlencodedParser, function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  let user_cart = parsed_users[userid].cart;
  requestedColor = request.body.color;
  if(user_cart=="empty"){
    parsed_users[userid].cart = requestedColor+",";
    fs.writeFileSync(users, JSON.stringify(parsed_users));
  }
  if(user_cart!="empty"){
    parsed_users[userid].cart = parsed_users[userid].cart.concat(requestedColor,",");
    fs.writeFileSync(users, JSON.stringify(parsed_users));

  }
    let user_cart_num = user_cart.split(",").length;
     parsed_users = JSON.parse(fs.readFileSync(users));

  response.render("product", {
    cart_amount: parsed_users[userid].cart,
  });
});

router.get('/cart', function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  let user_cart_items = parsed_users[userid].cart.split(",");
  let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
  for (let i=0; i < user_cart_items.length; i++){
    item_counts[user_cart_items[i]]++;
  }
  response.render("cart", {
    cart_amount: parsed_users[userid].cart,
    counts: item_counts,
    colors: Object.keys(price_dict),
    images: image_dict,
    style: image_styles,
    display_colors: display_colors,
  });
});
router.get('/contact', function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  let user_cart_items = parsed_users[userid].cart.split(",");
  let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
  for (let i=0; i < user_cart_items.length; i++){
    item_counts[user_cart_items[i]]++;
  }
  response.render("contact", {
    cart_amount: parsed_users[userid].cart,
    counts: item_counts,
    colors: Object.keys(price_dict),
    images: image_dict,
    style: image_styles,
  });
});
router.get('/policies', function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  let user_cart_items = parsed_users[userid].cart.split(",");
  let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
  for (let i=0; i < user_cart_items.length; i++){
    item_counts[user_cart_items[i]]++;
  }
  response.render("policies", {
    cart_amount: parsed_users[userid].cart,
    counts: item_counts,
    colors: Object.keys(price_dict),
    images: image_dict,
    style: image_styles,
  });
});
router.post('/cart', urlencodedParser, function(request, response) {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = request.cookies['userid'];
  if(request.body.plus == undefined && parsed_users[userid].cart.split(",").length == 2){
    parsed_users[userid].cart = "empty"
    fs.writeFileSync(users, JSON.stringify(parsed_users));
    let user_cart_items = parsed_users[userid].cart.split(",");
    let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
    for (let i=0; i < user_cart_items.length; i++){
      item_counts[user_cart_items[i]]++;
    }
    response.render("cart", {
      cart_amount: parsed_users[userid].cart,
      counts: item_counts,
      colors: Object.keys(price_dict),
      images: image_dict,
      style: image_styles,
      display_colors: display_colors,
    });
  }
  if(request.body.minus == undefined){
    parsed_users[userid].cart = parsed_users[userid].cart.concat(",",request.body.plus);
    fs.writeFileSync(users, JSON.stringify(parsed_users));
    let user_cart_items = parsed_users[userid].cart.split(",");
    let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
    for (let i=0; i < user_cart_items.length; i++){
      item_counts[user_cart_items[i]]++;
    }
    response.render("cart", {
      cart_amount: parsed_users[userid].cart,
      counts: item_counts,
      colors: Object.keys(price_dict),
      images: image_dict,
      style: image_styles,
      display_colors: display_colors,
    });
  }
  if(request.body.plus==undefined){
    parsed_users[userid].cart = parsed_users[userid].cart.replace(request.body.minus+",","");
    fs.writeFileSync(users, JSON.stringify(parsed_users));
    let user_cart_items = parsed_users[userid].cart.split(",");
    let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
    for (let i=0; i < user_cart_items.length; i++){
      item_counts[user_cart_items[i]]++;
    }
    response.render("cart", {
      cart_amount: parsed_users[userid].cart,
      counts: item_counts,
      colors: Object.keys(price_dict),
      images: image_dict,
      style: image_styles,
      display_colors: display_colors,
    });
  }
});

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/payment', async (req, res) => {
  let  parsed_users = JSON.parse(fs.readFileSync(users));
  let userid = req.cookies['userid'];
  let user_cart_items = parsed_users[userid].cart.split(",");
  let checkoutvar =[];
  let item_counts ={black:0,green:0,pink:0,gold:0,purple:0,clear:0,rose:0};
  for (let i=0; i < user_cart_items.length; i++){
    item_counts[user_cart_items[i]]++;
  }
  let colorways = Object.keys(price_dict);
  let checkout_items = [];
  for (let x=0; x< colorways.length; x++){
    if (parseInt(item_counts[colorways[x]])>0){
      let checkout_add = {price: price_dict[colorways[x]], quantity:item_counts[colorways[x]]}
      checkout_items.push(checkout_add);
    }
  }

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    shipping_options: [
   {
     shipping_rate_data: {
       type: 'fixed_amount',
       fixed_amount: {
         amount: 0,
         currency: 'usd',
       },
       display_name: 'Free shipping',
       // Delivers between 5-7 business days
       delivery_estimate: {
         minimum: {
           unit: 'business_day',
           value: 5,
         },
         maximum: {
           unit: 'business_day',
           value: 7,
         },
       }
     }
   },
   {
     shipping_rate_data: {
       type: 'fixed_amount',
       fixed_amount: {
         amount: 1500,
         currency: 'usd',
       },
       display_name: 'Next day air',
       // Delivers in exactly 1 business day
       delivery_estimate: {
         minimum: {
           unit: 'business_day',
           value: 1,
         },
         maximum: {
           unit: 'business_day',
           value: 1,
         },
       }
     }
   },
 ],
    line_items: checkout_items,
    mode: 'payment',
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/",
  });

  res.redirect(303, session.url);
});
module.exports = router;
