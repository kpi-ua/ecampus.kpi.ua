var ApiEndpoint = 'http://api.ecampus.kpi.ua/';

$(document).ready(function () {

    var url = '';
    
    url = ApiEndpoint + 'User/Auth?login=2&password=2';
    url = ApiEndpoint + 'Test';

    $("#txt-url").val(url);
    $("#txt-controller-name").val('Test');

    $("#btn-scaffold").click(function () {
        var url = $("#txt-url").val();
        scaffoldApi(url);
    });

    $("#btn-scaffold-controller").click(function(){
        var url = $("#txt-url").val();
        scaffoldController(url);
    });

    $("btn-scaffold-method").click(function(){
        var url = $("#txt-url").val();
        //scaffoldMethod(url);

        //var controller =
    });
});

function append(html){
    $("#out").append(html);
}

function scaffoldMethod(controller, method) {

    append('<form name="' + method.Name + '">');
    append('<h2>' + method.Name + '</h2>');
    append('<strong> HTTP Method' + method.Method + '</strong><br />');
    var url = ApiEndpoint + controller + '/' + method.Name;
    append('<strong>Url:</strong>&nbsp;<a href="' + url + '">' + url + '<br />');

    append('<table>');
    $.each(method.Parameters, function( index, value ){
        var parameter = value;

        createControl(parameter);
    });

    append('<table>');

    append('<input type="submit" value="Debug">');

    append('<span class="result-out"></span>');

    append('</form>');


}

function createControl(parameter) {
    append('<tr>');
    append('<td>' + parameter.Name +': </td><td><input type="text" value="" /><br />');
    append('</tr>')
}

function scaffoldController(url) {
    $.getJSON(url, function (obj) {
        var methods = obj.Data;

        $.each( methods, function( index, value ){
            var method = value;
            var controllerName = $("#txt-controller-name").val();
            scaffoldMethod(controllerName, method);

        });

    });
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

function buildControllerLink(controllerName){
    var url = ApiEndpoint + controllerName;
    var a = '<a href="' + url + '">' + controllerName + '</a>'
    append(a);
}