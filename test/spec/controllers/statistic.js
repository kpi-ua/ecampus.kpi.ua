'use strict';

describe('Controller: StatisticCtrl', function() {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var StatisticCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    StatisticCtrl = $controller('StatisticCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(StatisticCtrl.awesomeThings.length).toBe(3);
  });
});
