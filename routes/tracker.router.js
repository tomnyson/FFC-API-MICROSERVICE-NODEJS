var express = require("express");
var router = express.Router();
var validUrl = require("valid-url");
const shortId = require("shortid");
const User = require("../models/user.model.js");

router.post("/new-user", async (req, res) => {
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

router.get('/users', (req, res) => {
  User.find()
    .then(docs => {
      res.json(docs);
    })
    .catch(err => res.json(err) );
});

router.post('/add', (req, res) => {
  // because the date is optionally, we need to test whether date is there or not
  let date;
  if(req.body.date){
    date = req.body.date;
  } else {
    date = new Date();
  }

  // create the excercise which will be save
  const logger = {
    description: req.body.description, 
    duration: req.body.duration, 
    date: date
  };
  console.log('logger',logger)
  // finally we find the user by his id and we update him
  User.findByIdAndUpdate(req.body.userId, {$push: { log: logger}}, {new: true}).exec()
    .then( user => res.json({id: user.id, username: user.username, log: user.log[user.log.length-1]}))
    .catch( err => res.json(err) );
});


router.get('/log', (req, res) => {
  User.findById(req.query.userId).exec()
  .then( user => {
    let newLog = user.log;
    if (req.query.from){
      newLog = newLog.filter( x =>  x.date.getTime() > new Date(req.query.from).getTime() );
    }
    if (req.query.to){
      newLog = newLog.filter( x => x.date.getTime() < new Date(req.query.to).getTime());
    }
    if (req.query.limit){
      newLog = newLog.slice(0, req.query.limit > newLog.length ? newLog.length : req.query.limit);
    }
    user.log = newLog;
    let temp = user.toJSON();
    temp['count'] = newLog.length;

    return temp;
  })
  .then( result => res.json(result))
  .catch(err => res.json(err));
    
});


module.exports = router;