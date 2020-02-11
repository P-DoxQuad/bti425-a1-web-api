/*********************************************************************************
 * BTI425 – Assignment 1 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including 3rd-party web sites) or distributed to other students. 
 * 
 * Name: Michael Dzura Student ID: 033566100 Date: 11/21/2019 
 * 
 * Online (Heroku) URL: https://bti325-a6-mdzura.herokuapp.com/
 * ********************************************************************************/


// ################################################################################
// Web service setup

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());



// ################################################################################
// Data model and persistent store setup

const manager = require("./manager.js");



app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


// ################################################################################
// Deliver the app's home page to browser clients

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
  
});



// ################################################################################
// Resources available in this web API

app.get("/api", (req, res) => {
  // Here are the resources that are available for users of this web API...
  // YOU MUST EDIT THIS COLLECTION
  const links = [];
  // This app's resources...
  links.push({ "rel": "collection", "href": "/api/vehicles", "methods": "GET,POST" });
  links.push({ "rel": "collection", "href": "/api/vehicles/:vin", "methods": "GET,PUT,DELETE" });
  links.push({ "rel": "collection", "href": "/api/vehicles/:id", "methods": "GET,PUT,DELETE" });
  const linkObject = { 
    "links": links, 
    "apiVersion": "1.0", 
    "apiName": "Vehicle Manager API Version 1" 
  };
  res.json(linkObject);
});



// ################################################################################
// Request handlers for data entities (listeners)

// Get all
app.get("/api/vehicles", function (req, res) {
  // Call the manager method
  manager.vehicleGetAll()
         .then(function (data) {
           res.json(data);
         })
         .catch(function (error) {
          res.status(500).json({ "message": error });
         })
});

// Get one by vin
app.get("/api/vehicles/vin/:id", function (req, res) {
  // Call the manager method
  manager.vehicleGetByVin(req.params.id)
  .then(function (data) {
    res.json(data);
  })
  .catch(function() {
    res.status(404).json({ "message": "Resource not found" });
  })
});

// Get one by id
app.get("/api/vehicles/:id", function (req, res) {
  // Call the manager method
  manager.vehicleGetById(req.params.id)
  .then(function (data) {
    res.json(data);
  })
  .catch(function() {
    res.status(404).json({ "message": "Resource not found" });
  })
});

// Add new
app.post("/api/vehicle", function (req, res) {
  
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  console.log("POSTING data");
  
  // Call the manager method
  manager.vehicleAdd(req.body)
         .then(function(data) {
           res.json(data);
         })
         .catch(function(error) {
            res.status(500).json({ "message": error });
         })
});

// Edit existing
app.put("/api/vehicles/:id", function (req, res) {

  console.log("By ID: " + req.body.id);
  // Make sure that the URL parameter matches the body value
  // This code is customized for the expected shape of the body object
  if (req.body.id != req.body.id) {
    res.status(404).json({ "message": "Resource not found" });
  }
  else {
    // Call the manager method
    manager.vehicleEdit(req.body)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(error) {
       res.status(500).json({ "message": error });
    })
  }
});

// Delete item
app.delete("/api/vehicles/:id", function (req, res) {
  // Call the manager method
  manager.vehicleDelete(req.params.id)
         .then(function(data) {
           res.json(data);
         })
         .catch(function(error) {
            res.status(500).json({ "message": error });
         })
});



// ################################################################################
// Resource not found (this should be at the end)

app.use(function (req, res) {
  res.status(404).send("Resource not found");
});



// ################################################################################
// Tell the app to start listening for requests

app.listen(HTTP_PORT, function() { 
  console.log("Hello, World! Express is ready to handle HTTP requests on port " + HTTP_PORT);
  manager.initialize();
});

