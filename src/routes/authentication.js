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


router.put('/useredit/:id', upload.fields([]), async (req, res) => {
  const { id } = req.params;
  const { nombre,apellido,usuario,email} = req.body; 

  const newUser = {
      nombre , 
      apellido ,
      usuario ,
      email ,

  };

  await pool.query('UPDATE heroku_ac61479f38e9e23.user set ? WHERE id = ?', [newUser, id]);
  const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE id = ?', [id]);
  res.status(200).json({
    data: rows,
    message: "user updated"
  });


});




module.exports = router;