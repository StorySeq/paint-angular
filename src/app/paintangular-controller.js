'use strict';

angular.module('paintAngular')
.controller('PaintAngularController', [
  '$scope',
  function ($scope) {
    $scope.canvasSettings = {
      width: 500,
      height: 300
    };

    $scope.toolSettings = {
      lineWidth: 1,
      lineColor: '#000000',
      lineColorEnabled: true,
      fillColor: '#000000',
      fillColorEnabled: true
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
      addUndo(image);
      history.current = history.images.length - 1;
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
