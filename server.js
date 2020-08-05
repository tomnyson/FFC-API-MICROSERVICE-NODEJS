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



// According to the user stories, if our API isn't given a date query, we should return the current timestamp. To do so, we'll have the "empty endpoint" of .../timestamp redirect to .../timestamp/<current_date_string>:
app.get("/api/timestamp", function(req, res) {
  // We'll save the current timestamp as a Date object...
  let newDate = new Date();
  // ... then we'll redirect to the correct endpoint, adding the date to the end of the URL:
  // A 302 HTTP status code, also known as "Found", is used when the Web page is temporarily not available for reasons that have not been unforeseen. That way, search engines don't update their links.
  // NB: If we don't specify a redirect type, express.js defaults to "302 Found". For clarity, we add the 302 here:
  res.redirect(302, "/api/timestamp/" + newDate.getFullYear() + "-" + (newDate.getUTCMonth() + 1) + "-" + newDate.getUTCDate() );    // NB: Date object months are zero-indexed, so we add 1 to the month value of our date query.
});



// Whenever the user makes a query to the API, we need to return the unix date and the utc date in a JSON array:
app.get("/api/timestamp/:dateReq", function(req, res) {
  // We'll start by setting up a variable...
  const {dateReq} = req.params
  let date;
  if(dateReq) {
    res.json({
    "unix": new Date().getTime(),
    "utc": null
  });
  }
  
  if ( /\D/.test(req.params.dateReq) ) {
    date = new Date( req.params.dateReq );
  }
  else {
    date = new Date( parseInt(req.params.dateReq) );
  };
  
    
  // At the time of coding this API, the user stories on freeCodeCamp.org and in the GitHub/boilerplate have different demands for how to handle invalid date queries.
  // If using the freeCodeCamp.org user stories, we would need to account for invalid dates as follows:
  if (date == "Invalid Date") return res.json( {"error": "Invalid Date" } );
  
  let utcDate = date.toUTCString();  // to get a pretty string of text for the given date, in UTC format
  let unixDate = date.getTime();     // to get time in milliseconds since the start of epoch time
  
  // Finally, we return a JSON object as a response:
  res.json({
    "unix": unixDate,
    "utc": utcDate
  });
  
});




// AS SET UP IN THE FREECODECAMP BOILERPLATE, we also need to set up our server to listen for requests. This makes sure that our webapp/api is responding to requests and therefore "live".
// Note that this listener is placed at the end of Express projects (and the requirement for express.js is always placed at the beginning of the code).
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});