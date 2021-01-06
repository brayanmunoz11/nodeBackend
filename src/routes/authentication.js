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

    await pool.query('UPDATE heroku_ac61479f38e9e23.user set ? WHERE id = ?', [newUser, id]);
    const user = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE id = ?', [id]);
    res.status(200).json({
      data: user[0],
      message: "user updated"
    });

  } catch (err) {
    next(err);
  }


});

router.post('/validpassword/:id', upload.fields([]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const passwordBD = await pool.query('SELECT password FROM heroku_ac61479f38e9e23.user WHERE id = ?', [id]);


    const validPassword = await helpers.matchPassword(password, passwordBD)
    if (validPassword) {
      message = 'password correcto';
    } else {
      message = 'password incorrecto';
    }
    res.status(200).json({
      message: message,
    });
  }
  catch (err) {
    next(err);
  }
});

router.post('/updatepassword/:id', upload.fields([]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newpassword } = req.body;

    const passwordencriptado = await helpers.encryptPassword(newpassword);

    await pool.query('UPDATE password FROM heroku_ac61479f38e9e23.user WHERE id = ?', [id]);

    res.status(200).json({
      message: "password update",
    });
  }
  catch (err) {
    next(err);
  }
});

router.post('/deleteuser/:id', upload.fields([]), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM heroku_ac61479f38e9e23.user WHERE id = ?', [id]);

    res.status(200).json({
      message: "user delete",
    });
  }
  catch (err) {
    next(err);
  }
});

router.post('/updatePhoto/:id', upload.fields('foto'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { file } = req.file;

    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/didiblsne/image/upload`
    const CLOUDINARY_UPLOAD_PRESET = 'pqq4ikys';

    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      CLOUDINARY_URL,
      formData,
      {
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          onUploadProgress (e) {
              let progress = Math.round((e.loaded * 100.0) / e.total);
              console.log(progress);
              imageUploadbar.setAttribute('value', progress);
          }
      }
  );
  console.log(res.datasecure_url);


    

  } catch (err) {
    next(err);
  }




module.exports = router;