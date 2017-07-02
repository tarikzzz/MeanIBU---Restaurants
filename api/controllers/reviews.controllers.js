var mongoose = require('mongoose');
var Restaurant = mongoose.model('Restaurant');


// GET all reviews for a restaurant
module.exports.reviewsGetAll = function(req, res) {
  var id = req.params.restaurantId;
  console.log('GET reviews for restaurantId', id);

  Restaurant
    .findById(id)
    .select('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding restaurant");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Restaurant id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Restaurant ID not found " + id
        };
      } else {
        response.message = doc.reviews ? doc.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

// GET single review for a restaurant
module.exports.reviewsGetOne = function(req, res) {
  var restaurantId = req.params.restaurantId;
  var reviewId = req.params.reviewId;
  console.log('GET reviewId ' + reviewId + ' for restaurantId ' + restaurantId);

  Restaurant
    .findById(restaurantId)
    .select('reviews')
    .exec(function(err, restaurant) {
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding restaurant");
        response.status = 500;
        response.message = err;
      } else if(!restaurant) {
        console.log("Restaurant id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Restaurant ID not found " + id
        };
      } else {
        // Get the review
        response.message = restaurant.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _addReview = function (req, res, restaurant) {
  restaurant.reviews.push({
    name : req.body.name,
    rating : parseInt(req.body.rating, 10),
    review : req.body.review
  });

  restaurant.save(function(err, restaurantUpdated) {
    if (err) {
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(200)
        .json(restaurantUpdated.reviews[restaurantUpdated.reviews.length - 1]);
    }
  });

};

module.exports.reviewsAddOne = function(req, res) {

  var id = req.params.restaurantId;

  console.log('POST review to restaurantId', id);

  Restaurant
    .findById(id)
    .select('reviews')
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
        console.log("RestaurantId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Restaurant ID not found " + id
        };
      }
      if (doc) {
        _addReview(req, res, doc);
      } else {
        res
          .status(response.status)
          .json(response.message);
      }
    });


};


module.exports.reviewsUpdateOne = function(req, res) {
  var restaurantId = req.params.restaurantId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for restaurantId ' + restaurantId);

  Restaurant
    .findById(restaurantId)
    .select('reviews')
    .exec(function(err, restaurant) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding restaurant");
        response.status = 500;
        response.message = err;
      } else if(!restaurant) {
        console.log("Restaurant id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Restaurant ID not found " + id
        };
      } else {
        // Get the review
        thisReview = restaurant.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        restaurant.save(function(err, restaurantUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};
