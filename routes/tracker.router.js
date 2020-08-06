var express = require("express");
var router = express.Router();
var validUrl = require("valid-url");
const shortId = require("shortid");
const URL = require("../models/link.model.js");


router.get("/", async (req, res) => {
  console.log('hahahh')
 // res.sendFile(__dirname + "views/tracker.html");
});

router.get("/:short_url?", async function(req, res) {
  try {
    const urlParams = await URL.findOne({
      short_url: req.params.short_url
    });
    if (urlParams) {
      return res.redirect(urlParams.original_url);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});
module.exports = router;