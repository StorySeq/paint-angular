'use strict';

angular.module('paintAngular', ['ngTouch', 'ngSanitize', 'ui.router', 'colorpicker.module'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
