
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
        console.log ('{emailID:'+msg.emailID+', "files.filePath":'+JSON.stringify(msg.filePath)+'},  { $set: { "files.$.isStarred" : false } }');

        coll.update( {emailID:msg.emailID, "files.filePath":msg.filePath},  { $set: { "files.$.isStared" : false } } , {multi: true} , function(err, user) {
            if (user) {
                //console.log("user result",user);
                res.code = "200";
                res.value = "File Successfully Unstarred";
                console.log('My response',res);
                callback(null, res);
            } else {
                console.log(err);
            }
        });
    });

}

exports.handle_request = handle_request;
