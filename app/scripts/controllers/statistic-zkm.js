'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:ZkmCtrl
 * @description
 * # ZkmCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('ZkmCtrl', function ($scope, $cookies, $window, Api) {

    $scope.cathedras = [];
    $scope.subdivisions = [];
    $scope.errorLabelText = "";

    $scope.selecteCathedraId = null;

    reload();

    function reload() {

      if (!!Api.getToken()) {

        setFacultyAndInstitute();
        //setSubdivisionDetails();
      }
//!!!!
      $('#zkmWrapper').on('click', '.panel-heading', function () {
        var panelId = this.parentNode.id;
        $("#" + panelId + " .table").toggleClass("hidden");
        $("#" + panelId + " .zkmContent").toggleClass("hidden");
        $("#" + panelId + " .panelHeadingHover").toggleClass("active");
      });

    }


    function getParent(obj, parentTagName) {
      return (obj.tagName == parentTagName) ? obj : getParent(obj.parentNode, parentTagName);
    }

    function setRadioBtnForCathedras(responsive) {
      var subdivisionId = responsive.Subdivision.SubdivisionId;
      var subdivisionName = responsive.Subdivision.Name;
      if (~subdivisionName.indexOf("Кафедра")) {
        $scope.cathedras.push({
          cathedraId: subdivisionId,
          cathedraName: subdivisionName
        });
      }
    }

    function loadCathedras() {

      $scope.npps = [];

      if (!$scope.chosenSubdivision) {
        return;
      }

      var parentId = $scope.chosenSubdivision.subdivisionId;
      var subdivisionPath = "Subdivision/" + parentId + "/children";

      Api.execute("GET", subdivisionPath).then(function (response) {
        $scope.cathedras = [];
        response.forEach(function (itemForEach, i, arr) {
          if (arr[i + 1] != undefined) {
            var cathedraId = itemForEach.id;
            var cathedraName = itemForEach.name;
            $scope.cathedras.push({
              cathedraId: cathedraId,
              cathedraName: cathedraName
            });
          }
        });

      })
    }

    function setFacultyAndInstitute() {
      var kpiQuery = false;
      var sClaim = Api.decodeToken(Api.getToken());
      sClaim = JSON.parse(sClaim);

      if (typeof(sClaim.resp) == "object") {
        sClaim.resp.forEach(function (itemForEach, i, arr) {
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
        if (subdivisionId == 9998 && !kpiQuery) {
          kpiQuery = true;
          var pathFaculty = "Subdivision";
          Api.execute("GET", pathFaculty).then(function (response) {
            response.forEach(function (itemForEach, i, arr) {
              if (itemForEach.typeId == 26 || itemForEach.typeId == 77) {
                var subdivisionName = itemForEach.name;
                var subdivisionId = itemForEach.subdivisionId;
                $scope.subdivisions.push({
                  subdivisionId: subdivisionId,
                  subdivisionName: subdivisionName
                });
              }
            });

            var config = {
              '.chosen-select': {},
              '.chosen-select-deselect': {allow_single_deselect: true},
              '.chosen-select-no-single': {disable_search_threshold: 10},
              '.chosen-select-no-results': {no_results_text: 'Співпадінь не знайдено...'},
              '.chosen-select-width': {width: "95%"}
            };
            for (var selector in config) {
              $(selector).chosen(config[selector]);
            }
          });
        }
        if (document.getElementById(subdivisionId + "") == null &&
          (~subdivisionName.indexOf("факультет") || ~subdivisionName.indexOf("Факультет") || ~subdivisionName.indexOf("інститут") || ~subdivisionName.indexOf("Інститут"))) {
          $scope.subdivisions.push({
            subdivisionId: subdivisionId,
            subdivisionName: subdivisionName
          });
        }

      }
      return kpiQuery;
    }

    $scope.checkZkm = function (id, name) {
      $scope.statusLine = "";
      $scope.zkm = null;
      $scope.errorLabelText = "";

      $scope.selecteCathedraId = id;

      $("#zkmWrapper").empty();
      $("#table-for-download").empty();


      var isFinish = [];
      var cathedraId = id;
      var cathedraName = name;

      var cathedraNameRV = cathedraName;
      var cathedraNameDV = cathedraName;


      cathedraNameDV = !cathedraNameDV ? '' : cathedraNameDV;

      cathedraNameDV = cathedraNameDV.replace('Кафедра', 'кафедрі');
      cathedraNameRV = cathedraNameDV.replace('Кафедра', 'кафедри');

      $scope.statusLine += "Очікуємо  відповідь від сервера...\n";
      $scope.statusLine += "Зачекайте будь ласка.\n";
      for (var i = 0; i < 3; i++) {
        isFinish[i] = false;
      }

      $("#zkmWrapper").append(
        '<div class="panel panel-default" id="zkm1">' +
        '<div class="panel-heading panelHeadingHover extCentre">' +
        '<p>РОЗДІЛ 1. Статистичні дані по ' + cathedraNameDV + ', що сама себе забезпечує, тобто сама собі читає кредитні модулі(КМ).</p>' +
        '</div> ' +
        '</div>' +
        '<div class="panel panel-default" id="zkm2">' +
        '<div class="panel-heading panelHeadingHover extCentre">' +
        '<p>РОЗДІЛ 2. Статистичні дані по ' + cathedraNameDV + ', для якої читають інші кафедри університету.</p>' +
        '</div> ' +
        '</div>' +
        '<div class="panel panel-default" id="zkm3">' +
        '<div class="panel-heading panelHeadingHover extCentre">' +
        '<p>РОЗДІЛ 3. Статистичні дані по ' + cathedraNameDV + ', яка читає іншим кафедрам університету.</p>' +
        '</div> ' +
        '</div>'
      );

      // for download
      $("#table-for-download").append(
        '<tbody id="section1">' +
        '<tr><th colspan="2">РОЗДІЛ 1. Статистичні дані по ' + cathedraNameDV + ', що сама себе забезпечує, тобто сама собі читає кредитні модулі(КМ).</th></tr>' +
        '</tbody>' +
        '<tbody id="section2">' +
        '<tr><th colspan="2">РОЗДІЛ 2. Статистичні дані по ' + cathedraNameDV + ', для якої читають інші кафедри університету.</th></tr>' +
        '</tbody>' +
        '<tbody id="section3">' +
        '<tr><th colspan="2">РОЗДІЛ 3. Статистичні дані по ' + cathedraNameDV + ', яка читає іншим кафедрам університету.</th></tr>' +
        '</tbody>');
      //--

      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Раздел 1

      var path = [
        "Statistic/Cathedras/" + cathedraId + "/Modules/ByItself/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithMethodicalmanualByItself/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutMethodicalmanualByItself/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/EIRSByItself/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/EIRSByItself/Count",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithMethodicalManual/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutMethodicalManul/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithPartialMethodicalManul/List",
        "Statistic/Cathedras/" + cathedraId + "/Modules/WithoutFiles/List"
      ];

      Api.execute("GET", path[0]).then(function (response) {

        var baseSubName = "";
        var baseCounter = 0;
        var baseSubCounter = -1;
        var responseArray = [];

        //console.log(response);
        $("#zkm1").append(
          '<div class="row">' +
          '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
          '<div class="panel panel-default" id="zkm11">' +
          '<div class="panel-heading panelHeadingHover active">' +
          '<p>Кількість КМ, що читає ' + cathedraName + ' - <span class="badge myBadge" >' + response + '</span> </p>' +
          '</div></div></div></div>');

        //for download
        $("#section1").append('<tr><th colspan="2">Кількість КМ, що читає ' + cathedraName + ' - ' + response + '</th></tr>');
        //--
        Api.execute("GET", path[1]).then(function (response) {
          //console.log(response);
          responseArray[0] = response;
          Api.execute("GET", path[5]).then(function (response) {
            //console.log(response);
            responseArray[1] = response;
            Api.execute("GET", path[6]).then(function (response) {
              //console.log(response);
              responseArray[2] = response;
              Api.execute("GET", path[7]).then(function (response) {
                //console.log(response);
                responseArray[3] = response;
                Api.execute("GET", path[8]).then(function (response) {
                  //console.log(response);
                  responseArray[4] = response;
                  //console.log(responseArray);
                  $("#zkm11").append('<div class="zkmContent">' +
                    '<div class="tabbable row">' +
                    '<ul class="nav nav-tabs ">' +
                    '<li><a href="#14" data-toggle="tab">Завантажено МЗ - <span class="badge myBadge" >' + responseArray[0] + '</span></a></li>' +
                    '<li><a href="#15" data-toggle="tab">Відсутнє МЗ - <span class="badge myBadge" >' + responseArray[2].length + '</span></a></li>' +
                    '<li><a href="#16" data-toggle="tab">Частково забезпечені МЗ - <span class="badge myBadge" >' + responseArray[3].length + '</span></a></li>' +
                    '<li><a href="#17" data-toggle="tab">Відсутні файли або посилання на МЗ - <span class="badge myBadge" >' + responseArray[4].length + '</span></a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '<div class="tab-pane" id="14"></div>' +
                    '<div class="tab-pane" id="15">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '<div class="tab-pane" id="16">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '<div class="tab-pane" id="17">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '</div></div></div>'
                  );
                  //for download
                  $("#section1").append('<tr><th colspan="2">Відсутнє МЗ - ' + responseArray[2].length + '</th></tr>');
                  //--
                  responseArray[2].forEach(function (itemForEach, i, arr) {
                    //console.log(itemForEach);
                    $("#15 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section1").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });

                  //for download
                  $("#section1").append('<tr><th colspan="2">Частково забезпечені МЗ -' + responseArray[3].length + '</th></tr>');
                  //--
                  responseArray[3].forEach(function (itemForEach, i, arr) {
                    $("#16 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section1").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });

                  //for download
                  $("#section1").append('<tr><th colspan="2">Відсутні файли або посилання на МЗ - ' + responseArray[4].length + '</th></tr>');
                  //--
                  responseArray[4].forEach(function (itemForEach, i, arr) {
                    $("#17 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section1").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section1").append('<tr><th colspan="2">Завантажено МЗ - ' + responseArray[0] + '</th></tr>');
                  //--
                  responseArray[1].forEach(function (itemForEach, i, arr) {
                    var subName = itemForEach.name;
                    var kindOfDoc = itemForEach.className;
                    var curCount = itemForEach.count;
                    var subNameNext;

                    if (i + 1 >= responseArray[1].length) {
                      subNameNext = "";
                    } else {
                      subNameNext = responseArray[1][i + 1].name;

                    }

                    if (subName != baseSubName) {
                      baseSubName = subName;
                      baseCounter = 0;
                      baseSubCounter++;
                      $("#14").append('<div class="zkmContent">' +
                        '<div class="panel panel-default" id="zkm14' + baseSubCounter + '">' +
                        '<table class="table table-bordered hidden "><tbody></tbody></table>' +
                        '</div></div>');
                      //for download
                      $("#section1").append('<tr><th colspan="2" id="sec14' + baseSubCounter + '"></th></tr>');
                      //--
                    }
                    $('#zkm14' + baseSubCounter + ' .table tbody').append('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
                    baseCounter += curCount;
                    //for download
                    $("#section1").append('<tr><td>' + kindOfDoc + '</td><td>' + curCount + '</td></tr>');
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
                  Api.execute("GET", path[3]).then(function (response) {
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
                      //for download
                      $("#section1").append('<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>');
                      //--
                    }
                    $("#zkm12 table").before('<div class="panel-heading panelHeadingHover extCentre active">' +
                      '<p>Кількість завантажених ЕІР, що читає ' + cathedraName + ' - <span class="badge myBadge" >' + resultCounter + '</span> </p></div>');
                    //for download
                    $("#section1 #sec12").append('Кількість завантажених ЕІР, що читає ' + cathedraName + ' - ' + resultCounter);
                    //--
                    isFinish[0] = true;
                    $(".statusLine").append('<p>Розділ 1 - завантажено.</p>');
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

      Api.execute("GET", path2[0]).then(function (response) {

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
        Api.execute("GET", path2[1]).then(function (response) {
          //console.log(response);
          responseArray2[0] = response;
          Api.execute("GET", path2[5]).then(function (response) {
            response.sort(
              function (a, b) {
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
            Api.execute("GET", path2[6]).then(function (response) {
              //console.log(response);
              responseArray2[2] = response;
              Api.execute("GET", path2[7]).then(function (response) {
                //console.log(response);
                responseArray2[3] = response;
                Api.execute("GET", path2[8]).then(function (response) {
                  //console.log(response);
                  responseArray2[4] = response;
                  //console.log(responseArray2);
                  $("#zkm21").append('<div class="zkmContent">' +
                    '<div class="tabbable row">' +
                    '<ul class="nav nav-tabs ">' +
                    '<li><a href="#24" data-toggle="tab">Завантажено МЗ - <span class="badge myBadge" >' + responseArray2[0] + '</span></a></li>' +
                    '<li><a href="#25" data-toggle="tab">Відсутнє МЗ - <span class="badge myBadge" >' + responseArray2[2].length + '</span></a></li>' +
                    '<li><a href="#26" data-toggle="tab">Частково забезпечені МЗ - <span class="badge myBadge" >' + responseArray2[3].length + '</span></a></li>' +
                    '<li><a href="#27" data-toggle="tab">Відсутні файли або посилання на МЗ - <span class="badge myBadge" >' + responseArray2[4].length + '</span></a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '<div class="tab-pane" id="24"></div>' +
                    '<div class="tab-pane" id="25">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '<div class="tab-pane" id="26">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '<div class="tab-pane" id="27">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '</div></div></div>'
                  );
                  //for download
                  $("#section2").append('<tr><th colspan="2">Відсутнє МЗ -' + responseArray2[2].length + '</th></tr>');
                  //--
                  responseArray2[2].forEach(function (itemForEach, i, arr) {
                    //console.log(itemForEach);
                    $("#25 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section2").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section2").append('<tr><th colspan="2">Частково забезпечені МЗ - ' + responseArray2[3].length + '</th></tr>');
                  //--
                  responseArray2[3].forEach(function (itemForEach, i, arr) {
                    $("#26 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section2").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section2").append('<tr><th colspan="2">Відсутні файли або посилання на МЗ - ' + responseArray2[4].length + '</th></tr>');
                  //--
                  responseArray2[4].forEach(function (itemForEach, i, arr) {
                    $("#27 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section2").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section2").append('<tr><th colspan="2">Завантажено МЗ - ' + responseArray2[0] + '</th></tr>');
                  //--
                  responseArray2[1].forEach(function (itemForEach, i, arr) {
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
                  Api.execute("GET", path2[3]).then(function (response) {
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
                    //--
                    //console.log(response);
                    isFinish[1] = true;
                    $(".statusLine").append('<p>Розділ 2 - завантажено.</p>');
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

      Api.execute("GET", path3[0]).then(function (response) {


        var baseSubName = "";
        var baseSubdivName = "";
        var baseCounter = 0;
        var baseSubjCounter = 0;
        var baseSubdivCounter = -1;
        var baseSubCounter = -1;
        var responseArray3 = [];


        $("#zkm3").append(
          '<div class="row">' +
          '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
          '<div class="panel panel-default" id="zkm31">' +
          '<div class="panel-heading panelHeadingHover extCentre active">' +
          '<p>Кількість КМ, що читає ' + cathedraName + ' для інших кафедр - <span class="badge myBadge" >' + response + '</span> </p>' +
          '</div></div></div></div>');
        //for download
        $("#section3").append('<tr><th colspan="2">Кількість КМ, що читає ' + cathedraName + ' для інших кафедр - ' + response + '</th></tr>');

        Api.execute("GET", path3[1]).then(function (response) {

          responseArray3[0] = response;
          Api.execute("GET", path3[5]).then(function (response) {

            response.sort(
              function (a, b) {
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
            Api.execute("GET", path3[6]).then(function (response) {

              responseArray3[2] = response;
              Api.execute("GET", path3[7]).then(function (response) {

                responseArray3[3] = response;
                Api.execute("GET", path3[8]).then(function (response) {

                  responseArray3[4] = response;

                  $("#zkm31").append('<div class="zkmContent">' +
                    '<div class="tabbable row">' +
                    '<ul class="nav nav-tabs ">' +
                    '<li><a href="#34" data-toggle="tab">Завантажено МЗ - <span class="badge myBadge" >' + responseArray3[0] + '</span></a></li>' +
                    '<li><a href="#35" data-toggle="tab">Відсутнє МЗ - <span class="badge myBadge" >' + responseArray3[2].length + '</span></a></li>' +
                    '<li><a href="#36" data-toggle="tab">Частково забезпечені МЗ - <span class="badge myBadge" >' + responseArray3[3].length + '</span></a></li>' +
                    '<li><a href="#37" data-toggle="tab">Відсутні файли або посилання на МЗ - <span class="badge myBadge" >' + responseArray3[4].length + '</span></a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '<div class="tab-pane" id="34"></div>' +
                    '<div class="tab-pane" id="35">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '<div class="tab-pane" id="36">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '<div class="tab-pane" id="37">' +
                    '<table class="table table-bordered "><tbody></tbody></table></div>' +
                    '</div></div></div>'
                  );
                  //for download
                  $("#section3").append('<tr><th colspan="2">Відсутнє МЗ - ' + responseArray3[2].length + '</th></tr>');
                  //--
                  responseArray3[2].forEach(function (itemForEach, i, arr) {
                    //console.log(itemForEach);
                    $("#35 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section3").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section3").append('<tr><th colspan="2">Частково забезпечені МЗ - ' + responseArray3[3].length + '</th></tr>');
                  //--

                  responseArray3[3].forEach(function (itemForEach, i, arr) {
                    $("#36 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section3").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section3").append('<tr><th colspan="2">Відсутні файли або посилання на МЗ - ' + responseArray3[4].length + '</th></tr>');
                  //--
                  responseArray3[4].forEach(function (itemForEach, i, arr) {
                    $("#37 table tbody").append('<tr><td>' + itemForEach + '</td></tr>');
                    //for download
                    $("#section3").append('<tr><td colspan="2">' + itemForEach + '</td></tr>');
                    //--
                  });
                  //for download
                  $("#section3").append('<tr><th colspan="2">Завантажено МЗ - ' + responseArray3[0] + '</th></tr>');
                  //--
                  responseArray3[1].forEach(function (itemForEach, i, arr) {
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
                  Api.execute("GET", path3[3]).then(function (response) {
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
                    //--

                    isFinish[2] = true;
                    $(".statusLine").append('<p>Розділ 3 - завантажено.</p>');
                  });

                });
              });
            });
          });
        });
      });

    }

    $scope.$watch('chosenSubdivision', function () {
      loadCathedras();
    });

  });
