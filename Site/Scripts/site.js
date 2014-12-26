$(document).ready(function () {
    //$("a").popover({
    //    delay: 1000
    //});
    $('.isVisible').click(function () {
        var id = $(this).attr('id').toString();
        id = id.substr(0, id.length - 2);
        var v;
        if ($(this).hasClass('glyphicon-eye-open')) {

            v = 1;
        } else if ($(this).hasClass('glyphicon-eye-close')) {

            v = 0;
        }
        $(this).toggleClass('glyphicon-eye-open isVisible');
        $(this).toggleClass('glyphicon-eye-close isVisible');
        $.ajax({
            url: 'http://campus-api.azurewebsites.net/User/SetIsVisibleUserContact',
            type: 'GET',
            data: {
                sessionId: $("#CampusSessionId").val(),
                id: id,
                visible: v
            }
        });

    });
    var id1;
    $('.redagContact').click(function () {
        id1 = $(this).attr('id').toString();
        id1 = id1.substr(0, id1.length - 2);
    });
    $('#SaveNewUserContactValue').click(function () {
        if ($('#newValueUserContact').val() != null) {
            //alert("zzzzzzzz");
            $.ajax({
                url: 'http://campus-api.azurewebsites.net/User/UpdateUserContact',
                type: 'GET',
                data: {
                    sessionId: $("#CampusSessionId").val(),
                    ContactId: id1,
                    newValue: $('#newValueUserContact').val()
                }
            });
            //alert('#' + 'RedUserCont' + id1);
            alert($('#' + 'RedUserCont' + id1).innerHTML);
        }

    });
    var idDisc;
    $('.editdispline').click(function () {
        idDisc = $(this).attr('id');
    });
    $('#SaveEditDiscipline').click(function () {
        if ($('#dcComponentId').val() != null) {

            $.ajax({
                url: 'http://campus-api.azurewebsites.net/Discipline/EditRtDiscipline',
                type: 'GET',
                data: {
                    rtProfTrainTotalId: idDisc,
                    dcComponentId: $('#dcComponentId').val,
                    dcCycleId: $('#dcCycleId').val(),
                    shifr: $('#shifr').val(),
                    countHour: $('#countHour').val(),
                    creditNational: $('#creditNational').val(),
                    creditECTS: $('#creditECTS').val(),
                    ourCredit: $('#ourCredit').val(),
                    vcStatus: $('#vcStatus').val(),
                    vcActuality: $('#vcActuality').val(),
                    fullName: $('#fullName').val()
                }
            });
        }
    });
});

var image;
var text;
var head;

$(document).ready(function () {
    $("[rel=drevil]").popover({
        delay: 300,
        animation: 'false',
        placement: 'left',
        html: 'true',
        content: '<div><img class="portrait" src="' + image + '" />' + text + '</div>',
        trigger: 'hover'
    });
});
