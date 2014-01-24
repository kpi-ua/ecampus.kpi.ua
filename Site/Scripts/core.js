$(document).ready(function () {
    $("select").chosen();
    $(".search-field .default").keyup(function () {
        if ($(this).val().length >= 3) {
            $.get("http://api.ecampus.kpi.ua/User/Auth?login=2&password=2",function(data,status){
                data.header('Access-Control-Allow-Origin', "*");
                alert("Data Loaded: " + data);
            });
    
            console.log($(this).val());
        }
            
    });
});
