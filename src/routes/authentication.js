const express = require('express');
// const passport = require('passport');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

let multer = require('multer');
// const { request } = require('express');
let upload = multer();

let UserServices = require('./../services/users')
// SIGNUP
// router.get('/signup', (req, res) => {
//   res.render('auth/signup');

// });

const userService = new UserServices();

router.post('/signup', upload.fields([]), async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  var message = '';
  var users = {};

  console.log(req.body)
  const user = req.body;
  let newUser = {
    nombre: user.nombre,
    apellido: user.apellido,
    usuario: user.usuario,
    email: user.email,
    password: user.password
  }
  newUser.password = await helpers.encryptPassword(user.password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO heroku_ac61479f38e9e23.user SET ? ', newUser);
  users = newUser;
  message = 'user create';
  res.status(200).json({
    data: users,
    message: message
  });
});


//SIGNIN
router.post('/signin', upload.fields([]), async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');

  try{
    const [user, message] = await userService.getUser(req.body)
    res.status(200).json({
      data: user,
      message: message
    });
  }
  catch(err) {
    next(err);
  }
});


module.exports = router;