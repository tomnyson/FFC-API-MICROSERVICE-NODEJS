// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const moment = require("moment");
// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.json({
    unix: new Date().getTime(),
    utc: new Date().toUTCString()
  });
});

app.get("/api/timestamp/:date?", (request, response) => {
  const date = request.params.date;

  if (!isNaN(date)) {
    response.json({
      unix: new Date(parseInt(date)).getTime(),
      utc: new Date(parseInt(date)).toUTCString()
    });
  } else if (moment.utc(date, "YYYY-M-D", true).isValid()) {
    response.json({
      unix: new Date(date).getTime(),
      utc: new Date(date).toUTCString()
    });
  } else {
    response.json({
      unix: new Date(parseInt(date)).getTime(),
      utc: new Date(parseInt(date)).toUTCString()
    });
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
