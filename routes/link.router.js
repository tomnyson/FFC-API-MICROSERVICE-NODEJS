var express = require("express");
var router = express.Router();
var validUrl = require("valid-url");
const shortId = require("shortid");
const URL = require("../models/link.model.js");

router.post("/new", async (req, res) => {
  const url = req.body.url_input;
  const urlCode = shortId.generate();
  if (!validUrl.isWebUri(url)) {
    res.status(401).json({
      error: "invalid URL"
    });
  } else {
    try {
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