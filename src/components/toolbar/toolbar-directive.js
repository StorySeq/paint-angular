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
              'eraser': bits.lineWidth,
              'fill': bits.fillColor
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
