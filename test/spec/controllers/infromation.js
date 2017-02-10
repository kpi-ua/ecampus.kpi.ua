'use strict';

describe('Controller: InformationCtrl', function() {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var InformationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    InformationCtrl = $controller('InformationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(InformationCtrl.awesomeThings.length).toBe(3);
  });
});
