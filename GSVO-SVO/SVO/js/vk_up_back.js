/*
Копия кнопки сайта vk.com "вверх и назад"
by ducaty
www.makakaz.ru
*/
$(document).ready(function () {
    $("#topvk").css('display', 'none');
    $(function () {
        $('#topvk').click(function () {
            $('html, body').stop().animate({ scrollTop: $("body").offset().top }, 0)
        })
    });
    if (document.referrer == '') {
        $("#topvk").hide()
    } else {
        $("#topvk").show();
        //$('#topvk nobr').text('Назад').removeAttr('class').attr('class', 'back');
        $('#topvk').attr('onclick', 'window.location=\'' + document.referrer + '\'')
    }
});
jQuery(window).scroll(function () {
    if (jQuery(window).scrollTop() > 100) {
        $("#topvk").show(); $('#topvk nobr').text('Наверх').removeAttr('class'); $('#topvk').removeAttr('onclick')
    } else {
        if (document.referrer == '') {
            $("#topvk").hide()
        } else {
            $("#topvk").show();
            //$('#topvk nobr').text('Назад').removeAttr('class').attr('class', 'back');
            $('#topvk').attr('onclick', 'window.location=\'' + document.referrer + '\'')
        }
    }
});
document.write('<style>#topvk nobr{opacity:0.3;height:14px;padding:0px 20px;margin:0 31px 0 15px;font-weight:bold;font-family:tahoma,arial,verdana,sans-serif,Lucida Sans;font-size:11px;color:#45688e;background:url(images/vk_up_back.gif) no-repeat left 3px;-webkit-transition-property:opacity;-webkit-transition-duration:200ms;-moz-transition-property:opacity;-moz-transition-duration:200ms;}#topvk:hover nobr{opacity:1;height:14px;padding:0px 20px;margin:0 31px 0 15px;font-weight:bold;font-family:tahoma,arial,verdana,sans-serif,Lucida Sans;font-size:11px;color:#45688e;background:url(/images/vk_up_back.gif) no-repeat left 3px;}.back{background:url(images/vk_up_back.gif) no-repeat left -22px!important;}#topvk{top:0px;left:0px;padding:13px 0 13px;cursor:pointer;display:none;width:100px;height:100%;position:fixed;cursor:pointer;-webkit-transition-property:background;-webkit-transition-duration:200ms;-moz-transition-property:background;-moz-transition-duration:200ms;}#topvk:hover{background:#e1e7ed;}</style><div id="topvk"><nobr id="stl_text">Наверх</nobr></div>');