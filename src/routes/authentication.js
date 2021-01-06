const express = require('express');
const router = express.Router();

const pool = require('../database');

let multer = require('multer');
let upload = multer();

let UserServices = require('./../services/users')
const userService = new UserServices();

router.post('/signup', upload.fields([]), async (req, res, next) => {
  try {
    const {user, message} = await userService.createUser(req.body)
    res.status(200).json({
      data: user,
      message: message,
    });
  }
  catch (err) {
    next(err);
  }
});

//SIGNIN
router.post('/signin', upload.fields([]), async (req, res, next) => {
  try {
    const [user, message, valid] = await userService.getUser(req.body);
    res.status(200).json({
      data: user,
      message: message,
      valid: valid
    });
  }
  catch (err) {
    next(err);
  }
});


router.post('/useredit/:id', upload.fields([]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, usuario, email } = req.body;

    const newUser = {
      nombre,
      apellido,
      usuario,
      email

    };

    let vaaaal = await pool.query('UPDATE heroku_ac61479f38e9e23.user set ? WHERE id = ?', [newUser, id]);
    const user = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE id = ?', [id]);
    res.status(200).json({
      data: user[0],
      message: "user updated"
    });

  }catch (err) {
    next(err);
  }
});

router.post('/updatePhoto', upload.single('foto'), async (req, res, next) => {
  try {
    // const { id } = req.params;
    // const { nombre, apellido, usuario, email } = req.body;
    console.log(req.file)




    // res.status(200).json({
    //   data: user[0],
    //   message: "user updated"
    // });

  }catch (err) {
    next(err);
  }
});





module.exports = router;