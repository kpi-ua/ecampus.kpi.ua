//API JS SDK v1.0.2.220

var API = function() {};

API.prototype.ApiEndpoint = 'https://api.campus.kpi.ua/';
//API.prototype.ApiEndpoint = 'http://localhost:51944/';
//API.prototype.ApiEndpoint = 'https://api-campus-kpi-ua.azurewebsites.net/';

/**
 * Set auth token
 */
API.prototype.setToken = function(token) {
    localStorage["campus-access-token"] = token;
}

/**
 * Return current auth token
 */
API.prototype.getToken = function() {
    var token = localStorage["campus-access-token"];
    return token == "null" ? null : token;
}

/**
 * Set API endpoint
 */
API.prototype.setApiEndpoint = function(url) {
    this.ApiEndpoint = url;
};

/**
 * Logout and clear current auth token
 */
API.prototype.logout = function() {
    this.setToken(null);
}

/**
 * Execute API method
 */
API.prototype.execute = function(method, path, payload) {

    var self = this;

    var url = self.ApiEndpoint + path;

    payload = $.isEmptyObject(payload) ? null : payload;

    var jqxhr = $.ajax({
        url: url,
        method: method,
        data: payload,
        processData: false,
        contentType: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");

            if (!!self.getToken()) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.getToken());
            }
        },
        success: function(response) {
            //console.info('Request to campus API success: ', response);
        },
        error: function(jqXHR, status, error) {
            console.warn('Error occured: ', status, error);
        }
    });

    return jqxhr;
};

/**
 * Authorize and save auth token
 */
API.prototype.auth = function(login, password) {

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
        success: function(response) {
            self.setToken(response.access_token);
            d.resolve(self.getToken());
        },
        error: function(xhr, status, err) {
            console.warn(xhr, status, err.toString());

            self.setToken(null);
            d.resolve(self.getToken());
        }
    });

    return d.promise();
}

Campus = new API();
