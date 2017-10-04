const express = require('express');
const route = express.Router();
var Promise = require("bluebird");
var db = require("../models").db;
var Place = require("../models").Place;
var Hotel = require("../models").Hotel;
var Restaurant = require("../models").Restaurant;
var Activity = require("../models").Activity;

route.get('/', (req, res, next) => {
    var allAttractions = {};
    
    Hotel.findAll()
    .then(function(hotels) {
      allAttractions.hotels = hotels;
      return Restaurant.findAll();
    })
    .then(function(restaurants) {
      allAttractions.restaurants = restaurants;
      return Activity.findAll();
    })
    .then(function(activities) {
      allAttractions.activities = activities;
    })
    .then(function() {
      res.json(allAttractions);
    })
    .catch(next);
})

module.exports = route;