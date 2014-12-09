'use strict';

angular.module('paintAngular')
.service('lineService', [
  'shapeService',
  function(shapeService) {
    return function(canvasLayers, toolSettings) {
      var ctxTemp = canvasLayers.temp.ctx,
          optionDefaults = {
            'lineColor': '#000000',
            'fillColor': '#000000',
            'lineWidth': '3',
            'lineJoin': 'round'
          },
          options = {},
          shape;

      return {
        start: function (pageX, pageY) {
          options = _.merge({}, optionDefaults, toolSettings);
          shape = shapeService(canvasLayers, options);
          shape.start(pageX, pageY);
        },

        move: function (pageX, pageY) {
          var calc = shape.move(pageX, pageY, 1);

          var xo = calc.canvasTempLeftOriginal;
          var yo = calc.canvasTempTopOriginal;

          if (pageX < xo) { calc.x = calc.x + calc.w; calc.w = calc.w * - 1; }
          if (pageY < yo) { calc.y = calc.y + calc.h; calc.h = calc.h * - 1; }

          ctxTemp.lineJoin = options.lineJoin;
          ctxTemp.beginPath();
          ctxTemp.moveTo(calc.x, calc.y);
          ctxTemp.lineTo(calc.x + calc.w, calc.y + calc.h);
          ctxTemp.closePath();
          ctxTemp.stroke();
        },

        stop: function (pageX, pageY) {
          shape.stop(pageX, pageY);
        }
      };
    };
  }
]);
