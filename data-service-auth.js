/******************************************************************************
 * This module is strictly for validating and authenticating user credentals. *
 * It uses a completely seperate DB platform and connection. Mongoose is used *
 * as the middleware interface between NodeJS and MongoDB.                    *
 ******************************************************************************/ 

const bcrypt = require("bcryptjs");
 const mongoose = require("mongoose");                                                               // Linking Mongoose module.
var Schema = mongoose.Schema;                                                                       // Assigning Mongoose Schema to variable.

// Schema of User Account
var userSchema = new Schema({
    
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

var userCred = mongoose.model("bti325-mdzura-a6", userSchema);

let User;

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection("mongodb://dbuser:1234@senecaweb-shard-00-00-nhbot.mongodb.net:27017,senecaweb-shard-00-01-nhbot.mongodb.net:27017,senecaweb-shard-00-02-nhbot.mongodb.net:27017/test?ssl=true&replicaSet=SenecaWeb-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

        db.on('error', (err) => {
            reject(err);                                                                            // If connection error, Reject the promise with the provided error.
        });
        db.once('open', () => {
            User = db.model("users", userSchema);                                                   // Create a user model from schema above.
            resolve();
        });
    });
};
/******************************************************************************
 * Registers a New User in the Database for Authentication                    *
 ******************************************************************************/
module.exports.registerUser = function(userData) {
    console.log("Registering New User " + userData.userName + " " + userData.password + " " + userData.password2);
    return new Promise(function(resolve, reject) {
        if(userData.userName.length == 0 || userData.password.length == 0 || userData.password2.length == 0 ) {     // If registration fields are blank, Reject.
            console.log("Error: Cannot be blank!");
            reject("Cannot be blank!");                                                         
        } else if(userData.password !== userData.password2) {                                                       // If the passwords don't match, Reject.
            console.log("Error: Password doesn't match!");
            reject("Password doesn't match!");
        } else {
            console.log("Username: " + userData.userName + "\nPassword: " + userData.password);
            let newUser = new User(userData);                                                                       // Create a New User object with form data.
            bcrypt.genSalt(10, function (err, salt) {                                                               // Generate a "salt" using 10 rounds.
                bcrypt.hash(userData.password, salt, function (err, hash) {                                         // Encrypt the password.
                    if (err){
                        console.log("There was an error encrypting the password");
                        reject("There was an error encrypting the password");
                    }
                    newUser.password = hash;
                    newUser.save(function(err) {                                                                    // Save New User to MongoDB
                        if(err) {
                            if(err.code == 11000) {                                                                 // If Username key value already exists, Reject.
                                console.log("Error: Username taken!");
                                reject("Username taken!");
                            } else {
                                reject("There was an error saving the new user");
                            }
                        } else {
                            console.log("The new user was saved to the collection");
                            resolve("The new user was saved to the collection");                                    // Resolve if New User sucessfully saved to collection.
                        }
                    });
                });
            });
        }
    });

    /* console.log("Registering New User " + userData.userName + " " + userData.password + " " + userData.password2);
    return new Promise(function(resolve, reject) {
        if(userData.userName.length == 0 || userData.password.length == 0 || userData.password2.length == 0 ) {     // If registration fields are blank, Reject.
            console.log("Error: Cannot be blank!");
            reject("Cannot be blank!");                                                         
        } else if(userData.password !== userData.password2) {                                                       // If the passwords don't match, Reject.
            console.log("Error: Password doesn't match!");
            reject("Password doesn't match!");
        } else {
            console.log("Username: " + userData.userName + "\nPassword: " + userData.password);
            let newUser = new User(userData);                                                                       // Create a New User object with form data.
            newUser.save(function(err) {                                                                            // Save New User to MongoDB
                if(err) {
                    if(err.code == 11000) {                                                                         // If Username key value already exists, Reject.
                        console.log("Error: Username taken!");
                        reject("Username taken!");
                    } else {
                        reject("There was an error saving the new user");
                    }
                } else {
                    console.log("The new user was saved to the collection");
                    resolve("The new user was saved to the collection");                                             // Resolve if New User sucessfully saved to collection.
                }
            });
        }
    }); */
};
/*******************************************************************************/

/*******************************************************************************
 * Validates Users Credentials against database.                               *
 * *****************************************************************************/
module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        console.log("Searching.... " + userData.userName);
        User.findOne({ userName: userData.userName }).exec().then(function(foundUser) {                                     // Query Database for User.                                                                                                
                console.log("Found: " + foundUser.userName + " " + foundUser.password + " " + foundUser.loginHistory);
                bcrypt.compare(userData.password, foundUser.password).then(function() {
                    if (!foundUser) {                                                                                       // If User is not found in database, Reject.
                        console.log(userData.firstName + ": Not Found");
                        reject(userData.firstName + ": Not Found");
                    } else {
                        foundUser.loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });   // Push current date/time to loginHistory local object.
                        User.updateOne(                                                                                      // Update User on database.
                            { userName: userData.userName },
                            { $push: { loginHistory: { dateTime: new Date().toString(), userAgent: userData.userAgent } } }, // Push current date/time to loginHistory on database.
                            { multi: false }
                        ).exec().then(function () {
                            resolve(foundUser);
                        }).catch(function (err) {
                            console.log("There was an error verifying the user: " + err);
                            reject("There was an error verifying the user: " + err);
                        });
                    }
                })
            }).catch(function (err) {
                console.log("There was an error finding user: " + err);
                reject("There was an error finding user: " + err);
            });
    });

    /* return new Promise(function (resolve, reject) {
        console.log("Searching.... " + userData.userName);
        User.findOne({ userName: userData.userName }).exec().then(function(foundUser) {                                 // Query Database for User.                                                                                                
                console.log("Found: " + foundUser.userName + " " + foundUser.password + " " + foundUser.loginHistory);
                if (!foundUser) {                                                                                       // If User is not found in database, Reject.
                    console.log(userData.firstName + ": Not Found");
                    reject(userData.firstName + ": Not Found");
                } else if (foundUser.password != userData.password) {                                                   // Reject if password doesn't match database.
                    console.log("Incorrect Password for user: " + userData.userName);
                    reject("Incorrect Password for user: " + userData.userName);
                } else {
                    foundUser.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});    // Push current date/time to loginHistory local object.
                    User.updateOne(                                                                                     // Update User on database.
                        { userName: userData.userName },
                        { $push: { loginHistory: { dateTime: new Date().toString(), userAgent: userData.userAgent}}},   // Push current date/time to loginHistory on database.
                        { multi: false }
                    ).exec().then(function () {
                        resolve(foundUser);
                    }).catch(function (err) {
                        console.log("There was an error verifying the user: " + err);
                        reject("There was an error verifying the user: " + err);
                    });
                }
            }).catch(function (err) {
                console.log("There was an error finding user: " + err);
                reject("There was an error finding user: " + err);
            });
    }); */
};
/*******************************************************************************/