const express = require('express');
const User = require('../models').user;

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => {
    res.send(users);
  })
});

router.get('/:id', (req, res, next) => {
  User.findOne({ where: {id: req.params.id} })
  .then(user => {
    res.send(user)
  })
})

router.delete('/:id', (req, res, next) => {
  User.destroy({ where: {id: req.params.id} })
  .then(result => {
    if(!!result)
      res.send(true)
    res.send(false)
  })
})

router.post('/', (req, res, next) => {
  User.create({
    username: req.body.username,
    balance: req.body.balance
  }).then(result => {
    if(!!result)
     res.send(true)
    res.send(false)
  })
})

router.put('/:id', (req, res, next) => {
  User.update({
    username: req.body.username,
    balance: req.body.balance
  }, {returning: true, where: {id: req.params.id} }).then(result => {
    if(!!result)
     res.send(true)
    res.send(false)
  })
})


//
module.exports = router;
