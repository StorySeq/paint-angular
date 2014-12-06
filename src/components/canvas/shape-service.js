angular.module('paintAngular')
.service('shapeService', [
  function() {
    return function(canvasLayers, options) {
      var canvasTempLeftOriginal, canvasTempTopOriginal,
          factor, canvasTempLeftNew, canvasTempTopNew,
          canvas = canvasLayers.canvas,
          canvasTemp = canvasLayers.canvasTemp,
          defaultOptions = {
            fillStyle: '#ffff00',
            strokeStyle: '#FFFF00',
            lineWidth: '3'
          };

      return {
        start: function (pageX, pageY) {
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

          // TODO: set this globally in _drawShapeDown (for some reason colors are being reset due to canvas resize - is there way to permanently set it)
          canvasTemp.ctx.fillStyle = defaultOptions.fillStyle;
          canvasTemp.ctx.strokeStyle = defaultOptions.strokeStyle;
          canvasTemp.ctx.lineWidth = defaultOptions.lineWidth * factor;

          return {
            x: defaultOptions.lineWidth / 2 * factor,
            y: defaultOptions.lineWidth / 2 * factor,
            w: width - defaultOptions.lineWidth * factor,
            h: height - defaultOptions.lineWidth * factor,
            canvasTempLeftOriginal: canvasTempLeftOriginal,
            canvasTempTopOriginal: canvasTempTopOriginal
          }
        },

        stop: function () {
          canvas.ctx.drawImage(canvasTemp.el, canvasTempLeftNew, canvasTempTopNew);
          canvasTemp.$.hide();
        }
      };
    };
  }
]);
