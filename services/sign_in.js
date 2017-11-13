const validator = require('../validationAPI');
const db = require('../databaseAPI');
//const mongoSessionURL = "mongodb://localhost:27017/sessions";
//const expressSessions = require("express-session");
//const mongoStore = require("connect-mongo")(expressSessions);
const mongoURL = "mongodb://localhost:27017/Dropbox";
//const saltRounds = 10;

function handle_request(msg, callback){

    var res = {};
    var resultJson = {};
    console.log("In handle request:"+ JSON.stringify(msg));

    validator.isAuthenticUser(function(userStatus) {
        console.log("userStatus :", userStatus)
        if (!userStatus) {
            res.code = "400";
            res.value = "User authentication failed.";
            callback(null, res);
        } else {

            db.connect(mongoURL, function() {
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = db.collection('users');

                //var salt = bcrypt.genSaltSync(saltRounds);
                //var hash = bcrypt.hashSync(password, salt);
                //bcrypt.compareSync(myPlaintextPassword, hash); // true

                var fetchUserDetailsQuery = {emailID: msg.emailID};
                coll.findOne(fetchUserDetailsQuery, function(err, resultsUserDetails) {
                    if (resultsUserDetails) {
                        console.log("resultsUserDetails : ",resultsUserDetails);
                        resultJson=resultsUserDetails;
                        res.code = "200";
                        res.value = "Successfully signed in";
                        res.data = resultJson;
                        callback(null, res);
                    } else {
                        console.log(err);
                    }
                });
            });
        }

    }, msg.emailID,msg.password);


}

exports.handle_request = handle_request;