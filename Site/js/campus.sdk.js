//API JS SDK

var API = function() {};

API.prototype.ApiEndpoint = 'https://api.campus.kpi.ua/';
API.prototype._token = null;

API.prototype.setApiEndpoint = function(url) {
    this.ApiEndpoint = url;
};

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
            if (!!self._token) {
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Authorization", "Bearer " + self._token);
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
            self._token = response.access_token

            d.resolve(self._token);
        },
        error: function(xhr, status, err) {
            console.warn(xhr, status, err.toString());

            self._token = null;
            d.resolve(self._token);
        }
    });

    return d.promise();
}

Campus = new API();