var API_ENDPOINT = 'https://api.campus.kpi.ua/';

$(document).ready(function() {
    step(1);
});

function step(n) {
    for (i = 1; i <= 4; i++) {
        $(".step-" + i).hide();
    }

    $(".step-" + n).show();
}

function restorePassword() {

    var url = API_ENDPOINT + 'Account/Recovery';

    var payload = {
        Captcha: $('#captcha-value').val(),
        UserIdentifier: $('#user-id').val()
    };

    $(".loader").show();

    $.ajax({
        type: "POST",
        url: url,
        crossDomain: true,
        data: JSON.stringify(payload),
        contentType: "application/json",
        success: function() {
            step(3);
            $(".loader").hide();
        },
        error: function(xhr, ajaxOptions) {
            $(".loader").hide();

            if (xhr.status === 403) {
                showMessage("Невiрний код пiдтвердження");
                $('#captcha-value').val('');
                getCaptcha();
            }
            if (xhr.status === 404) {
                showMessage("Користувач з таким логiном, або електроною поштою не знайдений");
                location.reload();
            }
            if (xhr.status === 409) {
                step(4);
            }
        }
    });
}

function validate() {
    $("#btn-get-captcha").prop("disabled", !$('#user-id').val());
    $("#btn-get-password").prop("disabled", !$('#captcha-value').val());
}

function getCaptcha() {
    step(2);

    var emailOrLogin = $('#user-id').val();

    var url = API_ENDPOINT + 'Account/Recovery/' + encodeURIComponent(emailOrLogin) + '/token?d=' + new Date().getTime();
    $("#captcha-image").attr("src", url);
}

function showMessage(message) {
    alert(message);
}