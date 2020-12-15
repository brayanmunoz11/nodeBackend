const express = require('express');
const passport = require('passport');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

let multer = require('multer');
const { request } = require('express');
let upload = multer();



// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');

});


router.post('/signup', upload.fields([]), async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  //const { fullname } = req.body;
  console.log(req.body)
  const user = req.body;
  let newUser = { 
    nombre : user.nombre, 
    apellido : user.apellido,
    usuario : user.usuario,
    email : user.email,
    password : user.password
    
  }
  newUser.password = await helpers.encryptPassword(user.password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO heroku_ac61479f38e9e23.user SET ? ', newUser);
  //const result = await pool.query(``);

  newUser.id = result.insertId;
  return done(null, newUser);

});

router.get('/signin', (req, res) => {
  
});



//SIGNIN
router.post('/signin', upload.fields([]), async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log(req.body)
  var message = '';
  var users = {};
  const user1 = req.body;
  const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.users WHERE username = ?', [user1.nombre]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(user1.password, user.password)
    if (validPassword) {
      users = user;
      message = 'usario logeado';
      console.log(user);
    } else {

      message = 'password incorrecto';
    }
  } else {
    message = 'usuario no existe';
  }
  res.status(200).json({
    data: users,
    message: message
  });
});




module.exports = router;