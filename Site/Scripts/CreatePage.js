var personList = [];
var langsList = [];

$(document).ready(function() {
    //loading values
    API.getData(["Ir", "GetPersonStatusType"], {}, function(data) {
        $.each(data, function(key, value) {
            $('#person_type').append("<option value=" + key + ">" + value + "</option>");
        });
    });
    
    API.getData(["Ir", "GetContributorType"], {}, function (data) {
        $.each(data, function (key, value) {
            $('#contrib_type').append("<option value=" + key + ">" + value + "</option>");
        });
    });





    //переменные
    var editPersons = false;

    

    //функции
    function expand(elementName, blockName) {
        if ($(elementName).hasClass("glyphicon-expand")) {
            $(elementName).removeClass("glyphicon-expand");
            $(elementName).addClass("glyphicon-collapse-down");
            $(blockName).hide();
        } else if ($(elementName).hasClass("glyphicon-collapse-down")) {
            $(elementName).removeClass("glyphicon-collapse-down");
            $(elementName).addClass("glyphicon-expand");
            $(blockName).show();
        }

    }

    function changeButtonNames(flag, saveButton, cancelButton) {
        if (flag) {
            $(saveButton).val("Сохранить");
            $(cancelButton).val("Отменить");
        } else {
            $(saveButton).val("Добавить");
            $(cancelButton).val("Очистить");
        }
    }

    function changePersonFields() {
        if (document.getElementById("kpi").checked) {
            $("#name").show();
            $("#surname").hide();
            $("#person_type").hide();
        } else {
            $("#name").hide();
            $("#surname").show();
            $("#person_type").show();
        }
    }

    function checkPersent() {
        if ($("#contrib_percent").val() != "") {
            var num = parseFloat($("#contrib_percent").val());
            if (num < 0 || num > 100 || isNaN(num)) {
                $.ambiance({
                    message: "Введите правильный процент в разделе Учасники",
                    type: "error",
                    fade: false
                });
                $("#contrib_percent").focus();
                return false;
            } else {
                $("#contrib_percent").val(num);
                return true;
            }
        }
        return true;
    }
    
    function checkSelect(elementName) {
        if ($(elementName+" option:selected").val() == "--") {
            return false;
        } else {
            return true;
        }
    }

    function checkInput(elementName) {
        if ($(elementName).val() == "") {
            return false;
        } else {
            return true;
        }
    }

    function loadPersons() {
        $(".persons-list").html("");
        for (var item in personList) {
            if (personList[item].selected) {
                $(".persons-list").append("<div><a person_id='" + item + "' class='delete-person'><b>[x]</b></a><a person_id=" + item + " class='edit-person'><b>" + (personList[item].name ? personList[item].name : "") + (personList[item].surname ? personList[item].surname : "") + ", " + (personList[item].ptype ? $("#person_type option[value=" + personList[item].ptype + "]").html() + ", " : "") + (personList[item].ctype ? $("#contrib_type option[value=" + personList[item].ctype + "]").html() + ", " : "") + (personList[item].percent ? personList[item].percent + "%" : "") + "</b></a></div>");
            } else {
                $(".persons-list").append("<div><a person_id='" + item + "' class='delete-person'>[x]</a><a person_id=" + item + " class='edit-person'>" + (personList[item].name ? personList[item].name : "") + (personList[item].surname ? personList[item].surname : "") + ", " + (personList[item].ptype ? $("#person_type option[value=" + personList[item].ptype + "]").html() + ", " : "") + (personList[item].ctype ? $("#contrib_type option[value=" + personList[item].ctype + "]").html() + ", " : "") + (personList[item].percent ? personList[item].percent + "%" : "") + "</a></div>");
            }
        }
        
        $(".delete-person").click(function () {
            var id = this.getAttribute("person_id");
            delete personList[id];
            personList = reloadArray(personList);
            loadPersons();
        });
        $(".edit-person").click(function() {
            $("#persons_radio").hide();
            editPersons = true;
            changeButtonNames(editPersons, "#add_person", "#clear_person");
            var id = this.getAttribute("person_id");
            $("#person_id").val(id);
            var per = personList[id];
            if (per.kpi) {
                $("#name").val(per.name);
                $("#kpi_person_info").val(per.id);
                $("#kpi_person_info").attr("role", per.role);
            } else {
                $("#surname").val(per.surname);
                $("#person_type").val(per.ptype);
            }
            $("#contrib_type").val(per.ctype);
            $("#contrib_percent").val(per.percent);
            for (var i in personList) {
                personList[i].selected = false;
            }
            personList[id].selected = true;
            loadPersons();
        });
    }

    function clearPersons() {
        $("#persons_radio").show();
        $("#name").val("");
        $("#surname").val("");
        $("#kpi_person_info").val("");
        $("#person_type").val("--");
        $("#contrib_type").val("--");
        $("#contrib_percent").val("");
        for (var i in personList) {
            personList[i].selected = false;
        }
        editPersons = false;
        changeButtonNames(editPersons, "#add_person", "#clear_person");
    }

    function reloadArray(list) {
        var newlist = [];
        for (var i in list) {
            if (list[i] != undefined) {
                newlist.push(list[i]);
            }
        }
        return newlist;
    }

    function editPerson() {
        var i = $("#person_id").val();
        if (personList[i].kpi) {
            personList[i].name = $("#name").val();
            personList[i].id = $("#kpi_person_info").val();
            personList[i].role = $("#kpi_person_info").attr("role");
        } else {
            personList[i].surname = $("#surname").val();
            personList[i].ptype = $("#person_type").val();
        }
        personList[i].ctype = $("#contrib_type").val();
        if (checkPersent()) {
            personList[i].percent = ($("#contrib_percent").val() != "" ? $("#contrib_percent").val() : null);
        } else {
            return false;
        }
        $("#persons_radio").show();
        editPersons = false;
        changeButtonNames(editPersons, "#add_person", "#clear_person");
        $("#person_id").val("");
        return true;
    }
    





    //события 
    $("#name").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: apiEndpoint + "Ir/GetPersonName?sessionId=" + ssid + "&name=" + $("#name").val(),
                success: function (data) {
                    response($.map(data.Data, function (value, key) {
                        return {
                            value: value.Name,
                            data: value.Id,
                            type: value.Accessority
                        };
                    }));
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            $("#kpi_person_info").val(ui.item.data);
            $("#kpi_person_info").attr("role", ui.item.type);
        }
    });

    $("#expand_persons").click(function() {
        expand("#expand_persons", ".persons-block");
    });

    $("#expand_info").click(function() {
        expand("#expand_info", ".info-block");
    });

    $("#private").click(function() {
        document.getElementById("public").checked = false;
    });
    $("#public").click(function() {
        document.getElementById("private").checked = false;
    });
    $("#kpi").click(function () {
        document.getElementById("notkpi").checked = false;
        changePersonFields();
    });
    $("#notkpi").click(function () {
        document.getElementById("kpi").checked = false;
        changePersonFields();
    });

    $("#add_person").click(function () {
        if (document.getElementById("kpi").checked && !editPersons) {
            for (var i in personList) {
                if (personList[i].id == $("#kpi_person_info").val()) {
                    $.ambiance({
                        message: "Невозможно добавить одного человека дважды",
                        type: "error",
                        fade: false
                    });
                    return;
                }
            }
        }
        if (editPersons) {
            if (editPerson()) {
                clearPersons();
                loadPersons();
            }
            return;
        }
        if (document.getElementById("kpi").checked) {
            if (checkInput("#name") && checkPersent() && $("#kpi_person_info").val() != "" && $("#kpi_person_info").attr("role") != "") {
                var obj1 = {
                    kpi: true,
                    id: $("#kpi_person_info").val(),
                    role: $("#kpi_person_info").attr("role"),
                    name: $("#name").val(),
                    ctype: $("#contrib_type").val(),
                    percent: ($("#contrib_percent").val() != "" ? $("#contrib_percent").val() : null)
                };
                personList.push(obj1);
            } else {
                $.ambiance({
                    message: "Проверьте правильность заполнения полей в разделе Учасники",
                    type: "error",
                    fade: false
                });
                return;
            }
        } else {
            if (checkInput("#surname") && checkSelect("#person_type") && checkPersent()) {
                var obj2 = {
                    kpi: false,
                    surname: $("#surname").val(),
                    ptype: $("#person_type").val(),
                    ctype: $("#contrib_type").val(),
                    percent: ($("#contrib_percent").val() != "" ? $("#contrib_percent").val() : null)
                };
                personList.push(obj2);
            } else {
                $.ambiance({
                    message: "Проверьте правильность заполнения полей",
                    type: "error",
                    fade: false
                });
                return;
            }
        }
        loadPersons();
        clearPersons();
    });

    $("#clear_person").click(function () {
        clearPersons();
        loadPersons();
    });




    //раздел языков 
    //загрузка
    API.getData(["Ir", "GetLang"], {}, function (data) {
        $.each(data, function (key, value) {
            $('#lang').append("<option value=" + key + ">" + value + "</option>");
        });
    });

    //переменные
    var editLangs = false;
    var mainLang = true;


    //функции
    function changeLangType(main) {
        if (main) {
            $("#lang_name_label").html("Введите основной язык");
        } else {
            $("#lang_name_label").html("Введите дополнительный язык");
        }
    }
    
    function clearLangs() {
        $("#lang").val("--");
        $("#title").val("");
        $("#annotation").val("");
        $("#keywords").val("");
    }

    function chechSameLang(id) {
        for (var i in langsList) {
            if (langsList[i].lang == id) {
                $.ambiance({
                    message: "Невозможно добавить язык два раза",
                    type: "error",
                    fade: false
                });
                return false;
            }
        }
        return true;
    }

    function loadLangs() {
        $(".langs-list").html("");
        for (var i in langsList) {
            var html = "<div>";
            html += "<a lang_id='" + i + "' class='delete_lang'>";
            if (editLangs) {
                html += "<b>[x]</b>";
                html += "</a><a lang_id = '" + i + "' class='edit_lang'><b>[Редагувати]</b></a>";
            } else {
                html += "[x]";
                html += "</a><a lang_id = '" + i + "' class='edit_lang'>[Редагувати]</a>";
            }
            html += "Мова " + $("#lang option[value=" + langsList[i].lang + "]").html() + " - " + (langsList[i].clang ? "Основна мова" : "Інша мова")+"</br>";
            html += "<b>" + langsList[i].title + "</b>";
            html += "<a lang_id='" + i + "' class='show_click'>[...]</a><div style='display:none' id='langbox" + i + "' class='langbox'><u>Аннотації:</u> "+langsList[i].annotation + "</br><u>Ключові слова:</u> "+langsList[i].keywords+"</div>";
            html += "</div>";
            $(".langs-list").append(html);
        }
        $(".show_click").click(function () {
            var id = this.getAttribute("lang_id");
            $("#langbox" + id).toggle();
        });
        $(".delete_lang").click(function() {
            var id = this.getAttribute("lang_id");
            if (langsList[id].clang) {
                mainLang = true;
                changeLangType(mainLang);
            }
            delete langsList[id];
            langsList = reloadArray(langsList);
            loadLangs();
        });
    }



    //события
    $("#add_lang").click(function() {
        if (checkInput("#title") && checkSelect("#lang") && chechSameLang($("#lang").val())) {
            var obj = {
                lang: $("#lang").val(),
                title: $("#title").val(),
                annotation: $("#annotation").val(),
                keywords: $("#keywords").val(),
                clang: mainLang
            };
            langsList.push(obj);
            if (mainLang) {
                mainLang = false;
            }
            changeLangType(mainLang);
        } else {
            $.ambiance({
                message: "Проверьте правильность заполнения полей в разделе Языки",
                type: "error",
                fade: false
            });
            return;
        }
        clearLangs();
        loadLangs();
    });

    $("#clear_lang").click(function() {
        clearLangs();
    });
});