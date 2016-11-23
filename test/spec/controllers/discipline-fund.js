'use strict';

describe('Controller: DisciplineFundCtrl', function () {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var DisciplineFundCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DisciplineFundCtrl = $controller('DisciplineFundCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DisciplineFundCtrl.awesomeThings.length).toBe(3);
  });
});
