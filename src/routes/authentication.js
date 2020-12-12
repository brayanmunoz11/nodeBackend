const express = require('express');
const passport = require('passport');
const router = express.Router();


// SIGNUP
router.get('/signup', (req, res) => {
    res.render('auth/signup');
    res.send('API SIGNUP');
  });


  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  
  router.get('/profile',(req, res) => {
    res.send(' this is your profile');
  });


module.exports = router;