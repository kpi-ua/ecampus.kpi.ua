'use strict';

/**
 * @ngdoc service
 * @name ecampusApp.Api
 * @description
 * # Api
 * Service in the ecampusApp.
 */
angular.module('ecampusApp')
  .service('Api', function () {

    /**
     * Set API endpoint
     */
    this.setApiEndpoint = function (url) {
      Campus.setApiEndpoint(url);
    };

    /**
     * Get API endpoint
     */
    this.getApiEndpoint = function () {
      return Campus.getApiEndpoint();
    };

    /**
     * Logout and clear current auth token
     */
    this.logout = function () {
      Campus.logout();
    };

    /**
     * Execute API method
     */
    this.execute = function (method, path, payload) {
      return Campus.execute(method, path, payload);
    };

    /**
     * Authorize and save auth token
     */
    this.auth = function (login, password) {
      return Campus.auth(login, password);
    };

    /**
     * Get information about current logged user
     */
    this.getCurrentUser = function () {
      return Campus.getCurrentUser();
    };

    /**
     * Return current auth token
     */
    this.getToken = function () {
      return Campus.getToken();
    };

    this.decodeToken = function (accessTokenIn) {

      if (!accessTokenIn || accessTokenIn == 'null') {
        return null;
      }

      var a = accessTokenIn.split(".");
      var uHeader = b64utoutf8(a[0]);
      var uClaim = b64utoutf8(a[1]);

      var pHeader = KJUR.jws.JWS.readSafeJSONString(uHeader);
      var pClaim = KJUR.jws.JWS.readSafeJSONString(uClaim);

      var sHeader = JSON.stringify(pHeader, null, "  ");
      var sClaim = JSON.stringify(pClaim, null, "  ");

      return sClaim;
    }
  });
