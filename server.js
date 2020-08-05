
/*
 * Required modules
 */
var express = require("express");
var url = require("url");

/*
 * App
 */
var app = express();

app.listen(process.env.PORT, function () {
	console.log('Example app listening to current port!');
});
