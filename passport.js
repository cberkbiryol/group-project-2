//Use npm install passport-local
//Use npm install passport

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

//const User needed for deserializeUser
//const User = require('<relative path to User.js eg ./User>')

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

passport.use(new LocalStrategy(
  function(username, password, done) {
      User.findOne({  // Using sequelize model function
          where: { // Take an object with options where self explanatory
              username: 'email'
          }
      }).then(function (user) { // Sequelize return a promise with user in callback
          if (user == null) { // Checking if user exsists
              return done(null, false)  // Standard Passport callback
          }

          if (password == user.password) { // use your password hash comparing logic here for security
              return done(null, user) // Standard Passport callback
          }
          return done(null, false) // Standard Passport callback
      })
  }
))

  //*******Study this**********
//   app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });