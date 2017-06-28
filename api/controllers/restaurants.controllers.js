var mongoose = require('mongoose');
var Restaurant = mongoose.model('Restaurant');


var runGeoQuery = function(req, res) {

  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (isNaN(lng) || isNaN(lat)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, lng and lat must both be numbers"
      });
    return;
  }

  // A geoJSON point
  var point = {
    type : "Point",
    coordinates : [lng, lat]
  };

  var geoOptions = {
    spherical : true,
    maxDistance : 2000,
    num : 5
  };

  Restaurant
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log('Geo Results', results);
      console.log('Geo stats', stats);
      if (err) {
        console.log("Error finding restaurants");
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(results);
      }
    });
};

module.exports.restaurantsGetAll = function(req, res) {
  console.log('Requested by: ' + req.user);
  console.log('GET the restaurants');
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 50;

  if (req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req, res);
    return;
  }

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, count and offset must both be numbers"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
    return;
  }

  Restaurant
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, restaurants) {
      console.log(err);
      console.log(restaurants);
      if (err) {
        console.log("Error finding restaurants");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found restaurants", restaurants.length);
        res
          .json(restaurants);
      }
    });

};

module.exports.restaurantsGetOne = function(req, res) {
  var id = req.params.restaurantId;

  console.log('GET restaurantId', id);

  Restaurant
    .findById(id)
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding restaurant");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("restaurantId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Restaurant ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.restaurantsAddOne = function(req, res) {
  console.log("POST new restaurant");

  Restaurant
    .create({
      name : req.body.name,
      description : req.body.description,
      stars : parseInt(req.body.stars,10),
      services : _splitArray(req.body.services),
      photos : _splitArray(req.body.photos),
      currency : req.body.currency,
      location : {
        address : req.body.address,
        coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      }
    }, function(err, restaurant) {
      if (err) {
        console.log("Error creating restaurant");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Restaurant created!", restaurant);
        res
          .status(201)
          .json(restaurant);
      }
    });

};


module.exports.restaurantsUpdateOne = function(req, res) {
  var restaurantId = req.params.restaurantId;

  console.log('GET restaurantId', restaurantId);

  Restaurant
    .findById(restaurantId)
    .select('-reviews -rooms')
    .exec(function(err, restaurant) {
      if (err) {
        console.log("Error finding restaurant");
        res
          .status(500)
          .json(err);
          return;
      } else if(!restaurant) {
        console.log("RestaurantId not found in database", restaurantId);
        res
          .status(404)
          .lson({
            "message" : "Restaurant ID not found " + restaurantId
          });
          return;
      }

      restaurant.name = req.body.name;
      restaurant.description = req.body.description;
      restaurant.stars = parseInt(req.body.stars,10);
      restaurant.services = _splitArray(req.body.services);
      restaurant.photos = _splitArray(req.body.photos);
      restaurant.currency = req.body.currency;
      restaurant.location = {
        address : req.body.address,
        coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };

      restaurant
        .save(function(err, restaurantUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });


    });

};
