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
        var form = $(this).parent();
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

    $("#txt-url").val(ApiEndpoint + 'Test');

    $("#btn-scaffold-controller").click(function(){
        _url = $("#txt-url").val();
        _controller = _url.replace(ApiEndpoint, '');  //Check this logic !!!
        fillMethodList(_url);
    });


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
});

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
        append('<strong> HTTP Method: ' + methodInfo.Method + '</strong><br />');
        append('<strong>Url:</strong>&nbsp;<a href="' + methodUrl + '">' + methodUrl + '</a><br /><br />');

        append('<form class="form-horizontal" name="' + method + '" id="' + method + '" role="form">');


        $.each(methodInfo.Parameters, function(index, parameter ){
            createControl(parameter);
        });

        append('<input type="button" class="btn btn-primary submit" value="Debug">');
        append('</form>');

        render();
    })
}

function createControl(parameter){
    var type = parameter.Type;

    var controlId = parameter.Name;

    append('<div class="form-group">');
    append('<label for="' + controlId + '" class="col-sm-2 control-label">' + parameter.Name + '</label>');

    append('<div class="col-sm-10">');

    if (type == 'System.String'){
        append('<input class="form-control" type="text" name="' + controlId + '" value="" placeholder="' + parameter.Name + '" />');
    } else if (type =='System.Int32'){
        append('<input class="form-control" type="number" name="' + controlId + '" value="" placeholder="' + parameter.Name + '" />');
    } else{
        append('<input class="form-control" type="text" name="' + controlId + '" value="" placeholder="' + parameter.Name + '" />');
    }
    append('</div>');
    append('</div>');
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

function scaffoldApi(url) {

    $.getJSON(url, function (obj) {

        var data = obj.Data;

        if (data.Controllers != null) {
            
            $("#out").html('<ul>');
            for (var i=0; i < data.Controllers.length; i++) {
                    var controllerName = data.Controllers[i];
                    var controllerUrl = ApiEndpoint + controllerName;
                    var a = '<li><a onclick="lo" href="#' + controllerUrl + '">' + controllerName + '</a></li>';
                    append(a);
            }          
           append('</ul>');
        }


        //alert(JSON.stringify(data));        
        console.log("success");
    }).done(function () {
            console.log("second success");
       })
       .fail(function () {
            console.log("error");
       })
       .always(function () {
            console.log("complete");
       });

}