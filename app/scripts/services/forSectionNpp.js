//  For section npp
function check() {

    $("p.errorLabel").remove();
    $("#1, #2, #semester1, #semester2").empty();
    $(".tabLiStyle, .myTabPane ").removeClass("active");

    var cathedraId = $('input[name=cathedra]:checked').val();
    var path = "Statistic/Cathedras/" + cathedraId + "/Emplloyers/WithIndividualLoad/List";

    Campus.execute("GET", path).then(function(response) {
        //console.log(response);
        if (!response || response == "") {
            $('.radioMenu').append('<p class="errorLabel">На жаль, записи у базі даних відсутні.</p>');
        } else {

            var baseEmplFullName = "";
            var baseCounter = -1;
            var baseSubName = "";
            var collectGroupsString = "";

            response.forEach(function(itemForEach, i, arr) {

                var emplFullName = itemForEach.employeeName;
                var subLongNameFull = itemForEach.rnpName;
                var studStudyGroupName = itemForEach.studyGroup;
                var studSemesterYear = itemForEach.years;

                if (studSemesterYear[0] == 0) {} else {
                    if (baseEmplFullName != emplFullName) {

                        baseEmplFullName = emplFullName;
                        baseCounter++;
                    }
                    if (document.getElementById('npp' + baseCounter + '' + studSemesterYear[0] + '') == null) {
                        $('#' + studSemesterYear[0]).append('<div class="panel panel-default" id="npp' + baseCounter + '' + studSemesterYear[0] + '">' +
                            '<div class="panel-heading panelHeadingHover textCentre">' +
                            '<i class="fa fa-sort-desc   textCentre"></i>' +
                            emplFullName +
                            '<i class="fa fa-sort-desc   textCentre"></i>' +
                            '</div>' +
                            '<table class="table table-bordered hidden"><tbody></tbody></table>' +
                            '</div>');
                        // for download
                        $("#semester" + studSemesterYear[0]).append('<tr><th colspan="3">' + emplFullName + '</th></tr>');
                    }

                    if (baseSubName != subLongNameFull) {
                        baseSubName = subLongNameFull;
                        collectGroupsString = studStudyGroupName + "<br> ";
                    } else {
                        collectGroupsString += studStudyGroupName + "<br> ";
                    }
                    if (arr[i + 1] == undefined || arr[i + 1].rnpName != baseSubName) {
                        $("#npp" + baseCounter + "" + studSemesterYear[0] + " .table tbody").append('<tr>' +
                            '<td>' + baseSubName + ' </td>' +
                            '<td>' + collectGroupsString + '</td>' +
                            '<td>' + studSemesterYear + '</td></tr>');
                        // for download
                        $("#semester" + studSemesterYear[0]).append('<tr>' +
                            '<td>' + baseSubName + ' </td>' +
                            '<td>' + collectGroupsString + '</td>' +
                            '<td>' + studSemesterYear + '</td></tr>');
                    }
                }
            });

        }
    });
}