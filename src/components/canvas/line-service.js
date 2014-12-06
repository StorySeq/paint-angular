
angular.module('paintAngular')
.service('lineService', [
  'shapeService',
  function(shapeService) {
    return function(canvasLayers, options) {
      var ctxTemp = canvasLayers.canvasTemp.ctx;
      var shape = shapeService(canvasLayers, options);
      return {
        start: function (pageX, pageY) {
          shape.start(pageX, pageY);
        },

        move: function (pageX, pageY) {
          var calc = shape.move(pageX, pageY, 1);

          var xo = calc.canvasTempLeftOriginal;
          var yo = calc.canvasTempTopOriginal;

          if (pageX < xo) { calc.x = calc.x + calc.w; calc.w = calc.w * - 1; }
          if (pageY < yo) { calc.y = calc.y + calc.h; calc.h = calc.h * - 1; }

          ctxTemp.lineJoin = 'round';
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
