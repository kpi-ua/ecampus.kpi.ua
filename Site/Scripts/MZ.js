var ApiEndpoint;

$(document).ready(function () {

    ApiEndpoint = document.getElementById("ApiEndpoint").innerHTML;

    $(".chzn-select").chosen();

    GetYear();

    InitCreditTab();
    GetDiscList();

    /********************************************* RNP MODULE ***********************************************************************/
    $("#body_GetYear").change(function () {
        $("#body_GetKaf").empty();
        if (check_data($(this))) {
            $("#body_GetKaf").append("<option value='-1'>Виберіть кафедру</option>");
            var url = ApiEndpoint + "MzSearch/GetKafedra?year=" + $(this).find("option:selected").text();
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {
                        $i = 0;
                        $("#body_GetKaf").append("<option value='" + ($i++) + "'>" + value.Name + "</option>");
                    });
                }
            });
            $("#select_kaf").css('display', 'block');
            $("#select_riven").css('display', 'none');
            $("#select_prof").css('display', 'none');
            $("#select_form").css('display', 'none');
            $("#select_table").css('display', 'none');
            $("#select_group").css('display', 'none');
            $("#BodyContainer").css('display', 'none');
        }
    });

    function GetYear() {
        var url = ApiEndpoint + "MZSearch/GetYear";
        $("#body_GetYear").append("<option value='-1'>Виберіть рік</option>");
        $.getJSON(url, function (data, status) {
            if (data.Data.length > 0) {
                $i = 0;
                $.each(data.Data, function (key, value) {
                    //for ($i = 0; $i < data.Data.length;$i++)
                    $("#body_GetYear").append("<option value='" + ($i++) + "'>" + value.StudyYear + "</option>");
                });
            }
        });
    }

    $("#body_GetKaf").change(function () {
        $("#body_GetRiven").empty();
        if (check_data($(this))) {
            $("#body_GetRiven").append("<option value='-1'>Виберіть рівень</option>");
            var url = ApiEndpoint + "MzSearch/GetRiven";
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {
                        $i = 0;
                        $("#body_GetRiven").append("<option value='" + ($i++) + "'>" + value.Name + "</option>");
                    });
                }
            });
            $("#select_kaf").css('display', 'block');
            $("#select_riven").css('display', 'block');
            $("#select_prof").css('display', 'none');
            $("#select_form").css('display', 'none');
            $("#select_table").css('display', 'none');
            $("#select_group").css('display', 'none');
            $("#BodyContainer").css('display', 'none');
        }

    });

    $("#body_GetRiven").change(function () {
        $("#body_GetProf").empty();
        if (check_data($(this))) {
            $("#body_GetProf").append("<option value='-1'>Виберіть напрям</option>");
            var url = ApiEndpoint + "MzSearch/GetProf?kaf=" + $('#body_GetKaf').find("option:selected").text() + "&riv=" + $(this).find("option:selected").text();
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {
                        $i = 0;
                        $("#body_GetProf").append("<option value='" + value.TotalShifr + "'>" + value.TotalShifr + " " + value.Name + "</option>");
                    });
                }
            });
            $("#select_kaf").css('display', 'block');
            $("#select_riven").css('display', 'block');
            $("#select_prof").css('display', 'block');
            $("#select_form").css('display', 'none');
            $("#select_table").css('display', 'none');
            $("#select_group").css('display', 'none');
            $("#BodyContainer").css('display', 'none');

        }
    });

    $("#body_GetProf").change(function () {
        $("#body_GetForm").empty();
        if (check_data($(this))) {
            $("#body_GetForm").append("<option value='-1'>Виберіть форму</option>");
            var url = ApiEndpoint + "MzSearch/GetForm?shifr=" + $(this).val() + "&year=" + $("#body_GetYear").find("option:selected").text();
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {
                        $i = 0;
                        $("#body_GetForm").append("<option value='" + ($i++) + "'>" + value.Name + "</option>");
                    });
                }
            });
            $("#select_kaf").css('display', 'block');
            $("#select_riven").css('display', 'block');
            $("#select_prof").css('display', 'block');
            $("#select_form").css('display', 'block');
            $("#select_table").css('display', 'none');
            $("#select_group").css('display', 'none');
            $("#BodyContainer").css('display', 'none');
        }
    });

    $("#body_GetForm").change(function () {
        $("#body_sel_table").empty();

        $("#body_sel_table").append("<option value='-1'>Виберіть таблицю</option>");
        $("#body_sel_table").append("<option value='0'>Аудиторні години</option>");
        $("#body_sel_table").append("<option value='1'>Контрольні заходи та їх розподіл за семестрами</option>");
        $("#body_sel_table").append("<option value='2'>Для груп</option>");
        $("#select_kaf").css('display', 'block');
        $("#select_riven").css('display', 'block');
        $("#select_prof").css('display', 'block');
        $("#select_form").css('display', 'block');
        $("#select_table").css('display', 'block');
        $("#select_group").css('display', 'none');
        $("#BodyContainer").css('display', 'none');
    });

    $("#body_sel_table").change(function () {
        
        if ($("#body_sel_table").val() == 2) {
           // alert('ol');
            $("#body_GetGroup").empty();
            if (check_data($(this))) {
                $("#body_GetGroup").append("<option value='-1'>Виберіть групу</option>");
                var url = ApiEndpoint + "MzSearch/GetGroups?riven="+ $('#body_GetRiven').find("option:selected").text() + "&form=" + $("#body_GetForm").find("option:selected").text() + "&year=" + $("#body_GetYear").find("option:selected").text() + "&shifr=" + $("#body_GetProf").val();
                $.getJSON(url, function (data, status) {
                    if (data.Data.length > 0) {
                        $.each(data.Data, function (key, value) {
                            $i = 0;
                            $("#body_GetGroup").append("<option value='" + ($i++) + "'>" + value.Name + "</option>");
                        });
                    }
                });
                $("#select_kaf").css('display', 'block');
                $("#select_riven").css('display', 'block');
                $("#select_prof").css('display', 'block');
                $("#select_form").css('display', 'block');
                $("#select_table").css('display', 'block');
                $("#select_group").css('display', 'block');
                $("#BodyContainer").css('display', 'none');
            }
        }
        else {
            $("#select_riven").css('display', 'block');
            $("#select_prof").css('display', 'block');
            $("#select_form").css('display', 'block');
            $("#select_table").css('display', 'block');
            $("#select_group").css('display', 'none');
            $("#BodyContainer").css('display', 'block');
            //alert('okl');
            GetTable($("#body_sel_table").val());
        }
    });

    $("#body_GetGroup").change(function () {
        $("#BodyContainer").css('display', 'block');
        if ($("#body_GetGroup").val() != -1) GetTable($("#body_sel_table").val());
    });

    function GetTable(t_number) {
        for (var i = 0; i < 3; i++) $("#body_Table" + i).css('display', 'none');
        $("#body_Table" + t_number).css('display', 'block');
        var cycle = new Array;
        if (t_number == 0) {
            for (var j = 4; j < $("#body_Table0 tr").length; j++) { $("#body_Table0 tr").eq(j).remove(); j--; }

            //get cycles
            var j = 1;
            var url = ApiEndpoint + "MzSearch/GetCycle?shifr=" + $("#body_GetProf").val() + "&form=" + $("#body_GetForm").find("option:selected").text();
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {

                        cycle.push(value.Name);


                    });
                }
                //alert(cycle.length);
                var array = new Array();
                var array1 = new Array();
                var name;
                $j = 0;
                $.each(cycle, function (i, item) {
                    var part = $("<tbody />")
                    part.append("<tr><td colspan='10'><a href='#' class='cycle'>" + cycle[i] + "<i class='fa fa-caret-up'></i></a></td></tr>")
                    $("#body_Table0").append(part)
                    ////////////////////////////////////////////


                    //////////////////////////////////////////////
                    var url1 = ApiEndpoint + "MzSearch/GetHours?cycle=" + cycle[i] + "&shifr=" + $("#body_GetProf").val() + "&form=" + $("#body_GetForm").find("option:selected").text() + "&year=" + $("#body_GetYear").find("option:selected").text();
                    $.getJSON(url1, function (data, status) {

                        if (data.Data.length > 0) {


                            $.each(data.Data, function (key, value) {
                                if (array.length != 0) {
                                    var add = true;
                                    for (var i1 = 0; i1 < array.length; i1++) {
                                        if (array[i1] == value.ModuleName) {
                                            add = false;
                                            var number = i1 + 4;
                                        }
                                    }
                                    if (add) {

                                        array.push(value.ModuleName);
                                        array1.push(value.HourN);
                                        if (value.NName == "Лекція") { part.append("<tr class='tr-row' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>" + value.HourN + "</td><td>0</td><td>0</td><td>0</td></tr>"); }
                                        if (value.NName == "Практичне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>0</td><td>" + value.HourN + "</td><td>0</td><td>0</td></tr>");
                                        if (value.NName == "Лабораторне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>0</td><td>0</td><td>" + value.HourN + "</td><td>0</td></tr>");
                                        if (value.NName == "Самостійна робота") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td></td><td></td><td>" + value.HourN + "</td></tr>");
                                        //$('#body_Table0 tr').eq(number).find('td').eq(name).text(value.HourN);
                                    }
                                    else {

                                        array1[number - 4] += value.HourN;
                                        if (value.NName == "Лекція") name = 6;
                                        if (value.NName == "Практичне заняття") name = 7;
                                        if (value.NName == "Лабораторне заняття") name = 8;
                                        if (value.NName == "Самостійна робота") name = 9;
                                        $('.tr-row').eq(number - 4).find('td').eq(name).text(value.HourN);

                                    }
                                }
                                else {

                                    array.push(value.ModuleName);
                                    array1.push(value.HourN);
                                    if (value.NName == "Лекція") { part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>" + value.HourN + "</td><td>0</td><td>0</td><td>0</td></tr>"); }
                                    if (value.NName == "Практичне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td0></td><td>" + value.HourN + "</td><td>0</td><td>0</td></tr>");
                                    if (value.NName == "Лабораторне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td></td><td>" + value.HourN + "</td><td></td></tr>");
                                    if (value.NName == "Самостійна робота") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>0</td><td>0</td><td>0</td><td>" + value.HourN + "</td></tr>");
                                    //$('#body_Table0 tr').eq(number).find('td').eq(name).text(value.HourN);

                                }
                                //$("#body_Table0").append("<tr><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td>"+value.NName+"</td><td></td><td></td></tr>");
                            });
                            //alert(array.length)
                        }
                        for (var j1 = 0; j1 < array1.length; j1++) $('.tr-row').eq(j1).find('td').eq(5).text(array1[j1]);
                        $(".cycle").on("click", function () {
                            if ($(this).find('i').hasClass('fa-caret-up')) {
                                $rows = $(this).parent().parent().parent().find('tr');
                                $(this).find('i').removeClass('fa fa-caret-up').addClass('fa fa-caret-down');
                                for (var i = 1; i < $rows.length; i++) $rows.eq(i).css('display', 'none');
                            }
                            else {
                                $rows = $(this).parent().parent().parent().find('tr');
                                $(this).find('i').removeClass('fa fa-caret-down').addClass('fa fa-caret-up');
                                for (var i = 1; i < $rows.length; i++) $rows.eq(i).css('display', 'table-row');

                            }
                            e.preventDefault();
                            return false;

                        });

                    }
                    //,  $("#body_Table0").append("<tr><td>" + cycle[i] + "</td></tr>")
                   );



                })


            });

        }


        if (t_number == 1) {
            for (var j = 2; j < $("#body_Table1 tr").length; j++) { $("#body_Table1 tr").eq(j).remove(); j--; }

            //get cycles
            var j = 1;
            var url = ApiEndpoint + "MzSearch/GetCycle?shifr=" + $("#body_GetProf").val() + "&form=" + $("#body_GetForm").find("option:selected").text();
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {

                        cycle.push(value.Name);


                    });
                }
                //alert(cycle.length);
                var array = new Array();
                var array1 = new Array();
                var name;
                $j = 0;
                $.each(cycle, function (i, item) {
                    var part = $("<tbody />");
                    part.append("<tr><td colspan='11'><a href='#' class='cycle1'>" + cycle[i] + "<i class='fa fa-caret-up'></i></a></td></tr>");
                    $("#body_Table1").append(part);
                    ////////////////////////////////////////////


                    //////////////////////////////////////////////
                    var url1 = ApiEndpoint + "MzSearch/GetEvents?cycle=" + cycle[i] + "&shifr=" + $("#body_GetProf").val() + "&form=" + $("#body_GetForm").find("option:selected").text() + "&year=" + $("#body_GetYear").find("option:selected").text();
                    $.getJSON(url1, function (data, status) {

                        if (data.Data.length > 0) {


                            $.each(data.Data, function (key, value) {

                                if (array.length != 0) {
                                    var add = true;
                                    for (var i1 = 0; i1 < array.length; i1++) {
                                        if (array[i1] == value.ModuleName) {
                                            add = false;
                                            var number = i1;
                                        }
                                    }
                                    if (add) {

                                        array.push(value.ModuleName);

                                        if (value.Name == "Екзамен") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Залік") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Диференційований залік") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>" + value.Semester + "д</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Курсовий проект") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Курсова робота") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Робота контрольна") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Розрахунково-графічна робота") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td></tr>"); }
                                        if (value.Name == "Домашня контрольна робота") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td></tr>"); }
                                        //if (value.Name == "Розрахунково-графічна робота") { part.append("<tr class='tr-row' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td></tr>"); }


                                        //$('#body_Table0 tr').eq(number).find('td').eq(name).text(value.HourN);
                                    }
                                    else {


                                        if (value.Name == "Екзамен") name = 3;
                                        if (value.Name == "Залік") name = 4;
                                        if (value.Name == "Диференційований залік") name = 4;
                                        if (value.Name == "Робота контрольна") name = 5;
                                        if (value.Name == "Курсовий проект") name = 6;
                                        if (value.Name == "Курсова робота") name = 7;
                                        if (value.Name == "Розрахунково-графічна робота") name = 8;
                                        if (value.Name == "Домашня контрольна робота") name = 9;


                                        $('.tr-row1').eq(number).find('td').eq(name).text(value.Semester);

                                    }
                                }
                                else {

                                    array.push(value.ModuleName);
                                    if (value.Name == "Екзамен") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Залік") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Диференційований залік") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>" + value.Semester + "д</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Курсовий проект") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Курсова робота") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Робота контрольна") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Розрахунково-графічна робота") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td><td>-</td></tr>"); }
                                    if (value.Name == "Домашня контрольна робота") { part.append("<tr class='tr-row1' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>" + value.Semester + "</td><td>-</td></tr>"); }
                                    //$('#body_Table0 tr').eq(number).find('td').eq(name).text(value.HourN);

                                }
                                //$("#body_Table1").append("<tr><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td>"+value.NName+"</td><td></td><td></td></tr>");
                            });
                            //alert(array.length)
                        }

                        $(".cycle1").on("click", function () {

                            if ($(this).find('i').hasClass('fa-caret-up')) {
                                $rows = $(this).parent().parent().parent().find('tr');
                                $(this).find('i').removeClass('fa fa-caret-up').addClass('fa fa-caret-down');
                                for (var i = 1; i < $rows.length; i++) $rows.eq(i).css('display', 'none');
                            }
                            else {
                                $rows = $(this).parent().parent().parent().find('tr');
                                $(this).find('i').removeClass('fa fa-caret-down').addClass('fa fa-caret-up');
                                for (var i = 1; i < $rows.length; i++) $rows.eq(i).css('display', 'table-row');

                            }
                            e.preventDefault();
                            return false;

                        });

                    }
                    //,  $("#body_Table0").append("<tr><td>" + cycle[i] + "</td></tr>")
                   );



                })


            });

        }


        if (t_number == 2) {
            for (var j = 4; j < $("#body_Table2 tr").length; j++) { $("#body_Table2 tr").eq(j).remove(); j--; }
            
            //get cycles
            var j = 1;
            var url = ApiEndpoint + "MzSearch/GetCycle?shifr=" + $("#body_GetProf").val() + "&form=" + $("#body_GetForm").find("option:selected").text();
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {

                        cycle.push(value.Name);


                    });
                }
                //alert(cycle.length);
                var array = new Array();
                var array1 = new Array();
                var name;
                $j = 0;
                $.each(cycle, function (i, item) {
                    var part = $("<tbody />")
                    part.append("<tr><td colspan='10'><a href='#' class='cycle2'>" + cycle[i] + "<i class='fa fa-caret-up'></i></a></td></tr>")
                    $("#body_Table2").append(part)
                    ////////////////////////////////////////////


                    //////////////////////////////////////////////
                    var url1 = ApiEndpoint + "MzSearch/GetGroupTable?groupp=" + $("#body_GetGroup").find("option:selected").text() + "&cycle=" + cycle[i] + "&year=" + $("#body_GetYear").find("option:selected").text();
                    $.getJSON(url1, function (data, status) {

                        if (data.Data.length > 0) {


                            $.each(data.Data, function (key, value) {
                                //alert(value.ModuleName);
                                if (array.length != 0) {
                                    var add = true;
                                    for (var i1 = 0; i1 < array.length; i1++) {
                                        if (array[i1] == value.ModuleName) {
                                            add = false;
                                            var number = i1 + 4;
                                        }
                                    }
                                    if (add) {

                                        array.push(value.ModuleName);
                                        array1.push(value.HourN);
                                        
                                        if (value.NName == "Лекція") { part.append("<tr class='tr-row' ><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>" + value.HourN + "</td><td>0</td><td>0</td><td>0</td></tr>"); }
                                        if (value.NName == "Практичне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>0</td><td>" + value.HourN + "</td><td>0</td><td>0</td></tr>");
                                        if (value.NName == "Лабораторне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>0</td><td>0</td><td>" + value.HourN + "</td><td>0</td></tr>");
                                        if (value.NName == "Самостійна робота") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td></td><td></td><td>" + value.HourN + "</td></tr>");
                                        //$('#body_Table0 tr').eq(number).find('td').eq(name).text(value.HourN);
                                    }
                                    else {

                                        array1[number - 4] += value.HourN;
                                        if (value.NName == "Лекція") name = 6;
                                        if (value.NName == "Практичне заняття") name = 7;
                                        if (value.NName == "Лабораторне заняття") name = 8;
                                        if (value.NName == "Самостійна робота") name = 9;
                                        $('.tr-row').eq(number - 4).find('td').eq(name).text(value.HourN);

                                    }
                                }
                                else {

                                    array.push(value.ModuleName);
                                    array1.push(value.HourN);
                                    if (value.NName == "Лекція") { part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>" + value.HourN + "</td><td>0</td><td>0</td><td>0</td></tr>"); }
                                    if (value.NName == "Практичне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td0></td><td>" + value.HourN + "</td><td>0</td><td>0</td></tr>");
                                    if (value.NName == "Лабораторне заняття") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td></td><td>" + value.HourN + "</td><td></td></tr>");
                                    if (value.NName == "Самостійна робота") part.append("<tr class='tr-row'><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td>0</td><td>0</td><td>0</td><td>0</td><td>" + value.HourN + "</td></tr>");
                                    //$('#body_Table0 tr').eq(number).find('td').eq(name).text(value.HourN);

                                }
                                //$("#body_Table0").append("<tr><td>" + (j++) + "</td><td>" + value.ModuleName + "</td><td>" + value.CafName + "</td><td>" + value.Credits + "</td><td>" + value.Hours + "</td><td></td><td></td><td>"+value.NName+"</td><td></td><td></td></tr>");
                            });
                            //alert(array.length)
                        }
                        
                        for (var j1 = 0; j1 < array1.length; j1++) {
                            setTimeout(10);
                            $('.tr-row').eq(j1).find('td').eq(5).text(array1[j1]);
                            
                           //alert(array1[j1]);
                        }
                        $(".cycle2").on("click", function () {
                            if ($(this).find('i').hasClass('fa-caret-up')) {
                                $rows = $(this).parent().parent().parent().find('tr');
                                $(this).find('i').removeClass('fa fa-caret-up').addClass('fa fa-caret-down');
                                for (var i = 1; i < $rows.length; i++) $rows.eq(i).css('display', 'none');
                            }
                            else {
                                $rows = $(this).parent().parent().parent().find('tr');
                                $(this).find('i').removeClass('fa fa-caret-down').addClass('fa fa-caret-up');
                                for (var i = 1; i < $rows.length; i++) $rows.eq(i).css('display', 'table-row');

                            }
                            e.preventDefault();
                            return false;

                        });

                    }
                    //,  $("#body_Table0").append("<tr><td>" + cycle[i] + "</td></tr>")
                   );



                })


            });

        }


    }

    /*$('.cycle').click(function () {      
    });*/
});


function check_data($object) {
    if (($object).val() >= 0) return true;
    else return false;
}


/********************************************DISCIPLINE Module ************************************************************/
function GetDiscList() {
    var url = ApiEndpoint + "MZSearch/GetDiscList";
    $("#body_DiscList").append("<option value='-1'>Не обрано</option>");
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#body_DiscList").append("<option value='" + value.DcDisciplineId + "'>" + value.Name + "</option>");
            });
        }
    });
}

function showPopupWindow()
{ 
    var winWidth = $(window).width();
    var boxWidth = winWidth - 200;

    var scrollPos = $(window).scrollTop();

    /* Вычисляем позицию */
    var disWidth = (winWidth - boxWidth) / 2
    var disHeight = scrollPos + 40;;

    /* Добавляем стили к блокам */
    $('.popup-box').css({ 'width': boxWidth + 'px', 'left': disWidth + 'px', 'top': disHeight + 'px' });

    var containerHeight = $("html").height() - 200;

    $(".popContainer").css("max-height", containerHeight);
    $(".popContainer").css("min-height", containerHeight);

    $("#popup-box-1").show("slow");

    $('.close').click(function () {
        /* Скрываем тень и окно, когда пользователь кликнул по X */
        $('[id^=popup-box-]').hide();
        $("html,body").css("overflow", "auto");
    });
}

function DiscListChange()
{
    var url = ApiEndpoint + "MZSearch/GetSpecialityD?" + "&discId=" + $("#body_DiscList").find("option:selected").val();

    console.log("In DiscList change. JSON url = " + url);

    $("#body_SpecList").empty();
    $("#body_SpecList").append("<option value='-1'>Не обрано</option>");
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#body_SpecList").append("<option value='" + value.RtProfTrainTotalId + "'>" + value.TotalShifr + " " + value.Name + "</option>");
            });
        }
    });
}

function SearchDisc()
{
    $("#sTitle").slideDown("slow");
    $("#sresult").slideDown("slow");
    $("#DiscContainer div").remove();
    $("#ircontainer div").remove();

    $("#sresult").css('display', 'inline');

    var url = ApiEndpoint;

    if ($("#body_DiscList").find("option:selected").val() > -1 && $("#body_SpecList").find("option:selected").val() > -1) {
        url += "MZSearch/GetDisc?" + "&rtpttId=" + $("#body_SpecList").find("option:selected").val() +
                                     "&dcdiscId=" + $("#body_DiscList").find("option:selected").val();
    }
    else
        if ($("#body_DiscList").find("option:selected").val() > -1) {
            url += "MZSearch/GetDiscD?" + "&dcdiscId=" + $("#body_DiscList").find("option:selected").val();
        }
        else
            if($("#body_SpecList").find("option:selected").val() > -1) {
                url += "MZSearch/GetDiscC?" + "&rtpttId=" + $("#body_SpecList").find("option:selected").val();
            }  else
            {
                alert("Choose something");
                return;
            }   

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value)
            {
                var rdId = value.RtDisciplineId;
                var discName = value.NameFull;
                $("#DiscContainer").append("<div class=\"oneitem col-md-12\">" +
                                                "<span class=\"itemrow\" discId=\"" + rdId + "\" onclick=\"ShowIrList(" + rdId + ")\">" + discName + "</span>" +
                                                "<input type=\"button\" value=\"[...]\" discId=\"" + rdId + "\" class=\"btn-success\" onclick=\"ShowDiscCard(" + rdId + ")\"/>" + 
                                           "</div>");
            });
        }
    });

}

function ShowDiscCard(id)
{
    var rdId = id;
    var popContainer = $("#popup-box-1 .popContainer");

    popContainer.children().remove();

    popContainer.append(
        "<div class =\"row firstRow\">" +
            "<div class=\"col-md-5\">" +
                "<ul id=\"dul\" class=\"itemcol col-md-12\"></ul>" +
            "</div>" +
       "</div>");

    var parentUl = popContainer.children(".firstRow").children().children("#dul");

        //-----------------------for disc---------------------------------

    loadDiscRows(parentUl, rdId);

        //----------------cred for disc------------------------------------------------------
    popContainer.append(
            "<div class =\"row secondRow\">" +
                "<div class=\"col-md-5\">" +
                    "<div class=\"col-lg-12 label label-warning\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
                        "Кредитні модулі" +
                    "</div>" +
                    "<div id=\"cpop\" class=\"itemcol col-md-12\">" +
                    "</div>" +
                "</div>" +
            "</div>");

    getCredForDisc($("#cpop"), rdId);

        //--------------------rnp for disc----------------------------------------------------
    popContainer.children(".secondRow").append(
            "<div class=\"col-md-5 col-md-offset-1\">" +
                "<div class=\" col-md-12 label label-warning  margin\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
                    "Рядки РНП" +
                "</div>" +
                "<div id=\"rnppop\" class=\"itemcol col-md-12 margin\">" +
                "</div>" +
           "</div>");

    getRNPForDisc($("#rnppop"), rdId);

    showPopupWindow();
}

function ShowIrList2(id)
{
    $(".itemcol").remove();
    $(".itemrow_a").attr("class", "itemrow");
    //$("#DiscContainer div input").remove();
    //$("#DiscContainer div br").remove();

    //$("#ircontainer div").remove();

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
        getIrForDorC(obj, $("#ircontainer"));

    } else if ($("#body_isdisc").attr("value") == "False") {

        //---------------------for cred-------------------------------------------------------------

        loadCredRows(parentUl, obj);
        parentDiv.append("<input type=\"button\" value=\"Детальніше\" cid=\"" + obj.attr("cid") + "\" class=\"btn-success col-lg-4 col-lg-offset-8\"/><br>");

        //--------------------ir for cred------------------------------------------------------------

        getIrForDorC(obj, $("#ircontainer"));
    }

}

var loadDiscRows = function (parentUl, rdId) {

    var url = ApiEndpoint;

    url += "MZSearch/GetOneDisc?rtdiscId=" + rdId;

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

            $("#DiscContainer .itemcol").slideDown("slow");
        }

    });
}

var getCredForDisc = function (parent, rdId) {

    var url = ApiEndpoint;

    url += "MZSearch/GetDiscDetailC?rtdiscId=" + rdId;

    console.log("Inside getCredForDisc. JSON url:" + url);

    $.getJSON(url, function (data, status) {
        console.log("Inside getCredForDisc JSON. Data length " + data.Data.length);
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                console.log("Inside getCredForDisc parent appending.");
                parent.append("<div class=\"oneitem\" ><p class=\"itemrow\"" + "\">" + value.NameFull + "</p></div>");
            });
        }
    });

};

var getRNPForDisc = function (parent, rdId) {
    var url = ApiEndpoint;

    url += "MZSearch/GetDiscDetailR?rtdiscId=" + rdId;

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                parent.append("<div class=\"oneitem\" ><p class=\"itemrow\"" + "\">" + value.NameFull + "</p></div>");
            });
        }
    });
};

var getIrForDisc = function (parent, rtId)
{
    var url = ApiEndpoint;

    url += "MZSearch/GetIrD?rtdiscId=" + rtId;

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            var prev = null;
            $.each(data.Data, function (key, value) {
                if (prev != value.kind) {
                    parent.append("<div class=\"ironediv\"><div class=\"col-md-12 kind\">" + value.kind + "</div><br></div>");
                    parent.children(".ironediv").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                } else {
                    parent.children(".ironediv").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                }
            });
        }
    });
}


/********************************************Сredit Module ************************************************************/
function InitCreditTab()
{
    GetCredList();
    GetCredSpecList();
    GetStudyFormList();
}

function GetCredList() {
    var url = ApiEndpoint + "MZSearch/GetCredList";
    $("#body_CredList").append("<option value='-1'>Не обрано</option>");
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#body_CredList").append("<option value='" + value.DcCreditModuleId + "'>" + value.Name + "</option>");
            });
        }
    });
}

function GetCredSpecList() {
    var url = ApiEndpoint + "MZSearch/GetSpecialityList";
    $("#body_CredSpecList").append("<option value='-1'>Не обрано</option>");
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#body_CredSpecList").append("<option value='" + value.RtProfTrainTotalId + "'>" + value.TotalShifr + " " + value.Name + "</option>");
            });
        }
    });
}

function GetStudyFormList() {
    var url = ApiEndpoint + "MZSearch/GetStudyFormList";
    $("#body_CredSFList").append("<option value='-1'>Не обрано</option>");
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#body_CredSFList").append("<option value='" + value.DcStudyFormId + "'>" + value.Name + "</option>");
            });
        }
    });
}

function CredListChange() {
    var url = ApiEndpoint + "MZSearch/GetSpecialityC?" + "&dccredId=" + $("#body_CredList").find("option:selected").val();

    console.log("In CreditList change. JSON url = " + url);

    $("#body_CredSpecList").empty();
    $("#body_CredSpecList").append("<option value='-1'>Не обрано</option>");
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#body_CredSpecList").append("<option value='" + value.RtProfTrainTotalId + "'>" + value.TotalShifr + " " + value.Name + "</option>");
            });
        }
    });
}

function SearchCred() {
    $("#sTitle").slideDown("slow");
    $("#credSearchResult").slideDown("slow");
    $("#CredContainer div").remove();

    $("#credSearchResult").css('display', 'inline');

    var url = ApiEndpoint;

    var selectedCred = $("#body_CredList").find("option:selected").val();
    var selectedSpec = $("#body_CredSpecList").find("option:selected").val();
    var selectedSF = $("#body_CredSFList").find("option:selected").val();

    if (selectedCred == -1 && selectedSpec == -1 && selectedSF == -1)
    {
        alert("Choose something");
        return;
    }
    else
    {
        url += "MZSearch/GetCredX?" + "&credId=" + selectedCred + "&specId=" + selectedSpec + "&sfId=" + selectedSF;
    }

    console.log("In CredSearch. JSON url: " + url);

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            console.log("In CredSearch JSON true. ");
            $.each(data.Data, function (key, value) {
                var credId = value.cCreditModuleId;
                var credName = value.NameFull;
                $("#CredContainer").append("<div class=\"oneitem col-md-12\">" +
                                                "<span class=\"itemrow\" credId=\"" + credId + "\" onclick=\"ShowIrList(" + credId + ")\">" + credName + "</span>" +
                                                "<input type=\"button\" value=\"[...]\" credId=\"" + credId + "\" class=\"btn-success\" onclick=\"ShowCredCard(" + credId + ")\"/>" +
                                           "</div>");
            });
        }
        else {
            console.log("In CredSearch JSON false. ");
            $("#CredContainer").append("<div>" + "Записів не знайдено" + "</div>");
        }
    });
}

function ShowCredCard(id)
{
    var credId = id;
    var popContainer = $("#popup-box-2 .popContainer");

    popContainer.children().remove();

    popContainer.append(
        "<div class =\"row firstRow\">" +
            "<div class=\"col-md-5\">" +
                "<ul id=\"cul\" class=\"itemcol col-md-12\"></ul>" +
            "</div>" +
       "</div>");

    var parentUl = popContainer.children(".firstRow").children().children("#cul");

        //-----------------------for cred---------------------------------

    loadCredRows(parentUl, credId);

        //--------------------rnp for cred----------------------------------------------------
    popContainer.append(
        "<div class =\"row secondRow\">" +
            "<div class=\"col-md-5\">" +
                "<div class=\"col-lg-12 label label-warning\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
                    "Рядки РНП" +
                "</div>" +
                "<div id=\"crnppop\" class=\"itemcol col-md-12\">" +
                "</div>" +
            "</div>" +
        "</div>");

    getRNPForCred($("#crnppop"), credId);

    showCredPopupWindow();
}

var loadCredRows = function (parentUl, credId) {

    var url = ApiEndpoint;

    url += "MZSearch/GetOneCred?ccredId=" + credId;

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Шифр" + "</span><span class=\"col-md-6\">" + value.cShifr + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Повна назва" + "</span><span class=\"col-md-6\">" + value.cName + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Скорочена назва" + "</span><span class=\"col-md-6\">" + value.cNameShort + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Абревіатура" + "</span><span class=\"col-md-6\">" + value.cAbbr + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Цикл" + "</span><span class=\"col-md-6\">" + value.cCicle + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Форма навчання" + "</span><span class=\"col-md-6\">" + value.cForm + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Актуальність" + "</span><span class=\"col-md-6\">" + value.cAct + "</span></li>");
                parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Дата зміни актуальності" + "</span><span class=\"col-md-6\">" + value.cCreateDate + "</span></li>");
            });

            //$("#CredContainer .itemcol").slideDown("slow");
        }
    });
}

var getRNPForCred = function (parent, credId) {
    var url = ApiEndpoint;

    url += "MZSearch/GetCredDetailR?ccredId=" + credId;

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                parent.append("<div class=\"oneitem\" ><p class=\"itemrow\"" + "\">" + value.NameFull + "</p></div>");
            });
        }
    });
};

var getIrForCred = function (parent, credId) {
    var url = ApiEndpoint;

    url += "MZSearch/GetIrC?ccredId" + credId;

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            var prev = null;
            $.each(data.Data, function (key, value) {
                if (prev != value.kind) {
                    parent.append("<div class=\"ironediv\"><div class=\"col-md-12 kind\">" + value.kind + "</div><br></div>");
                    parent.children(".ironediv").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                } else {
                    parent.children(".ironediv").append("<p class=\"irrow\" iid=\"" + value.levelId + "\">" + value.levelName + "</p>");
                }
            });
        }
    });
}

function showCredPopupWindow() {
    var winWidth = $(window).width();
    var boxWidth = winWidth - 200;

    var scrollPos = $(window).scrollTop();

    /* Вычисляем позицию */
    var disWidth = (winWidth - boxWidth) / 2
    var disHeight = scrollPos + 40;;

    /* Добавляем стили к блокам */
    $('.popup-box').css({ 'width': boxWidth + 'px', 'left': disWidth + 'px', 'top': disHeight + 'px' });

    var containerHeight = $("html").height() - 200;

    $(".popContainer").css("max-height", containerHeight);
    $(".popContainer").css("min-height", containerHeight);

    $("#popup-box-2").show("slow");

    $('.close').click(function () {
        /* Скрываем тень и окно, когда пользователь кликнул по X */
        $('[id^=popup-box-]').hide();
        $("html,body").css("overflow", "auto");
    });
}

$(document).on("click", "#CredContainer div span", function () {
    $(".itemcol").remove();
    $(".itemrow_a").attr("class", "itemrow");
    $("#CredContainer div input").remove();
    $("#CredContainer div br").remove();

    $("#ircontainer div").remove();

    $(this).attr("class", "itemrow_a");

    var parentDiv = $(this).parent();

    parentDiv.append("<ul class=\"itemcol\"></ul>");

    var parentUl = parentDiv.children(".itemcol");

    $("#CredContainer div .itemcol").css("display", "none");


    var credId = obj.attr("credId");

    getIrForCred($(this), credId);


    /*} else if ($("#body_isdisc").attr("value") == "False") {

        //---------------------for cred-------------------------------------------------------------

        loadCredRows(parentUl, obj);
        parentDiv.append("<input type=\"button\" value=\"Детальніше\" cid=\"" + obj.attr("cid") + "\" class=\"btn-success col-lg-4 col-lg-offset-8\"/><br>");

        //--------------------ir for cred------------------------------------------------------------

        getIrForDorC(obj, $("#ircontainer"));
    }*/
});


/**********************************************UNUSED CODE**************************************************************/
$(document).on("click", "#DiscContainer2 div input", function () {
    var obj = $(this);
    var rdId = obj.attr("discId");
    var popContainer = $(".popContainer");

    popContainer.children().remove();

    popContainer.append(
        "<div class =\"row firstRow\">" +
            "<div class=\"col-md-5\">" +
                "<ul id=\"dul\" class=\"itemcol col-md-12\"></ul>" +
            "</div>" +
       "</div>");

    var parentUl = popContainer.children(".firstRow").children().children("#dul");

    if ($("#body_isdisc").attr("value") == "True") {

        //-----------------------for disc---------------------------------

        loadDiscRows(parentUl, rdId);

        //--------------------ir for disc-----------------------------------------------------
        popContainer.children(".firstRow").append(
            "<div class=\"col-md-5 col-md-offset-1\">" +
                "<div class=\" col-lg-12 label label-warning\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
                    "Електронні інформаційні ресурси" +
                "</div>" +
                "<div id=\"irpop\" class=\"itemcol col-md-12\">" +
                "</div>" +
            "</div>");

        var irpopHeight = $(".itemcol").height() - 120;
        $("#irpop").css("max-height", irpopHeight);
        $("#irpop").css("min-height", irpopHeight);

        getIrForDorC($("#irpop"), rdId);

        //----------------cred for disc------------------------------------------------------
        popContainer.append(
            "<div class =\"row secondRow\">" +
                "<div class=\"col-md-5\">" +
                    "<div class=\"col-lg-12 label label-warning\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
                        "Кредитні модулі" +
                    "</div>" +
                    "<div id=\"cpop\" class=\"itemcol col-md-12\">" +
                    "</div>" +
                "</div>" +
            "</div>");

        getCredForDisc($("#cpop"), rdId);

        //--------------------rnp for disc----------------------------------------------------
        popContainer.children(".secondRow").append(
            "<div class=\"col-md-5 col-md-offset-1\">" +
                "<div class=\" col-md-12 label label-warning  margin\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
                    "Рядки РНП" +
                "</div>" +
                "<div id=\"rnppop\" class=\"itemcol col-md-12 margin\">" +
                "</div>" +
           "</div>");

        getRNPForDorC($("#rnppop"), rdId);


    } else if ($("#body_isdisc").attr("value") == "False") {

        //-----------------------for cred---------------------------------

        loadDiscRows(parentUl, obj);
        //--------------------ir for cred-----------------------------------------------------
        getIrForDorC(obj, $("#irpop"));

        //--------------------rnp for cred----------------------------------------------------
        popContainer.children(".inrow").append("<div class=\"col-md-5 col-md-offset-1\">" +
            "<div class=\" col-md-12 label label-warning  margin\" style=\"font-size: 100%; margin-bottom: 5px;\">" +
            "Рядки РНП" +
            "</div>" +
            "<div id=\"rnppop\" class=\"itemcol col-md-12 margin\">" +
            "</div></div>");

        getRNPForDorC(obj, $("#rnppop"));

    }

    //call popUP
    $(".popup-link-1").click();

});


/*$(document).on("click", "#body_SearchButton2", function () {
    $("#sTitle").slideDown("slow");
    $("#sresult").slideDown("slow");
    $("#itemcontainer div").remove();
    $("#ircontainer div").remove();

    $(".subtitle").text("Дисципліни");

    var url = ApiEndpoint;

    if ($("#body_DiscList").find("option:selected").val() > -1 && $("#body_SpecList").find("option:selected").val() > -1)
    {
        url += "MZSearch/GetDisc?" + "&rtpttId=" + $("#body_SpecList").find("option:selected").val() +
                                     "&dcdiscId=" + $("#body_DiscList").find("option:selected").val();

    }
    else
        if ($("#body_DiscList").find("option:selected").val() > -1)
        {
            url += "MZSearch/GetDiscD?" + "&dcdiscId=" + $("#body_DiscList").find("option:selected").val();
        }        
        else
        {
            alert("Choose something");
            return;
        } 

    console.log("test search button click. JSON url: " + url);
    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            $.each(data.Data, function (key, value) {
                $("#itemcontainer").append("<div class=\"oneitem\"><p class=\"itemrow\" did=\"" + value.RtDisciplineId + "\">" + value.NameFull + "</p></div>");
            });
        }
    });
    /*} else if ($("#body_isdisc").attr("value") == "False") {
        $(".subtitle").text("Кредитного модуля");
        url += "MZSearch/GetCred?rtpttId=" + $("#body_spec").attr("value") + "&sfId=" + $("#body_stdfrm").attr("value") + "&dcdiscId=" + $("#body_disc").attr("value");
        $.getJSON(url, function (data, status) {
            if (data.Data.length > 0) {
                $.each(data.Data, function (key, value) {
                    $("#itemcontainer").append("<div class=\"oneitem\" ><p class=\"itemrow\" cid=\"" + value.cCreditModuleId + "\">" + value.NameFull + "</p></div>");
                });
            }
        });
});*/



$(document).on("click", ".edit", function () {
    $("#body_irEdit").attr("Value", $(this).attr("iid"));
    $(".popContainer").append("<input class=\"hinput\" type=\"submit\"/>");
    $(".hinput").click();
});

$(document).on("click", ".ironediv p", function () {

    $(".ircol").remove();
    $(".irrow_a").attr("class", "irrow");
    $(".ironediv div br").remove();
    $(".edit").remove();
    $(".dlete").remove();
    $(".ironediv div").remove();

    var callObj = $(this);

    callObj.attr("class", "irrow_a");

    var parentDiv = callObj.parent();

    parentDiv.append("<ul class=\"ircol\"></ul>");
    console.log(parentDiv);

    var parentUl = parentDiv.children(".ircol");
    console.log(parentUl);

    $(".ircol").css("display", "none");

    var url = ApiEndpoint;
    url += "MZSearch/GetOneIr?irlevelId=" + callObj.attr("iid");

    $.getJSON(url, function (data, status) {
        if (data.Data.length > 0) {
            var count = 0;
            $.each(data.Data, function (key, value) {
                if (count < 1) {                              //---------------------must bi fixed! API err---------------------//
                    parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Номер протоколу" + "</span><span class=\"col-md-6\">" + value.DocNumber + "</span></li>");
                    parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Дата протоколу" + "</span><span class=\"col-md-6\">" + value.DocDate + "</span></li>");
                    parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Гриф" + "</span><span class=\"col-md-6\">" + value.stamp + "</span></li>");
                    parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Бібліографічний опис" + "</span><span class=\"col-md-6\">" + value.bibliog + "</span></li>");
                    parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Анотація" + "</span><span class=\"col-md-6\">" + value.Annotation + "</span></li>");
                    //parentUl.append("<li class=\"row lirow\"><span class=\"col-md-6\">" + "Посилання" + "</span><a href=\"#\" class=\"col-md-6\">" + "http://wwww.AlexFrostField" + "</a></li>");
                    parentDiv.append("<div><input type=\"button\" value=\"Редагувати\" iid=\"" + callObj.attr("iid") + "\" class=\"edit btn-success col-lg-4 col-lg-offset-3\"/><input type=\"button\" value=\"Відкріпити\" iid=\"" + callObj.attr("iid") + "\" class=\"delete btn-success col-lg-4 col-lg-offset-1\"/><br></div>");

                    count++;
                }
            });
            $(".ironediv .ircol").slideDown("slow");
        }
    });
});

function window_resize() {
    var page_h = $("html").height();
    var page_w = $("html").width();

    var containerHeight = page_h - 200;

    $(".popContainer").css("max-height", containerHeight);
    $(".popContainer").css("min-height", containerHeight);

    console.log("Page height" + (page_h - 200));
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
        console.log("Inside popup-link-1 click");

        /* Предотвращаем действия по умолчанию */
        e.preventDefault();
        e.stopPropagation();

        /* Получаем id (последний номер в имени класса ссылки) */
        var name = $(this).attr('class');
        var id = name[name.length - 1];
        var scrollPos = $(window).scrollTop();

        console.log("name=" + name + " id=" + id + " scrollPos=" + scrollPos);

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