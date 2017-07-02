angular.module('meanIBU').controller('RestaurantsController', RestaurantsController);

function RestaurantsController(restaurantDataFactory) {
  var vm = this;
  vm.title = 'Restaurant App';
  restaurantDataFactory.restaurantList().then(function(response) {
    vm.restaurants = response.data;
  });
}
