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

router.post('/add', async (req, res, next) => {
     const userId = req.body.userId;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const requiredFieldsCompleted = userId && description && duration;
  if(requiredFieldsCompleted){
    User.findById(userId, (error, user) => {
      if(error) return next(error);
      if(user){    
        const date = (req.body.date) ? new Date(req.body.date) : new Date();
        user.count = user.count + 1;
        const newExercise = {description: description, duration: duration, date: date};
        user.log.push(newExercise);
        user.save((error, user) => {
          if(error) return next(error);
          const dataToShow = { 
            username: user.username,
            _id: user._id,
            description: description,
            duration: duration,
            date: date.toDateString()
          };
          console.log(dataToShow)
          res.json(dataToShow);
        });
      } else {
        next();
      }
    });
  } else {
    let message = "Please complete all the required fields.";
    res.send(message);
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