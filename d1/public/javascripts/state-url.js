var nodeAngular = angular.module('nodeAngular', ['ui.router', 'ngFileUpload', 'ngResource']);

nodeAngular
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
      .state('index', {
        url: '/index',
        templateUrl: 'template/indexMain.html',
        controller: 'IndexController',
        resolve: {
          promiseObj: function($http) {
            // $http returns a promise for the url data
            return $http({
              method: 'GET',
              //url: g.gurl + g.news +
              url: 'data/categorys.json'
            });
          }
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'template/login.html',
        controller: 'LoginController'
      })

      .state('register', {
        url: '/register',
        templateUrl: 'template/register.html',
        controller: 'RegisterController'
      })
  });