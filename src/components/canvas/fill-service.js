'use strict';

angular.module('paintAngular')
.service('fillService', [
  function() {
    return function(canvasLayers, toolSettings) {
      var ctx = canvasLayers.canvas.ctx,
      optionDefaults = {
        'fillColor': '#000000'
      },
      options = {};

      return {
        start: function (pageX, pageY) {
          options = _.merge({}, optionDefaults, toolSettings);
          ctx.fillArea(pageX, pageY, options.fillColor);
        },

        move: function (pageX, pageY) {
        },

        stop: function (pageX, pageY) {
        }
      };
    };
  }
]);
