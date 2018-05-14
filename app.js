const express = require('express');
const app = express();
const config = require('config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { db } = require('./common/db-connection');



mongoose.connect(db());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', '/views');
app.set('view engine', 'ejs');

var port = config.get("server.port");
app.listen(port, () => {
    console.log('Example app listening on port', port);
});
