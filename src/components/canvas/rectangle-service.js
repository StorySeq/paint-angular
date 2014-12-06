
angular.module('paintAngular')
.service('rectangleService', [
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
          calc = shape.move(pageX, pageY);

          ctxTemp.rect(calc.x, calc.y, calc.w, calc.h);
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
