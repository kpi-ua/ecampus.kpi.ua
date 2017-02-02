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
          StudyYears: [
              {
              "name": "2015-2016",
              "id": 5
              },
              {
              "name": "2016-2017",
              "id": 6
              }
          ],
          Departments : [
          {
              "mark": 1,
              "name": "Кафедра автоматизованих систем обробки інформації та управління ФІОТ",
              "id": 10120
          },{
              "mark": 2,
              "name": "Кафедра інформації та управління ФІОТ",
              "id": 10122
          }
          ],
          Okrs: [],
          Specializations: [],
          StudyForms: [],
          XmlCodes: []
      };
      $scope.selectData={
          studyYear:null,
          departmentId:null,
          okrId:null,
          specializationId:null,
          studyFormId:null,
          xmlCodeId:null

      };
      onInit();
      function onInit(){
          $scope.selectData.studyYear = $scope.options.StudyYears[0].name;
          // $scope.selectData.departmentId = $scope.options.Departments [0].id;
          // $scope.selectData.okrId = $scope.options.Okrs[0].id;
          // $scope.selectData.specializationId = $scope.options.Specializations[0].id;
          // $scope.selectData.studyFormId = $scope.options.StudyForms[0].id;
          // $scope.selectData.xmlCodeId =$scope.options.XmlCodes[0].id;

      }
      $scope.$watch('selectData.studyYear', function () {
          console.log($scope.selectData.studyYear);
          console.log();
      });

  });
