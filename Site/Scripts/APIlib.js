var ssid;
var apiEndpoint;

$(document).ready(function () {
    ssid = document.getElementById("ssid").value;
    apiEndpoint = document.getElementById("api").value;
});

window.API = {
    getPerson: function() {

    },

    getData: function(path, obj, callback) {
        var url = apiEndpoint + path.join('/') + "?";
        var array = [];
        for (var item in obj) {
            array.push(item + "=" + obj[item]);
        }
        url += array.join("&");
        $.getJSON(url, function(data, status) {
            if (status == "success") {
                callback(data.Data);
            }
            callback(false);
        });
    }
};