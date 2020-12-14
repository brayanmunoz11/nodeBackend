const express = require('express');
const passport = require('passport');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

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
  router.post('/signin',upload.fields([]), async (req, res, next) => {

    console.log(req.body)

    const user1 = req.body; 
    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.users WHERE username = ?', [user1.nombre]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(user1.password, user.password)
      if (validPassword) {
        
        console.log(user);
      } 
    } 
  });
  
  


module.exports = router;