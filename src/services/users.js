const pool = require('../database');
const helpers = require('../lib/helpers');
class UserServices {
  constructor() {

  }
  async getUser(user) {
    var message = '';
    var users = {};

    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE usuario = ?', [user.nombre]);
    if (rows.length > 0) {
      const userf = rows[0];
      console.log([user.password, userf.password])
      const validPassword = await helpers.matchPassword(user.password, userf.password)
      if (validPassword) {
        users = user;
        message = 'usuario logeado';
        console.log(user);
      } else {
        message = 'password incorrecto';
      }
    } else {
      message = 'usuario no existe';
    }

    return [users, message];
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

    return newUser
  }
}

module.exports = UserServices;