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
        // console.log(user);
      } else {
        message = 'password incorrecto';
      }
    } else {
      message = 'usuario no existe';
    }

    return [users, message, valid]
  }
  async createUser(user) {
    let newUser = {
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      email: user.email,
      password: user.password
    }
    newUser.password = await helpers.encryptPassword(user.password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO heroku_ac61479f38e9e23.user SET ? ', newUser);
    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE nombre = ?', [newUser.nombre]);
    
    return rows
  }
}
module.exports = UserServices;