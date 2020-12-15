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
    res.setHeader('Content-Type', 'application/json')
		res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.body)
    var message = '';
    var users = {};
    const user1 = req.body; 
    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE usuario = ?', [user1.nombre]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(user1.password, user.password)
      if (validPassword) {
        users = user;
        message = 'usario logeado';
        console.log(user);
      } else{
        
        message = 'password incorrecto';
      }
    } else{
      message = 'usuario no existe';
    }
    res.status(200).json({
      data: users,
      message: message
    }); 
  });
  
  


module.exports = router;