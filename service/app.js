/**
 * Created by 012789 on 28.07.2016.
 */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes/routes.js")(router);

app.use('/api', router);
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});