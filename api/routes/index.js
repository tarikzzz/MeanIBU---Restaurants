var express = require('express');
var router = express.Router();

var ctrlRestaurants = require('../controllers/restaurants.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');


router
  .route('/restaurants')
  .get(ctrlRestaurants.restaurantsGetAll)
  .post(ctrlRestaurants.restaurantsAddOne);

router
  .route('/restaurants/:restaurantId')
  .get(ctrlRestaurants.restaurantsGetOne)
  .put(ctrlRestaurants.restaurantsUpdateOne);



router
  .route('/restaurants/:restaurantId/reviews')
  .get(ctrlReviews.reviewsGetAll)
  .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
  .route('/restaurants/:restaurantId/reviews/:reviewId')
  .get(ctrlReviews.reviewsGetOne)
  .put(ctrlReviews.reviewsUpdateOne);


router
  .route('/users/register')
  .post(ctrlUsers.register);

  router
    .route('/users/login')
    .post(ctrlUsers.login);

module.exports = router;
