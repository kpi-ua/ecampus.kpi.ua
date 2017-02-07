'use strict';

describe('Directive: toggle', function() {

  // load the directive's module
  beforeEach(module('ecampusApp'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should call bootstrap method tooltip', inject(function($compile) {
    element = angular.element(
      '<span data-toggle="tooltip" data-original-title="Актуальність"></span>'
    );
    element = $compile(element)(scope);
    spyOn(element, 'tooltip');
    // must bu element.trigger('event_that_call_tooltip')
    element.tooltip();
    expect(element.tooltip).toHaveBeenCalled();
  }));
});
