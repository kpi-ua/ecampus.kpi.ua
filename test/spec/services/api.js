'use strict';

describe('Service: api', function() {
  var api;

  beforeEach(function() {
    module('ecampusApp');
    inject(function($injector) {
      api = $injector.get('api');
    });
  });


  it('test get ApiEndpoint', function() {
    var ApiEndpoint = api.getApiEndpoint();

    expect(ApiEndpoint).toEqual(api.ApiEndpoint);
  });

  it('test get/set LoginFinishTime', function() {
    api.setLoginFinishTime(10);
    var getLoginFinishTime = api.getLoginFinishTime();

    expect(getLoginFinishTime).toMatch(/10/);
  });

  it('test get/set currentUser', function() {
    api.setCurrentUser('user');
    var getCurrentUser = api.getCurrentUser();

    expect(getCurrentUser).toEqual('user');
  });

  it('test remove token', function() {
    api.removeToken();
    var getToken = api.getToken();

    expect(getToken).not.toBeDefined();
  });

});
