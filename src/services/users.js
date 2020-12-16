class UserServices {
  constructor(){

  }
  async getUser(user) {
    var message = '';
    var users = {};
    // const user1 = req.body;
    console.log(user);
    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.user WHERE usuario = ?', [user.nombre]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(user.password, user.password)
      if (validPassword) {
        users = user;
        message = 'usario logeado';
        console.log(user);
      } else {
        message = 'password incorrecto';
      }
    } else {
      message = 'usuario no existe';
    }

    return [users, message]
  }
  async createUser(user) {
    
  }


}