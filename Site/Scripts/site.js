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
