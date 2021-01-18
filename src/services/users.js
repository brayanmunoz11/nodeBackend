const pool = require('../database');
const helpers = require('../lib/helpers');
class UserServices {
  constructor(){

  }

  async getUser(user) {
    var message = '';
    var users = {};
    var valid = false;

    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE usuario = ?', [user.nombre]);
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
    // console.log(user);
    let userF = []
    let message = 'user created'
    let newUser = {
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      email: user.email,
      password: user.password
    }
    newUser.password = await helpers.encryptPassword(user.password);

    // Saving in the Database
    try{
      await pool.query('INSERT INTO heroku_ac61479f38e9e23.user SET ? ', newUser);
      userF = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE nombre = ?', [newUser.nombre]);
    }catch(err){
      if(err.sqlMessage.includes('usuario_UNIQUE')){
        message = 'Usuario no valido'
      }else if(err.sqlMessage.includes('email_UNIQUE')) {
        message = 'Email no valido'
      }
      // console.log(err.sqlMessage);
    }

    return {user: userF[0], message}
  }
}
module.exports = UserServices;