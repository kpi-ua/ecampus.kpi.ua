'use strict';

describe('Controller: SettingsCtrl', function() {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var SettingsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsCtrl = $controller('SettingsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(SettingsCtrl.awesomeThings.length).toBe(3);
  });
});
