var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./databaseAPI");
var mongoURL = "mongodb://localhost:27017/Dropbox";

function isExistingUser(callbackFunction,emailID) {

   mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');
                var query = {emailID: emailID};
                coll.find(query).toArray(function(err, result){
                    if (result.length>0) {
                      console.log("Result :",result);
            callbackFunction(true);
                    } else {
            console.log("Result :",result);
                        callbackFunction(false);
                    }
                });
            });

}


function isAuthenticUser(callbackFunction,emailID,password) {
    var isAuthenticUserQuery = {emailID: emailID,password:password};
    console.log("Query is:" + isAuthenticUserQuery);

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        //var query = {emailID: emailID,password:password};
        coll.find(isAuthenticUserQuery).toArray(function(err, result){
            if (result.length>0) {
                console.log("Result :",result);
                callbackFunction(true);
            } else {
                console.log("Result :",result);
                callbackFunction(false);
            }
        });
    });



}


exports.isExistingUser = isExistingUser;
exports.isAuthenticUser = isAuthenticUser;
