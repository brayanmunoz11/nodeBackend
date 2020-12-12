const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { nombre } = req.body;
  const { apellido } = req.body;
  const { email } = req.body;
  const newUser = {
      username,
      password,
      nombre,
      apellido,
      email
  };
  newUser.password =  await helpers.encryptPassword(password);

  const result = await pool.query('INSERT INTO heroku_ac61479f38e9e23.users SET ? ', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.users WHERE id = ?', [id]);
    done(null, rows[0]);
});
  


