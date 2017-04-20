(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name ecampusApp.controller:NpSpecializationsCtrl
   * @description
   * # MpSpecializationsCtrl
   * Controller of the ecampusApp
   */
  angular.module('ecampusApp')
    .controller('NpSpecializationsCtrl', NpSpecializationsCtrl);

  NpSpecializationsCtrl.$inject = ['$scope', 'api'];

  function NpSpecializationsCtrl($scope, api) {

    function sortNames(a, b) {
      var name1 = a.name;
      var name2 = b.name;

      return name1.localeCompare(name2);
    }

    function getAllFacultySubdivision(allSubdivisions, facultyId) {
      return allSubdivisions.filter(function(element) {
        return (
          element.parentId === facultyId
        );
      });
    }

    function filterAllSubdivision(allSubdivisions, subdivisionId) {
      // typeId value for faculty subdivisions
      var typeId = 30;

      return allSubdivisions.filter(function(element) {
        return (
          element.parentId === subdivisionId &&
          element.type.id === typeId
        );
      });
    }

    $scope.filterSubdivision = function(response, facultyId) {
      var allFacultySubdivisions = getAllFacultySubdivision(response, facultyId);
      $scope.subdivisions = [];

      for (var i = 0; i < allFacultySubdivisions.length; i++) {
        var subdivisionId = allFacultySubdivisions[i].id;
        var filteredSubdivision = filterAllSubdivision(response, subdivisionId);

        if (filteredSubdivision.length !== 0) {
          $scope.subdivisions = filteredSubdivision.sort(sortNames);
        }
      }
    };

    function filterFaculty(response) {
      // parentId value for faculties
      var facultiesId = 10437;
      // parentId value for institutes
      var institutesId = 10436;

      return response.filter(function(element) {
        return (
          element.parentId === facultiesId ||
          element.parentId === institutesId
        );
      });
    }

    function loadFaculties() {
      var url = 'Subdivision';

      api.execute('GET', url)
        .then(function(response) {
          $scope.fullSubdivisionResponse = response;
          $scope.faculties = filterFaculty(response).sort(sortNames);
        });
    }

    function filterSpecialities(allSpecialities, subdivisionId) {
      return allSpecialities.filter(function(element) {
        return (
          element.subdivision.id === subdivisionId
        );
      });
    }

    function uniqueSpecialities(arr) {
      var result = [];

      nextInput:
        for (var i = 0; i < arr.length; i++) {
          var str = arr[i];
          for (var j = 0; j < result.length; j++) {
            if (
              (result[j].id === str.id)
            ) {
              continue nextInput;
            }
          }
          result.push(str);
        }
      return result;
    }

    $scope.loadSpecialities = function(subdivisionId) {
      var url = 'StudyOrganization/ProfTrains';

      api.execute('GET', url)
        .then(function(response) {
          var specialitiesWithOkr = filterSpecialities(response, subdivisionId);
          $scope.allSpecialities = specialitiesWithOkr;
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr).sort(sortNames);
        });
    };

    // loadSpecializations(specialities.selected.id);
    // $scope.loadSpecializations = loadSpecializations;

    function loadSpecializations(specialityId) {
      var url = '';

      if (!specialityId) {
        url = 'StudyOrganization/Specialization';
      } else {
        url = 'StudyOrganization/Specialization?specialityId=' + specialityId;
      }

      api.execute('GET', url)
        .then(function(response) {
          $scope.specializations = response;
        });
    }

    function loadStudyYears() {
      var url = 'studyYears';

      api.execute('GET', url)
        .then(function(response) {
          $scope.studyYears = response.sort(sortNames);
        });
    }

    $scope.loadOkr = function(specialityId) {
      var allSpecialities = $scope.allSpecialities;
      var result = [];
      var filteredSpecialities = allSpecialities.filter(function(element) {
        return element.id === specialityId
      });

      for (var i = 0; i < filteredSpecialities.length; i++) {
        var specialitiesElement = filteredSpecialities[i];
        var okrSpecialitiesElement = specialitiesElement.okr;

        result.push(okrSpecialitiesElement);
      }
      $scope.allOkr = result.sort(sortNames)
    };

    function loadStudyForms() {
      var url = 'studyForms';

      api.execute('GET', url)
        .then(function(response) {
          $scope.studyForms = response.sort(sortNames);
        });
    }

    function checkParameter(value) {
      return value === 'not set';
    }

    function checkForUndefined(value) {
      return typeof value == 'undefined';
    }

    $scope.reloadNp = loadNp;

    function loadNp(specializationId, studyingYearId, studyFormId) {
      var url;

      if (
        !checkForUndefined(specializationId) ||
        !checkForUndefined(studyingYearId) ||
        !checkForUndefined(studyFormId)
      ) {
        var parameters = [];
        url = 'Np?';

        if (
          !checkParameter(specializationId) &&
          !checkForUndefined(specializationId)
        ) {
          var specializationParameter = {
            name: 'specializationId', value: specializationId
          };

          parameters.push(specializationParameter);
        }

        if (
          !checkParameter(studyingYearId) &&
          !checkForUndefined(studyingYearId)
        ) {
          var studyingYearParameter = {
            name: 'studyingYearId', value: studyingYearId
          };

          parameters.push(studyingYearParameter);
        }

        if (
          !checkParameter(studyFormId) &&
          !checkForUndefined(studyFormId)
        ) {
          var studyFormParameter = {
            name: 'studyFormId', value: studyFormId
          };

          parameters.push(studyFormParameter);
        }

        var len = parameters.length;

        for(var i = 0; i < len; i++) {
          var currentParameter = parameters[i];

          url += ('&' + currentParameter.name + '=' + (+currentParameter.value));
        }
      } else {
        url = 'Np';
      }

      api.execute('GET', url)
        .then(function(response) {
          $scope.nps = response;
        });
    }

    loadFaculties();
    loadStudyYears();
    loadStudyForms();
    loadSpecializations();
    loadNp();
  }
})();
