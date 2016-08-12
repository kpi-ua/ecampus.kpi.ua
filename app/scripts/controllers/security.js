'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:SecurityCtrl
 * @description
 * # SecurityCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('SecurityCtrl', function() {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });




/*

$(document).ready(function() {
    step(1);
});

function step(n) {
    for (var i = 1; i <= 4; i++) {
        $(".step-" + i).hide();
    }

    $(".step-" + n).show();
}

function restorePassword() {

    var url = 'Account/Recovery';

    var payload = {
        Captcha: $('#captcha-value').val(),
        UserIdentifier: $('#user-id').val()
    };

    $(".loader").show();

    Campus.execute("POST", url, JSON.stringify(payload))
        .done(function(result) {
            step(3);
            $(".loader").hide();
        })
        .fail(function(result) {
            $(".loader").hide();

            if (result.status === 403) {
                showMessage("Невiрний код пiдтвердження");
                $('#captcha-value').val('');
                getCaptcha();
            }
            if (result.status === 404) {
                showMessage("Користувач з таким логiном, або електроною поштою не знайдений");
                location.reload();
            }
            if (result.status === 409) {
                step(4);
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

    var url = Campus.ApiEndpoint + 'Account/Recovery/' + encodeURIComponent(emailOrLogin) + '/token?d=' + new Date().getTime();
    $("#captcha-image").attr("src", url);
}

function showMessage(message) {
    alert(message);
}
*/