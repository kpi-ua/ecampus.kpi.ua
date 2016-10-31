//API JS SDK v1.2.0.500

var API = function () { };
var Campus = new API();

"use strict";
//API.prototype.ApiEndpoint = 'https://api.campus.kpi.ua/';
API.prototype.ApiEndpoint = 'http://api-campus-kpi-ua.azurewebsites.net/';
/**
 * Set auth token
 */
API.prototype.setToken = function (token) {
    localStorage["campus-access-token"] = token;
};

/**
 * Return current auth token
 */
API.prototype.getToken = function () {
    var token = localStorage["campus-access-token"];
    return token == "null" ? null : token;
};

/**
 * Set API endpoint
 */
API.prototype.setApiEndpoint = function (url) {
    this.ApiEndpoint = url;
};

/**
 * Get API endpoint
 */
API.prototype.getApiEndpoint = function () {
    return this.ApiEndpoint;
};

/**
 * Save current user
 */
API.prototype.setCurrentUser = function (data) {
    localStorage["campus-current-user"] = JSON.stringify(data);
};

/**
 * Get information about current logged user
 */
API.prototype.getCurrentUser = function () {
    return JSON.parse(localStorage["campus-current-user"]);
}

/**
 * Logout and clear current auth token
 */
API.prototype.logout = function () {
    this.setToken(null);
    this.setCurrentUser(null);
};

/**
 * Execute API method
 */
API.prototype.execute = function (method, path, payload) {

    var self = this;

    var url = self.ApiEndpoint + path;

    payload = $.isEmptyObject(payload) ? null : payload;

    if (method == "POST" /* || method == "POST" */) {
        payload = !!payload ? JSON.stringify(payload) : payload;
    }

    var jqxhr = $.ajax({
        url: url,
        method: method,
        data: payload,
        processData: true,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");

            if (!!self.getToken()) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.getToken());
            }
        },
        success: function () {
            //console.info('Request to campus API success: ', response);
        },
        error: function (jqXHR, status, error) {
            console.warn('Error occured: ', status, error);
        }
    });

    return jqxhr;
};

/**
 * Authorize and save auth token
 */
API.prototype.auth = function (login, password) {

    var payload = {
        username: login,
        password: password,
        grant_type: 'password'
    };

    var self = this;

    payload = $.param(payload);

    var d = $.Deferred();

    $.ajax({
        url: self.ApiEndpoint + 'oauth/token',
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        crossDomain: true,
        data: payload,
        success: function (response) {
            self.setToken(response.access_token);

            self.execute("GET", "Account/Info").then(function (response) {
                //get current user details
                self.setCurrentUser(response);
                d.resolve(self.getToken());
            });
        },
        error: function (xhr, status, err) {
            console.warn(xhr, status, err.toString());

            self.logout();
            d.resolve(null);
        }
    });

    return d.promise();
};

