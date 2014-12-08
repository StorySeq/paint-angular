'use strict';

describe('controllers', function(){
  var scope;

  beforeEach(module('paintAngular'));

  beforeEach(inject(function($rootScope) {
  	scope = $rootScope.$new();
  }));
});
