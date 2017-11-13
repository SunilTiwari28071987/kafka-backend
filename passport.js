var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./databaseAPI");
var mongoURL = "mongodb://localhost:27017/Dropbox";
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
    usernameField: 'emailID',
    passwordField: 'password'
  },function(username, password, done) {
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');

		//var salt = bcrypt.genSaltSync(saltRounds);
		//var hash = bcrypt.hashSync(password, salt);
		//bcrypt.compareSync(myPlaintextPassword, hash); // true

                coll.findOne({emailID: username, password:password}, function(err, user){
                    if (user) {
                        done(null, {emailID: username, password: password});

                    } else {
                        done(null, false);
                    }
                });
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};


