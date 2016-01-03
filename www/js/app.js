// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  })
})
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('routes', {
    url: '/routes',
    templateUrl: 'templates/routes.html',
    controller: 'RoutesCtrl'
  })
  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })
  .state('destination', {
    url: '/destination/:stopId',
    templateUrl: 'templates/destination.html',
    controller: 'DestCtrl'
  })
  .state('confirm', {
    url: '/confirm/:stopId/:destId',
    templateUrl: 'templates/confirm.html',
    controller: 'ConfirmCtrl'
  })
})

//Destination
.controller('DestCtrl', function($scope, RouteService, $location, $stateParams) {
  console.log('Dest', $stateParams.stopId);
  //var path = $location.path().split('/');
  //var stopId = path[path.length-1];
  //console.log(path[path.length-1]);
  var stopId = $stateParams.stopId;

  RouteService.getRoutes()
      .then(function(res) {
        $scope.data = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });

  RouteService.getStopInfo(stopId)
      .then(function(res) {
        $scope.stop = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });

  $scope.go = function (path) {
    console.log(path);
    $location.path(path);
  };
})
//Home
.controller('HomeCtrl', function($scope) {
  console.log('home');
})
//Routes
.controller('RoutesCtrl', function($scope, $http, RouteService, $location) {
  console.log('routes');

  RouteService.getRoutes()
    .then(function(res) {
      console.log(res);
      $scope.data = res.data;
    })
    .catch(function(err) {
      console.log(err);
  });

  $scope.go = function(path) {
    console.log(path);
    $location.path(path);
  };

})
//Confirm
.controller('ConfirmCtrl', function($scope, $stateParams, RouteService) {
  console.log($stateParams);;
  var params = $stateParams;
  var stopId;
  $scope.success = false

  RouteService.getStopInfo($stateParams.stopId)
      .then(function(res) {
        $scope.start = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });

  RouteService.getStopInfo($stateParams.destId)
      .then(function(res) {
        $scope.stop = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });

  $scope.confirmTrip = function(stopId) {
    RouteService.confirmTrip(stopId)
        .then(function(res) {
          console.log(res)
          $scope.success = true;
        })
        .catch(function(err) {
          console.log(err)
        })
  }
})
.factory('RouteService', function($http, $q) {
  var deferred = $q.defer();
  return {

    getRoutes: function() {
      return $http.get('http://159.203.212.140:3000/v1/ericsson/route/')
          .success(function(res) {
            console.log(res, 'from factory');
            deferred.resolve(res);
          })
          .error(function(err) {
            console.log(err);
            deferred.reject(err)
          })
        return deferred.promise;
    },

    getStopInfo: function(stopId) {
      {
        return $http.get('http://159.203.212.140:3000/v1/ericsson/route/' + stopId)
            .success(function(res) {
              console.log(res, 'from factory');
              deferred.resolve(res);
            })
            .error(function(err) {
              console.log(err);
              deferred.reject(err)
            })
        return deferred.promise;
      }
    },

    confirmTrip: function(stopId) {
      return $http.post('http://159.203.212.140:3000/v1/ericsson/route/' + stopId)
          .success(function(res) {
            console.log(res);
          })
          .error(function(err) {
            console.log(err);
          });
    }
  }

})
