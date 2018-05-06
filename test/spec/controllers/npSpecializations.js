'use strict';

describe('Controller: NpspecializationsCtrl', function () {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var NpspecializationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NpspecializationsCtrl = $controller('NpspecializationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NpspecializationsCtrl.awesomeThings.length).toBe(3);
  });
});
