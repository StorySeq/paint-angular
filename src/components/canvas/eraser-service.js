'use strict';

angular.module('paintAngular')
.service('eraserService', [
  'pencilService',
  function(pencilService) {
    return function(canvasLayers, options) {
      var ctx = canvasLayers.canvas.ctx;
      var pencil = pencilService(canvasLayers, options);
      return {
        start: function (pageX, pageY) {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          pencil.start(pageX, pageY);
        },

        move: function (pageX, pageY) {
          pencil.move(pageX, pageY);
        },

        stop: function (pageX, pageY) {
          pencil.stop(pageX, pageY);
          ctx.restore();
        }
      };
    };
  }
]);
