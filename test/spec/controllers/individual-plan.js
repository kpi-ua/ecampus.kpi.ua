'use strict';

describe('Controller: IndividualPlanCtrl', function () {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var IndividualPlanCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndividualPlanCtrl = $controller('IndividualPlanCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IndividualPlanCtrl.awesomeThings.length).toBe(3);
  });
});
