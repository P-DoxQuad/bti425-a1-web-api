/******************************************************************************
 * This module interfaces with MongoDB and performs the respected CRUD        *
 * operations: CREATE, READ, UPDATE, DELETE. Mongoose is used as the          *
 * middleware interface between NodeJS and MongoDB.                           *
 ******************************************************************************/ 

const mongoose = require("mongoose");                                                               // Linking Mongoose module.
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);






const vehicleSchema = require("./vehicle-schema.js");         // Load Schema                                                              // Assigning Mongoose Schema to variable.

//var vehicleManager = mongoose.model("db-a1", vehicleSchema);




/******************************************************************************
 * Initializes Connection to Database                                         *
 ******************************************************************************/
let Vehicles;                                                                           // Collection Properties
module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection("mongodb://dbuser:1234@cluster1-shard-00-00-hc4tf.gcp.mongodb.net:27017,cluster1-shard-00-01-hc4tf.gcp.mongodb.net:27017,cluster1-shard-00-02-hc4tf.gcp.mongodb.net:27017/db-a1?ssl=true&replicaSet=cluster1-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

        db.on('error', function (err) {
            reject(console.log(err.message));                                                                            // If connection error, Reject the promise with the provided error.
        });
        db.once('open', function () {
            Vehicles = db.model("db-a1", vehicleSchema, "vehicles");                                                   // Create a user model from schema above.
            
            resolve(console.log("Database Connected"));
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives list of all vehicles from the Database                           *
 ******************************************************************************/
module.exports.vehicleGetAll = function() {
    console.log("Getting All Vehicles...");
    return new Promise(function(resolve, reject) {
        Vehicles.find()
          //.limit(20)
          .sort({ make: 'asc', model: 'asc', year: 'asc' })
          .exec(function (error, items) {
            if (error) {
              // Query error
              return reject(console.log(error.message));
            }
            // Found, a collection will be returned 
            console.log(items);
            return resolve(JSON.stringify(items));
           
          });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives individual vehicle by VIN from the Database                       *
 ******************************************************************************/
module.exports.vehicleGetByVin = function (vinNum) {
    console.log("Getting Vehicle By VIN...");
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Vehicles.findOne({"vin": vinNum}, function(error, data) {
            if (error) {
                // Find/match is not found
                return reject(error.message);
            }
            // Check for an item
            if (data) {
                // Found, one object will be returned
                return resolve(data);
            } else {
                return reject('Not found');
            }
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Retreives individual vehicle by ID from the Database                       *
 ******************************************************************************/
module.exports.vehicleGetById = function (byId) {
    console.log("Getting Vehicle By ID...");
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Vehicles.findOne({"id": byId}, function(error, data) {
            if (error) {
                // Find/match is not found
                return reject(error.message);
            }
            // Check for an item
            if (data) {
                // Found, one object will be returned
                return resolve(data);
            } else {
                return reject('Not found');
            }
        });
    });
};
/*******************************************************************************/
/******************************************************************************
 * Add Vehicle to the Database                                                *
 ******************************************************************************/
module.exports.vehicleAdd = function (newItem) {
    console.log("Adding Vehicle to Collection...");
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Vehicles.create(newItem, function (error, item) {
            if (error) {
              // Cannot add item
              return reject(console.log(error.message));
            }
            //Added object will be returned
            return resolve(item);
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Edit existing vehicle from the Database                                    *
 ******************************************************************************/
module.exports.vehicleEdit = function (newItem) {
    console.log("Editing Vehicle in Collection...");
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Vehicles.findByIdAndUpdate(newItem._id, newItem, { new: true }, function (error, item) {
            if (error) {
              // Cannot edit item
              return reject(console.log(error.message));
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject(console.log("Not Found!"));
            }
        });
    });
};
/*******************************************************************************/

/******************************************************************************
 * Delete vehicle from the Database                                           *
 ******************************************************************************/
module.exports.vehicleDelete = function (itemId) {
    console.log("Deleting Vehicle By ID...");
    return new Promise(function (resolve, reject) {
        // Find one specific document
        Vehicles.findByIdAndRemove(itemId, function (error) {
            if (error) {
              // Cannot delete item
              return reject(error.message);
            }
            // Return success, but don't leak info
            return resolve();
        });
    });
};
/*******************************************************************************/
