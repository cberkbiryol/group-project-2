//Use npm install passport-local

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

//const User needed for deserializeUser
const User = require('<relative path to User.js eg ./User>')

//Require SQL to write to db
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

connection.query('USE Jobber');

//export passport function to Jobber app
module.exports = function(passport){

//Serialize and Deserialize set up
passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    connection.query("SELECT * FROM employer WHERE id = 'email'", function(err,rows){
        done(err, rows[0]);
    });
})
}

passport.use('logIn', new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: 'email' }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  //*******Study this**********8
//   app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });