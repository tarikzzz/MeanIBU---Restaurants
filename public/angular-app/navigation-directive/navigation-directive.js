angular.module('meanIBU').directive('mrNavigation', mrNavigation);

function mrNavigation() {
  return {
    restrict: 'E',
    templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
  };
}
