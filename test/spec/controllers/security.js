'use strict';

describe('Controller: SecurityCtrl', function() {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var SecurityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    SecurityCtrl = $controller('SecurityCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(SecurityCtrl.awesomeThings.length).toBe(3);
  });
});
