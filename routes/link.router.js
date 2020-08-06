var express = require("express");
var router = express.Router();
var validUrl = require("valid-url");
const shortId = require('shortid');
const URL = require("../models/")
router.get("/new", async (req, res) => {
  const url = req.body.url_input;
  const urlCode = shortId.generate();
  // check if the url is valid or not
  if (!validUrl.isWebUri(url)) {
    res.status(401).json({
      error: "invalid URL"
    });
  } else {
    try {
      // check if its already in the database
      let findOne = await URL.findOne({
        original_url: url
      });
      if (findOne) {
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        });
      } else {
        // if its not exist yet then create new one and response with the result
        findOne = new URL({
          original_url: url,
          short_url: urlCode
        });
        await findOne.save();
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("server erorr…");
    }
  }
});

module.exports = router;