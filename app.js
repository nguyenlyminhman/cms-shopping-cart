const express = require('express');
const app = express();
const config = require('config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { db } = require('./common/db-connection');
const router = require('./router')



mongoose.connect(db());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);
var port = config.get("server.port");
app.listen(port, () => {
    console.log('The cms-shopping-cart listening on port', port);
});
