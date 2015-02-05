//Default API endpoint: http://api.ecampus.kpi.ua/

$(document).ready(function () {
    var sessionId;
    var apiEndpoint;

    window.API = {
        setApiEndpoint: function (url) {
            apiEndpoint = url;
        },

        getApiEndpoint: function () {
            return apiEndpoint;
        },

        setSessionId: function (sid) {
            sessionId = sid;
        },

        getSessionId: function () {
            return sessionId;
        },

        getUser: function (callback) {
            this.getData(["User", "GetCurrentUser"], {}, function (data) {
                callback(data);
            });
        },

        getData: function (path, obj, callback) {
            var url = apiEndpoint + path.join('/') + "?sessionId=" + sessionId + "&";
            var array = [];
            for (var item in obj) {
                array.push(item + '=' + obj[item]);
            }
            url += array.join("&");
            $.getJSON(url, function (data, status) {
                if (status === "success") {
                    if (data["Compression"] != null && data["Compression"]["Type"] === "Gzip") {
                        callback(this.API.gzip.encode(data["Data"]), data);
                    } else {
                        callback(data.Data);
                    }
                } else {
                    callback(false);
                }
            });
        },

        gzip: {
            encode: function (string) {
                // Get some base64 encoded binary data from the server. Imagine we got this:
                var b64Data = string;

                // Decode base64 (convert ascii to binary)
                var strData = Base64.decode(string)//atob(b64Data);

                // Convert binary string to character-number array
                var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });

                // Turn number array into byte-array
                var binData = new Uint8Array(charData);

                // Pako magic
                var data = pako.inflate(binData);

                // Convert gunzipped byteArray back to ascii string:
                var strData = String.fromCharCode.apply(null, new Uint16Array(data));

                return strData;
            }
        }
    };
});
