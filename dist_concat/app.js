/*! rgbHex - v1.1.2 - 2013-09-27 */window.rgbHex=function(){function a(a){return!isNaN(parseFloat(a))&&isFinite(a)}function b(a){return a.replace(/^\s+|\s+$/g,"")}function c(c){return c=b(c),a(c)&&c>=0&&255>=c}function d(a){return/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(b(a))}function e(a){return a=parseInt(a,10).toString(16),1===a.length?"0"+a:a}function f(a){return parseInt(a,16).toString()}function g(b){return b=b.split(","),(3===b.length||4===b.length)&&c(b[0])&&c(b[1])&&c(b[2])?4!==b.length||a(b[3])?"#"+e(b[0]).toUpperCase()+e(b[1]).toUpperCase()+e(b[2]).toUpperCase():null:null}function h(a){return d(a)?(3===a.length&&(a=a.charAt(0)+a.charAt(0)+a.charAt(1)+a.charAt(1)+a.charAt(2)+a.charAt(2)),"rgb("+f(a.substr(0,2))+","+f(a.substr(2,2))+","+f(a.substr(4,2))+")"):void 0}function i(a){return a.replace(/\s/g,"")}return function(a){if(!a)return null;var c=null,d=/^rgba?\((.*)\);?$/,e=/^#/;return a=b(a.toString()),"transparent"===a||"rgba(0,0,0,0)"===i(a)?"transparent":d.test(a)?g(a.match(d)[1]):e.test(a)?h(a.split("#").reverse()[0]):(c=a.split(","),1===c.length?h(a):3===c.length||4===c.length?g(a):void 0)}}(),jQuery&&jQuery.extend({rgbHex:function(a){return window.rgbHex(a)}});

!function(){window.CanvasRenderingContext2D&&(CanvasRenderingContext2D.prototype.diamond=function(a,b,c,d){return a&&b&&c&&d?(this.beginPath(),this.moveTo(a+.5*c,b),this.lineTo(a,b+.5*d),this.lineTo(a+.5*c,b+d),this.lineTo(a+c,b+.5*d),this.lineTo(a+.5*c,b),this.closePath(),void 0):!0}),window.CanvasRenderingContext2D&&(CanvasRenderingContext2D.prototype.ellipse=function(a,b,c,d){if(!(a&&b&&c&&d))return!0;var e=.5522848,f=c/2*e,g=d/2*e,h=a+c,i=b+d,j=a+c/2,k=b+d/2;this.beginPath(),this.moveTo(a,k),this.bezierCurveTo(a,k-g,j-f,b,j,b),this.bezierCurveTo(j+f,b,h,k-g,h,k),this.bezierCurveTo(h,k+g,j+f,i,j,i),this.bezierCurveTo(j-f,i,a,k+g,a,k),this.closePath()}),window.CanvasRenderingContext2D&&(CanvasRenderingContext2D.prototype.hexagon=function(a,b,c,d){if(!(a&&b&&c&&d))return!0;var e=.225,f=1-e;this.beginPath(),this.moveTo(a+.5*c,b),this.lineTo(a,b+d*e),this.lineTo(a,b+d*f),this.lineTo(a+.5*c,b+d),this.lineTo(a+c,b+d*f),this.lineTo(a+c,b+d*e),this.lineTo(a+.5*c,b),this.closePath()}),window.CanvasRenderingContext2D&&(CanvasRenderingContext2D.prototype.pentagon=function(a,b,c,d){return a&&b&&c&&d?(this.beginPath(),this.moveTo(a+c/2,b),this.lineTo(a,b+.4*d),this.lineTo(a+.2*c,b+d),this.lineTo(a+.8*c,b+d),this.lineTo(a+c,b+.4*d),this.lineTo(a+c/2,b),this.closePath(),void 0):!0}),window.CanvasRenderingContext2D&&(CanvasRenderingContext2D.prototype.roundedRect=function(a,b,c,d,e){return a&&b&&c&&d?(e||(e=5),this.beginPath(),this.moveTo(a+e,b),this.lineTo(a+c-e,b),this.quadraticCurveTo(a+c,b,a+c,b+e),this.lineTo(a+c,b+d-e),this.quadraticCurveTo(a+c,b+d,a+c-e,b+d),this.lineTo(a+e,b+d),this.quadraticCurveTo(a,b+d,a,b+d-e),this.lineTo(a,b+e),this.quadraticCurveTo(a,b,a+e,b),this.closePath(),void 0):!0})}();
'use strict';

angular.module('paintAngular', ['ngTouch', 'ngSanitize', 'ui.router', 'colorpicker.module']);

'use strict';

angular.module('paintAngular')
.controller('PaintAngularController', [
  '$scope',
  function ($scope) {
    $scope.canvasSettings = {
      width: 500,
      height: 300
    };

    $scope.toolSettings = {
      lineWidth: 1,
      lineColor: '#000000',
      lineColorEnabled: true,
      fillColor: '#000000',
      fillColorEnabled: true
    };

    $scope.history = {
      current: 0,
      images: [],
      max: 16,
      emptyImage: null
    };

    var history = $scope.history;

    var changeHistory = function() {
      $scope.$broadcast('history-change', history.images[history.current]);
    };

    var addUndo = function (image) {
      // delete future entries if user decides to draw after undo
      if (history.current < history.images.length - 1) {
        history.images.splice(history.current + 1, history.images.length);
      }
      history.images.push(image);
      if (history.images.length > history.max) {
        history.images = history.images.slice(1, history.images.length);
      }
    };

    $scope.$on('canvas-directive-new-drawing', function(data, image) {
      addUndo(image);
      history.current = history.images.length - 1;
    });

    $scope.$on('canvas-directive-empty-canvas', function(data, image) {
      history.emptyImage = image;
      history.images.push(image);
    });

    $scope.$on('toolbar-directive-undo', function() {
      --history.current;
      changeHistory();
    });

    $scope.$on('toolbar-directive-redo', function() {
      ++history.current;
      changeHistory();
    });
  }
]);

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
  function(
    touchEventFactory, canvasService, pencilService, lineService, rectangleService,
    ellipseService, eraserService
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

        var width = scope.settings.width,
            height = scope.settings.height,
            canvasLayers = {},
            canvasOffset,
            modeServices = {
              'pencil': pencilService,
              'line': lineService,
              'rectangle': rectangleService,
              'ellipse': ellipseService,
              'eraser': eraserService
            },
            ucFirst = function(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            };

        el.width(width);
        el.height(height);

        el.addClass('canvas-container');

        // automatically appends each canvas
        // also returns the jQuery object so we can chain events right off the function call.
        // for the tempCanvas we will be setting some extra attributes but don't won't matter
        // as they will be reset on mousedown anyway.
        function createCanvas(name) {
          var newName = (name ? ucFirst(name) : ''),
              canvasName = 'canvas' + newName;

          canvasLayers[canvasName] = {};
          canvasLayers[canvasName].el = document.createElement('canvas');
          canvasLayers[canvasName].ctx = canvasLayers[canvasName].el.getContext('2d');
          canvasLayers[canvasName].$ = $(canvasLayers[canvasName].el);

          canvasLayers[canvasName].$
          .attr('class', 'canvas' + (name ? '-' + name : ''))
          .attr('width', width + 'px')
          .attr('height', height + 'px');

          el.append(canvasLayers[canvasName].$);

          return canvasLayers[canvasName].$;
        }

        // create bg canvasLayers
        createCanvas('bg');

        // create drawing canvas
        createCanvas('');

        // create temp canvas for drawing shapes temporarily
        // before transfering to main canvas
        createCanvas('temp').hide();

        canvasService.init(canvasLayers, width, height);

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
          canvasService.setImage(image, null, null);
        });

        scope.$emit('canvas-directive-empty-canvas', canvasService.getImage(false));
      }
    };
  }
]);

'use strict';

angular.module('paintAngular')
.service('canvasService', [
  function() {
    var _canvasLayers = null,
        _listeners = {},
        _imageStretch = false,
        _width = null,
        _height = null;

    function fire(event, params) {
      var listeners = _listeners[event];
      if (!listeners) { return; }

      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(this, params);
      }
    }

    return {
      init: function(canvasLayers, width, height) {
        _canvasLayers = canvasLayers;
        _width = width;
        _height = height;
        fire('initialized');
      },
      isInitialized: function() {
        return _canvasLayers !== null;
      },
      getImage: function (withBg) {
        var canvasSave = document.createElement('canvas'),
        ctxSave = canvasSave.getContext('2d');

        withBg = withBg === false ? false : true;

        $(canvasSave)
        .css({display: 'none', position: 'absolute', left: 0, top: 0})
        .attr('width', _width)
        .attr('height', _height);


        if (withBg) { ctxSave.drawImage(_canvasLayers.bg.el, 0, 0); }
        ctxSave.drawImage(_canvasLayers.canvas.el, 0, 0);

        return canvasSave.toDataURL();
      },
      setImage: function (img, ctxType, resize, notUndo) {
        if (!img) { return; }

        var myImage = null,
            ctx = '';

        function loadImage() {
          var ratio = 1, xR = 0, yR = 0, x = 0, y = 0, w = myImage.width, h = myImage.height;

          if (!resize) {
            // get width/height
            if (myImage.width > _width || myImage.height > _height || _imageStretch) {
              xR = _width / myImage.width;
              yR = _height / myImage.height;

              ratio = xR < yR ? xR : yR;

              w = myImage.width * ratio;
              h = myImage.height * ratio;
            }

            // get left/top (centering)
            x = (_width - w) / 2;
            y = (_height - h) / 2;
          }

          ctx.clearRect(0, 0, _width, _height);
          ctx.drawImage(myImage, x, y, w, h);

          // wtf?
          // _this[ctxType + 'Resize'] = false;
        }

        ctx = _canvasLayers.canvas.ctx;

        if (window.rgbHex(img)) {
          ctx.clearRect(0, 0, _width, _height);
          ctx.fillStyle = img;
          ctx.rect(0, 0, _width, _height);
          ctx.fill();
        }
        else {
          myImage = new Image();
          myImage.src = img.toString();
          $(myImage).load(loadImage);
        }
      }
    }
  }
]);

'use strict';

angular.module('paintAngular')
.service('ellipseService', [
  'shapeService',
  function(shapeService) {
    return function(canvasLayers, toolSettings) {
      var ctxTemp = canvasLayers.canvasTemp.ctx,
          optionDefaults = {
            'lineColor': '#000000',
            'fillColor': '#000000',
            'lineWidth': '3'
          },
          options = {},
          shape;

      return {
        start: function (pageX, pageY) {
          _.merge(options, optionDefaults, toolSettings);
          shape = shapeService(canvasLayers, options),
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

'use strict';

angular.module('paintAngular')
.service('lineService', [
  'shapeService',
  function(shapeService) {
    return function(canvasLayers, toolSettings) {
      var ctxTemp = canvasLayers.canvasTemp.ctx,
          optionDefaults = {
            'lineColor': '#000000',
            'fillColor': '#000000',
            'lineWidth': '3',
            'lineJoin': 'round'
          },
          options = {},
          shape;

      return {
        start: function (pageX, pageY) {
          options = _.merge({}, optionDefaults, toolSettings);
          shape = shapeService(canvasLayers, options);
          shape.start(pageX, pageY);
        },

        move: function (pageX, pageY) {
          var calc = shape.move(pageX, pageY, 1);

          var xo = calc.canvasTempLeftOriginal;
          var yo = calc.canvasTempTopOriginal;

          if (pageX < xo) { calc.x = calc.x + calc.w; calc.w = calc.w * - 1; }
          if (pageY < yo) { calc.y = calc.y + calc.h; calc.h = calc.h * - 1; }

          ctxTemp.lineJoin = options.lineJoin;
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

'use strict';

angular.module('paintAngular')
.service('rectangleService', [
  'shapeService',
  function(shapeService) {
    return function(canvasLayers, toolSettings) {
      var ctxTemp = canvasLayers.canvasTemp.ctx,
          optionDefaults = {
            'lineColor': '#000000',
            'fillColor': '#000000',
            'lineWidth': '3'
          },
          options = {},
          shape;

      return {
        start: function (pageX, pageY) {
          _.merge(options, optionDefaults, toolSettings);
          shape = shapeService(canvasLayers, options);
          shape.start(pageX, pageY);
        },

        move: function (pageX, pageY) {
          var calc = shape.move(pageX, pageY);

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

'use strict';

angular.module('paintAngular')
.factory('hexrgbFactory', function() {
  return {
    // props goes to http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRgb: function(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
  };
})

'use strict';

angular.module('paintAngular')
.factory('touchEventFactory', function() {
  return function(event) {
    if (event.originalEvent.targetTouches) {
      if (!event.originalEvent.targetTouches.length) {
        return event;
      }
      return event.originalEvent.targetTouches[0];
    }
    return event;
  };
});

'use strict';

angular.module('paintAngular')
  .controller('NavbarCtrl', ["$scope", function ($scope) {
    $scope.date = new Date();
  }]);

'use strict';

angular.module('paintAngular')
.directive('toolbarDirective', [
  function() {
    return {
      restrict: 'A',
      scope: {
        settings: '=',
        history: '=',
        options: '=toolSettings'
      },
      templateUrl: 'components/toolbar/toolbar.html',
      link: function(scope, el) {
        el.addClass('paintangular-toolbar');
        var maxLineWidths = 80,
            bits = {
              'lineColor': 1,
              'fillColor': 2,
              'lineWidth': 4
            },
            masks = {
              'pencil': bits.lineColor + bits.lineWidth,
              'line': bits.lineColor + bits.lineWidth,
              'rectangle': bits.lineColor + bits.fillColor + bits.lineWidth,
              'ellipse': bits.lineColor + bits.fillColor + bits.lineWidth,
              'eraser': bits.lineWidth
            };

        scope.lineWidths = [];

        for (var i = 1; i <= maxLineWidths; i++) {
          scope.lineWidths.push(i);
        }

        scope.activate = function(type) {
          if (scope.settings.mode === type) {
            scope.settings.mode = null;
            return;
          }
          scope.settings.mode = type;
        };

        scope.goHistory = function(direction) {
          scope.$emit('toolbar-directive-' + direction);
        };

        scope.$watch('options.lineColor', function(value) {
          scope.lineColorPickerStyle = {
            'color': value
          };
        });

        scope.$watch('options.fillColor', function(value) {
          scope.fillColorPickerStyle = {
            'color': value
          };
        });

        scope.$watch('settings.mode', function(newMode) {
          var mask = newMode ? masks[newMode] : 0;
          scope.showLineColor = mask & bits.lineColor;
          scope.showFillColor = mask & bits.fillColor;
          scope.showLineWidth = mask & bits.lineWidth;
        });
      }
    };
  }
]);

angular.module("paintAngular").run(["$templateCache", function($templateCache) {$templateCache.put("app/paintangular.html","<div class=\"container\"><div class=\"jumbotron text-center\"><div data-toolbar-directive=\"\" data-settings=\"canvasSettings\" data-history=\"history\" data-tool-settings=\"toolSettings\"></div><div data-settings=\"canvasSettings\" data-canvas-directive=\"\" data-tool-settings=\"toolSettings\"></div></div><hr></div>");
$templateCache.put("components/navbar/navbar.html","<nav class=\"navbar navbar-static-top navbar-inverse\" ng-controller=\"NavbarCtrl\"><div class=\"container-fluid\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"https://github.com/Swiip/generator-gulp-angular\"><span class=\"glyphicon glyphicon-home\"></span> Gulp Angular</a></div><div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-6\"><ul class=\"nav navbar-nav\"><li class=\"active\"><a ng-href=\"#\">Home</a></li><li><a ng-href=\"#\">About</a></li><li><a ng-href=\"#\">Contact</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li>Current date: {{ date | date:\'yyyy-MM-dd\' }}</li></ul></div></div></nav>");
$templateCache.put("components/toolbar/toolbar.html","<div class=\"btn-group\"><button class=\"btn\" ng-click=\"activate(\'pencil\')\" ng-class=\"{\'btn-primary\': settings.mode == \'pencil\', \'btn-default\': settings.mode != \'pencil\'}\"><i class=\"fa fa-pencil\"></i></button> <button class=\"btn\" ng-click=\"activate(\'line\')\" ng-class=\"{\'btn-primary\': settings.mode == \'line\', \'btn-default\': settings.mode != \'line\'}\"><i class=\"fa fa-minus\"></i></button> <button class=\"btn\" ng-click=\"activate(\'rectangle\')\" ng-class=\"{\'btn-primary\': settings.mode == \'rectangle\', \'btn-default\': settings.mode != \'rectangle\'}\"><i class=\"fa fa-square-o\"></i></button> <button class=\"btn\" ng-click=\"activate(\'ellipse\')\" ng-class=\"{\'btn-primary\': settings.mode == \'ellipse\', \'btn-default\': settings.mode != \'ellipse\'}\"><i class=\"fa fa-circle-o\"></i></button> <button class=\"btn\" ng-click=\"activate(\'eraser\')\" ng-class=\"{\'btn-primary\': settings.mode == \'eraser\', \'btn-default\': settings.mode != \'eraser\'}\"><i class=\"fa fa-eraser\"></i></button></div><div class=\"btn-group\"><button class=\"btn btn-default\" ng-disabled=\"history.current === 0\" ng-click=\"goHistory(\'undo\')\"><i class=\"fa fa-undo\"></i></button> <button class=\"btn btn-default\" ng-disabled=\"history.current === history.images.length - 1\" ng-click=\"goHistory(\'redo\')\"><i class=\"fa fa-repeat\"></i></button></div><div><div class=\"btn-group\"><div class=\"color-picker btn\" ng-if=\"showLineColor\"><span class=\"input-group-addon\"><input type=\"checkbox\" ng-model=\"options.lineColorEnabled\"></span> <span class=\"input-group-addon\" data-colorpicker=\"\" ng-model=\"options.lineColor\" ng-style=\"lineColorPickerStyle\"><i class=\"fa fa-square-o\"></i></span></div><div class=\"color-picker btn\" ng-if=\"showFillColor\"><span class=\"input-group-addon\"><input type=\"checkbox\" ng-model=\"options.fillColorEnabled\"></span> <span class=\"input-group-addon\" data-colorpicker=\"\" ng-model=\"options.fillColor\" ng-style=\"fillColorPickerStyle\"><i class=\"fa fa-square\"></i></span></div><select class=\"btn btn-default\" ng-if=\"showLineWidth\" ng-model=\"options.lineWidth\" ng-options=\"value for value in lineWidths\"></select></div></div>");}]);