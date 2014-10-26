var ssid;
var apiEndpoint;

$(document).ready(function() {
    ssid = document.getElementById("CampusSessionId").value;
    apiEndpoint = document.getElementById("ApiEndpoint").innerHTML;


    window.API = {
        getUser: function(callback) {
            this.getData(["User", "GetCurrentUser"], {}, function(data) {
                callback(data);
            });
        },

        getData: function (path, obj, callback) {
            var url = apiEndpoint + path.join('/') + "?sessionId="+ssid + "&";
            var array = [];
            for (var item in obj) {
                array.push(item + '=' + obj[item]);
            }
            url += array.join("&");
            $.getJSON(url, function (data, status) {
                if (status == "success") {
                    callback(data.Data);
                } else {
                    callback(false);
                }
            });
        }
    };
});