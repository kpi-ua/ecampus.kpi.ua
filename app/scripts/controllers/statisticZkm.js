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

  $scope.cathedras = [];
  $scope.subdivisions = [];
  $scope.errorLabelText = '';
  $scope.selecteCathedraId = null;
  $scope.loadedSatistic = {};
  $scope.cathedraHeadings = {};
  $scope.chosenCathedra = null;
  $scope.chosenSection = "";
  $scope.loadedSections = [];

  $scope.onSectionSelect = onSectionSelect;
  $scope.check = check;
  activate();

  function activate() {

  }

  function onSectionSelect(value) {
    $scope.chosenSection = value;
    loadStatisticSection($scope.chosenSection);
  }

  function check(chosenCathedra) {
    $scope.errorLabelText = "";
    $scope.chosenCathedra = chosenCathedra;
    var cathedraName = $scope.chosenCathedra.cathedraName;
    $scope.cathedraNames = {
      "NV": $scope.chosenCathedra.cathedraName.replace('Кафедра', 'кафедра'),
      "DV": $scope.chosenCathedra.cathedraName.replace('Кафедра', 'кафедрі'),
      "RV": $scope.chosenCathedra.cathedraName.replace('Кафедра', 'кафедри')
    };

    $scope.loadedSections = [];
    loadStatisticSection($scope.chosenSection);
  }

  function loadStatisticSection(selectedSection) {
    $scope.errorLabelText = '';

    if ($scope.chosenCathedra) {
      var cathedraId = $scope.chosenCathedra.cathedraId;
      if (selectedSection != "" && !~$scope.loadedSections.indexOf(selectedSection)) {
        $scope.loadedSections.push(selectedSection);
        var path = "/Statistic/Cathedras/" + cathedraId + "/StatisticFor";
        switch (selectedSection) {
          case 'section1': {
            path += "FirstSubjectProviderSection";
            $scope.cathedraHeadings[selectedSection] = {
              "first": "Кількість КМ, що читає " + $scope.cathedraNames["NV"],
              "second": "Кількість завантажених ЕІР, що читає " + $scope.cathedraNames["NV"]
            };
            break;
          }
          case 'section2': {
            path += "SecondSubjectProviderSection";
            $scope.cathedraHeadings[selectedSection] = {
              "first": "Кількість КМ, що читають інші кафедри для " + $scope.cathedraNames["RV"],
              "second": "Кількість завантажених ЕІР, що читає " + $scope.cathedraNames["NV"]
            };
            break;
          }
          case 'section3': {
            path += "ThirdSubjectProviderSection";
            $scope.cathedraHeadings[selectedSection] = {
              "first": "Кількість КМ, що читає " + $scope.cathedraNames["NV"] + " для інших кафедр",
              "second": "Кількість завантажених ЕІР, що читає " + $scope.cathedraNames["NV"]
            };
            break;
          }
          default: {
            $scope.errorLabelText = 'Помилка. Обрана секція відсутня.';
          }
        }
        api.execute('GET', path)
            .then(function (response) {
              $scope.loadedSatistic[selectedSection] = response;
            })
            .catch(errorHandlerMy);
      }
    }
    else {
      $scope.errorLabelText = 'Оберіть кафедру.';
      $scope.chosenSection = "";
    }

  }

  function errorHandlerMy(response, status, headers) {
    $scope.errorLabelText = api.errorHandler(response);
  }
}