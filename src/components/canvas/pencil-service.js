"use strict";

angular.module('paintAngular')
.service('pencilService', [
  function() {
    return function(canvasLayers, toolSettings) {
      var ctx = canvasLayers.canvas.ctx,
          optionDefaults = {
            'lineColor': '#000000',
            'lineWidth': '3',
            'lineJoin': 'round',
            'lineCap': 'round'
          },
          options = {};
      return {
        start: function (pageX, pageY) {
          // options merged here because toolSettings can change
          _.merge(options, optionDefaults, toolSettings);
          
          ctx.lineJoin = options.lineJoin;
          ctx.lineCap = options.lineCap;
          ctx.strokeStyle = options.lineColor;
          ctx.fillStyle = options.lineColor;
          ctx.lineWidth = options.lineWidth;

          // draw single dot in case of a click without a move
          ctx.beginPath();
          ctx.arc(pageX, pageY, options.lineWidth / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();

          // start the path for a drag
          ctx.beginPath();
          ctx.moveTo(pageX, pageY);
        },

        move: function (pageX, pageY) {
          ctx.lineTo(pageX, pageY);
          ctx.stroke();
        },

        stop: function () {
          ctx.closePath();
        }
      };
    };
  }
]);
