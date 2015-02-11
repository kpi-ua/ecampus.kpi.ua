$(document).ready(function () {
    $("#view_tab").show();
    $("#view_tab").addClass('active');

    var irId = window.location.search.split('=')[1];

    API.getData(["Ir", "GetContributors"], {
        id: irId
    }, function (data) {
        var html = "";
        $.each(data, function (key, value) {
            //условие что б создателя не выводило
            html += "<span class='view-person'>" + (value.name ? value.name : "") + (value.surname ? value.surname : "") + ", " + (value.ptypeId ? value.ptypeName + ", " : "") + (value.ctypeId ? value.ctypeName + ", " : "") + (value.percent ? value.percent + "%" : "") + "</span><br/>";
        });
        $(".persons-block").append(html);
        $(".persons-block").append("<br/>");
    });


    API.getData(["Ir", "GetIr"], {
            id: irId
        }, function(data) {
            $(".info-block").append("<span>" + (data.dayNamesShort == null ? "" : "<u>Назва ресурсу:</u> " + data.NameShort + "</span><br/>") + "<span><u>Статус ресурсу:</u> " + (data.isPublic ? "Публічний" : "Приватний") + "</span><br/><span><u>Вид:</u> " + data.DcIrKindName + "</span>");
        });
    
    API.getData(["Ir", "GetExtraLangs"], {
        irId: irId
    }, function (data) {
        var html = "";
        $.each(data, function(key, value) {
            html += "<div>";
            html += "Мова " + value.Name + " - " + (value.IsLangContent ? "Основна мова" : "Інша мова") + "</br>";
            html += "<b>" + value.TitleBibliographic + "</b>";
            html += value.Annotation == null && value.Keywords == null ? "" : "<a lang_id='" + value.DcLanguageId + "' class='show_click'>[...]</a><div style='display:none' id='langbox" + value.DcLanguageId + "' class='langbox'>" + (value.annotation == null ? "" : "<u>Аннотації:</u> " + value.Annotation + "</br>") + (value.Keywords == null ? "" :"<u>Ключові слова:</u> " + value.Keywords + "</div>");
            html += "</div>";
        });
        $(".language-block").append(html);
        $(".show_click").click(function () {
            $("#langbox" + this.getAttribute('lang_id')).toggle();
        });
    });
});
