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
    $scope.hideTable = false;

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

    $scope.filterSubdivision = filterSubdivision;

    function filterSubdivision(response, facultyId) {
      var allFacultySubdivisions = getAllFacultySubdivision(response, facultyId);
      $scope.subdivisions = [];

      for (var i = 0; i < allFacultySubdivisions.length; i++) {
        var subdivisionId = allFacultySubdivisions[i].id;
        var filteredSubdivision = filterAllSubdivision(response, subdivisionId);

        if (filteredSubdivision.length !== 0) {
          $scope.subdivisions = filteredSubdivision.sort(sortNames);
        }
      }
    }

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
      var method = 'GET';

      api.execute(method, url)
        .then(function(response) {
          $scope.fullSubdivisionResponse = response;
          $scope.faculties = filterFaculty(response).sort(sortNames);
        })
        .catch(function(response) {
          $scope.errorFaculties = api.errorHandler(response);
        })
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

    $scope.loadSpecialities = loadSpecialities;

    function loadSpecialities(subdivisionId) {
      var url = 'StudyOrganization/ProfTrains';
      var method = 'GET';

      api.execute(method, url)
        .then(function(response) {
          var specialitiesWithOkr = filterSpecialities(response, subdivisionId);
          $scope.allSpecialities = specialitiesWithOkr;
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr).sort(sortNames);
        })
        .catch(function(response) {
          $scope.errorSpecialities = api.errorHandler(response);
        })
    }

    $scope.loadSpecializations = loadSpecializations;

    function loadSpecializations(specialityId) {
      var url = '';
      var method = 'GET';

      if (!specialityId) {
        url = 'StudyOrganization/Specialization';
      } else {
        url = 'StudyOrganization/Specialization?specialityId=' + specialityId;
      }

      api.execute(method, url)
        .then(function(response) {
          $scope.specializationsModal = response.sort(sortNames);
          $scope.specializations = response.sort(sortNames);
        })
        .catch(function(response) {
          $scope.errorSpecializations = api.errorHandler(response);
        })
    }

    function loadStudyYears() {
      var url = 'studyYears';
      var method = 'GET';

      api.execute(method, url)
        .then(function(response) {
          $scope.studyYearsModal = response.sort(sortNames);
          $scope.studyYears = response.sort(sortNames);
        })
        .catch(function(response) {
          $scope.errorStudyYears = api.errorHandler(response);
        })
    }

    // спеціальність on-select="loadOkr(specialities.selected.id);
    // loadSpecializations(specialities.selected.id);"

    $scope.loadOkr = function(specialityId) {
      var allSpecialities = $scope.allSpecialities;
      var result = [];
      var filteredSpecialities = allSpecialities.filter(function (element) {
        return element.id === specialityId
      });

      for (var i = 0; i < filteredSpecialities.length; i++) {
        var specialitiesElement = filteredSpecialities[i];
        var okrSpecialitiesElement = specialitiesElement.okr;

        result.push(okrSpecialitiesElement);
      }
      $scope.allOkr = result.sort(sortNames)
    };

    function loadOkr() {
      var url = 'StudyOrganization/okr';
      var method = 'GET';

      api.execute(method, url)
        .then(function (response) {
          $scope.allOkrsModal = response.sort(sortNames);
          $scope.allOkr = response.sort(sortNames);
        })
        .catch(function(response) {
          $scope.errorOkr = api.errorHandler(response);
        })
    }

    function loadStudyForms() {
      var url = 'studyForms';
      var method = 'GET';

      api.execute(method, url)
        .then(function(response) {
          $scope.studyFormsModal = response.sort(sortNames);
          $scope.studyForms = response.sort(sortNames);
        })
        .catch(function(response) {
          $scope.errorStudyForms = api.errorHandler(response);
        })
    }

    function checkForUndefined(value) {
      return typeof value == 'undefined';
    }

    $scope.reloadNp = loadNp;

    function loadNp(specializationId, studyingYearId, studyFormId) {
      var url;
      var method = 'GET';

      if (
        !checkForUndefined(specializationId) ||
        !checkForUndefined(studyingYearId) ||
        !checkForUndefined(studyFormId)
      ) {
        var parameters = [];
        url = 'Np?';

        if (
          !checkForUndefined(specializationId)
        ) {
          var specializationParameter = {
            name: 'specializationId', value: specializationId
          };

          parameters.push(specializationParameter);
        }

        if (
          !checkForUndefined(studyingYearId)
        ) {
          var studyingYearParameter = {
            name: 'studyingYearId', value: studyingYearId
          };

          parameters.push(studyingYearParameter);
        }

        if (
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

      api.execute(method, url)
        .then(function(response) {
          var responseLen = response.length;

          $scope.nps = response;
          $scope.hideTable = responseLen === 0;
        })
        .catch(function(response) {
            $scope.errorNp = api.errorHandler(response);
          $scope.errorNp += 'Не вдалося завантажити навчальні плани. Спробуйте будь ласка пізніше.';
        })
    }

    function toggleClass(el, className) {
      if (el.classList) {
        el.classList.toggle(className);
      } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0)
          classes.splice(existingIndex, 1);
        else
          classes.push(className);

        el.className = classes.join(' ');
      }
    }

    function createIconElement() {
      var icon = document.createElement('span');

      icon.className = 'glyphicon glyphicon-filter';
      icon.setAttribute('aria-hidden', 'true');
      return icon;
    }

    function changeButtonText(button) {
      var show = 'Показати фільтри';
      var hide = 'Сховати фільтри';
      var filterIcon = createIconElement();

      button.innerText = button.innerText === hide ? show : hide;
      button.appendChild(filterIcon);
    }

    function toggleSidebar() {
      var toggleButton = document.getElementById('filter-toggle');
      var npContent = document.getElementById('np-content');

      function toggle(e) {
        e.preventDefault();
        toggleClass(npContent, 'col-md-8');
        changeButtonText(toggleButton);
      }

      toggleButton.addEventListener('click', toggle);
    }

    $scope.showStatus = showStatus;

    function showStatus(value) {
      return value === true ? 'Aктуально' : 'Не актуально' ;
    }

    $scope.createPayloadForSave = createPayloadForSave;

    function createPayloadForSave(
      specializationId, studyingYearId,
      studyFormId, studyTermYear, studyTermMonth, name,
      okrId, actuality, protocolNumber, protocolDate
    ) {
      var result = {};

      // required properties
      result.specializationId = specializationId;
      result.studyingYearId = studyingYearId;
      result.studyFormId = studyFormId;
      result.studyTermYear = studyTermYear;
      result.studyTermMonth = studyTermMonth;
      result.name = name;

      // additional properties
      result.okrId = !okrId ? null : okrId;
      result.actuality = !actuality ? false : actuality;
      result.protocolNumber = !protocolNumber ? null : okrId;
      // temp solution before backend fix problem with null protocolDate property
      if (protocolDate) {
        result.protocolDate = !protocolDate ? null : okrId;
      }

      return result;
    }

    $scope.addNewNp = addNewNp;

    function addNewNp(payload) {
      var url = 'Np';
      var method = 'POST';

      console.log('payload');
      console.log(payload);

      api.execute(method, url, payload)
        .then(function(response) {
          $scope.addNewNpResults = response;
        })
        .catch(function(response) {
            var modelStateResults = response.data;
            var modelStateResultsLen = modelStateResults.length;

            for (var i = 0; i < modelStateResultsLen; i++) {
              var modelStateResult = modelStateResults[i];
              var addNewNpResults = "";

              addNewNpResults += modelStateResult[0];
            }
          console.log(modelStateResults);
        })
    }

    $scope.editNp = editNp;

    function editNp(npId, data) {
      console.log('data');
      console.log(data);

      var url = 'Np/' + npId;
      var method = 'PUT';

      var payload = {};

      // required properties
      payload.actuality = data.actuality;
      payload.specializationId = data.specialization.id;
      payload.studyingYearId = data.studyingYear.id;
      payload.studyFormId = data.studyForm.id;
      payload.studyTermYear = data.studyTermYear;
      payload.studyTermMonth = data.studyTermMonth;
      payload.name = data.name;
      payload.okrId = data.okr.id;

      console.log('payload');
      console.log(payload);

      api.execute(method, url, payload)
        .then(function(response) {
          console.log('response');
          console.log(response);
        });
    }

    $scope.checkName = checkEmptyProperties;
    $scope.checkStudyYear = checkEmptyProperties;
    $scope.checkStudyForm = checkEmptyProperties;
    $scope.checkOkr = checkEmptyProperties;
    $scope.checkSpecialization = checkEmptyProperties;

    function checkEmptyProperties(data) {
      if (data === null || data === '') {
        return 'Заповніть це поле!';
      }
    }

    $scope.deleteNp = deleteNp;

    function deleteNp(npId) {
      var url = 'Np/' + npId;
      var method = 'DELETE';

      api.execute(method, url)
        .then(function(response) {
          console.log(response);
        });
    }

    //TODO implement after API 'StudyOrganization/methodist/specializations' refactoring
    function loadSpecializationsForMethodist() {
      var url = 'StudyOrganization/methodist/specializations';
      var method = 'GET';

      api.execute(method, url)
        .then(function(response) {
          $scope.specializationsModal = response.sort(sortNames);
          console.log(response);
        });
    }

    toggleSidebar();
    loadFaculties();
    loadStudyYears();
    loadStudyForms();
    // loadSpecializations();
    loadNp();
    loadOkr();
  }
})();
