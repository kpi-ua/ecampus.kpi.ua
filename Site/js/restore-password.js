var API_ENDPOINT = 'http://localhost:50302/';
// var API_ENDPOINT = 'https://api.campus.kpi.ua/';

$(document).ready(function() {
    $(".step-2").hide();
    $(".step-3").hide();
    $(".step-4").hide();
});

function restorePassword() {

    var emailOrLogin = $('#user-id').val();
    var captcha = $('#captcha-value').val();
    var url = API_ENDPOINT + 'Account/Recovery';

    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        data: JSON.stringify({
            Captcha: captcha,
            UserIdentifier: emailOrLogin
        }),
        contentType: "application/json",
        success: function(response) {
            $(".step-2").hide();
            $(".step-3").show();
        },
        error: function(xhr, ajaxOptions, thrownError) {
            if (xhr.status == 403) {
                showMessage("Невiрний код пiдтвердження");
                $('#captcha-value').val('');
                getCaptcha();
            }
            if (xhr.status == 404) {
                showMessage("Користувач з таким логiном, або електроною поштою не знайдений");
                location.reload();
            }
            if (xhr.status == 409) {
                $(".step-2").hide();
                $(".step-3").hide();
                $(".step-4").show();
            }
        }
    });
}

function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function validate() {
    $("#btn-get-captcha").prop("disabled", !$('#user-id').val());
    $("#btn-get-password").prop("disabled", !$('#captcha-value').val());
}

function getCaptcha() {
    $(".step-1").hide();
    $(".step-2").show();

    var emailOrLogin = $('#user-id').val();

    var url = API_ENDPOINT + 'Account/Recovery/' + encodeURIComponent(emailOrLogin) + '/token?d=' + new Date().getTime();
    $("#captcha-image").attr("src", url);
}

function showMessage(message) {
    alert(message);
}