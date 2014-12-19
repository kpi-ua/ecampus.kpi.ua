$(document).ready(function () {
    //$("a").popover({
    //    delay: 1000
    //});
    $('.isVisible').click(function () {
        var id = $(this).attr('id');
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
    //$('.redagContact').click(function () {
    //    var id = $(this).attr('id');
    //    $('body').append('<div id="dialog">');
    //    $('#dialog').append('<input>');
    //    var dialog = $('#dialog').dialog({
    //            title: 'title',
    //            autoOpen: true,
    //            height: 300,
    //            width: 350,
    //            modal: true,
    //            buttons: {
    //                "Ok": function() {
    //                    $.ajax({
    //                        url: 'http://campus-api.azurewebsites.net/User/SetIsVisibleUserContact',
    //                        type: 'GET',
    //                        data: {
    //                            sessionId: $("#CampusSessionId").val(),
    //                            id: id,
    //                            visible: v
    //                        },
    //                        success: function() {
    //                            dialog.dialog("close");
    //                        }
    //                    });
    //                },
    //                "Cansel": function () {
    //                    dialog.dialog("close");
    //                }
    //            },
    //            close: function () {
    //                dialog.remove();
    //            }
    //    });
        

    //});
        var id1;
    $('.redagContact').click(function () {
        id1 = $(this).attr('id');
        });
    $('#SaveNewUserContactValue').click(function() {
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
            //alert($("#" + id1 + "td").innerHTML);
            //$("#" + id1 + "td").innerHTML = $('#newValueUserContact').val();
            //location.reload();
            //var text = $("#" + id1 + "td").val();
            //    // получаем текст
            //    var body = $('body');
            //    // производим замену текста
            //    var body_re = body.replace(text, $('#newValueUserContact').val());
            //    // обновляем весь текст
            //    body.innerHTML = body_re;
            //$('#RedactUserContact-modal').close();
        }

    });

});

var image;
var text;
var head;

 $(document).ready(function() {
     $("[rel=drevil]").popover({
         delay: 300,
         animation: 'false',
         placement : 'left',
         html: 'true',
         content: '<div><img class="portrait" src="'+image+'" />'+text+'</div>',
         trigger: 'hover'
     });     
 });
