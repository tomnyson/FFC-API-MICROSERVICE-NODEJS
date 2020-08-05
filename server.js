// server.js -- where our node.js app starts

// To get our microservice API project underway, we need to set up express.js.
// To do so, we'll require it as a dependency (node.js will look in package.json to find which version we want to use)...
const express = require('express');
// ... though now set a variable, to actually use the express dependency, we also need to define our express app by expressing it as a function:
const app = express();


// AS SET UP IN THE FREECODECAMP BOILERPLATE, we need to enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) so that our webapp/API is remotely testable by FCC...
// It too is a required dependency and its version is set in our package.json dependency file...
const cors = require('cors');
// ... and configured by FCC for us as follows:
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204


// AS SET UP IN THE FREECODECAMP BOILERPLATE, In order to serve static files such as images, CSS files, and JavaScript files, we can use the express.static built-in middleware function in Express.
// We set this folder to the standard /public:
app.use(express.static('public'));

// AS SET UP IN THE FREECODECAMP BOILERPLATE, we'll also do a bit more basic setup for our project so that any client requests for the root endpoint/route (i.e. / ) is handled by returning the index page:
app.get("/", function (req, res) {
  // When our api gets a request for the root folder, the request is handled by responding with the URL for our index.html endpoint:
  res.sendFile(__dirname + '/views/index.html');
});



///////////////
// With all the setup done, let's code our our API endpoints as outlined in the user stories for the project:
///////////////


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api/timestamp/", (req, res) => {
  res.json({ unix: Date.now(), utc: Date() });
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
  console.log('dateObject.toString() ',dateObject.toString() )
  if (dateObject.toString() === "Invalid Date") {
    res.json({error: 'Invalid Date'});
  } else {
    res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
  }
});



// AS SET UP IN THE FREECODECAMP BOILERPLATE, we also need to set up our server to listen for requests. This makes sure that our webapp/api is responding to requests and therefore "live".
// Note that this listener is placed at the end of Express projects (and the requirement for express.js is always placed at the beginning of the code).
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});