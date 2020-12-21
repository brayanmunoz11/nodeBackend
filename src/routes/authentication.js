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


module.exports = router;