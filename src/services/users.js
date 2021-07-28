const pool = require('../database');
const helpers = require('../lib/helpers');
class UserServices {
  constructor(){

  }

  async getUser(user) {
    var message = '';
    var users = {};
    var valid = false;
    // console.log(user.email)
    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE email = ?', [user.email]);
    if (rows.length > 0) {
      const user1 = rows[0];
      const validPassword = await helpers.matchPassword(user.password, user1.password)
      if (validPassword) {
        users = user1;
        message = 'usario logeado';
        valid = true;
      } else {
        message = 'Password incorrecto';
      }
    } else {
      message = 'Usuario no existe';
    }

    return [users, message, valid]
  }
  async createUser(user) {
    console.log(user.password[0]);
    let userF = []
    let message = 'user created'
    let newUser = {
      nombre: user.name,
      usuario: user.dni,
      email: user.email,
      password: user.password[0],
      apellido: user.apellido,
      tipoUsuario: user.tipoUsuario
    }
    newUser.password = await helpers.encryptPassword(user.password[0]);

    // Saving in the Database
    try{
      await pool.query('INSERT INTO heroku_ac61479f38e9e23.user SET ? ', newUser);
      userF = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE nombre = ?', [newUser.nombre]);
    }catch(err){
      if(err.sqlMessage.includes('usuario_UNIQUE')){
        message = 'El DNI ya esta registrado, ingrese uno valido'
      }else if(err.sqlMessage.includes('email_UNIQUE')) {
        message = 'El DNI ya esta registrado, ingrese uno valido'
      }
      console.log(err.sqlMessage);
    }

    return {user: userF[0], message}
  }

  async createPreferences(user){
    let newprefe = {
      color: "#000000",
      zise: "16px",
      descargacomp: 1,
      descargaunit: 1,
      tema: 0,
      iduserpreference: user.id
    }
    await pool.query('INSERT INTO heroku_ac61479f38e9e23.preferencias SET ? ', newprefe);

    let userP = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.preferencias WHERE iduserpreference = ?', [user.id]);
    return {userP: userP[0]}
  }

  async getPreferences(id){
    let preferences = {}
    try {
      preferences = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.preferencias WHERE iduserpreference = ?', [id]);

    }catch(err){
      next(err);
    }
    return {preferences: preferences[0]}
  }
}
module.exports = UserServices;