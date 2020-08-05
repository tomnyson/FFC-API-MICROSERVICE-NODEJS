var express = require('express');
var router = express.Router();

// About page route.
router.get('/new', function (req, res) {
  res.json({message: 'hahahha'});
})

module.exports = router;