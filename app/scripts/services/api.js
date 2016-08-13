'use strict';

/**
 * @ngdoc service
 * @name ecampusApp.Api
 * @description
 * # Api
 * Service in the ecampusApp.
 */
angular.module('ecampusApp')
    .service('Api', function() {

        /**
         * Set API endpoint
         */
        this.setApiEndpoint = function(url) {
            Campus.setApiEndpoint(url);
        };

        /**
         * Get API endpoint
         */
        this.getApiEndpoint = function() {
            return Campus.getApiEndpoint();
        };

        /**
         * Logout and clear current auth token
         */
        this.logout = function() {
            Campus.logout();
        };

        /**
         * Execute API method
         */
        this.execute = function(method, path, payload) {
            return Campus.execute(method, path, payload);
        };

        /**
         * Authorize and save auth token
         */
        this.auth = function(login, password) {
            return Campus.auth(login, password);
        };
    });