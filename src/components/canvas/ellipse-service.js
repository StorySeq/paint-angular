'use strict';

angular.module('paintAngular')
.service('ellipseService', [
  'shapeService',
  function(shapeService) {
    return function(canvasLayers, toolSettings) {
      var ctxTemp = canvasLayers.temp.ctx,
          optionDefaults = {
            'lineColor': '#000000',
            'fillColor': '#000000',
            'lineWidth': '3'
          },
          options = {},
          shape;

      return {
        start: function (pageX, pageY) {
          _.merge(options, optionDefaults, toolSettings);
          shape = shapeService(canvasLayers, options),
          shape.start(pageX, pageY);
        },

        move: function (pageX, pageY) {
          var calc = shape.move(pageX, pageY);

          ctxTemp.ellipse(calc.x, calc.y, calc.w, calc.h);
          ctxTemp.stroke();
          ctxTemp.fill();
        },

        stop: function (pageX, pageY) {
          shape.stop(pageX, pageY);
        }
      };
    };
  }
]);
