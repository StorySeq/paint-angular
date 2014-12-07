'use strict';

angular.module('paintAngular')
.controller('MainCtrl', [
  '$scope',
  '$timeout',
  function ($scope, $timeout) {
    $scope.canvasSettings = {
      width: 500,
      height: 300
    };

    $scope.history = {
      current: 0,
      images: [],
      max: 16,
      emptyImage: null
    };

    var history = $scope.history;

    var changeHistory = function() {
      $scope.$broadcast('history-change', history.images[history.current]);
    };

    var addUndo = function (image) {
      // delete future entries if user decides to draw after undo
      if (history.current < history.images.length - 1) {
        history.images.splice(history.current + 1, history.images.length);
      }
      history.images.push(image);
      if (history.images.length > history.max) {
        history.images = history.images.slice(1, history.images.length);
      }
    };

    $scope.$on('canvas-directive-new-drawing', function(data, image) {
      $timeout(function() {
        addUndo(image);
        history.current = history.images.length - 1;
      });
    });

    $scope.$on('canvas-directive-empty-canvas', function(data, image) {
      history.emptyImage = image;
      history.images.push(image);
    });

    $scope.$on('toolbar-directive-undo', function() {
      --history.current;
      changeHistory();
    });

    $scope.$on('toolbar-directive-redo', function() {
      ++history.current;
      changeHistory();
    });
  }
]);
