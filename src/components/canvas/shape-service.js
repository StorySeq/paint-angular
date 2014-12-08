'use strict';

angular.module('paintAngular')
.service('shapeService', [
  function() {
    return function(canvasLayers, toolSettings) {
      var canvasTempLeftOriginal, canvasTempTopOriginal,
          factor, canvasTempLeftNew, canvasTempTopNew,
          canvas = canvasLayers.canvas,
          canvasTemp = canvasLayers.canvasTemp,
          defaultOptions = {
            fillColor: '#000000',
            lineColor: '#000000',
            lineWidth: '3'
          },
          options = {};

      return {
        start: function (pageX, pageY) {
          _.merge(options, defaultOptions, toolSettings);
          // the pagex and y values here were strangly written uppercase in the
          // orig source
          canvasTemp.$
          .css({left: pageX, top: pageY})
          .attr('width', 0)
          .attr('height', 0)
          .show();

          canvasTempLeftOriginal = pageX;
          canvasTempTopOriginal = pageY;
        },

        move: function (pageX, pageY, factor) {
          var xo = canvasTempLeftOriginal,
              yo = canvasTempTopOriginal;

          // we may need these in other funcs, so we'll just pass them along with the event
          factor = factor || 2;
          var left = (pageX < xo ? pageX : xo);
          var top = (pageY < yo ? pageY : yo);
          var width = Math.abs(pageX - xo);
          var height = Math.abs(pageY - yo);

          canvasTemp.$
          .css({left: left, top: top})
          .attr('width', width)
          .attr('height', height);

          // store these for later to use in our "up" call
          canvasTempLeftNew = left;
          canvasTempTopNew = top;

          factor = factor || 2;

          if (options.fillColorEnabled) {
            canvasTemp.ctx.fillStyle = options.fillColor;
          } else {
            canvasTemp.ctx.fillStyle = 'rgba(0,0,0,0.0)';
          }
          if (options.lineColorEnabled) {
            canvasTemp.ctx.strokeStyle = options.lineColor;
          } else {
            canvasTemp.ctx.strokeStyle = 'rgba(0,0,0,0.0)';
          }
          canvasTemp.ctx.lineWidth = options.lineWidth * factor;

          return {
            x: options.lineWidth / 2 * factor,
            y: options.lineWidth / 2 * factor,
            w: width - options.lineWidth * factor,
            h: height - options.lineWidth * factor,
            canvasTempLeftOriginal: canvasTempLeftOriginal,
            canvasTempTopOriginal: canvasTempTopOriginal
          };
        },

        stop: function () {
          canvas.ctx.drawImage(canvasTemp.el, canvasTempLeftNew, canvasTempTopNew);
          canvasTemp.$.hide();
        }
      };
    };
  }
]);
