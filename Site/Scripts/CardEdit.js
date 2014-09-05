var persons = [];
var langs = [];
var changes_flag = false;
var changes_flag_l = false;
var ApiEndpoint;

$(document).ready(function () {
    
    ApiEndpoint = document.getElementById("ApiEndpoint").innerHTML;

    //load saved values from cookies
    var persons_cookies = getCookie("persons");
    var lags_cookies = getCookie("langs");
    if (persons_cookies != "")
    {
        persons = JSON.parse(persons_cookies);
    }
    load_members();

    if (lags_cookies != "")
    {
        langs = JSON.parse(lags_cookies);
    }
    load_langs();

    //load all datepickers
    $("#body_access_begin").datepicker();
    $("#body_date").datepicker();
    $("#body_access_end").datepicker();
    $("#body_doc_date").datepicker();

    if ($("#irId").text() != "") {
        var url = ApiEndpoint + "Ir/GetContributors?sessionId=" + $("#sssid").val() + "&irId=" + document.getElementById("irId").innerHTML;
        $.getJSON(url, function(data, status) {
            if (data.Data.length > 0) {
                $.each(data.Data, function (key, value) {
                    if (value.notKpi == false) {
                        persons[persons.length] = {                            
                            kpi: true,
                            name: value.name,
                            part_type: value.DcContributorTypeId,
                            part_percent: value.ContributionPercent,
                            id: value.IrContributorId
                        };
                    } else {
                        persons[persons.length] = {
                            kpi: false,
                            name: value.name,
                            per_type: value.status,
                            part_type: value.DcContributorTypeId,
                            part_percent: value.ContributionPercent,
                            id: value.IrContributorId
                        };
                    }
                });
            }
        });
    }

    $("#body_page_number").keyup(function() {
        $("#body_page_quantity").val($("#body_page_number").val() / 24);
        console.log($("#body_page_number").val() / 24);
    });
    
    $("#body_person_name").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: ApiEndpoint + "Ir/GetPersonName?session=" + $("#sssid").val() + "&name=" + $("#body_person_name").val(),
                success: function(data) {
                    response($.map(data.Data, function(value, key) {
                        return {
                            value: value.Name,
                            data: value.Id,
                            acs: value.Accessority
                        };
                    }));
                }
            });
        },
        minLength: 3,
        select: function(event, ui) {
            $("#person_name_id").val(ui.item.data);
            $("#person_name_id").attr["acs"] = ui.item.acs;
        }
    });


    //человеки----
    $("#body_person_accessory").change(function() {
        if (document.getElementById("body_person_accessory_0").checked) {
            $("#person_name_div").slideDown(300);
            $("#non-kpi-person").slideUp(300);
        } else {
            $("#person_name_div").slideUp(300);
            $("#non-kpi-person").slideDown(300);
        }
    });
    //сохранить
    $("#add_contr").click(function() {
        if ((document.getElementById("body_person_accessory_0").checked && document.getElementById("body_person_name").value == "") || (document.getElementById("body_person_accessory_1").checked && (document.getElementById("body_not_kpi_surname").value == "" || document.getElementById("body_person_type").selectedIndex == 0)) || document.getElementById("body_contribution_type").selectedIndex == 0 || document.getElementById("body_contribution_part").value == "") {
            alert("Необхідно заповнити всі поля у розділі \"Учасники\"");
            return false;
        }
        if (changes_flag == true) {
            changes_flag = false;
            if (document.getElementById("body_person_accessory_0").checked || persons[document.getElementById("person_id_value").value].kpi) {
                persons[document.getElementById("person_id_value").value] = {
                    kpi: true,
                    name: document.getElementById("body_person_name").value,
                    part_type: document.getElementById("body_contribution_type")[document.getElementById("body_contribution_type").selectedIndex].value,
                    part_percent: document.getElementById("body_contribution_part").value,
                    name_id: $("#person_name_id").val(),
                    name_acs: $("#person_name_id").attr["acs"]
                };
            } else {
                persons[document.getElementById("person_id_value").value] = {
                    kpi: false,
                    name: document.getElementById("body_not_kpi_surname").value,
                    per_type: document.getElementById("body_person_type")[document.getElementById("body_person_type").selectedIndex].value,
                    part_type: document.getElementById("body_contribution_type")[document.getElementById("body_contribution_type").selectedIndex].value,
                    part_percent: document.getElementById("body_contribution_part").value,
                };
            }
        } else {
            if (document.getElementById("body_person_accessory_0").checked) {
                persons[persons.length] = {
                    kpi: true,
                    name: document.getElementById("body_person_name").value,
                    part_type: document.getElementById("body_contribution_type")[document.getElementById("body_contribution_type").selectedIndex].value,
                    part_percent: document.getElementById("body_contribution_part").value,
                    name_id: $("#person_name_id").val(),
                    name_acs: $("#person_name_id").attr["acs"]
                };
            } else {
                persons[persons.length] = {
                    kpi: false,
                    name: document.getElementById("body_not_kpi_surname").value,
                    per_type: document.getElementById("body_person_type")[document.getElementById("body_person_type").selectedIndex].value,
                    part_type: document.getElementById("body_contribution_type")[document.getElementById("body_contribution_type").selectedIndex].value,
                    part_percent: document.getElementById("body_contribution_part").value,
                };
            }
        }
        load_members();
        return false;
    });
    //очистить
    $("#clear_contr").click(function() {
        document.getElementById("body_person_name").value = "";
        document.getElementById("body_contribution_part").value = "";
        document.getElementById("body_not_kpi_surname").value = "";
        document.getElementById("person_id_value").value = "";
        document.getElementById("body_person_type").selectedIndex = 0;
        document.getElementById("body_contribution_type").selectedIndex = 0;
        return false;
    });

    //вывести список
    function load_members() {
        $("#members").html("");
        for (var i = 0; i < persons.length; i++) {
            if (persons[i] == undefined) continue;
            $("#members").append('<div class="col-sm-3"></div><div class="col-sm-9"><a person_id="' + i + '" class="delete_person_button">[x]</a>            <a person_id="' + i + '" class="select_person_button">' + persons[i].name + ',' + document.getElementById("body_contribution_type")[persons[i].part_type].text + ',' + persons[i].part_percent + '%' + '</a></div>');
        }
        //удалить
        $(".delete_person_button").click(function () {
            delete persons[this.getAttribute("person_id")];
            load_members();

        });
        //выбрать
        $(".select_person_button").click(function () {
            changes_flag = true;
            var person_id = this.getAttribute("person_id");
            if (persons[person_id].kpi) {
                document.getElementById("body_person_accessory_0").checked = true;
            } else {
                document.getElementById("body_person_accessory_1").checked = true;
            }
            $("#body_person_accessory").change();
            document.getElementById("body_person_name").value = persons[person_id].name;
            document.getElementById("body_contribution_part").value = persons[person_id].part_percent;
            document.getElementById("body_not_kpi_surname").value = persons[person_id].name;
            document.getElementById("person_id_value").value = person_id;
            document.getElementById("body_person_type").selectedIndex = persons[person_id].per_type;
            document.getElementById("body_contribution_type").selectedIndex = persons[person_id].part_type;
        });
        var json = JSON.stringify(persons);
        document.getElementById("body_persons_json").value = json;
        setCookie("persons", json, 2);
    }
    
    //языки---
    //сохранить
    $("#add_lang").click(function () {
        if (document.getElementById("body_language").value == 0 || document.getElementById("body_lang_name").value == "") {
            alert("Необхідно заповнити всі поля у розділі \"Анотації\"");
            return false;
        }
        if (changes_flag_l == true) {
            changes_flag_l = false;
            langs[document.getElementById("lang_id_value").value] = {
                lang: document.getElementById("body_language").value,
                annot: document.getElementById("body_annotation").value,
                key_words: document.getElementById("body_lang_keywords").value,
                name: document.getElementById("body_lang_name").value,
                authors: document.getElementById("body_lang_authors").value
            };
        } else {
            langs[langs.length] = {
                lang: document.getElementById("body_language").value,
                annot: document.getElementById("body_annotation").value,
                key_words: document.getElementById("body_lang_keywords").value,
                name: document.getElementById("body_lang_name").value,
                authors: document.getElementById("body_lang_authors").value
            };
        }
        load_langs();
        return false;
    });
    //очистить
    $("#clear_lang").click(function () {
        document.getElementById("body_language").value = "--";
        document.getElementById("body_annotation").value = "";
        document.getElementById("body_lang_keywords").value = "";
        document.getElementById("body_lang_name").value = "";
        document.getElementById("body_lang_authors").value = "";
        return false;
    });

    //вывести список
    function load_langs() {
        $("#langs").html("");
        for (var i = 0; i < langs.length; i++) {
            if (langs[i] == undefined) continue;
            $("#langs").append('<div class="col-sm-3"></div><div class="col-sm-9"><a lang_id="' + i + '" class="delete_lang_button">[x]</a>            <a lang_id="' + i + '" class="select_lang_button">' + document.getElementById("body_language")[langs[i].lang].text + ',' + langs[i].name + '</a></div>');
        }
        //удалить
        $(".delete_lang_button").click(function () {
            delete langs[this.getAttribute("lang_id")];
            load_langs();

        });
        //выбрать
        $(".select_lang_button").click(function () {
            changes_flag_l = true;
            var lang_id = this.getAttribute("lang_id");
            document.getElementById("body_language").value = langs[lang_id].lang;
            document.getElementById("body_annotation").value = langs[lang_id].annot;
            document.getElementById("body_lang_keywords").value = langs[lang_id].key_words;
            document.getElementById("body_lang_name").value = langs[lang_id].name;
            document.getElementById("body_lang_authors").value = langs[lang_id].authors;
        });
        var json = JSON.stringify(langs);
        document.getElementById("body_langs_json").value = json;
        setCookie("langs", json, 2);
    }

    function ShowAlert(message) {
        alert(message);
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }

    $("#body_save").click(function () {
        setCookie("persons", "", 1);
        setCookie("langs", "", 1);
    });
});

