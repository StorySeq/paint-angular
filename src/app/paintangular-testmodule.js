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
    templateUrl: 'app/paintangular.html',
    controller: 'PaintAngularController'
  });

  $urlRouterProvider.otherwise('/');
});
