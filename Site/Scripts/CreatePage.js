var personList = [];
var langsList = [];

$(document).ready(function () {
    //tabs
    $("#create_tab").addClass("active");
    
    //tree
    API.getData(["Ir", "GetIrKinds"], {}, function (data) {
        var html = "<ul>";
        $.each(data, function (key, value) {
            if (value.kinds.length > 0) {
                html += "<li value='" + value.id + "'>" + value.name;
                html += "<ul>";
                for (var item in value.kinds) {
                    html += "<li value='" + value.kinds[item].id + "'>" + value.kinds[item].name + "</li>";
                }
                html += "</ul>";
                html += "</li>";
            }
        });
        html += "</ul>";
        $("#search_tree").append(html);
        $.jstree.defaults.core.themes.icons = false;
        $("#search_tree").jstree();
    });

    $("#tree_select").click(function() {
        var array = $("#search_tree").jstree().get_bottom_selected(true);
        if (array.length > 0) {
            $("#type > optgroup > option[value='" + array[0].li_attr.value + "']").attr('selected', true).trigger('chosen:updated');
        } else {
            alert("Виберіть пункт у дереві!");
            return;
        }
        $('#myModal').modal('toggle');
        $("#search_tree").jstree().close_all();
    });

    $("#search_tree").on('changed.jstree', function (e, data) {
        if (data.node.children.length > 0) {
            $("#search_tree").jstree().open_node(data.node);
            $("#search_tree").jstree().deselect_node(data.node);
        }
    });

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

    API.getData(["Ir", "GetIrKinds"], {}, function (data) {
        var html = "";
        $.each(data, function (key, value) {
            if (value.kinds.length > 0) {
                html += "<optgroup label='" + value.name + "' value='" + value.id + "'>";
                for (var item in value.kinds) {
                    html += "<option value='" + value.kinds[item].id + "'>" + value.kinds[item].name + "</option>";
                }
                html += "</optgroup>";
            }
        });
        $("#type").append(html);
        $("#type").chosen();
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
            $(saveButton).val("Зберегти");
            $(cancelButton).val("Відмінити");
        } else {
            $(saveButton).val("Додати");
            $(cancelButton).val("Відмінити");
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
    if (document.getElementById("contrib_percent").value != "" && !editPersons && checkSelect("#contrib_type")) {
            var num = parseFloat($("#contrib_percent").val());
            if (num < 0 || num > 100 || isNaN(num)) {
                alert("Введіть правильний відсоток в розділі Учасники");
                $("#contrib_percent").focus();
                return false;
            } else {
                var percent = 0;
                for (var i in personList) {
                    if (personList[i].ctype == $("#contrib_type").val()) {
                        percent += personList[i].percent*1;
                    }
                }
                if (percent + num > 100) {
                    alert("Відсотковий внесок усіх учасників не може бути більшим ніж 100%");
                    return false;
                } else {
                    $("#contrib_percent").val(num);
                    return true;
                }
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
            clearPersons();
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
            $("#contrib_type").val(per.ctype == null ? "--" : per.ctype);
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
        $("#person_id").val("");
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
        personList[i].ctype = $("#contrib_type").val() != "--" ? $("#contrib_type").val() : null;
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
        $(".persons-block").toggle();
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
        if (document.getElementById("kpi").checked) {
            for (var i in personList) {
                if (editPersons && i == $("#person_id").val()) {
                    continue;
                }
                if (personList[i].id == $("#kpi_person_info").val()) {
                    alert("Неможливо два рази додати одного учасника");
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
                    ctype: $("#contrib_type").val() != "--" ? $("#contrib_type").val() : null,
                    percent: ($("#contrib_percent").val() != "" ? $("#contrib_percent").val() : null)
                };
                personList.push(obj1);
            } else {
                alert("Перевірте правильнісь заповнення полів у розділі Учасники");
                return;
            }
        } else {
            if (checkInput("#surname") && checkSelect("#person_type") && checkPersent()) {
                var obj2 = {
                    kpi: false,
                    surname: $("#surname").val(),
                    ptype: $("#person_type").val(),
                    ctype: $("#contrib_type").val() != "--" ? $("#contrib_type").val() : null,
                    percent: ($("#contrib_percent").val() != "" ? $("#contrib_percent").val() : null)
                };
                personList.push(obj2);
            } else {
                alert("Перевірте правильнісь заповнення полів у розділі Учасники");
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
            $("#lang_name_label").html("Введіть основну мову");
        } else {
            $("#lang_name_label").html("Введіть додаткову мову");
        }
    }
    
    function clearLangs() {
        changeSelectedLang();
        $("#lang").val("--");
        $("#title").val("");
        $("#annotation").val("");
        $("#keywords").val("");
        $("#lang_id").val("");
    }

    function chechSameLang(id) {
        for (var i in langsList) {
            if (editLangs && i == $("#lang_id").val()) {
                continue;
            }
            if (langsList[i].lang == id) {
                alert("Неможливо додати одну мову двічі");
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
            if (langsList[i].selected) {
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
        $(".edit_lang").click(function () {
            editLangs = true;
            changeButtonNames(editLangs, "#add_lang", "#clear_lang");
            var id = this.getAttribute("lang_id");
            $("#lang_id").val(id);
            $("#lang").val(langsList[id].lang);
            $("#title").val(langsList[id].title);
            $("#annotation").val(langsList[id].annotation);
            $("#keywords").val(langsList[id].keywords);
            changeLangType(langsList[id].clang);
            langsList[id].selected = true;
            loadLangs();
        });
    }

    function changeSelectedLang() {
        for (var item in langsList) {
            langsList[item].selected = false;
        }
    }



    //события
    $("#add_lang").click(function() {
        if (checkInput("#title") && checkSelect("#lang") && chechSameLang($("#lang").val())) {
            if (editLangs) {
                var i = $("#lang_id").val();
                langsList[i].lang = $("#lang").val();
                langsList[i].title = $("#title").val();
                langsList[i].annotation = $("#annotation").val();
                langsList[i].keywords = $("#keywords").val();
                editLangs = false;
                changeButtonNames(editLangs, "#add_lang", "#clear_lang");
            } else {
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
            }
            changeLangType(mainLang);
        } else {
            alert("Перевірте правильність заповнення полів у розділі Мови");
            return;
        }
        clearLangs();
        loadLangs();
    });

    $("#clear_lang").click(function () {
        editLangs = false;
        changeButtonNames(editLangs, "#add_lang", "#clear_lang");
        clearLangs();
        changeLangType(mainLang);
        loadLangs();
    });
    

    //saving
    $("#save").click(function () {
        $("#save").prop("disabled", true);
        //check mainlang
        var mainLangExist = false;
        for (var i in langsList) {
            if (langsList[i].clang == true) {
                mainLangExist = true;
            }
        }
        if (mainLangExist == false) {
            alert("Ви не ввели основну мову");
        }

        API.getData(["Ir", "AddIr"], {            
            kindId: $("#type").val(),
            isPublic: document.getElementById("public").checked ? 1 : 0
        }, function (data) {
            if (data == -1) {
                alert("Помилка при збереженні");
                return;
            } else {
                var irId = data;

                async.series([
                    function(callback) {
                        for (var i in langsList) {
                            var obj = langsList[i];
                            obj.irId = irId;
                            API.getData(["Ir", "AddExtraLang"], obj, function (data) {
                                if (data == -1) {
                                    alert("Помилка при збереженні мов перекладу");
                                }
                                callback();
                            });
                        }
                    },
                    function(callback) {
                        for (var i in personList) {
                            var obj = personList[i];
                            obj.irId = irId;
                            API.getData(["Ir", "AddContributor"], obj, function (data) {
                                if (data == -1) {
                                    alert("Помилка при авторів");
                                }
                                callback();
                            });
                        }
                    },
                function(callback) {
                    API.getUser(function (data) {
                        var user = data;

                        API.getData(["Ir", "AddContributor"], {
                            kpi: true,
                            irId: irId,
                            id: user.UserAccountId,
                            role: "creator",
                            name: user.FullName
                        }, function (data) {
                            if (data == -1) {
                                alert("Помилка при збереженні авторів");
                            }
                            callback();
                        });
                    });
                },
                function(callback) {
                    document.location.href = "View.aspx?id="+irId;
                }]);
            }
        });
    });
});