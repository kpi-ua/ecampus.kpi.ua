'use strict';

describe('Directive: breadcrumbs', function () {

  // load the directive's module
  beforeEach(module('ecampusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<breadcrumbs></breadcrumbs>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the breadcrumbs directive');
  }));
});
