"use strict";

angular.module('paintAngular')
.directive('canvasDirective', [
  'touchEventFactory',
  'canvasService',
  'pencilService',
  'lineService',
  'rectangleService',
  'ellipseService',
  'eraserService',
  'fillService',
  function(
    touchEventFactory, canvasService, pencilService, lineService, rectangleService,
    ellipseService, eraserService, fillService
  ) {
    return {
      restrict: 'A',
      scope: {
        settings: '=',
        toolSettings: '='
      },
      link: function(scope, el) {
        if (!scope.settings.width) { throw new Error('width missing'); }
        if (!scope.settings.height) { throw new Error('height missing'); }

        var dimensions = scope.settings,
            canvasLayers = {},
            canvasOffset,
            modeServices = {
              'pencil': pencilService,
              'line': lineService,
              'rectangle': rectangleService,
              'ellipse': ellipseService,
              'eraser': eraserService,
              'fill': fillService
            };

        el.width(dimensions.width);
        el.height(dimensions.height);

        el.addClass('canvas-container');

        // automatically appends each canvas
        // also returns the jQuery object so we can chain events right off the function call.
        // for the tempCanvas we will be setting some extra attributes but don't won't matter
        // as they will be reset on mousedown anyway.
        function createCanvas(name) {
          canvasLayers[name] = {};
          canvasLayers[name].el = document.createElement('canvas');
          canvasLayers[name].ctx = canvasLayers[name].el.getContext('2d');
          canvasLayers[name].$ = $(canvasLayers[name].el);

          canvasLayers[name].$
          .attr('class', 'canvas' + (name ? '-' + name : ''))
          .attr('width', dimensions.width + 'px')
          .attr('height', dimensions.height + 'px');

          el.append(canvasLayers[name].$);

          return canvasLayers[name].$;
        }

        // create bg canvasLayers
        createCanvas('bg');

        // create drawing canvas
        createCanvas('canvas');

        // create temp canvas for drawing shapes temporarily
        // before transfering to main canvas
        createCanvas('temp').hide();

        canvasService.init(canvasLayers, dimensions);

        var canvasPageX = function(e) {
          return Math.floor(e.pageX - canvasOffset.left);
        };

        var canvasPageY = function(e) {
          return Math.floor(e.pageY - canvasOffset.top);
        };


        var applyMouseDown = function(mode) {
          var $canvas = canvasLayers.canvas.$;
          // turn off all previous event listeners
          $canvas.off();

          if (!mode) {
            return;
          }

          if (!modeServices[mode]) {
            throw new Error('Unknown mode: ' + mode);
          }
          var modeService = modeServices[mode](canvasLayers, scope.toolSettings);

          $canvas.on('mousedown touchstart', function(e) {
            canvasOffset = $canvas.offset();
            e = touchEventFactory(e);

            modeService.start(canvasPageX(e), canvasPageY(e));
            $(document).on('mousemove touchmove', function(e) {
              e.preventDefault();
              e = touchEventFactory(e);
              modeService.move(canvasPageX(e), canvasPageY(e));
            })
            .on('mouseup touchend', function(e) {
              modeService.stop();
              $(document).off('mousemove touchmove mouseup touchend');
              scope.$emit('canvas-directive-new-drawing', canvasService.getImage(false));
              scope.$apply();
            });
          });
        };

        scope.$watch('settings.mode', function(newMode, oldMode) {
          if (oldMode === newMode) { return; }
          applyMouseDown(newMode);
        });

        scope.$on('history-change', function(data, image) {
          canvasService.setImage(image);
        });

        scope.$emit('canvas-directive-empty-canvas', canvasService.getImage(false));
      }
    };
  }
]);
