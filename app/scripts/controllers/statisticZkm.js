'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:StatisticZkmCtrl
 * @description
 * # StatisticZkmCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('ZkmCtrl', StatisticZkmCtrl);

StatisticZkmCtrl.$inject = ['$scope', 'api'];

function StatisticZkmCtrl($scope, api) {
  // var NTUUKpiSubdivisionId = 9998;
  // var InstituteTypeId = 26;
  // var FacultyTypeId = 77;
  // var CampusKpiSubsystemId = 1;

  $scope.cathedras = [];
  $scope.subdivisions = [];
  $scope.errorLabelText = '';

  $scope.selecteCathedraId = null;

  // activate();
  //
  // function activate() {
  //
  // }
  reload();

  function reload() {

    //!!!!
    $('#zkmWrapper').on('click', '.panel-heading', function () {
      var panelId = this.parentNode.id;
      $('#' + panelId + ' .table').toggleClass('hidden');
      $('#' + panelId + ' .zkmContent').toggleClass('hidden');
      $('#' + panelId + ' .panelHeadingHover').toggleClass('active');
    });

  }

  // function getParent(obj, parentTagName) {
  //   return (
  //     (obj.tagName === parentTagName) ?
  //       obj : getParent(obj.parentNode, parentTagName)
  //   );
  // }
  //
  // function setRadioBtnForCathedras(responsive) {
  //   var subdivisionId = responsive.Subdivision.Id;
  //   var subdivisionName = responsive.Subdivision.Name;
  //   if (~subdivisionName.indexOf('Кафедра')) {
  //     $scope.cathedras.push({
  //       cathedraId: subdivisionId,
  //       cathedraName: subdivisionName
  //     });
  //   }
  // }
  // function loadCathedras() {
  //
  //   $scope.npps = [];
  //
  //   if (!$scope.chosenSubdivision) {
  //     return;
  //   }
  //
  //   var parentId = $scope.chosenSubdivision.subdivisionId;
  //   var subdivisionPath = 'Subdivision/' + parentId + '/children';
  //
  //   api.execute('GET', subdivisionPath).then(function (response) {
  //     $scope.cathedras = [];
  //     response.forEach(function (item, i, arr) {
  //       if (arr[i + 1] !== undefined) {
  //         var cathedraId = item.id;
  //         var cathedraName = item.name;
  //         $scope.cathedras.push({
  //           cathedraId: cathedraId,
  //           cathedraName: cathedraName
  //         });
  //       }
  //     });
  //   });
  // }
  //
  // function setFacultyAndInstitute() {
  //   var kpiQuery = false;
  //   var sClaim = api.decodeToken(api.getToken());
  //   sClaim = JSON.parse(sClaim);
  //   var tof = typeof(sClaim.resp);
  //   if (tof === 'object') {
  //     sClaim.resp.forEach(function (item) {
  //       kpiQuery = setFacultyAndInstituteLogic(item, kpiQuery);
  //     });
  //   } else if (tof === 'string') {
  //     kpiQuery = setFacultyAndInstituteLogic(sClaim.resp, kpiQuery);
  //   }
  // }
  // function setFacultyAndInstituteLogic(item, kpiQuery) {
  //   var itemJSON = JSON.parse(item);
  //   if (itemJSON.Subsystem === CampusKpiSubsystemId) {
  //     var subdivisionId = itemJSON.Subdivision.Id;
  //     var subdivisionName = itemJSON.Subdivision.Name;
  //
  //     if (subdivisionId === NTUUKpiSubdivisionId && !kpiQuery) {
  //       kpiQuery = true;
  //       var pathFaculty = 'Subdivision';
  //       api.execute('GET', pathFaculty).then(function (response) {
  //         response.forEach(function (item) {
  //           if (
  //             item.type.id === InstituteTypeId ||
  //             item.type.id === FacultyTypeId
  //           ) {
  //             var subdivisionName = item.name;
  //             var subdivisionId = item.id;
  //
  //             $scope.subdivisions.push({
  //               subdivisionId: subdivisionId,
  //               subdivisionName: subdivisionName
  //             });
  //           }
  //         });
  //
  //         // var config = {
  //         //   '.chosen-select': {},
  //         //   '.chosen-select-deselect': { allow_single_deselect: true },
  //         //   '.chosen-select-no-single': { disable_search_threshold: 10 },
  //         //   '.chosen-select-no-results':
  //         //     { no_results_text: 'Співпадінь не знайдено...' },
  //         //   '.chosen-select-width': { width: '95%' }
  //         // };
  //         // for (var selector in config) {
  //         //   $(selector).chosen(config[selector]);
  //         // }
  //       });
  //     }
  //     if (document.getElementById(subdivisionId + '') === null &&
  //       (
  //       ~subdivisionName.indexOf('факультет') || ~subdivisionName.indexOf('Факультет') || ~subdivisionName.indexOf('інститут') || ~subdivisionName.indexOf('Інститут'))
  //     ) {
  //       $scope.subdivisions.push({
  //         subdivisionId: subdivisionId,
  //         subdivisionName: subdivisionName
  //       });
  //     }
  //
  //   }
  //   return kpiQuery;
  // }

  $scope.check = function (cathedra) {
    var isFinish = [];
    var cathedraId = cathedra.cathedraId;
    var cathedraName = cathedra.cathedraName;
    var cathedraNameRV = cathedraName;
    var cathedraNameDV = cathedraName;

    $scope.statusLine = '';
    $scope.zkm = null;
    $scope.errorLabelText = '';
    $scope.selecteCathedraId = cathedraId;

    $('#zkmWrapper').empty();
    $('#table-for-download').empty();

    cathedraNameDV = !cathedraNameDV ? '' : cathedraNameDV;

    cathedraNameDV = cathedraNameDV.replace('Кафедра', 'кафедрі');
    cathedraNameRV = cathedraNameDV.replace('Кафедра', 'кафедри');

    $scope.statusLine += 'Очікуємо  відповідь від сервера...\n';
    $scope.statusLine += 'Зачекайте будь ласка.\n';
    for (var i = 0; i < 3; i++) {
      isFinish[i] = false;
    }

    $('#zkmWrapper').append(
      '<div class="panel panel-default" id="zkm1">' +
      '<div class="panel-heading panelHeadingHover extCentre">' +
      '<p>РОЗДІЛ 1. Статистичні дані по ' + cathedraNameDV +
      ', що сама себе забезпечує, тобто сама собі читає кредитні модулі(КМ).' +
      '</p></div></div>' +
      '<div class="panel panel-default" id="zkm2">' +
      '<div class="panel-heading panelHeadingHover extCentre">' +
      '<p>РОЗДІЛ 2. Статистичні дані по ' + cathedraNameDV +
      ', для якої читають інші кафедри університету.</p>' +
      '</div></div>' +
      '<div class="panel panel-default" id="zkm3">' +
      '<div class="panel-heading panelHeadingHover extCentre">' +
      '<p>РОЗДІЛ 3. Статистичні дані по ' + cathedraNameDV +
      ', яка читає іншим кафедрам університету.</p>' +
      '</div></div>'
    );

    // for download
    $('#table-for-download').append(
      '<tbody id="section1">' +
      '<tr><th colspan="2">РОЗДІЛ 1. Статистичні дані по ' +
      cathedraNameDV +
      ', що сама себе забезпечує, тобто сама собі читає кредитні модулі(КМ).' +
      '</th></tr>' +
      '</tbody>' +
      '<tbody id="section2">' +
      '<tr><th colspan="2">РОЗДІЛ 2. Статистичні дані по ' +
      cathedraNameDV +
      ', для якої читають інші кафедри університету.</th></tr>' +
      '</tbody>' +
      '<tbody id="section3">' +
      '<tr><th colspan="2">РОЗДІЛ 3. Статистичні дані по ' +
      cathedraNameDV +
      ', яка читає іншим кафедрам університету.</th></tr>' +
      '</tbody>'
    );

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Раздел 1

    var path = [
      '/Modules/ByItself/Count',
      '/Modules/WithMethodicalmanualByItself/Count',
      '/Modules/WithoutMethodicalmanualByItself/Count',
      '/Modules/EIRSByItself/List',
      '/Modules/EIRSByItself/Count',
      '/Modules/WithMethodicalManual/List',
      '/Modules/WithoutMethodicalManul/List',
      '/Modules/WithPartialMethodicalManul/List',
      '/Modules/WithoutFiles/List'
    ].map(function (s) {
      return 'Statistic/Cathedras/' + cathedraId + s;
    });

    api.execute('GET', path[0]).then(function (response) {

      var baseSubName = '';
      var baseCounter = 0;
      var baseSubCounter = -1;
      var responseArray = [];

      //console.log(response);
      $('#zkm1').append(
        '<div class="row">' +
        '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
        '<div class="panel panel-default" id="zkm11">' +
        '<div class="panel-heading panelHeadingHover active">' +
        '<p>Кількість КМ, що читає ' + cathedraName +
        ' - <span class="badge myBadge" >' + response + '</span> </p>' +
        '</div></div></div></div>'
      );

      //for download
      $('#section1').append(
        '<tr><th colspan="2">Кількість КМ, що читає ' +
        cathedraName + ' - ' + response + '</th></tr>'
      );
      //--
      api.execute('GET', path[1]).then(function (response) {
        //console.log(response);
        responseArray[0] = response;
        api.execute('GET', path[5]).then(function (response) {
          //console.log(response);
          responseArray[1] = response;
          api.execute('GET', path[6]).then(function (response) {
            //console.log(response);
            responseArray[2] = response;
            api.execute('GET', path[7]).then(function (response) {
              //console.log(response);
              responseArray[3] = response;
              api.execute('GET', path[8]).then(function (response) {
                //console.log(response);
                responseArray[4] = response;
                //console.log(responseArray);
                $('#zkm11').append(
                  '<div class="zkmContent">' +
                  '<div class="tabbable row">' +
                  '<ul class="nav nav-tabs ">' +
                  '<li><a href="#14" data-toggle="tab">' +
                  'Завантажено МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray[0] +
                  '</span></a></li>' +
                  '<li><a href="#15" data-toggle="tab">' +
                  'Відсутнє МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray[2].length +
                  '</span></a></li>' +
                  '<li><a href="#16" data-toggle="tab">' +
                  'Частково забезпечені МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray[3].length +
                  '</span></a></li>' +
                  '<li><a href="#17" data-toggle="tab">' +
                  'Відсутні файли або посилання на МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray[4].length +
                  '</span></a></li>' +
                  '</ul>' +
                  '<div class="tab-content">' +
                  '<div class="tab-pane" id="14"></div>' +
                  '<div class="tab-pane" id="15">' +
                  '<table class="table table-bordered "><tbody>' +
                  '</tbody></table></div>' +
                  '<div class="tab-pane" id="16">' +
                  '<table class="table table-bordered "><tbody>' +
                  '</tbody></table></div>' +
                  '<div class="tab-pane" id="17">' +
                  '<table class="table table-bordered "><tbody>' +
                  '</tbody></table></div>' +
                  '</div></div></div>'
                );
                //for download
                $('#section1').append(
                  '<tr><th colspan="2">Відсутнє МЗ - ' +
                  responseArray[2].length + '</th></tr>'
                );
                //--
                responseArray[2].forEach(function (item) {
                  //console.log(item);
                  $('#15 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section1').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });

                //for download
                $('#section1').append(
                  '<tr><th colspan="2">Частково забезпечені МЗ -' +
                  responseArray[3].length + '</th></tr>'
                );
                //--
                responseArray[3].forEach(function (item) {
                  $('#16 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section1').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });

                //for download
                $('#section1').append(
                  '<tr><th colspan="2">' +
                  'Відсутні файли або посилання на МЗ - ' +
                  responseArray[4].length + '</th></tr>'
                );
                //--
                responseArray[4].forEach(function (item) {
                  $('#17 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section1').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section1').append(
                  '<tr><th colspan="2">Завантажено МЗ - ' +
                  responseArray[0] + '</th></tr>'
                );
                //--
                responseArray[1].forEach(function (item) {
                  var subName = item.name;
                  var kindOfDoc = item.className;
                  var curCount = item.count;
                  var subNameNext;

                  if (i + 1 >= responseArray[1].length) {
                    subNameNext = '';
                  } else {
                    subNameNext = responseArray[1][i + 1].name;
                  }

                  if (subName !== baseSubName) {
                    baseSubName = subName;
                    baseCounter = 0;
                    baseSubCounter++;
                    $('#14').append(
                      '<div class="zkmContent">' +
                      '<div class="panel panel-default" id="zkm14' +
                      baseSubCounter + '">' +
                      '<table class="table table-bordered hidden ">' +
                      '<tbody></tbody></table>' +
                      '</div></div>'
                    );
                    //for download
                    $('#section1').append(
                      '<tr><th colspan="2" id="sec14' +
                      baseSubCounter + '"></th></tr>'
                    );
                    //--
                  }
                  $('#zkm14' + baseSubCounter + ' .table tbody').append(
                    '<tr><td>' + kindOfDoc + '</td><td>' +
                    curCount + '</td></tr>'
                  );
                  baseCounter += curCount;
                  //for download
                  $('#section1').append(
                    '<tr><td>' + kindOfDoc + '</td><td>' +
                    curCount + '</td></tr>'
                  );
                  //--
                  //downloadCounter ++;
                  if (subName !== subNameNext) {
                    $('#zkm14' + baseSubCounter + ' .table').before(
                      '<div class="panel-heading panelHeadingHover extCentre">' +
                      '<p>' + baseSubName + '<span class="badge myBadge" >' +
                      baseCounter + '</span> </p></div>'
                    );
                    //for download
                    $('#section1 #sec14' + baseSubCounter).append(
                      baseSubName + ' - ' + baseCounter
                    );
                    //--
                  }
                });

                //console.log('baseSubCounter ' +baseSubCounter);
                //console.log('downloadCounter ' +downloadCounter);
                api.execute('GET', path[3]).then(function (response) {
                  var resultCounter = 0;
                  $('#zkm1').append(
                    '<div class="row">' +
                    '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                    '<div class="panel panel-default" id="zkm12">' +
                    '<table class="table table-bordered "><tbody></tbody></table>' +
                    '</div></div></div>'
                  );
                  //for download
                  $('#section1').append(
                    '<tr><th colspan="2" id="sec12"></th></tr>'
                  );
                  //--
                  for (var key in response) {
                    var subName = key;
                    var curCount = response[key];
                    $('#zkm12 table tbody').append(
                      '<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>'
                    );
                    resultCounter += curCount;
                    //for download
                    $('#section1').append(
                      '<tr><td>' + subName + '</td><td>' + curCount + '</td></tr>'
                    );
                    //--
                  }
                  $('#zkm12 table').before(
                    '<div class="panel-heading panelHeadingHover extCentre active">' +
                    '<p>Кількість завантажених ЕІР, що читає ' + cathedraName +
                    ' - <span class="badge myBadge" >' + resultCounter + '</span> </p></div>'
                  );
                  //for download
                  $('#section1 #sec12').append(
                    'Кількість завантажених ЕІР, що читає ' +
                    cathedraName + ' - ' + resultCounter
                  );
                  //--
                  isFinish[0] = true;
                  $('.statusLine').append('<p>Розділ 1 - завантажено.</p>');
                });
              });
            });
          });
        });
      });
    });

    ////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Раздел 2

    var path2 = [
      '/Modules/FromForeignCathedras/Count',
      '/MethodicalManual/FromForeignCathedras/Count',
      '/Modules/WithoutMethodicalmanualByItself/Count', // не используется отсутствует для раздела 2
      '/EIRSByCreditModules/FromForeignCathedras/List',
      '/EIRByCreditModules/FromForeignCathedras/Count',
      '/Modules/WithMethodicalManual/FromForeignCathedras/List',
      '/Modules/WithoutMethodicalManual/FromForeignCathedras/List',
      '/Modules/WithPartialMethodicalManual/FromForeignCathedras/List',
      '/Modules/WithoutFiles/FromForeignCathedras/List'
    ].map(function (s) {
      return 'Statistic/Cathedras/' + cathedraId + s;
    });

    api.execute('GET', path2[0]).then(function (response) {

      var baseSubName = '';
      var baseSubdivName = '';
      var baseCounter = 0;
      var baseSubjCounter = 0;
      var baseSubdivCounter = -1;
      var baseSubCounter = -1;
      var responseArray2 = [];

      //console.log(response);
      $('#zkm2').append(
        '<div class="row">' +
        '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
        '<div class="panel panel-default" id="zkm21">' +
        '<div class="panel-heading panelHeadingHover extCentre active">' +
        '<p>Кількість КМ, що читають інші кафедри для ' + cathedraNameRV +
        ' - <span class="badge myBadge" >' + response + '</span> </p>' +
        '</div></div></div></div>'
      );
      //for download
      $('#section2').append(
        '<tr><th colspan="2">Кількість КМ, що читають інші кафедри для ' +
        cathedraNameRV + ' - ' + response + '</th></tr>'
      );
      //--
      api.execute('GET', path2[1]).then(function (response) {
        //console.log(response);
        responseArray2[0] = response;
        api.execute('GET', path2[5]).then(function (response) {
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
          api.execute('GET', path2[6]).then(function (response) {
            //console.log(response);
            responseArray2[2] = response;
            api.execute('GET', path2[7]).then(function (response) {
              //console.log(response);
              responseArray2[3] = response;
              api.execute('GET', path2[8]).then(function (response) {
                //console.log(response);
                responseArray2[4] = response;
                //console.log(responseArray2);
                $('#zkm21').append(
                  '<div class="zkmContent">' +
                  '<div class="tabbable row">' +
                  '<ul class="nav nav-tabs ">' +
                  '<li><a href="#24" data-toggle="tab">Завантажено МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray2[0] +
                  '</span></a></li>' +
                  '<li><a href="#25" data-toggle="tab">Відсутнє МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray2[2].length +
                  '</span></a></li>' +
                  '<li><a href="#26" data-toggle="tab">Частково забезпечені МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray2[3].length +
                  '</span></a></li>' +
                  '<li><a href="#27" data-toggle="tab">Відсутні файли або посилання на МЗ - ' +
                  '<span class="badge myBadge" >' + responseArray2[4].length +
                  '</span></a></li></ul>' +
                  '<div class="tab-content">' +
                  '<div class="tab-pane" id="24"></div>' +
                  '<div class="tab-pane" id="25">' +
                  '<table class="table table-bordered ">' +
                  '<tbody></tbody></table></div>' +
                  '<div class="tab-pane" id="26">' +
                  '<table class="table table-bordered ">' +
                  '<tbody></tbody></table></div>' +
                  '<div class="tab-pane" id="27">' +
                  '<table class="table table-bordered ">' +
                  '<tbody></tbody></table></div>' +
                  '</div></div></div>'
                );
                //for download
                $('#section2').append(
                  '<tr><th colspan="2">Відсутнє МЗ -' +
                  responseArray2[2].length + '</th></tr>'
                );
                //--
                responseArray2[2].forEach(function (item) {
                  //console.log(item);
                  $('#25 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section2').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section2').append(
                  '<tr><th colspan="2">Частково забезпечені МЗ - ' +
                  responseArray2[3].length + '</th></tr>'
                );
                //--
                responseArray2[3].forEach(function (item) {
                  $('#26 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section2').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section2').append(
                  '<tr><th colspan="2">Відсутні файли або посилання на МЗ - ' +
                  responseArray2[4].length + '</th></tr>'
                );
                //--
                responseArray2[4].forEach(function (item) {
                  $('#27 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section2').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section2').append(
                  '<tr><th colspan="2">Завантажено МЗ - ' +
                  responseArray2[0] + '</th></tr>'
                );
                //--
                responseArray2[1].forEach(function (item) {
                  var subName = item.name;
                  var kindOfDoc = item.classNameFull;
                  var curCount = item.count;
                  var subdivName = item.subdivisionName;
                  var subNameNext;
                  var subdivNameNext;
                  if (i + 1 >= responseArray2[1].length) {
                    subNameNext = '';
                    subdivNameNext = '';
                    $(
                      '#24 #zkm24' + baseSubdivCounter +
                      ' .panelHeadingHover p.nestingFix'
                    ).append(
                      '<span class="badge myBadge" >' +
                      baseSubjCounter + '</span>'
                    );
                    //for download
                    $('#section2 #sec24' + baseSubdivCounter + ' th').append(
                      ' - ' + baseSubjCounter
                    );
                    //--
                  } else {
                    subNameNext = responseArray2[1][i + 1].name;
                    subdivNameNext = responseArray2[1][i + 1].subdivisionName;
                  }
                  if (baseSubdivName !== subdivName) {
                    if (baseSubdivCounter !== -1) {
                      $(
                        '#24 #zkm24' + baseSubdivCounter +
                        ' .panelHeadingHover p.nestingFix'
                      ).append(
                        '<span class="badge myBadge" >' +
                        baseSubjCounter + '</span>'
                      );
                      //for download
                      $(
                        '#section2 #sec24' + baseSubdivCounter + ' th'
                      ).append(
                        ' - ' + baseSubjCounter
                      );
                      //--
                    }
                    baseSubdivName = subdivName;
                    baseSubName = '';
                    baseSubdivCounter++;
                    baseSubjCounter = 0;
                    $('#24').append(
                      '<div class="panel panel-default" id="zkm24' +
                      baseSubdivCounter + '">' +
                      '<div class="panel-heading panelHeadingHover extCentre">' +
                      '<p class="nestingFix">' + baseSubdivName +
                      '</p></div> '
                    );
                    //for download
                    $('#section2').append(
                      '<tr id="sec24' + baseSubdivCounter +
                      '"><th colspan="2" >' + baseSubdivName + '</th></tr>'
                    );
                    //--
                  }
                  if (subName !== baseSubName) {
                    baseSubName = subName;
                    baseCounter = 0;
                    baseSubCounter++;
                    baseSubjCounter++;
                    $('#zkm24' + baseSubdivCounter).append(
                      '<div class="row">' +
                      '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                      '<div class="panel panel-default" id="zkm24' +
                      baseSubdivCounter + '_' + baseSubCounter + '">' +
                      '<table class="table table-bordered "><tbody></tbody></table>' +
                      '</div></div></div>'
                    );
                    //for download
                    $('#section2 #sec24' + baseSubdivCounter).after(
                      '<tr id="sec24' + baseSubdivCounter + '_' +
                      baseSubCounter + '"><th colspan="2" ></th></tr>'
                    );
                    //--
                  }
                  $(
                    '#zkm24' + baseSubdivCounter + '_' +
                    baseSubCounter + ' .table tbody'
                  ).append(
                    '<tr><td>' + kindOfDoc + '</td><td>' +
                    curCount + '</td></tr>'
                  );
                  baseCounter += curCount;
                  //for download
                  $(
                    '#section2 #sec24' + baseSubdivCounter +
                    '_' + baseSubCounter
                  ).after(
                    '<tr><td>' + kindOfDoc + '</td><td>' +
                    curCount + '</td></tr>'
                  );
                  //--
                  if (
                    subName !== subNameNext ||
                    (
                      subdivName !== subdivNameNext &&
                      subdivNameNext !== ''
                    )
                  ) {
                    $(
                      '#zkm24' + baseSubdivCounter + '_' + baseSubCounter + ' .table'
                    ).before(
                      '<div class="panel-heading panelHeadingHover extCentre active">' +
                      '<p>' + baseSubName +
                      '<span class="badge myBadge" >' + baseCounter +
                      '</span></p></div>'
                    );
                    //for download
                    $(
                      '#section2 #sec24' + baseSubdivCounter + '_' +
                      baseSubCounter + ' th'
                    ).append(
                      baseSubName + ' - ' + baseCounter
                    );
                    //--
                  }
                });
                api.execute('GET', path2[3]).then(function (response) {
                  var resultCounter = 0;
                  $('#zkm2').append(
                    '<div class="row">' +
                    '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                    '<div class="panel panel-default" id="zkm22">' +
                    '<table class="table table-bordered "><tbody></tbody></table>' +
                    '</div></div></div>'
                  );
                  //for download
                  $('#section2').append(
                    '<tr id="sec22"><th colspan="2"></th></tr>'
                  );
                  //--
                  for (var key in response) {
                    var subName = key;
                    var curCount = response[key];
                    $('#zkm22 table tbody').append(
                      '<tr><td>' + subName + '</td>' +
                      '<td>' + curCount + '</td></tr>'
                    );
                    //for download
                    $('#section2').append(
                      '<tr><td>' + subName + '</td>' +
                      '<td>' + curCount + '</td></tr>'
                    );
                    //--
                    resultCounter += curCount;
                  }
                  $('#zkm22 table').before(
                    '<div class="panel-heading panelHeadingHover extCentre active">' +
                    '<p>Кількість завантажених ЕІР, що читає ' + cathedraName +
                    ' - <span class="badge myBadge" >' + resultCounter +
                    '</span> </p></div>'
                  );
                  //for download
                  $('#section2 #sec22 th').append(
                    'Кількість завантажених ЕІР, що читає ' +
                    cathedraName + ' - ' + resultCounter
                  );
                  //--
                  //console.log(response);
                  isFinish[1] = true;
                  $('.statusLine').append('<p>Розділ 2 - завантажено.</p>');
                });
              });
            });
          });
        });
      });
    });

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Раздел 3

    var path3 = [
      '/Modules/ForForeignCathedras/Count',
      '/WithMethodicalManual/ForForeignCathedras/Count',
      '/WithoutMethodicalManual/ForForeignCathedras/Count',
      //не используется отсутствует для раздела 2
      '/EIRByCreditModules/ForForeignCathedras/List',
      '/EIRByCreditModules/ForForeignCathedras/Count',
      '/Modules/WithMethodicalManual/ForForeignCathedras/List',
      '/Modules/WithoutMethodicalManual/ForForeignCathedras/List',
      '/Modules/WithPartialMethodicalManual/ForForeignCathedras/List',
      '/Modules/WithoutFiles/ForForeignCathedras/List'
    ].map(function (s) {
      return 'Statistic/Cathedras/' + cathedraId + s;
    });

    api.execute('GET', path3[0]).then(function (response) {
      var baseSubName = '';
      var baseSubdivName = '';
      var baseCounter = 0;
      var baseSubjCounter = 0;
      var baseSubdivCounter = -1;
      var baseSubCounter = -1;
      var responseArray3 = [];

      $('#zkm3').append(
        '<div class="row">' +
        '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
        '<div class="panel panel-default" id="zkm31">' +
        '<div class="panel-heading panelHeadingHover extCentre active">' +
        '<p>Кількість КМ, що читає ' + cathedraName +
        ' для інших кафедр - <span class="badge myBadge" >' +
        response + '</span> </p>' +
        '</div></div></div></div>'
      );
      //for download
      $('#section3').append(
        '<tr><th colspan="2">Кількість КМ, що читає ' +
        cathedraName + ' для інших кафедр - ' + response + '</th></tr>'
      );

      api.execute('GET', path3[1]).then(function (response) {

        responseArray3[0] = response;
        api.execute('GET', path3[5]).then(function (response) {

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
          api.execute('GET', path3[6]).then(function (response) {

            responseArray3[2] = response;
            api.execute('GET', path3[7]).then(function (response) {

              responseArray3[3] = response;
              api.execute('GET', path3[8]).then(function (response) {

                responseArray3[4] = response;

                $('#zkm31').append(
                  '<div class="zkmContent">' +
                  '<div class="tabbable row">' +
                  '<ul class="nav nav-tabs ">' +
                  '<li><a href="#34" data-toggle="tab">' +
                  'Завантажено МЗ - <span class="badge myBadge" >' +
                  responseArray3[0] + '</span></a></li>' +
                  '<li><a href="#35" data-toggle="tab">' +
                  'Відсутнє МЗ - <span class="badge myBadge" >' +
                  responseArray3[2].length + '</span></a></li>' +
                  '<li><a href="#36" data-toggle="tab">' +
                  'Частково забезпечені МЗ - <span class="badge myBadge" >' +
                  responseArray3[3].length + '</span></a></li>' +
                  '<li><a href="#37" data-toggle="tab">' +
                  'Відсутні файли або посилання на МЗ - ' +
                  '<span class="badge myBadge" >' +
                  responseArray3[4].length + '</span></a></li>' +
                  '</ul>' +
                  '<div class="tab-content">' +
                  '<div class="tab-pane" id="34"></div>' +
                  '<div class="tab-pane" id="35">' +
                  '<table class="table table-bordered ">' +
                  '<tbody></tbody></table></div>' +
                  '<div class="tab-pane" id="36">' +
                  '<table class="table table-bordered ">' +
                  '<tbody></tbody></table></div>' +
                  '<div class="tab-pane" id="37">' +
                  '<table class="table table-bordered ">' +
                  '<tbody></tbody></table></div>' +
                  '</div></div></div>'
                );
                //for download
                $('#section3').append(
                  '<tr><th colspan="2">Відсутнє МЗ - ' +
                  responseArray3[2].length + '</th></tr>'
                );
                //--
                responseArray3[2].forEach(function (item) {
                  // console.log(item);
                  $('#35 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section3').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section3').append(
                  '<tr><th colspan="2">Частково забезпечені МЗ - ' +
                  responseArray3[3].length + '</th></tr>'
                );
                //--

                responseArray3[3].forEach(function (item) {
                  $('#36 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section3').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section3').append(
                  '<tr><th colspan="2">' +
                  'Відсутні файли або посилання на МЗ - ' +
                  responseArray3[4].length + '</th></tr>'
                );
                //--
                responseArray3[4].forEach(function (item) {
                  $('#37 table tbody').append(
                    '<tr><td>' + item + '</td></tr>'
                  );
                  //for download
                  $('#section3').append(
                    '<tr><td colspan="2">' + item + '</td></tr>'
                  );
                  //--
                });
                //for download
                $('#section3').append(
                  '<tr><th colspan="2">Завантажено МЗ - ' +
                  responseArray3[0] + '</th></tr>'
                );
                //--
                responseArray3[1].forEach(function (item) {
                  var subName = item.name;
                  var kindOfDoc = item.classNameFull;
                  var curCount = item.count;
                  var subdivName = item.subdivisionName;
                  var subNameNext;
                  var subdivNameNext;
                  if (i + 1 >= responseArray3[1].length) {
                    subNameNext = '';
                    subdivNameNext = '';
                    $(
                      '#34 #zkm34' + baseSubdivCounter +
                      ' .panelHeadingHover p.nestingFix'
                    ).append(
                      '<span class="badge myBadge" >' +
                      baseSubjCounter + '</span>'
                    );
                    //for download
                    $(
                      '#section3 #sec34' +
                      baseSubdivCounter + ' th'
                    ).append(' - ' + baseSubjCounter);
                    //--
                  } else {
                    subNameNext = responseArray3[1][i + 1].name;
                    subdivNameNext = responseArray3[1][i + 1].subdivisionName;
                  }
                  if (baseSubdivName !== subdivName) {
                    if (baseSubdivCounter !== -1) {
                      $(
                        '#34 #zkm34' + baseSubdivCounter +
                        ' .panelHeadingHover p.nestingFix'
                      ).append(
                        '<span class="badge myBadge" >' +
                        baseSubjCounter + '</span>'
                      );
                      //for download
                      $(
                        '#section3 #sec34' +
                        baseSubdivCounter + ' th'
                      ).append(' - ' + baseSubjCounter);
                      //--
                    }
                    baseSubdivName = subdivName;
                    baseSubName = '';
                    baseSubdivCounter++;
                    baseSubjCounter = 0;
                    $('#34').append(
                      '<div class="panel panel-default" id="zkm34' +
                      baseSubdivCounter + '">' +
                      '<div class="panel-heading panelHeadingHover extCentre">' +
                      '<p class="nestingFix">' + baseSubdivName + '</p>' +
                      '</div> '
                    );
                    //for download
                    $('#section3').append(
                      '<tr id="sec34' + baseSubdivCounter +
                      '"><th colspan="2" >' +
                      baseSubdivName + '</th></tr>'
                    );
                    //--
                  }

                  if (subName !== baseSubName) {
                    baseSubName = subName;
                    baseCounter = 0;
                    baseSubCounter++;
                    baseSubjCounter++;
                    $('#zkm34' + baseSubdivCounter).append(
                      '<div class="row">' +
                      '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                      '<div class="panel panel-default" id="zkm34' +
                      baseSubdivCounter + '_' + baseSubCounter + '">' +
                      '<table class="table table-bordered ">' +
                      '<tbody></tbody></table>' +
                      '</div></div></div>'
                    );
                    //for download
                    $('#section3 #sec34' + baseSubdivCounter).after(
                      '<tr id="sec34' + baseSubdivCounter + '_' +
                      baseSubCounter + '"><th colspan="2" ></th></tr>'
                    );
                    //--
                  }
                  $(
                    '#zkm34' + baseSubdivCounter + '_' +
                    baseSubCounter + ' .table tbody'
                  ).append(
                    '<tr><td>' + kindOfDoc + '</td><td>' +
                    curCount + '</td></tr>'
                  );
                  baseCounter += curCount;
                  //for download
                  $(
                    '#section3 #sec34' + baseSubdivCounter +
                    '_' + baseSubCounter
                  ).after(
                    '<tr><td>' + kindOfDoc + '</td><td>' +
                    curCount + '</td></tr>'
                  );
                  //--
                  if (
                    subName !== subNameNext ||
                    (
                      subdivName !== subdivNameNext &&
                      subdivNameNext !== ''
                    )
                  ) {
                    $(
                      '#zkm34' + baseSubdivCounter + '_' +
                      baseSubCounter + ' .table'
                    ).before(
                      '<div class="panel-heading panelHeadingHover extCentre active">' +
                      '<p>' + baseSubName + '<span class="badge myBadge" >' +
                      baseCounter + '</span></p></div>'
                    );
                    //for download
                    $(
                      '#section3 #sec34' + baseSubdivCounter + '_' +
                      baseSubCounter + ' th'
                    ).append(baseSubName + ' - ' + baseCounter);
                    //--
                  }
                });
                api.execute('GET', path3[3]).then(function (response) {
                  var resultCounter = 0;
                  $('#zkm3').append(
                    '<div class="row">' +
                    '<div class="zkmContent hidden col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">' +
                    '<div class="panel panel-default" id="zkm32">' +
                    '<table class="table table-bordered ">' +
                    '<tbody></tbody></table>' +
                    '</div></div></div>'
                  );
                  //for download
                  $('#section3').append(
                    '<tr id="sec32"><th colspan="2"></th></tr>'
                  );
                  //--
                  for (var key in response) {
                    var subName = key;
                    var curCount = response[key];
                    $('#zkm32 table tbody').append(
                      '<tr><td>' + subName + '</td><td>' +
                      curCount + '</td></tr>'
                    );
                    //for download
                    $('#section3').append(
                      '<tr><td>' + subName + '</td><td>' +
                      curCount + '</td></tr>'
                    );
                    //--
                    resultCounter += curCount;
                  }
                  $('#zkm32 table').before(
                    '<div class="panel-heading panelHeadingHover extCentre active">' +
                    '<p>Кількість завантажених ЕІР, що читає ' +
                    cathedraName +
                    ' - <span class="badge myBadge" >' +
                    resultCounter + '</span> </p></div>'
                  );
                  //for download
                  $('#section3 #sec32 th').append(
                    'Кількість завантажених ЕІР, що читає ' +
                    cathedraName + ' - ' + resultCounter
                  );
                  //--

                  isFinish[2] = true;
                  $('.statusLine').append('<p>Розділ 3 - завантажено.</p>');
                });

              });
            });
          });
        });
      });
    });

  };

  // $scope.$watch('chosenSubdivision', function () {
  //   loadCathedras();
  // });

}
