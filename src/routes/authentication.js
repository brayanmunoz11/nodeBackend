const express = require('express');
const passport = require('passport');
const router = express.Router();

let multer = require('multer');
let upload = multer();


// SIGNUP
router.get('/signup', (req, res) => {
    res.render('auth/signup');
    
  });


  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/signin', (req, res) => {
    res.render('auth/signin');
  });

  
  
  //SIGNIN
  router.post('/signin',upload.fields([]),  (req, res, next) => {
    
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.send('signin');
    console.log(req.bady);
		
    /*
    passport.authenticate('local.signin', {
      successRedirect: '/profile',
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res,next);*/
  });
  
  
  router.get('/profile',(req, res) => {
    res.render('profile');
  });


module.exports = router;