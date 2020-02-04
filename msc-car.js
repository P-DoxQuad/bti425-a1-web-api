
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var vehicleSchema = new Schema({
  id: Number,
  make: String,
  model: String,
  colour: String,
  year: Number,
  vin: String,
  msrp: Number,
  photo: String,
  description: String,
  purchaseDate: Date,
  purchaserName: String,
  purchaserEmail: String,
  pricePaid: Number
});

// Make schema available to the application
module.exports = vehicleSchema;
