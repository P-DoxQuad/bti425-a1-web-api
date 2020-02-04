


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
const mgr = manager();



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
  links.push({ "rel": "collection", "href": "/api/cars", "methods": "GET,POST" });
  // Example resources...
  links.push({ "rel": "collection", "href": "/api/customers", "methods": "GET,POST" });
  links.push({ "rel": "collection", "href": "/api/employees", "methods": "GET,POST" });
  const linkObject = { 
    "links": links, 
    "apiVersion": "1.0", 
    "apiName": "Web API example version 6" 
  };
  res.json(linkObject);
});



// ################################################################################
// Request handlers for data entities (listeners)

// Get all
app.get("/api/vehicles", (req, res) => {
  // Call the manager method
  res.json(mgr.vehicleGetAll());
});

// Get one
app.get("/api/vehicles/:id", (req, res) => {
  // Call the manager method
  let vehicleID = mgr.vehicleGetById(req.params.id);
  // Return the appropriate result
  // Longer if-else formgr...
  if (vehicleID) {
    res.json(vehicleID);
  }
  else {
    res.status(404).json({ "message": "Resource not found" });
  }
});

// Add new
app.post("/api/vehicles", (req, res) => {
  // Call the manager method
  // MUST return HTTP 201
  res.status(201).json(mgr.vehicleAdd(req.body));
});

// Edit existing
app.put("/api/cars/:id", (req, res) => {
  // Make sure that the URL parameter matches the body value
  // This code is customized for the expected shape of the body object
  if (req.params.id != req.body.id) {
    res.status(404).json({ "message": "Resource not found" });
  }
  else {
    // Call the manager method
    let editVehicle = mgr.vehicleEdit(req.body);
    // Return the appropriate result
    if (editVehicle) {
      res.json(editVehicle);

    } else {
      res.status(404).json({ "message": "Resource not found" });
    }
  }
});

// Delete item
app.delete("/api/cars/:id", (req, res) => {
  // Call the manager method
  mgr.vehicleDelete(req.params.id)
  // MUST return HTTP 204
  res.status(204).end();
});



// ################################################################################
// Resource not found (this should be at the end)

app.use((req, res) => {
  res.status(404).send("Resource not found");
});



// ################################################################################
// Tell the app to start listening for requests

app.listen(HTTP_PORT, function() { 
  console.log("Hello, World! Express is ready to handle HTTP requests on port " + HTTP_PORT) });
