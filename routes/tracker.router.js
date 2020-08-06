var express = require("express");
var router = express.Router();
var validUrl = require("valid-url");
const shortId = require("shortid");
const User = require("../models/user.model.js");

router.post("/new", async (req, res) => {
  const {username} = req.body
  
  User.findOne({username}, (err, user) => {
    if(user) {
      return res.send('user exist');
    }
    new User({username})
      .save()
      .then(doc => res.json({username: doc.username, _id: doc.id}))
      .catch(err => res.json(err));
  });
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