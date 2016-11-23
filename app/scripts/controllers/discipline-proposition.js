'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesPropositionCtrl
 * @description
 * # DisciplinesPropositionCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('DisciplinesPropositionCtrl', function ($scope, $http, Api, UniqueElemsInList) {

    angular.element(document).ready(function () {
      Api.execute("GET", "Subdivision")
        .then(function (response) {
          $scope.allDataFromApi = response;

          $scope.allSubdivisions = [];

          /* test with:
           Кафедра екології та технології рослинних полімерів ІХФ
           Кафедра української мови, літератури та культури ФЛ
           Кафедра історії ФСП
           Кафедра філософії ФСП
           Кафедра публічного права ФСП
           Кафедра інформаційного права та права інтелектуальної власності ФСП
           */

          if (!!$scope.allDataFromApi) {
            for (var i = 0; i < $scope.allDataFromApi.length; i++) {
              if ($scope.allDataFromApi[i].typeId == 30) {
                $scope.allSubdivisions.push({
                  name: $scope.allDataFromApi[i].name,
                  id: $scope.allDataFromApi[i].subdivisionId
                });
              }
            }
          }

          $scope.alldisciplines = [];
        }, function (response) {

          $scope.allSubdivisions = [];


        });
    });

    $scope.SendSubdivisionToServer = function () {
      $scope.alldisciplines = [];
      var data = $scope.selectedDiscipline.id;

      alert(data);

      var url = "SelectiveDiscipline/BlocksDispline/" + data;

      Api.execute("GET", url)
        .then(function (response) {

            // success callback
            $scope.alldisciplines = response.data;
            $scope.ifSubdivChosen = function () {
              return Boolean($scope.alldisciplines);
            };

            $scope.sortName = 'nameUkr';
            $scope.sortReverse = false;

            $scope.sortBy = function (propertyName) {
              $scope.sortReverse = ($scope.sortName === propertyName) ? !$scope.sortReverse : true;
              $scope.sortName = propertyName;
            };

            $scope.CurrentYearData = {};
            $scope.CurrentYearDataList = [];

            $scope.getCurrentYearData = function (currentData) {
              $scope.CurrentYearData = currentData;
            };

            /* temp data before api will be implemented*/
            $scope.tempListData = {
              allOkr: [
                {
                  currentOkr: "бакалавр",
                  currentOkrId: 1
                },
                {
                  currentOkr: "магістр",
                  currentOkrId: 2
                }
              ],
              allBlocks: [
                {currentBlock: "блок1", currentBlockId: 1},
                {currentBlock: "блок2", currentBlockId: 2},
                {currentBlock: "блок3", currentBlockId: 3},
                {currentBlock: "блок4", currentBlockId: 4}
              ],
              allDisciplines: [
                {currentDiscipline: "дисципліна1", currentDisciplineId: 1},
                {currentDiscipline: "дисципліна2", currentDisciplineId: 2},
                {currentDiscipline: "дисципліна3", currentDisciplineId: 3},
                {currentDiscipline: "дисципліна4", currentDisciplineId: 4}
              ]
            };

            $scope.tempListDataMax = {
              allYearsMax: [
                {currentYear: "2016-2017"},
                {currentYear: "2017-2018"},
                {currentYear: "2018-2019"}
              ],
              allApproves: [
                {currentApprove: "+"},
                {currentApprove: "-"},
                {currentApprove: "+/-"}
              ]

            };

            $scope.newDataMax = {
              cDisciplineBlock8Id: "",
              StudyYear: "",
              MaxCountStudent: "",
              IsApproved: ""
            };

            $scope.newData = {
              DcOKRId: "",
              DcBlock8Id: "",
              DcDiscipline8Id: "",
              DcSubdivisionWhoId: "",
              CountCredit: null,
              Annotation: "",
              Competence: "",
              Knowledge: "",
              Skill: ""
            };


            $scope.sendToServer = function () {
              $scope.newData.countCredit = parseInt($scope.newData.countCredit);
              var data = angular.toJson($scope.newData);
              console.log(data);
              var config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };

              console.log("I'm preparing new data. Wait pls.");
              console.log($scope.newData);

              // Api.execute("POST", 'some_url', data, config)
              //   .then(function (response) {
              //       $scope.alldisciplines = response.data;
              //     },
              //     function (response) {
              //       alert("Cannot add new data");
              //     }
              //   );
            }

          },
          function (response) {

            $scope.alldisciplines = null;
          }
        );
    };

    /* Control (integer + - adding) */
    $scope.MinusCred = function () {
      $scope.newData.countCredit = parseInt($scope.newData.countCredit);

      if ($scope.newData.countCredit !== 0) {
        $scope.newData.countCredit = $scope.newData.countCredit - 1;
        $('.btn-minuse').removeClass('disabled');
        $('.btn-pluss').removeClass('disabled');
      }
      else {
        $('.btn-minuse').addClass('disabled');
      }
    };

    $scope.PlusCred = function () {
      $scope.newData.countCredit = parseInt($scope.newData.countCredit);
      if ($scope.newData.countCredit !== 9) {
        $scope.newData.countCredit = $scope.newData.countCredit + 1;
        $('.btn-pluss').removeClass('disabled');
        $('.btn-minuse').removeClass('disabled');
      }
      else {
        $('.btn-pluss').addClass('disabled');
      }
    };

    var number = document.getElementById('newCred');

    number.onkeydown = function (e) {
      if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8)) {
        return false;
      }
    }

  });



