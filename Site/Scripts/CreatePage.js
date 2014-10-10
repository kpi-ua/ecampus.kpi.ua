var personList = [];
var languagesList = [];

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
    var editLanguages = false;

    

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
        $(".persons-list").html();
        for (var item in personList) {
            if (personList[item].selected) {
                $(".persons-list").append("<div><a class='.delete-person'><b>[x]</b></a><a personid=" + item + " class='.edit-person'><b>" + (personList[item].name ? personList[item].name : "") + (personList[item].surname ? personList[item].surname : "") + ", " + (personList[item].ptype ? $("#contrib_type option[value=" + personList[item].ptype + "]").html() : "") + " " + $("#contrib_type option[value=" + personList[item].ctype + "]").html() + ", " + (personList[item].percent ? personList[item].percent + "%" : "") + "</b></a></div>");
            }
            $(".persons-list").append("<div><a class='.delete-person'>[x]</a><a personid="+item+" class='.edit-person'>" + (personList[item].name ? personList[item].name : "") + (personList[item].surname ? personList[item].surname : "") + ", " + (personList[item].ptype ? $("#contrib_type option[value=" + personList[item].ptype + "]").html() : "") + " " + $("#contrib_type option[value=" + personList[item].ctype + "]").html() + ", " + (personList[item].percent ? personList[item].percent + "%" : "") + "</a></div>");
        }
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

    $("#add_person").click(function() {
        if (document.getElementById("kpi").checked) {
            if (checkInput("#name") && checkSelect("#contrib_type") && checkPersent() && $("#kpi_person_info").val() != "" && $("#kpi_person_info").attr("role") != "") {
                var obj1 = {
                    kpi: true,
                    name: $("#name").val(),
                    ctype: $("#contrib_type").val(),
                    percent: (checkPersent ? $("#contrib_percent").val() : null)
                };
                personList.push(obj1);
            } else {
                $.ambiance({
                    message: "Проверьте правильность заполнения полей в разделе Учасники",
                    type: "error",
                    fade: false
                });
            }
        } else {
            if (checkInput("#surname") && checkSelect("#person_type") && checkSelect("#contrib_type") && checkPersent()) {
                var obj2 = {
                    kpi: false,
                    surname: $("#surname").val(),
                    ptype: $("#person_type").val(),
                    ctype: $("#contrib_type").val(),
                    percent: (checkPersent ? $("#contrib_percent").val() : null)
                };
                personList.push(obj2);
            } else {
                $.ambiance({
                    message: "Проверьте правильность заполнения полей",
                    type: "error",
                    fade: false
                });
            }
        }
        loadPersons();
    });

    $("#clear_person").click(function () {
        $("#name").val("");
        $("#surname").val("");
        $("#person_type").val("--");
        $("#contrib_type").val("--");
        $("#contrib_percent").val("");
    });


});