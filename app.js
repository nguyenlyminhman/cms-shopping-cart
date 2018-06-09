const express = require('express');
const app = express();
const config = require('config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { db } = require('./common/db-connection');
const session = require('express-session');
const validate = require('express-validator');

const router = require('./router');
//use session to manage loged in user.
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'cms-shopping-cart',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//Connect to database (using mongo db).
mongoose.connect(db());

//using bodyParser middleware to parse incoming request bodies before your handlers.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
//using connect-flash to send error message
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//set local global errors
app.locals.errors = null;

//using express-validator to check value get from form.
app.use(validate());

//set views engine for website.
app.set('views', 'views');
app.set('view engine', 'ejs');

//set router for website
app.use('/', router);

//get the server port
var port = config.get("server.port");

//start the server
app.listen(port || process.env.port, () => {
  console.log('The cms-shopping-cart web-page is listening on port', port);
});
