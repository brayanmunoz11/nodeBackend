const express = require('express');
const router = express.Router();

let multer = require('multer');
let upload = multer();

let UserServices = require('./../services/users')
const userService = new UserServices();


router.post('/signup', upload.fields([]), async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');

  const user = await userService.getUser(req.body)

  res.status(200).json({
    data: user,
    message: 'user create'
  });
});

//SIGNIN
router.post('/signin', upload.fields([]), async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
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