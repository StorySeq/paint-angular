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
