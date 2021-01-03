const express = require('express');
const router = express.Router();

let multer = require('multer');
let upload = multer();

let UserServices = require('./../services/users')
const userService = new UserServices();

router.post('/signup', upload.fields([]), async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(200).json({
      data: user,
      message: 'user created'
    });
  }
  catch(err) {
    next(err);
  }
});

//SIGNIN
router.post('/signin', upload.fields([]), async (req, res, next) => {
  try{
    const [user, message, valid] = await userService.getUser(req.body);
    res.status(200).json({
      data: user,
      message: message,
      valid: valid
    });
  }
  catch(err) {
    next(err);
  }
});

// router.post('/add', upload.fields([]), async (req, res) => {
//   // console.log()
//   try {
//       let valid = false;
//       const { nombre, cuerpo, iduser, tipo } = req.body;
//       const newArchive = {
//           nombre,
//           cuerpo,
//           iduser
//       };
//       if (tipo == 'css'){
//           await pool.query('INSERT INTO heroku_ac61479f38e9e23.css set ?', [newArchive]);
//           valid=true;
//       }
//       else if (tipo == 'html'){
//           await pool.query('INSERT INTO heroku_ac61479f38e9e23.html set ?', [newArchive]);
//           valid=true;
//       }
//       else{
//           await pool.query('INSERT INTO heroku_ac61479f38e9e23. set ?', [newArchive]);
//           valid=true;
//       }
//       res.status(201).json({
//           data: valid,
//           message: 'file created'
//       });
//   }catch(err){
//       next(err);
//   }
// });

module.exports = router;