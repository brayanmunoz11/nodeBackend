const express = require('express');
const router = express.Router();

let multer = require('multer');
let upload = multer();

let UserServices = require('./../services/users')
const userService = new UserServices();

router.post('/signup', upload.fields([]), async (req, res, next) => {
<<<<<<< HEAD
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
=======
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  var message = '';
  var users = {};
   
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
    
   users = newUser;
    message = 'user created';
    res.status(200).json({
      data: users,
      message: message
    }); 


});

router.get('/signin', (req, res) => {
  
  
>>>>>>> ramaJose
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

<<<<<<< HEAD
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
=======

router.post('/useredit', upload.fields([]), async (req, res) => {
  
  const { nombre,apellido,usuario,email,id} = req.body; 

  const newUser = {
      nombre , 
      apellido ,
      usuario ,
      email ,

  };

  await pool.query('UPDATE heroku_ac61479f38e9e23.user set ? WHERE id = ?', [newUser, id]);
  const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE usuario = ?', [nombre]);
  res.status(200).json({
    data: rows,
    message: "user updated"
  });


});




>>>>>>> ramaJose

module.exports = router;