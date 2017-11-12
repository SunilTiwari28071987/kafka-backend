const validator = require('../validationAPI');
const db = require('../databaseAPI');
//const mongoSessionURL = "mongodb://localhost:27017/sessions";
//const expressSessions = require("express-session");
//const mongoStore = require("connect-mongo")(expressSessions);
const mongoURL = "mongodb://localhost:27017/Dropbox";
//const saltRounds = 10;

function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

    validator.isExistingUser(function(userStatus) {
        console.log("userStatus :", userStatus)
        if (userStatus) {
            res.code = "400";
            res.value = "Already existing user";
            callback(null, res);
        } else {

            db.connect(mongoURL, function() {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = db.collection('users');

                //var salt = bcrypt.genSaltSync(saltRounds);
                //var hash = bcrypt.hashSync(password, salt);
                //bcrypt.compareSync(myPlaintextPassword, hash); // true

                var signUpQuery = {
                    firstName: msg.firstName,
                    lastName: msg.lastName,
                    emailID: msg.emailID,
                    password: msg.password,
                    age: msg.age,
                    gender: msg.gender,
                    status: msg.status,
                    files: msg.files
                };
                coll.insert(signUpQuery, function(err, user) {
                    if (user) {
                        console.log(user);
                        res.code = "200";
                        res.value = "Successfully signed in";
                        console.log('My response',res);
                        callback(null, res);
                    } else {
                        console.log(err);
                    }
                });
            });
        }

    }, msg.emailID);


}

exports.handle_request = handle_request;