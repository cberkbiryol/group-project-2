//Use npm install passport-local

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

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