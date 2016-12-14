'use strict';

/**
 * @ngdoc service
 * @name ecampusApp.Api
 * @description
 * # Api
 * Service in the ecampusApp.
 */
angular.module('ecampusApp')
  .service('Api', function ($http) {

    //this.ApiEndpoint = 'https://api.campus.kpi.ua/';
    this.ApiEndpoint = 'https://api-campus-kpi-ua.azurewebsites.net/';

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

      return $http({
        url: url,
        method: method,
        data: payload,
        processData: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + self.getToken()
        },
        success: function () {
          //console.info('Request to campus API success: ', response);
        },
        error: function (jqXHR, status, error) {
          console.warn('Error occured: ', status, error);
        }
      }).then(function (response) {
        if (!!response) {
          return response.data;
        }

        return null;
      });

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

      var d = $.Deferred();

      $http({
        url: self.ApiEndpoint + 'oauth/token',
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: payload,
        success: function (response) {
        },
        error: function (xhr, status, err) {
          console.warn(xhr, status, err.toString());

          self.logout();
          d.resolve(null);
        }
      }).then(function (response) {
        if (!!response && !!response.data) {

          self.setToken(response.data.access_token);

          self.execute("GET", "Account/Info").then(function (response) {
            //get current user details
            self.setCurrentUser(response);
            d.resolve(self.getToken());
          });

          return response.data;
        }

        return null;
      });

      return d.promise();
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
