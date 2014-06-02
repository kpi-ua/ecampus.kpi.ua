
var ApiEndpoint = "http://api.ecampus.kpi.ua/";



$(document).ready(function () {
    $(".chzn-select").chosen();

    //-------------------------------------------------------------sete popUP
    var popup_Window_Width = 1200;
    popupMagic(popup_Window_Width);
    window_resize();
    //------------------------------------------------------------end set popUP

});

function window_resize() {
    var page_h = $("html").height();
    var page_w = $("html").width();

    var containerHeight = page_h - 170;

    $(".popContainer").css("max-height", containerHeight);
    $(".popContainer").css("min-height", containerHeight);

    console.log(page_h-200);
}


var popupMagic = function (popup_Window_Width) {
    $('body').append('<div id="blackout"></div>');

    var boxWidth = popup_Window_Width;
    centerBox();

    function centerBox() {

        /* определяем нужные данные */
        var winWidth = $(window).width();
        var winHeight = $(document).height();
        var scrollPos = $(window).scrollTop();

        /* Вычисляем позицию */

        var disWidth = (winWidth - boxWidth) / 2
        var disHeight = scrollPos + 40;

        /* Добавляем стили к блокам */
        $('.popup-box').css({ 'width': boxWidth + 'px', 'left': disWidth + 'px', 'top': disHeight + 'px' });
        $('#blackout').css({ 'width': winWidth + 'px', 'height': winHeight + 'px' });

        return false;
    };

    $('[class*=popup-link]').click(function (e) {

        /* Предотвращаем действия по умолчанию */
        e.preventDefault();
        e.stopPropagation();

        /* Получаем id (последний номер в имени класса ссылки) */
        var name = $(this).attr('class');
        var id = name[name.length - 1];
        var scrollPos = $(window).scrollTop();

        /* Корректный вывод popup окна, накрытие тенью, предотвращение скроллинга */
        $('#popup-box-' + id).show();
        $('#blackout').show();
        $('html,body').css('overflow', 'hidden');

        /* Убираем баг в Firefox */
        $('html').scrollTop(scrollPos);
    });

    $('[class*=popup-box]').click(function (e) {
        /* Предотвращаем работу ссылки, если она являеться нашим popup окном */
        e.stopPropagation();
    });
    $('html').click(function () {
        var scrollPos = $(window).scrollTop();
        /* Скрыть окно, когда кликаем вне его области */
        $('[id^=popup-box-]').hide();
        $('#blackout').hide();
        $("html,body").css("overflow", "auto");
        $('html').scrollTop(scrollPos);
    });
    $('.close').click(function () {
        var scrollPos = $(window).scrollTop();
        /* Скрываем тень и окно, когда пользователь кликнул по X */
        $('[id^=popup-box-]').hide();
        $('#blackout').hide();
        $("html,body").css("overflow", "auto");
        $('html').scrollTop(scrollPos);
    });
};


$(document).on("click", "#body_sb", function () {
    $("#sTitle").slideDown("slow");
    $("#sresult").slideDown("slow");
    $("#itemcontainer div").remove();
    $("#ircontainer div").remove();

    var url = ApiEndpoint;
    if ($("#body_isdisc").attr("value") == "True") {
        $(".subtitle").text("Дисципліни");
        url += "MZSearch/GetDisc?rtpttId=" + $("#body_spec").attr("value");
        $.getJSON(url, function (data, status) {
            if (data.Data.length > 0) {
                $.each(data.Data, function (key, value) {
                    $("#itemcontainer").append("<div class=\"oneitem\"><p class=\"itemrow\" did=\"" + value.RtDisciplineId + "\">" + value.NameFull + "</p></div>");
                });
            }
        });
    } else if ($("#body_isdisc").attr("value") == "False") {
        $(".subtitle").text("Кредитного модуля");
        url += "MZSearch/GetCred?rtpttId=" + $("#body_spec").attr("value");
        $.getJSON(url, function (data, status) {
            if (data.Data.length > 0) {
                $.each(data.Data, function (key, value) {
                    $("#itemcontainer").append("<div class=\"oneitem\" ><p class=\"itemrow\" cid=\"" + value.cCreditModuleId + "\">" + value.NameFull + "</p></div>");
                });
            }
        });
    }


});

$(document).on("click", "#itemcontainer div p", function () {


    $(".itemcol").remove();
    $(".itemrow_a").attr("class", "itemrow");
    $("#itemcontainer div input").remove();
    $("#itemcontainer div br").remove();

    $("#ircontainer div").remove();

    $(this).attr("class", "itemrow_a");

    var parentDiv = $(this).parent();

    parentDiv.append("<ul class=\"itemcol\"></ul>");

    var parentUl = parentDiv.children(".itemcol");

    $("#itemcontainer div .itemcol").css("display", "none");

    var obj = $(this);

    if ($("#body_isdisc").attr("value") == "True") {

        //-----------------------for disc---------------------------------
        loadDiscRows(parentUl, obj);
        parentDiv.append("<input type=\"button\" value=\"Детальніше\" did=\"" + obj.attr("did") + "\" class=\"btn-success col-lg-4 col-lg-offset-8\"/><br>");
        //--------------------ir for disc-----------------------------------------------------
        getIrForDisc(obj);

    } else if ($("#body_isdisc").attr("value") == "False") {

        //---------------------for cred-------------------------------------------------------------

        loadCredRows(parentUl, obj);
        parentDiv.append("<input type=\"button\" value=\"Детальніше\" cid=\"" + obj.attr("cid") + "\" class=\"btn-success col-lg-4 col-lg-offset-8\"/><br>");

        //--------------------ir for cred------------------------------------------------------------

        getIrforCred(obj);
    }
});

var loadDiscRows = function (parentUl, obj) {

    var url = ApiEndpoint;

    url += "MZSearch/GetOneDisc?rtdiscId=" + obj.attr("did");

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Шифр" + "</span><span class=\"col-md-6\">" + value.dShifr + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Повна назва" + "</span><span class=\"col-md-6\">" + value.dNameFull + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Скорочена назва" + "</span><span class=\"col-md-6\">" + value.dName + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Напрям" + "</span><span class=\"col-md-6\">" + value.dSpec + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Напрям за кафедрою" + "</span><span class=\"col-md-6\">" + value.dSpecSub + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Абревіатура" + "</span><span class=\"col-md-6\">" + value.dAbbr + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Цикл" + "</span><span class=\"col-md-6\">" + value.dCycle + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Статус" + "</span><span class=\"col-md-6\">" + value.dStatus + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Дата зміни статусу" + "</span><span class=\"col-md-6\">" + value.dStatusDate + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Актуальність" + "</span><span class=\"col-md-6\">" + value.dAct + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Дата зміни актуальності" + "</span><span class=\"col-md-6\">" + value.dCreateDate + "</span></li>");

            });

            $("#itemcontainer .itemcol").slideDown("slow");
        }

    });

}

var getIrForDisc = function (obj) {

    var url = ApiEndpoint;

    url += "MZSearch/GetIrD?rtdiscId=" + obj.attr("did");

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            var prev = null;
            $.each(data.Data, function (key, value) {
                if (prev != value.kind) {
                    $("#ircontainer").append("<div class=\"ironediv\"><div class=\"col-md-12 kind\">" + value.kind + "</div><br></div>");
                    $("#ircontainer .ironediv").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                } else {
                    $("#ircontainer .ironediv").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                }
            });
        }
    });
}

var loadCredRows = function (parentUl, obj) {

    var url = ApiEndpoint;

    url += "MZSearch/GetOneCred?ccredId=" + obj.attr("cid");

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Назва" + "</span><span class=\"col-md-6\">" + value.cNameShort + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Повна назва" + "</span><span class=\"col-md-6\">" + value.cName + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Назва дисципліни" + "</span><span class=\"col-md-6\">" + value.cDisc + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Шифр дисципліни" + "</span><span class=\"col-md-6\">" + value.cShifr + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Форма" + "</span><span class=\"col-md-6\">" + value.cForm + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Абревіатура" + "</span><span class=\"col-md-6\">" + value.cAbbr + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Цикл" + "</span><span class=\"col-md-6\">" + value.cCycle + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Термін" + "</span><span class=\"col-md-6\">" + value.cTerm + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Актуальність" + "</span><span class=\"col-md-6\">" + value.cAct + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Дата зміни актуальності" + "</span><span class=\"col-md-6\">" + value.cCreateDate + "</span></li>");
                
            });
            $("#itemcontainer .itemcol").slideDown("slow");
        }

    });
}

var getIrforCred = function (obj) {

    var url = ApiEndpoint;

    url += "MZSearch/GetIrC?ccredId=" + obj.attr("cid");

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            var prev = null;
            $.each(data.Data, function (key, value) {
                if (prev != value.kind) {
                    $("#ircontainer").append("<div><div class=\"col-md-12 kind\">" + value.kind + "</div><br></div>");
                    $("#ircontainer div").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                } else {
                    $("#ircontainer div").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                }
            });
        }
    });
};


$(document).on("click", ".ironediv p", function () {

    $(".ircol").remove();
    $(".irrow_a").attr("class", "irrow");
    $(".ironediv div br").remove();
    $(".ironediv div input").remove();

    $(this).attr("class", "irrow_a");

    var parentDiv = $(this).parent();

    parentDiv.append("<ul class=\"ircol\"></ul>");
    console.log(parentDiv);

    var parentUl = parentDiv.children(".ircol");
    console.log(parentUl);

    $(".ircol").css("display", "none");

    var url = ApiEndpoint;
    url += "MZSearch/GetOneIr?irlevelId=" + $(this).attr("iid");

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Номер протоколу" + "</span><span class=\"col-md-6\">" + value.DocNumber + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Дата протоколу" + "</span><span class=\"col-md-6\">" + value.DocDate + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Гриф" + "</span><span class=\"col-md-6\">" + value.stamp + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Бібліографічний опис" + "</span><span class=\"col-md-6\">" + value.bibliog + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Анотація" + "</span><span class=\"col-md-6\">" + value.Annotation + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Посилання" + "</span><a href=\"#\" class=\"col-md-6\">" + "http://wwwwvvvwww" + "</a></li>");
                parentDiv.append("<div><input type=\"button\" value=\"Редагувати\" iid=\"" + $(this).attr("iid") + "\" class=\"btn-success col-lg-4 col-lg-offset-3\"/><input type=\"button\" value=\"Відкріпити\" iid=\"" + $(this).attr("iid") + "\" class=\"btn-success col-lg-4 col-lg-offset-1\"/><br></div>");
            });
            $(".ironediv .ircol").slideDown("slow");
        }
    });


});


$(document).on("click", "#itemcontainer div input", function() {
    var obj = $(this);
    var popContainer = $(".popContainer");

    popContainer.children().remove();

    popContainer.append("<ul class=\"itemcol col-md-5\"></ul>");
    var parentUl = popContainer.children("ul");

    if ($("#body_isdisc").attr("value") == "True") {

        //-----------------------for disc---------------------------------
        loadDiscRows(parentUl, obj);

        //--------------------ir for disc-----------------------------------------------------
        

    } else if ($("#body_isdisc").attr("value") == "False") {

        loadCredRows(parentUl, obj);

    }


    $(".popup-link-1").click();



});


