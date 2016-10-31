'use strict';

describe('Directive: toggle', function () {

  // load the directive's module
  beforeEach(module('ecampusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<toggle></toggle>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the toggle directive');
  }));
});
