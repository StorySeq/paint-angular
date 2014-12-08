'use strict';

angular.module('paintAngularTestModule', [
  'ngTouch',
  'ngSanitize',
  'ui.router',
  'colorpicker.module',
  'paintAngular'
])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });

  $urlRouterProvider.otherwise('/');
});
