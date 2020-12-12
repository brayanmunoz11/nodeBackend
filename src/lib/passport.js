const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));


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
  


