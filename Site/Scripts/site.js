$(document).ready(function () {
    $("a").tooltip();
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
