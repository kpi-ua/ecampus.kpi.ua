var _url = ""; //URL of current controller
var _controller; //Name of current controller
var _html = "";
var _httpMethod = "GET";

function append(html) {
    _html += html;
}

function ajaxLoad(url, callback) {

    progressBar(true);

    var jqxhr = $.getJSON(url, function (result) {
            callback(result);
            console.log("success");
        })
        .done(function () {
            console.log("second success");
        })
        .fail(function () {
            alert('Error detected');
            console.log("error");
        })
        .always(function () {
            progressBar(false);
            console.log("complete");
        });

    // Set another completion function for the request above
    jqxhr.complete(function () {
        console.log("second complete");
    });
}

function progressBar(show) {
    if (show) {
        $("#progress").show();
    } else {
        $("#progress").hide();
    }
}

function displayResult(result) {
    var json = JSON.stringify(result, null, "\t");
    $("#message-box").val(json);
}

function loadControllerList() {

    ajaxLoad(API.getApiEndpoint(), function (obj) {

        $.each(obj.Data.Controllers, function (index, controller) {
            $('#cmb-controllers')
                .append($("<option></option>")
                    .attr("value", controller)
                    .text(controller));
        });

        $('#cmb-controllers').change(function () {
            var controller = $("#cmb-controllers option:selected").text();
            $("#message-box").val('');
            _url = API.getApiEndpoint() + controller;
            _controller = _url.replace(API.getApiEndpoint(), ''); //Check this logic !!!
            fillMethodList(_url);
        });

        $('#cmb-controllers').change();

    });
}

function getMethodInfo(array, method) {
    var result = null;
    array.forEach(function (value) {
        if (value.Name === method) {
            result = value;
        }
    });

    return result;
};

function scaffoldMethod(url, controller, method) {

    ajaxLoad(url, function (obj) {

        var methodInfo = getMethodInfo(obj.Data, method);
        var methodUrl = API.getApiEndpoint() + controller + '/' + method;

        _httpMethod = methodInfo.Method;

        $("#method-title").html('<strong>' + method + '<strong>');

        var form = $("#out");
        form.attr("action", _url + controller + '/' + method);
        form.attr("name", method);

        if (_httpMethod === "POST") {
            form.attr("method", _httpMethod);
            form.attr("enctype", "multipart/form-data");
        }

        $("#txt-http-method").val(methodInfo.Method);
        $("#txt-method-url").val(methodUrl);

        $.each(methodInfo.Parameters, function (index, parameter) {
            createControl(parameter);
        });

        append(renderFormGroup('', '', '<input type="button" class="btn btn-primary submit" value="Debug">'));

        //append('</form>');

        render();
    });
}

function createControl(parameter) {

    var type = parameter.Type;
    var controlId = parameter.Name;
    var controlType = '';

    var controlHtml;

    if (type === 'System.String') {
        controlType = 'text';
    } else if (type === 'System.Int32') {
        controlType = 'number';
    } else if (type === 'System.Web.HttpPostedFileBase') {
        controlType = 'file';
    } else {
        controlType = 'text';
    }

    controlHtml = '<input class="form-control" type="' + controlType + '" name="' + controlId + '" id = "' + controlId + '" value="" placeholder="' + parameter.Name + '" />';

    append(renderFormGroup(controlId, parameter.Name, controlHtml));
}

function renderFormGroup(controlId, title, controlHtml) {

    var html = '';
    html += '<div class="form-group">';
    html += '<label for="' + controlId + '" class="col-md-4 control-label">' + title + '</label>';
    html += '<div class="col-md-8">';
    html += controlHtml;
    html += '</div>';
    html += '</div>';
    return html;
}

function fillMethodList(url) {
    $('#cmb-methods').html('');

    ajaxLoad(url, function (obj) {
        //$.getJSON(url, function (obj) {

        $.each(obj.Data, function (index, method) {
            $('#cmb-methods')
                .append($("<option></option>")
                    .attr("value", method.Name)
                    .text(method.Name));
        });

        $("#cmb-methods").change();
    })
}

$(document).ready(function () {

    API.setApiEndpoint('http://campus-api.azurewebsites.net/');
    
    $("#api-link").attr("href", API.getApiEndpoint);
    $("#api-link").text(API.getApiEndpoint);
    

    $("#cmb-methods").change(function () {
        var method = $("#cmb-methods option:selected").text();
        scaffoldMethod(_url, _controller, method);
        $("#message-box").val('');
    });

    $("#btn-auth").click(function () {
        var login = $("#txt-login").val();
        var password = $("#txt-password").val();

        var url = API.getApiEndpoint() + 'User/Auth?login=' + login + '&password=' + password;

        ajaxLoad(url, function (obj) {
            API.setSessionId(obj.Data);
            $("#campus-session-id").val(API.getSessionId());
            $("#sessionId").val(API.getSessionId());
        });
    });

    loadControllerList();
});

function render() {
    $("#out").html('');
    $("#out").append(_html);

    $("#sessionId").val(API.getSessionId());

    _html = '';

    $(".submit").click(function () {
        var form = $(this).closest("form");

        progressBar(true);
        var controllerMethod = form.attr('Name');

        if (_httpMethod === 'GET') {
            var url = _url + '/' + controllerMethod + '?' + form.serialize();

            $.getJSON(url, function (obj) {
                displayResult(obj);
                progressBar(false);
            }).fail(function () {
                displayResult("Error detected")
                progressBar(false);
            });
        }

        if (_httpMethod === 'POST') {
            var data = new FormData(document.getElementById($(form).attr("Id")));
            
            $.ajax({
                url: _url + '/' + controllerMethod,
                type: _httpMethod,
                data: data,
                processData: false,
                contentType: false,
                success: function (obj) {
                    displayResult(obj);
                    progressBar(false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    displayResult(textStatus)
                    progressBar(false);
                }
            });
        }
    });
}

