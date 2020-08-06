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

router.post('/add', async (req, res) => {
   const user = await User.findById(req.body.userId);
  if(!user) {
    res.send("userId " + req.body.userId + " not found");
    return;
  } 
  const exercise = new User({ 
    description: req.body.description,
    duration: req.body.duration
  });
  // if a date was provided, set it in the exercise
  //  otherwise MongoDB will default it to Date.now()
  if(req.body.date) exercise.date = req.body.date
  user.log.push(exercise);
  
  try {
    await user.save();
    // res.json(user);
    res.json({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date
    })
  } catch(e) {
    console.log(e);
    res.send("Sorry, there was an error saving the exercise.");
  }
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