// server.js -- where our node.js app starts

// To get our microservice API project underway, we need to set up express.js.
// To do so, we'll require it as a dependency (node.js will look in package.json to find which version we want to use)...
const express = require("express");
const mongoose = require("mongoose");
var linkRouter = require("./routes/link.router.js");
const trackerRouter = require("./routes/tracker.router.js");
// ... though now set a variable, to actually use the express dependency, we also need to define our express app by expressing it as a function:
const app = express();

const requestIp = require("request-ip");
var bodyParser = require("body-parser");
// inside middleware handler

// AS SET UP IN THE FREECODECAMP BOILERPLATE, we need to enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) so that our webapp/API is remotely testable by FCC...
// It too is a required dependency and its version is set in our package.json dependency file...
const cors = require("cors");
// ... and configured by FCC for us as follows:
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204
var ipMiddleware = function(req, res, next) {
  const clientIp = requestIp.getClientIp(req);
  console.log({ clientIp });
  next();
};
//As Connect Middleware
app.use(requestIp.mw());
// AS SET UP IN THE FREECODECAMP BOILERPLATE, In order to serve static files such as images, CSS files, and JavaScript files, we can use the express.static built-in middleware function in Express.
// We set this folder to the standard /public:
app.use(express.static("public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const mongodbUrl = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.9bac1.mongodb.net/freecodecamp?retryWrites=true&w=majority`;

console.log("url", mongodbUrl);

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "ConnetFailed"));
connection.once("open", () => {
  console.log("MongoDB Connecting");
});

// AS SET UP IN THE FREECODECAMP BOILERPLATE, we'll also do a bit more basic setup for our project so that any client requests for the root endpoint/route (i.e. / ) is handled by returning the index page:
app.get("/", function(req, res) {
  // When our api gets a request for the root folder, the request is handled by responding with the URL for our index.html endpoint:
  res.sendFile(__dirname + "/views/tracker.html");
});

app.get("/tracker", function(req, res) {
  res.sendFile(__dirname + "/views/tracker.html");
});

///////////////
// With all the setup done, let's code our our API endpoints as outlined in the user stories for the project:
///////////////

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

/*api time tracker*/
app.get("/api/timestamp/", (req, res) => {
  res.json({ unix: Date.now(), utc: Date() });
});

/*api whoim*/

app.get("/api/whoami", (req, res) => {
  var ipadress = req.clientIp;
  var language = req.acceptsLanguages();
  var software = req.get("User-Agent");
  res.json({
    ipaddress: ipadress,
    language: language[0],
    software: software
  });
});

app.get("/api/timestamp/:date_string", (req, res) => {
  let dateString = req.params.date_string;
  let dateInt;
  //A 4 digit number is a valid ISO-8601 for the beginning of that year
  //5 digits or more must be a unix time, until we reach a year 10,000 problem
  if (/\d{5,}/.test(dateString)) {
    dateInt = parseInt(dateString);
    //Date regards numbers as unix timestamps, strings are processed differently
    res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
  }

  let dateObject = new Date(dateString);
  console.log("dateObject.toString() ", dateObject.toString());
  if (dateObject.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
  }
});
/*import router part*/
app.use("/api/shorturl", linkRouter);
app.use("/api/exercise", trackerRouter);

// AS SET UP IN THE FREECODECAMP BOILERPLATE, we also need to set up our server to listen for requests. This makes sure that our webapp/api is responding to requests and therefore "live".
// Note that this listener is placed at the end of Express projects (and the requirement for express.js is always placed at the beginning of the code).
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log(
      "Mongoose default connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});
