var ApiEndpoint = 'http://api.ecampus.kpi.ua/';

var _url = ""; //URL of current controller
var _controller; //Name of current controller
var _html = "";
var _method = "GET";

function append(html){
    _html += html;
}

function render(){
    $("#out").html('');
    $("#out").append(_html);

    _html = '';

    $(".submit").click(function(){
        //var form = $(this).parent();

        var form = $(this).closest("form");

        var url = _url + '/' + form.attr('Name') + '?' + form.serialize();

        if (_method == 'GET'){
            $.getJSON(url, function (obj) {
                displayResult(obj);
            });
        }

        if (_method == 'POST'){
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(obj){
                    displayResult(obj);
                },
                dataType: dataType
            });
        }
    });
}

function displayResult(result){
    var json = JSON.stringify(result);
    $("#message-box").val(json);
}

$(document).ready(function () {

    $("#cmb-methods").change(function() {
        var method = $("#cmb-methods option:selected" ).text();
        scaffoldMethod(_url, _controller, method);
        $("#message-box").val('');
    });

    $("#btn-auth").click(function(){
        var login = $("#txt-login").val();
        var password = $("#txt-password").val();

        var url = ApiEndpoint + 'User/Auth?login=' + login + '&password=' + password;
        $.getJSON(url, function (obj) {
            var sessionId = obj.Data;
            $("#txt-session-id").val(sessionId);
        });
    });

    loadControllerList();
});

function loadControllerList() {
    $.getJSON(ApiEndpoint, function (obj) {

        $.each(obj.Data.Controllers, function(index, controller ){
            $('#cmb-controllers')
                .append($("<option></option>")
                .attr("value", controller)
                .text(controller));
        });

        $('#cmb-controllers').change(function() {
                var controller = $("#cmb-controllers option:selected" ).text();
                $("#message-box").val('');
                _url = ApiEndpoint + controller;
                _controller = _url.replace(ApiEndpoint, '');  //Check this logic !!!
                fillMethodList(_url);
        });

        $('#cmb-controllers').change();

    });
}

function getMethodInfo (array, method) {
    var result = null;
    array.forEach(function(value) {
        if (value.Name == method){
            result = value;
        }
    });

    return result;
};

function scaffoldMethod(url, controller, method) {

    $.getJSON(url, function (obj) {

        var methodInfo = getMethodInfo(obj.Data, method);
        var methodUrl = ApiEndpoint + controller + '/' + method;

        append('<h2>' + method + '</h2>');
        //append('<strong> HTTP Method: ' + methodInfo.Method + '</strong><br />');
        //append('<strong>Url:</strong>&nbsp;<a href="' + methodUrl + '">' + methodUrl + '</a><br /><br />');

        append('<form class="form-horizontal" name="' + method + '" id="' + method + '" role="form">');

        append(renderFormGroup('', 'HTTP Method:', '<span class="label label-info">' + methodInfo.Method + '</span>' ));
        append(renderFormGroup('', 'Url', '<a href="' + methodUrl + '">' + methodUrl + '</a>'));

        $.each(methodInfo.Parameters, function(index, parameter ){
            createControl(parameter);
        });

        append(renderFormGroup('', '', '<input type="button" class="btn btn-primary submit" value="Debug">'));

        append('</form>');

        render();
    });
}

function createControl(parameter){

    var type = parameter.Type;
    var controlId = parameter.Name;

    var controlHtml = '';
    if (type == 'System.String'){
        controlHtml = '<input class="form-control" type="text" name="' + controlId + '" value="" placeholder="' + parameter.Name + '" />';
    } else if (type =='System.Int32'){
        controlHtml = '<input class="form-control" type="number" name="' + controlId + '" value="" placeholder="' + parameter.Name + '" />';
    } else{
        controlHtml = '<input class="form-control" type="text" name="' + controlId + '" value="" placeholder="' + parameter.Name + '" />';
    }

    append(renderFormGroup(controlId, parameter.Name, controlHtml));
}

function renderFormGroup(controlId, title, controlHtml){

    var html = '';
    html += '<div class="form-group">';
    html += '<label for="' + controlId + '" class="col-sm-4 control-label">' + title + '</label>';
    html += '<div class="col-sm-8">';
    html += controlHtml;
    html += '</div>';
    html += '</div>';
    return html;
}

function fillMethodList(url) {
    $('#cmb-methods').html('');

    $.getJSON(url, function (obj) {

        $.each(obj.Data, function(index, method ){
            $('#cmb-methods')
                .append($("<option></option>")
                .attr("value", method.Name)
                .text(method.Name));
        });

        $("#cmb-methods").change();
    })
}