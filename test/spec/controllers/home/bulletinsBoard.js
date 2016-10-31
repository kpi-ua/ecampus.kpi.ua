'use strict';

describe('Controller: HomeBulletinsBoardCtrl', function () {

  // load the controller's module
  beforeEach(module('ecampusApp'));

  var HomeBulletinsBoardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomeBulletinsBoardCtrl = $controller('HomeBulletinsBoardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomeBulletinsBoardCtrl.awesomeThings.length).toBe(3);
  });
});
