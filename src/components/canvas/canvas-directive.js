"use strict";

angular.module('paintAngular')
.directive('canvasDirective', [
  'pencilService',
  'lineService',
  'rectangleService',
  function(pencilService, lineService, rectangleService) {
    return {
      restrict: 'A',
      scope: {
        settings: '='
      },
      link: function(scope, el, attr) {
        if (!attr.width) throw new Error('width missing');
        if (!attr.height) throw new Error('height missing');

        var width = attr.width;
        var height = attr.height;
        var ctxBgResize = false;
        var ctxResize = false;
        var canvasLayers = {};
        var canvasOffset;

        var modeServices = {
          'pencil': pencilService,
          'line': lineService,
          'rectangle': rectangleService
        };

        var modeDefaults = {
          'pencil': {
            'strokeStyle': '#000000',
            'lineWidth': '3',
            'lineJoin': 'round',
            'lineCap': 'round'
          },
          'shape': {

          },
          'rectangle': {

          }
        };

        el.width(width);
        el.height(height);

        el.addClass('canvas-container');

        var ucFirst = function(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

        // automatically appends each canvas
        // also returns the jQuery object so we can chain events right off the function call.
        // for the tempCanvas we will be setting some extra attributes but don't won't matter
        // as they will be reset on mousedown anyway.
        function createCanvas(name) {
          var newName = (name ? ucFirst(name) : ''),
              canvasName = 'canvas' + newName;

          canvasLayers[canvasName] = {};
          canvasLayers[canvasName]['el'] = document.createElement('canvas');
          canvasLayers[canvasName]['ctx'] = canvasLayers[canvasName]['el'].getContext('2d');
          canvasLayers[canvasName]['$'] = $(canvasLayers[canvasName]['el']);

          canvasLayers[canvasName]['$']
          .attr('class', 'canvas' + (name ? '-' + name : ''))
          .attr('width', width + 'px')
          .attr('height', height + 'px');

          el.append(canvasLayers[canvasName]['$']);

          return canvasLayers[canvasName]['$'];
        }

        // create bg canvasLayers
        createCanvas('bg');

        // create drawing canvas
        createCanvas('');

        // create temp canvas for drawing shapes temporarily
        // before transfering to main canvas
        createCanvas('temp').hide();

        var canvasPageX = function(e) {
          return Math.floor(e.pageX - canvasOffset.left);
        };

        var canvasPageY = function(e) {
          return Math.floor(e.pageY - canvasOffset.top);
        };


        var applyMouseDown = function(mode) {
          var $canvas = canvasLayers['canvas'].$;
          // turn off all previous event listeners
          $canvas.off();

          if (!modeServices[mode]) {
            throw new Error('Unknown mode: ' + mode);
          }
          var options = _.merge({}, modeDefaults[mode], scope.settings.options),
              modeService = modeServices[mode](canvasLayers, options);

          $canvas.on('mousedown touchstart', function(e) {

            canvasOffset = $canvas.offset();

            modeService.start(canvasPageX(e), canvasPageY(e));
            $(document).on('mousemove touchmove', function(e) {
              modeService.move(canvasPageX(e), canvasPageY(e));
            })
            .on('mouseup touchend', function(e) {
              modeService.stop();
              $(document).off('mousemove touchmove mouseup touchend');
            });
          });
        };

        scope.$watch('settings.mode', function(newMode, oldMode) {
          if (oldMode === newMode) return;
          applyMouseDown(newMode);
        });
      }
    }
  }
])
