"use strict";

angular.module('paintAngular')
.directive('canvasDirective', [
  'touchEventFactory',
  'pencilService',
  'lineService',
  'rectangleService',
  'ellipseService',
  'eraserService',
  function(
    touchEventFactory, pencilService, lineService, rectangleService,
    ellipseService, eraserService
  ) {
    return {
      restrict: 'A',
      scope: {
        settings: '=',
        toolSettings: '='
      },
      link: function(scope, el, attr) {
        if (!scope.settings.width) throw new Error('width missing');
        if (!scope.settings.height) throw new Error('height missing');

        var width = scope.settings.width;
        var height = scope.settings.height;
        var ctxBgResize = false;
        var ctxResize = false;
        var canvasLayers = {};
        var canvasOffset;
        var imageStretch = false;

        var modeServices = {
          'pencil': pencilService,
          'line': lineService,
          'rectangle': rectangleService,
          'ellipse': ellipseService,
          'eraser': eraserService
        };

        var modeDefaults = {
          'pencil': {
            'strokeStyle': '#000000',
            'lineWidth': '3',
            'lineJoin': 'round',
            'lineCap': 'round'
          },
          'shape': {},
          'rectangle': {},
          'ellipse': {}
        };

        modeDefaults.eraser = modeDefaults.pencil

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

          if (!mode) {
            return;
          }

          if (!modeServices[mode]) {
            throw new Error('Unknown mode: ' + mode);
          }
          var options = _.merge({}, modeDefaults[mode], scope.settings.options),
              modeService = modeServices[mode](canvasLayers, scope.toolSettings);

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
              scope.$emit('canvas-directive-new-drawing', getImage(false));
              scope.$apply();
            });
          });
        };

        var getImage = function (withBg) {
          var canvasSave = document.createElement('canvas'),
          ctxSave = canvasSave.getContext('2d');

          withBg = withBg === false ? false : true;

          $(canvasSave)
          .css({display: 'none', position: 'absolute', left: 0, top: 0})
          .attr('width', width)
          .attr('height', height);


          if (withBg) { ctxSave.drawImage(canvasBg, 0, 0); }
          ctxSave.drawImage(canvasLayers.canvas.el, 0, 0);

          return canvasSave.toDataURL();
        };

        var setImage = function (img, ctxType, resize, notUndo) {
          if (!img) return;

          var _this = this,
          myImage = null,
          ctx = '';

          function loadImage() {
            var ratio = 1, xR = 0, yR = 0, x = 0, y = 0, w = myImage.width, h = myImage.height;

            if (!resize) {
              // get width/height
              if (myImage.width > width || myImage.height > height || imageStretch) {
                xR = width / myImage.width;
                yR = height / myImage.height;

                ratio = xR < yR ? xR : yR;

                w = myImage.width * ratio;
                h = myImage.height * ratio;
              }

              // get left/top (centering)
              x = (width - w) / 2;
              y = (height - h) / 2;
            }

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(myImage, x, y, w, h);

            // wtf?
            // _this[ctxType + 'Resize'] = false;

            // Default is to run the undo.
            // If it's not to be run set it the flag to true.
            // if (!notUndo) {
            //   addUndo();
            // }
          }

          ctx = canvasLayers.canvas.ctx;

          if (window.rgbHex(img)) {
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = img;
            ctx.rect(0, 0, this.width, this.height);
            ctx.fill();
          }
          else {
            myImage = new Image();
            myImage.src = img.toString();
            $(myImage).load(loadImage);
          }
        };

        scope.$watch('settings.mode', function(newMode, oldMode) {
          if (oldMode === newMode) return;
          applyMouseDown(newMode);
        });

        scope.$on('history-change', function(data, image) {
          setImage(image, null, null);
        });

        scope.$emit('canvas-directive-empty-canvas', getImage(false));
      }
    }
  }
]);
