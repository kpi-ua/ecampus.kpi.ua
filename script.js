var ApiEndpoint = 'http://api.ecampus.kpi.ua/';

var _url = ""; //URL of current controller
var _controller; //Name of current controller
var _html = "";
var _method = "GET";
var _sessionId = "";

function append(html){
    _html += html;
}

function render(){
    $("#out").html('');
    $("#out").append(_html);

    $("#sessionId").val(_sessionId);

    _html = '';

    $(".submit").click(function(){
        var form = $(this).closest("form");

        progressBar(true);
        var controllerMethod = form.attr('Name');

        if (_method == 'GET'){
            var url = _url + '/' + controllerMethod + '?' + form.serialize();

            $.getJSON(url, function (obj) {
                displayResult(obj);
                progressBar(false);
            });
        }

        if (_method == 'POST'){

            var data = new FormData(document.getElementById($(form).attr("Id")));
            var url = _url + '/' + controllerMethod;

            $.ajax({
                url: url,
                type: _method,
                data: data,
                processData: false,
                contentType: false,
                success: function(obj){
                    displayResult(obj);
                    progressBar(false);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    displayResult(textStatus)
                    progressBar(false);
                }
            });
        }
    });
}

function ajaxLoad(url, callback){

    progressBar(true);

    var jqxhr = $.getJSON(url, function(result) {
        callback(result);
        console.log( "success" );
    })
        .done(function() {
            console.log( "second success" );
        })
        .fail(function() {
            alert('Error detected');
            console.log( "error" );
        })
        .always(function() {
            progressBar(false);
            console.log("complete");
        });

    // Set another completion function for the request above
    jqxhr.complete(function() {
        console.log( "second complete" );
    });
}

function progressBar(show){
    if (show){
        $("#progress").show();
    }else{
        $("#progress").hide();
    }
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

        ajaxLoad(url, function (obj) {
            _sessionId = obj.Data;
            $("#txt-session-id").val(_sessionId);
            $("#sessionId").val(_sessionId);
        });
    });

    loadControllerList();
});

function loadControllerList() {

    ajaxLoad(ApiEndpoint, function (obj) {

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

    ajaxLoad(url, function (obj) {

        var methodInfo = getMethodInfo(obj.Data, method);
        var methodUrl = ApiEndpoint + controller + '/' + method;

        _method = methodInfo.Method;

        append('<h2>' + method + '</h2>');


        //<FORM action="http://server.com/cgi/handle" enctype="multipart/form-data" method="post">

        var enctype = _method == 'POST' ? ' enctype="multipart/form-data" ' : '';

        append('<form class="form-horizontal" name="' + method + '" action="' + _method + '" id="' + methodInfo.Name + '" role="form"' + enctype + '>');

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
    var controlType ='';

    var controlHtml;

    if (type == 'System.String'){
        controlType = 'text';
    } else if (type =='System.Int32'){
        controlType = 'number';
    } else if (type =='System.Web.HttpPostedFileBase'){
        controlType = 'file';
    } else{
        controlType = 'text';
    }

    controlHtml = '<input class="form-control" type="' + controlType + '" name="' + controlId + '" id = "' + controlId + '" value="" placeholder="' + parameter.Name + '" />';

    append(renderFormGroup(controlId, parameter.Name, controlHtml));
}

function renderFormGroup(controlId, title, controlHtml){

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

        $.each(obj.Data, function(index, method ){
            $('#cmb-methods')
                .append($("<option></option>")
                .attr("value", method.Name)
                .text(method.Name));
        });

        $("#cmb-methods").change();
    })
}