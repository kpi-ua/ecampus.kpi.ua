'use strict';

describe('Controller: RnpCtrl', function() {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var RnpCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    RnpCtrl = $controller('RnpCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(RnpCtrl.awesomeThings.length).toBe(3);
  });
});
