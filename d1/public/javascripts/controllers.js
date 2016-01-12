nodeAngular
  .controller('IndexController', function ($scope, $state, $http, promiseObj) {
    $scope.categorys = promiseObj.data.Data;
  })

  .controller('LoginController', function ($scope, $state, $http) {

  })
  .controller('RegisterController', function ($scope, $state, $http) {

  })