"use strict";

angular.module('paintAngular')
.directive('toolbarDirective', [
  function() {
    return {
      restrict: 'A',
      scope: {
        settings: '='
      },
      templateUrl: 'components/toolbar/toolbar.html',
      link: function(scope, el, attr) {
        scope.activate = function(type, e) {
          if (scope.settings.mode == type) {
            scope.settings.mode = null;
            return;
          }
          scope.settings.mode = type;
        };
      }
    }
  }
]);
