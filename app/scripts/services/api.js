'use strict';

/**
 * @ngdoc service
 * @name ecampusApp.Api
 * @description
 * # Api
 * Service in the ecampusApp.
 */
angular.module('ecampusApp')
  .service('Api', function ($http, $rootScope, $window) {

    //this.ApiEndpoint = 'https://api.campus.kpi.ua/';
    this.ApiEndpoint = 'https://api-campus-kpi-ua.azurewebsites.net/';

    $rootScope.requestCount = 0;

    this.changeRequestCount = function (i) {
      $rootScope.requestCount = $rootScope.requestCount + i;
    };


    /**
     * Execute API method
     */
    this.execute = function (method, path, payload) {

      var self = this;

      var url = self.ApiEndpoint + path;

      payload = $.isEmptyObject(payload) ? null : payload;

      if (method == "POST" || method == "PUT" || method == "DELETE") {
        payload = !!payload ? JSON.stringify(payload) : payload;
      }

      self.changeRequestCount(1);

      return $http({
        url: url,
        method: method,
        data: payload,
        processData: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + self.getToken()
        }
      }).then(function (response) {

        self.changeRequestCount(-1);

        if (!!response) {
          return response.data;
        }

        return null;
      }, function (err) {

        console.warn(err);
        self.changeRequestCount(-1);
        return err;

      });

    };

    /**
     * Remove auth token after session expired
     * return true if session is expired
     */

    var tokenLimit = null;

    this.removeToken = function () {
      var self = this;
      var limit = tokenLimit;
      var localStorageInitTime = self.getLoginInitTime();
      if (+new Date() - localStorageInitTime > limit) {
        //redirect and remove items from local storage after 5 seconds
        setTimeout(function () {
          self.logout();
          self.setLoginInitTime(null);
          $window.location.href = '/';
        }, 5000);
        return true;
      }
      return false;
    };

    /**
     * Set loginInitTime
     */
    this.setLoginInitTime = function (time) {
      localStorage["loginInitTime"] = time;
    };

    /**
     * Return current loginInitTime
     */
    this.getLoginInitTime = function () {
      var time = localStorage["loginInitTime"];
      return time == "null" ? null : time;
    };

    /**
     * Authorize and save auth token
     */
    this.auth = function (login, password) {
      var payload = {
        username: login,
        password: password,
        grant_type: 'password'
      };

      var self = this;

      payload = $.param(payload);

      self.changeRequestCount(1);

      return $http({
        url: self.ApiEndpoint + 'oauth/token',
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: payload
      }).then(function (response) {

        self.changeRequestCount(-1);

        if (!!response && !!response.data) {

          self.setToken(response.data.access_token);

          self.setLoginInitTime(+new Date());

          // tokenLimit = 10000;  10 second for testing
          tokenLimit = response.data.expires_in;

          var session = response.data;

          return self.execute("GET", "Account/Info").then(function (response) {
            //get current user details
            self.setCurrentUser(response);

            return session;
          });
        }

        return null;
      }, function (err) {
        self.changeRequestCount(-1);
        console.warn(err);
        self.logout();
      });

    };

    /**
     * Logout and clear current auth token
     */
    this.logout = function () {
      this.setToken(null);
      this.setCurrentUser(null);
    };


    /**
     * Set auth token
     */
    this.setToken = function (token) {
      localStorage["campus-access-token"] = token;
    };

    /**
     * Return current auth token
     */
    this.getToken = function () {
      var token = localStorage["campus-access-token"];
      return token == "null" ? null : token;
    };

    /**
     * Set API endpoint
     */
    this.setApiEndpoint = function (url) {
      this.ApiEndpoint = url;
    };

    /**
     * Get API endpoint
     */
    this.getApiEndpoint = function () {
      return this.ApiEndpoint;
    };

    /**
     * Save current user
     */
    this.setCurrentUser = function (data) {
      if (!!data) {
        localStorage["campus-current-user"] = JSON.stringify(data);
      }
      else {
        localStorage["campus-current-user"] = '';
      }
    };

    /**
     * Get information about current logged user
     */
    this.getCurrentUser = function () {
      var json = localStorage["campus-current-user"];
      if (!!json) {
        return JSON.parse(json);
      }

      return null;
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
