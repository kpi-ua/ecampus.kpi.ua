'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:RnpCtrl
 * @description
 * # RnpCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('RnpCtrl', function ($scope, $cookies, $window, Api , $filter, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
      $scope.options ={
          StudyYears: [],
          Departments : [],
          Okrs: [],
          Specializations: [],
          StudyForms: [],
          XmlCodes: []
      };

      $scope.model = {
          studyYearName:null,
          departmentItem:null,
          okrName:null,
          specializationCodeName:null,
          studyFormName:null,
          xmlCode:null
      };

      $scope.selectData={
          studyYearId:null,
          departmentId:null,
          departmentMark:null,
          okrId:null,
          specializationId:null,
          studyFormId:null,
          xmlCodeId:null

      };

      $scope.display= {
          StudyGroups: [],
          RnpRows: []
      };
      $scope.RnpRows = null;
      $scope.errorLabelText="";
      // $scope.RnpRows = $scope.display.RnpRows;

      onInit();
      function onInit(){
          // $scope.selectData.departmentId = $scope.options.Departments [0].id;
          // $scope.selectData.okrId = $scope.options.Okrs[0].id;
          // $scope.selectData.specializationId = $scope.options.Specializations[0].id;
          // $scope.selectData.studyFormId = $scope.options.StudyForms[0].id;
          // $scope.selectData.xmlCodeId =$scope.options.XmlCodes[0].id;
      }
      $scope.testDataInit = function () {
          if($scope.RnpRows == null){
              $scope.RnpRows = [
                  {
                      "cycleName": "Цикл професійної та практичної підготовки",
                      "rnpRows": [
                          {
                              "rnp": {
                                  "name": "Теорія автоматичного управління - 2. Теорія цифрових систем управління",
                                  "id": 98479
                              },
                              "subdivisionName": "Кафедра технічної кібернетики ФІОТ",
                              "credits": 3,
                              "countLecture": 36,
                              "countPractice": 0,
                              "countLaboratory": 18,
                              "independentStudentWork": 51,
                              "cycleName": "Цикл професійної та практичної підготовки"
                          }
                      ]

                  },
                  {
                      "cycleName": "Цикл професійної та практичної підготовки 2",
                      "rnpRows": [
                          {
                              "rnp": {
                                  "name": "Теорія автоматичного управління - 2. Теорія цифрових систем управління",
                                  "id": 98479
                              },
                              "subdivisionName": "Кафедра технічної кібернетики ФІОТ",
                              "credits": 3,
                              "countLecture": 36,
                              "countPractice": 0,
                              "countLaboratory": 18,
                              "independentStudentWork": 51,
                              "cycleName": "Цикл професійної та практичної підготовки"
                          }
                      ]

                  }
              ];
          }
          else{
              $scope.RnpRows = [
                  {
                      "cycleName": "Цикл професійної та практичної підготовки",
                      "rnpRows": [
                          {
                              "rnp": {
                                  "name": "Теорія автоматичного управління - 2. Теорія цифрових систем управління",
                                  "id": 98479
                              },
                              "subdivisionName": "Кафедра технічної кібернетики ФІОТ",
                              "credits": 3,
                              "countLecture": 36,
                              "countPractice": 0,
                              "countLaboratory": 18,
                              "independentStudentWork": 51,
                              "cycleName": "Цикл професійної та практичної підготовки"
                          }
                      ]

                  },
                  {
                      "cycleName": "Цикл професійної та практичної підготовки 2",
                      "rnpRows": [
                          {
                              "rnp": {
                                  "name": "Теорія автоматичного управління - 2. Теорія цифрових систем управління",
                                  "id": 98479
                              },
                              "subdivisionName": "Кафедра технічної кібернетики ФІОТ",
                              "credits": 3,
                              "countLecture": 36,
                              "countPractice": 0,
                              "countLaboratory": 18,
                              "independentStudentWork": 51,
                              "cycleName": "Цикл професійної та практичної підготовки"
                          }
                      ]

                  },
                  {
                      "cycleName": "Цикл професійної та практичної підготовки 3",
                      "rnpRows": [
                          {
                              "rnp": {
                                  "name": "Теорія автоматичного управління - 2. Теорія цифрових систем управління",
                                  "id": 98479
                              },
                              "subdivisionName": "Кафедра технічної кібернетики ФІОТ",
                              "credits": 3,
                              "countLecture": 36,
                              "countPractice": 0,
                              "countLaboratory": 18,
                              "independentStudentWork": 51,
                              "cycleName": "Цикл професійної та практичної підготовки"
                          }
                      ]

                  }
              ];
          }
      }
  });
