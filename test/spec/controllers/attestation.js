'use strict';

describe('Controller: AttestationCtrl', function () {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var AttestationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttestationCtrl = $controller('AttestationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AttestationCtrl.awesomeThings.length).toBe(3);
  });
});
