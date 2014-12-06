
angular.module('paintAngular')
.service('ellipseService', [
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
