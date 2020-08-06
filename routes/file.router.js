var express = require("express");
var router = express.Router();
const multer = require('multer');

const upload = multer({
  // dest: 'uploads/', // dont want to store files on server
  limits: { fileSize: 20971520 } // 20mb
}).single('inputFile');

router.post('/', function (req, res) {
  upload(req, res, function (err) {
    let output = {
      filesize: ''
    };
    if (err) {
      output.filesize = 'File too large';
    } else {
      const size = (req.file.size / (1024 * 1024)).toFixed(2);
      output.filesize = size + ' mb';
    }
    res.header('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(output, null, 3));
  });
});



module.exports = router