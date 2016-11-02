'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:ZkmCtrl
 * @description
 * # ZkmCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('ZkmCtrl', function($scope, $cookies, $window, Api) {

        reload();

        function reload() {

            if (!!Campus.getToken()) {
                var sClaim = decodeToken(Campus.getToken());

                if (!!sClaim) {
                    sClaim = JSON.parse(sClaim);
                    $(".userName").append(JSON.parse(sClaim.prof).FullName);
                }
            }



            $('.login-message').click(function() {
                $('.login-message').addClass('hidden');
            });

            if (!!document.querySelector("#authorized") && !Campus.getToken()) {
                history.back();
            }

            $('#zkmWrapper').on('click', '.panel-heading', function() {
                var panelId = this.parentNode.id;
                $("#" + panelId + " .table").toggleClass("hidden");
                $("#" + panelId + " .zkmContent").toggleClass("hidden");
                $("#" + panelId + " .panelHeadingHover").toggleClass("active");
            });

            $('#zkmWrapper').on('click', 'table', function() {});

            if (!!Campus.getToken()) {
                setFacultyAndInstitute();
                setSubdivisionDetails();
            }
            ыы
        }

        function decodeToken(accessTokenIn) {

            if (!accessTokenIn || accessTokenIn == 'null') {
                return null;
            }

            var a = accessTokenIn.split(".");
            var uHeader = b64utoutf8(a[0]);
            var uClaim = b64utoutf8(a[1]);

            var pHeader = KJUR.jws.JWS.readSafeJSONString(uHeader);
            var pClaim = KJUR.jws.JWS.readSafeJSONString(uClaim);

            var sHeader = JSON.stringify(pHeader, null, "  ");
            var sClaim = JSON.stringify(pClaim, null, "  ");

            return sClaim;
        }

        function getParent(obj, parentTagName) {
            return (obj.tagName == parentTagName) ? obj : getParent(obj.parentNode, parentTagName);
        }

        function setRadioBtnForCathedras(responsive) {
            var subdivisionId = responsive.Subdivision.SubdivisionId;
            var subdivisionName = responsive.Subdivision.Name;
            if (document.getElementById(subdivisionId + "") == null && ~subdivisionName.indexOf("Кафедра")) {
                $('.radioMenu .radioBtnWrapper').append('<input class="radioBtn" id="' + subdivisionId + '" name="cathedra" type="radio" value=' + subdivisionId + ' onchange="check()">' +
                    '<label for="' + subdivisionId + '" class="side-label">' + subdivisionName + '</label>');
            }
        }

        function setSubdivisionDetails() {
            var sClaim = decodeToken(Campus.getToken());
            sClaim = JSON.parse(sClaim);
            if (typeof(sClaim.resp) == "object") {
                sClaim.resp.forEach(function(itemForEach, i, arr) {
                    var itemForEachJSON = JSON.parse(itemForEach);
                    if (itemForEachJSON.Subsystem == 1) {
                        setRadioBtnForCathedras(itemForEachJSON);
                    }

                });
            } else {
                if (typeof(sClaim.resp) == "string") {
                    var responsive = JSON.parse(sClaim.resp);
                    if (responsive.Subsystem == 1) {
                        setRadioBtnForCathedras(responsive);
                    }
                }
            }

        }

        function setFacultyAndInstitute() {
            var kpiQuery = false;
            var sClaim = decodeToken(Campus.getToken());
            sClaim = JSON.parse(sClaim);
            if (typeof(sClaim.resp) == "object") {
                sClaim.resp.forEach(function(itemForEach, i, arr) {
                    kpiQuery = setFacultyAndInstituteLogic(itemForEach, kpiQuery);
                });
            } else {
                if (typeof(sClaim.resp) == "string") {
                    kpiQuery = setFacultyAndInstituteLogic(sClaim.resp, kpiQuery);
                }
            }

        }

        function setFacultyAndInstituteLogic(item, kpiQuery) {
            var itemForEachJSON = JSON.parse(item);
            if (itemForEachJSON.Subsystem == 1) {
                var subdivisionId = itemForEachJSON.Subdivision.SubdivisionId;
                var subdivisionName = itemForEachJSON.Subdivision.Name;
                //console.log(subdivisionId +" -"+subdivisionName);
                if (subdivisionId == 9998 && !kpiQuery) {
                    kpiQuery = true;
                    var pathFaculty = "Subdivision";
                    Campus.execute("GET", pathFaculty).then(function(response) {
                        //console.log(response);
                        response.forEach(function(itemForEach, i, arr) {
                            if (itemForEach.typeId == 26 || itemForEach.typeId == 77) {
                                var subdivisionName = itemForEach.name;
                                var subdivisionId = itemForEach.subdivisionId;
                                $(".chosen-select").append('<option id="' + subdivisionId + '" value="' + subdivisionId + '">' + subdivisionName + '</option>');
                            }
                        });
                        var config = {
                            '.chosen-select': {},
                            '.chosen-select-deselect': { allow_single_deselect: true },
                            '.chosen-select-no-single': { disable_search_threshold: 10 },
                            '.chosen-select-no-results': { no_results_text: 'Співпадінь не знайдено...' },
                            '.chosen-select-width': { width: "95%" }
                        };
                        for (var selector in config) {
                            $(selector).chosen(config[selector]);
                        }
                        $('.chosen-select').on('change', function(evt, params) {
                            var parentId = this.value;
                            var subdivisionPath = "Subdivision/" + parentId + "/children";
                            Campus.execute("GET", subdivisionPath).then(function(response) {
                                $('.radioMenu .radioBtnWrapper').empty();
                                $('.radioMenu .radioBtnWrapper').append('<label class="topLabel">Оберіть кафедру</label>');
                                response.forEach(function(itemForEach, i, arr) {
                                    if (arr[i + 1] != undefined) {
                                        var cathedraId = itemForEach.id;
                                        var cathedraName = itemForEach.name;
                                        //console.log(itemForEach);
                                        $('.radioMenu .radioBtnWrapper').append('<input class="radioBtn" id="' + cathedraId + '" name="cathedra" type="radio" value=' + cathedraId + ' onchange="check()">' +
                                            '<label for="' + cathedraId + '" class="side-label">Кафедра ' + cathedraName + '</label>');
                                    }
                                })
                            });
                        });

                    });
                }
                if (document.getElementById(subdivisionId + "") == null &&
                    (~subdivisionName.indexOf("факультет") || ~subdivisionName.indexOf("Факультет") ||
                        ~subdivisionName.indexOf("інститут") || ~subdivisionName.indexOf("Інститут"))) {
                    $(".chosen-select").append('<option id="' + subdivisionId + '" value="' + subdivisionId + '">' + subdivisionName + '</option>');
                }
            }
            return kpiQuery;
        }
    });                         $("#section1").append('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
                                //--
                                //downloadCounter ++;
                                if (subName != subNameNext) {
                                    $("#zkm14" + baseSubCounter + " .table").before('<div class="panel-heading panelHeadingHover extCentre">' +
                                        '<p>' + baseSubName + '<span class="badge myBadge" >' + baseCounter + '</span> </p></div>');
                                    //for download
                                    $("#section1 #sec14" + baseSubCounter).append(baseSubName + ' - ' + baseCounter);
                                    //--
                                }
                            });
                            //console.log("baseSubCounter " +baseSubCounter);
                            //console.log("downloadCounter " +downloadCounter);
                            Campus.execute("GET", path[3]).then(function(response) {
                                var resultCounter = 0;
                                $("#zkm1").append(
                                    '<div class="row">' +
                                    '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                                    '<div class="panel panel-default" id="zkm12">' +
                                    '<table class="table table-bordered "><tbody></tbody></table>' +
                                    '</div></div></div>');
                                //for download
                                $("#section1").append('<tr><th colspan="2" id="sec12"></th></tr>');
                                //--
                                for (var key in response) {
                                    var subName = key;
                                    var curCount = response[key];
                                    $("#zkm12 table tbody").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                                    resultCounter += curCount;
                                
                                    $("#section1").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                                
                                }
                                $("#zkm12 table").before('<div class="panel-heading panelHeadingHover extCentre active">' +
                                    '<p>Кількість завантажених ЕІР, що читає ' + cathedraName + ' - <span class="badge myBadge" >' + resultCounter + '</span> </p></div>');
                      
                                $("#section1 #sec12").append('Кількість завантажених ЕІР, що читає ' + cathedraName + ' - ' + resultCounter);
                                            
                                isFinish[0] = true;

                                $(".statusLine").append('<p>Розділ 1 - завантажено.</p>');
                                if (isFinish[0] && isFinish[1] && isFinish[2]) {

                                    $("#zkmWrapper a").on('click', function(event) {
                                        event.preventDefault();
                                    });
                                }

                            });
                        });
                    });
                });
            });
        });


    });


    ////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Раздел 2

    var path2 = [
        "Statistic/Cathedras/" + cathedraId + "/Modules/FromForeignCathedras/Count",
        "Statistic/Cathedras/" + cathedraId + "/MethodicalManual/FromForeignCathedras/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutMethodicalmanualByItself/Count", //не используется отсутствует для раздела 2
        "Statistic/Cathedras/" + cathedraId + "/EIRSByCreditModules/FromForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/EIRByCreditModules/FromForeignCathedras/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithMethodicalManual/FromForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutMethodicalManual/FromForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithPartialMethodicalManual/FromForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutFiles/FromForeignCathedras/List"
    ];

    Campus.execute("GET", path2[0]).then(function(response) {

        var baseSubName = "";
        var baseSubdivName = "";
        var baseCounter = 0;
        var baseSubjCounter = 0;
        var baseSubdivCounter = -1;
        var baseSubCounter = -1;
        var responseArray2 = [];

        //console.log(response);
        $("#zkm2").append(
            '<div class="row">' +
            '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
            '<div class="panel panel-default" id="zkm21">' +
            '<div class="panel-heading panelHeadingHover extCentre active">' +
            '<p>Кількість КМ, що читають інші кафедри для ' + cathedraNameRV + ' - <span class="badge myBadge" >' + response + '</span> </p>' +
            '</div></div></div></div>');
        //for download
        $("#section2").append('<tr><th colspan="2">Кількість КМ, що читають інші кафедри для ' + cathedraNameRV + ' - ' + response + '</th></tr>');
        //--
        Campus.execute("GET", path2[1]).then(function(response) {
            //console.log(response);
            responseArray2[0] = response;
            Campus.execute("GET", path2[5]).then(function(response) {
                response.sort(
                    function(a, b) {
                        if (a.subdivisionName > b.subdivisionName) {
                            return 1;
                        }
                        if (a.subdivisionName < b.subdivisionName) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (a.name < b.name) {
                            return -1;
                        }
                        return 0;
                    });
                responseArray2[1] = response;
                Campus.execute("GET", path2[6]).then(function(response) {
                    //console.log(response);
                    responseArray2[2] = response;
                    Campus.execute("GET", path2[7]).then(function(response) {
                        //console.log(response);
                        responseArray2[3] = response;
                        Campus.execute("GET", path2[8]).then(function(response) {
                            //console.log(response);
                            responseArray2[4] = response;
                            //console.log(responseArray2);
                            $("#zkm21").append('<div class="zkmContent">' +
                                '<div class="tabbable row">' +
                                '<ul class="nav nav-tabs myNavTabs textCentre">' +
                                '<li class="tabLiStyle "><a href="#24" data-toggle="tab">Завантажено МЗ - <span class="badge myBadge" >' + responseArray2[0] + '</span></a></li>' +
                                '<li class="tabLiStyle"><a href="#25" data-toggle="tab">Відсутнє МЗ - <span class="badge myBadge" >' + responseArray2[2].length + '</span></a></li>' +
                                '<li class="tabLiStyle "><a href="#26" data-toggle="tab">Частково забезпечені МЗ - <span class="badge myBadge" >' + responseArray2[3].length + '</span></a></li>' +
                                '<li class="tabLiStyle"><a href="#27" data-toggle="tab">Відсутні файли або посилання на МЗ - <span class="badge myBadge" >' + responseArray2[4].length + '</span></a></li>' +
                                '</ul>' +
                                '<div class="tab-content">' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="24"></div>' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="25">' +
                                '<table class="table table-bordered "><tbody></tbody></table></div>' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="26">' +
                                '<table class="table table-bordered "><tbody></tbody></table></div>' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="27">' +
                                '<table class="table table-bordered "><tbody></tbody></table></div>' +
                                '</div></div></div>'

                            );
                            //for download
                            $("#section2").append('<tr><th colspan="2">Відсутнє МЗ -' + responseArray2[2].length + '</th></tr>');
                            //--
                            responseArray2[2].forEach(function(itemForEach, i, arr) {
                                //console.log(itemForEach);
                                $("#25 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                                //for download
                                $("#section2").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                                //--
                            });
                            //for download
                            $("#section2").append('<tr><th colspan="2">Частково забезпечені МЗ - ' + responseArray2[3].length + '</th></tr>');
                            //--
                            responseArray2[3].forEach(function(itemForEach, i, arr) {
                                $("#26 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                                //for download
                                $("#section2").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                                //--
                            });
                            //for download
                            $("#section2").append('<tr><th colspan="2">Відсутні файли або посилання на МЗ - ' + responseArray2[4].length + '</th></tr>');
                            //--
                            responseArray2[4].forEach(function(itemForEach, i, arr) {
                                $("#27 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                                //for download
                                $("#section2").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                                //--
                            });
                            //for download
                            $("#section2").append('<tr><th colspan="2">Завантажено МЗ - ' + responseArray2[0] + '</th></tr>');
                            //--
                            responseArray2[1].forEach(function(itemForEach, i, arr) {
                                var subName = itemForEach.name;
                                var kindOfDoc = itemForEach.classNameFull;
                                var curCount = itemForEach.count;
                                var subdivName = itemForEach.subdivisionName;
                                var subNameNext;
                                var subdivNameNext;
                                if (i + 1 >= responseArray2[1].length) {
                                    subNameNext = "";
                                    subdivNameNext = "";
                                    $("#24 #zkm24" + baseSubdivCounter + " .panelHeadingHover p.nestingFix").append(
                                        '<span class="badge myBadge" >' + baseSubjCounter + '</span>');
                                    //for download
                                    $("#section2 #sec24" + baseSubdivCounter + " th").append(' - ' + baseSubjCounter);
                                    //--
                                } else {
                                    subNameNext = responseArray2[1][i + 1].name;
                                    subdivNameNext = responseArray2[1][i + 1].subdivisionName;

                                }
                                if (baseSubdivName != subdivName) {
                                    if (baseSubdivCounter != -1) {
                                        $("#24 #zkm24" + baseSubdivCounter + " .panelHeadingHover p.nestingFix").append(
                                            '<span class="badge myBadge" >' + baseSubjCounter + '</span>');
                                        //for download
                                        $("#section2 #sec24" + baseSubdivCounter + " th").append(' - ' + baseSubjCounter);
                                        //--
                                    }
                                    baseSubdivName = subdivName;
                                    baseSubName = "";
                                    baseSubdivCounter++;
                                    baseSubjCounter = 0;
                                    $("#24").append(
                                        '<div class="panel panel-default" id="zkm24' + baseSubdivCounter + '">' +
                                        '<div class="panel-heading panelHeadingHover extCentre">' +
                                        '<p class="nestingFix">' + baseSubdivName + '</p>' +
                                        '</div> ');
                                    //for download
                                    $("#section2").append('<tr id="sec24' + baseSubdivCounter + '"><th colspan="2" >' + baseSubdivName + '</th></tr>');
                                    //--

                                }
                                if (subName != baseSubName) {
                                    baseSubName = subName;
                                    baseCounter = 0;
                                    baseSubCounter++;
                                    baseSubjCounter++;
                                    $("#zkm24" + baseSubdivCounter).append(
                                        '<div class="row">' +

                                        '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                                        '<div class="panel panel-default" id="zkm24' + baseSubdivCounter + '_' + baseSubCounter + '">' +
                                        '<table class="table table-bordered "><tbody></tbody></table>' +
                                        '</div></div></div>');
                                    //for download
                                    $("#section2 #sec24" + baseSubdivCounter).after('<tr id="sec24' + baseSubdivCounter + '_' + baseSubCounter + '"><th colspan="2" ></th></tr>');
                                    //--
                                }
                                $('#zkm24' + baseSubdivCounter + '_' + baseSubCounter + ' .table tbody').append('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
                                baseCounter += curCount;
                                //for download
                                $("#section2 #sec24" + baseSubdivCounter + "_" + baseSubCounter).after('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
                                //--
                                if (subName != subNameNext || (subdivName != subdivNameNext & subdivNameNext != "")) {
                                    $("#zkm24" + baseSubdivCounter + '_' + baseSubCounter + " .table").before('<div class="panel-heading panelHeadingHover extCentre active">' +
                                        '<p>' + baseSubName + '<span class="badge myBadge" >' + baseCounter + '</span></p></div>');
                                    //for download
                                    $("#section2 #sec24" + baseSubdivCounter + "_" + baseSubCounter + " th").append(baseSubName + ' - ' + baseCounter);
                                    //--
                                }
                            });
                            Campus.execute("GET", path2[3]).then(function(response) {
                                var resultCounter = 0;
                                $("#zkm2").append(
                                    '<div class="row">' +
                                    '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                                    '<div class="panel panel-default" id="zkm22">' +
                                    '<table class="table table-bordered "><tbody></tbody></table>' +
                                    '</div></div></div>');
                                //for download
                                $("#section2").append('<tr id="sec22"><th colspan="2"></th></tr>');
                                //--
                                for (var key in response) {
                                    var subName = key;
                                    var curCount = response[key];
                                    $("#zkm22 table tbody").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                                    //for download
                                    $("#section2").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                                    //--
                                    resultCounter += curCount;
                                }
                                $("#zkm22 table").before('<div class="panel-heading panelHeadingHover extCentre active">' +
                                    '<p>Кількість завантажених ЕІР, що читає ' + cathedraName + ' - <span class="badge myBadge" >' + resultCounter + '</span> </p></div>');
                                //for download
                                $("#section2 #sec22 th").append('Кількість завантажених ЕІР, що читає ' + cathedraName + ' - ' + resultCounter);

                                isFinish[1] = true;
                                $(".statusLine").append('<p>Розділ 2 - завантажено.</p>');
                                if (isFinish[0] && isFinish[1] && isFinish[2]) {

                                    $("#zkmWrapper a").on('click', function(event) {
                                        event.preventDefault();
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });



    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Раздел 3


    var path3 = [
        "Statistic/Cathedras/" + cathedraId + "/Modules/ForForeignCathedras/Count",
        "Statistic/Cathedras/" + cathedraId + "/WithMethodicalManual/ForForeignCathedras/Count",
        "Statistic/Cathedras/" + cathedraId + "/WithoutMethodicalManual/ForForeignCathedras/Count", //не используется отсутствует для раздела 2
        "Statistic/Cathedras/" + cathedraId + "/EIRByCreditModules/ForForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/EIRByCreditModules/ForForeignCathedras/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithMethodicalManual/ForForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutMethodicalManual/ForForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithPartialMethodicalManual/ForForeignCathedras/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutFiles/ForForeignCathedras/List"
    ];

    Campus.execute("GET", path3[0]).then(function(response) {



        var baseSubName = "";
        var baseSubdivName = "";
        var baseCounter = 0;
        var baseSubjCounter = 0;
        var baseSubdivCounter = -1;
        var baseSubCounter = -1;
        var responseArray3 = [];

        //console.log(response);
        $("#zkm3").append(
            '<div class="row">' +
            '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
            '<div class="panel panel-default" id="zkm31">' +
            '<div class="panel-heading panelHeadingHover extCentre active">' +
            '<p>Кількість КМ, що читає ' + cathedraName + ' для інших кафедр - <span class="badge myBadge" >' + response + '</span> </p>' +
            '</div></div></div></div>');
        //for download
        $("#section3").append('<tr><th colspan="2">Кількість КМ, що читає ' + cathedraName + ' для інших кафедр - ' + response + '</th></tr>');
        //--
        Campus.execute("GET", path3[1]).then(function(response) {
            //console.log(response);
            responseArray3[0] = response;
            Campus.execute("GET", path3[5]).then(function(response) {
                //console.log(response);
                response.sort(
                    function(a, b) {
                        if (a.subdivisionName > b.subdivisionName) {
                            return 1;
                        }
                        if (a.subdivisionName < b.subdivisionName) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (a.name < b.name) {
                            return -1;
                        }
                        return 0;
                    });
                responseArray3[1] = response;
                Campus.execute("GET", path3[6]).then(function(response) {
                    //console.log(response);
                    responseArray3[2] = response;
                    Campus.execute("GET", path3[7]).then(function(response) {
                        //console.log(response);
                        responseArray3[3] = response;
                        Campus.execute("GET", path3[8]).then(function(response) {
                            //console.log(response);
                            responseArray3[4] = response;
                            //console.log(responseArray3);
                            $("#zkm31").append('<div class="zkmContent">' +
                                '<div class="tabbable row">' +
                                '<ul class="nav nav-tabs myNavTabs textCentre">' +
                                '<li class="tabLiStyle "><a href="#34" data-toggle="tab">Завантажено МЗ - <span class="badge myBadge" >' + responseArray3[0] + '</span></a></li>' +
                                '<li class="tabLiStyle"><a href="#35" data-toggle="tab">Відсутнє МЗ - <span class="badge myBadge" >' + responseArray3[2].length + '</span></a></li>' +
                                '<li class="tabLiStyle "><a href="#36" data-toggle="tab">Частково забезпечені МЗ - <span class="badge myBadge" >' + responseArray3[3].length + '</span></a></li>' +
                                '<li class="tabLiStyle"><a href="#37" data-toggle="tab">Відсутні файли або посилання на МЗ - <span class="badge myBadge" >' + responseArray3[4].length + '</span></a></li>' +
                                '</ul>' +
                                '<div class="tab-content">' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="34"></div>' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="35">' +
                                '<table class="table table-bordered "><tbody></tbody></table></div>' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="36">' +
                                '<table class="table table-bordered "><tbody></tbody></table></div>' +
                                '<div class="col-md-12 tab-pane  myTabPane" id="37">' +
                                '<table class="table table-bordered "><tbody></tbody></table></div>' +
                                '</div></div></div>'

                            );
                            //for download
                            $("#section3").append('<tr><th colspan="2">Відсутнє МЗ - ' + responseArray3[2].length + '</th></tr>');
                            //--
                            responseArray3[2].forEach(function(itemForEach, i, arr) {
                                //console.log(itemForEach);
                                $("#35 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                                //for download
                                $("#section3").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                                //--
                            });
                            //for download
                            $("#section3").append('<tr><th colspan="2">Частково забезпечені МЗ - ' + responseArray3[3].length + '</th></tr>');
                            //--

                            responseArray3[3].forEach(function(itemForEach, i, arr) {
                                $("#36 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                                //for download
                                $("#section3").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                                //--
                            });
                            //for download
                            $("#section3").append('<tr><th colspan="2">Відсутні файли або посилання на МЗ - ' + responseArray3[4].length + '</th></tr>');
                            //--
                            responseArray3[4].forEach(function(itemForEach, i, arr) {
                                $("#37 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                                //for download
                                $("#section3").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                                //--
                            });
                            //for download
                            $("#section3").append('<tr><th colspan="2">Завантажено МЗ - ' + responseArray3[0] + '</th></tr>');
                            //--
                            responseArray3[1].forEach(function(itemForEach, i, arr) {
                                var subName = itemForEach.name;
                                var kindOfDoc = itemForEach.classNameFull;
                                var curCount = itemForEach.count;
                                var subdivName = itemForEach.subdivisionName;
                                var subNameNext;
                                var subdivNameNext;
                                if (i + 1 >= responseArray3[1].length) {
                                    subNameNext = "";
                                    subdivNameNext = "";
                                    $("#34 #zkm34" + baseSubdivCounter + " .panelHeadingHover p.nestingFix").append(
                                        '<span class="badge myBadge" >' + baseSubjCounter + '</span>');
                                    //for download
                                    $("#section3 #sec34" + baseSubdivCounter + " th").append(' - ' + baseSubjCounter);
                                    //--
                                } else {
                                    subNameNext = responseArray3[1][i + 1].name;
                                    subdivNameNext = responseArray3[1][i + 1].subdivisionName;
                                }
                                if (baseSubdivName != subdivName) {
                                    if (baseSubdivCounter != -1) {
                                        $("#34 #zkm34" + baseSubdivCounter + " .panelHeadingHover p.nestingFix").append(
                                            '<span class="badge myBadge" >' + baseSubjCounter + '</span>');
                                        //for download
                                        $("#section3 #sec34" + baseSubdivCounter + " th").append(' - ' + baseSubjCounter);
                                        //--
                                    }
                                    baseSubdivName = subdivName;
                                    baseSubName = "";
                                    baseSubdivCounter++;
                                    baseSubjCounter = 0;
                                    $("#34").append(
                                        '<div class="panel panel-default" id="zkm34' + baseSubdivCounter + '">' +
                                        '<div class="panel-heading panelHeadingHover extCentre">' +
                                        '<p class="nestingFix">' + baseSubdivName + '</p>' +
                                        '</div> ');
                                    //for download
                                    $("#section3").append('<tr id="sec34' + baseSubdivCounter + '"><th colspan="2" >' + baseSubdivName + '</th></tr>');
                                    //--

                                }
                                if (subName != baseSubName) {
                                    baseSubName = subName;
                                    baseCounter = 0;
                                    baseSubCounter++;
                                    baseSubjCounter++;
                                    $("#zkm34" + baseSubdivCounter).append(
                                        '<div class="row">' +

                                        '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                                        '<div class="panel panel-default" id="zkm34' + baseSubdivCounter + '_' + baseSubCounter + '">' +
                                        '<table class="table table-bordered "><tbody></tbody></table>' +
                                        '</div></div></div>');
                                    //for download
                                    $("#section3 #sec34" + baseSubdivCounter).after('<tr id="sec34' + baseSubdivCounter + '_' + baseSubCounter + '"><th colspan="2" ></th></tr>');
                                    //--
                                }
                                $('#zkm34' + baseSubdivCounter + '_' + baseSubCounter + ' .table tbody').append('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
                                baseCounter += curCount;
                                //for download
                                $("#section3 #sec34" + baseSubdivCounter + "_" + baseSubCounter).after('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
                                //--
                                if (subName != subNameNext || (subdivName != subdivNameNext & subdivNameNext != "")) {
                                    $("#zkm34" + baseSubdivCounter + '_' + baseSubCounter + " .table").before('<div class="panel-heading panelHeadingHover extCentre active">' +
                                        '<p>' + baseSubName + '<span class="badge myBadge" >' + baseCounter + '</span></p></div>');
                                    //for download
                                    $("#section3 #sec34" + baseSubdivCounter + "_" + baseSubCounter + " th").append(baseSubName + ' - ' + baseCounter);
                                    //--
                                }
                            });
                            Campus.execute("GET", path3[3]).then(function(response) {
                                var resultCounter = 0;
                                $("#zkm3").append(
                                    '<div class="row">' +
                                    '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                                    '<div class="panel panel-default" id="zkm32">' +
                                    '<table class="table table-bordered "><tbody></tbody></table>' +
                                    '</div></div></div>');
                                //for download
                                $("#section3").append('<tr id="sec32"><th colspan="2"></th></tr>');
                                //--
                                for (var key in response) {
                                    var subName = key;
                                    var curCount = response[key];
                                    $("#zkm32 table tbody").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                                    //for download
                                    $("#section3").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                                    //--
                                    resultCounter += curCount;
                                }
                                $("#zkm32 table").before('<div class="panel-heading panelHeadingHover extCentre active">' +
                                    '<p>Кількість завантажених ЕІР, що читає ' + cathedraName + ' - <span class="badge myBadge" >' + resultCounter + '</span> </p></div>');
                                //for download
                                $("#section3 #sec32 th").append('Кількість завантажених ЕІР, що читає ' + cathedraName + ' - ' + resultCounter);


                                isFinish[2] = true;
                                $(".statusLine").append('<p>Розділ 3 - завантажено.</p>');
                                if (isFinish[0] && isFinish[1] && isFinish[2]) {

                                    $("#zkmWrapper a").on('click', function(event) {
                                        event.preventDefault();
                                    });
                                }

                            });

                        });
                    });
                });
            });
        });
    });
}