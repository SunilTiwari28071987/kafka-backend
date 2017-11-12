
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

    db.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = db.collection('users');

        //var salt = bcrypt.genSaltSync(saltRounds);
        //var hash = bcrypt.hashSync(password, salt);
        //bcrypt.compareSync(myPlaintextPassword, hash); // true


        coll.update( {emailID:msg.emailID}, {$pull: {files: {filePath: msg.filePath}}}, {multi: true} , function(err, user) {
            if (user) {
                console.log(user);
                res.code = "200";
                res.value = "File Successfully Deleted";
                console.log('My response',res);
                callback(null, res);
            } else {
                console.log(err);
            }
        });
    });

}

exports.handle_request = handle_request;
