'use strict';

angular
  .module('ecampusApp')
  .directive('rnpInput', rnpInput);

rnpInput.$inject = ['$scope'];

function rnpInput(api) {
  return {
    link: function ($scope) {
      var useId = api.getCurrentUser().id;

      var chainResponsibility = [
        'StudyYear', 'Department', 'Okr',
        'Specialization', 'StudyForm', 'XmlCodes'
      ];
      onInit();

      function onInit() {
        setStudyYears(true);
      }

      function setStudyYears(isInit) {
        var path = 'studyYears';

        api.execute('GET', path).then(function (response) {
          var selectName = 'StudyYear';
          var StudyYearsWatcher = $scope.$watch(
            $scope.options.StudyYears,
            onStudyYearsSet()
          );
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, дані відсутні.';
            resetSelectDataOptionsAndModel(selectName);
          } else {
            $scope.options.StudyYears = response;
            onStudyYearsSet(isInit);
          }
        });
      }

      function onStudyYearsSet(isInit, chainObject) {
        // var initStudyYearIndex = 0;
        var initStudyYearIndex = 5;
        var selectName = 'StudyYear';
        if (
          $scope.options.StudyYears[initStudyYearIndex] !== undefined &&
          isInit
        ) {
          var StudyYear = $scope.options.StudyYears[initStudyYearIndex];
          $scope.selectData.studyYearId = StudyYear.id;
          $scope.model.studyYearName = StudyYear.name;
          setDepartments(useId, $scope.selectData.studyYearId, isInit);
        } else if (chainObject !== undefined) {
          if (chainObject.selectName === selectName) {
            $scope.selectData.studyYearId = chainObject.chosenObj.id;
            setDepartments(useId, $scope.selectData.studyYearId, true);
          } else {
            onDepartmentSet(false, chainObject);
          }
        }
      }

      function setDepartments(userId, studyYear, isInit) {
        var selectName = 'Department';
        var path = 'Rnp/' + userId + '/Subdivision/' + studyYear;
        api.execute('GET', path).then(function (response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, дані відсутні';
            resetSelectDataOptionsAndModel(selectName);
          } else {
            $scope.options.Departments = response;
            onDepartmentSet(isInit);
          }
        });
      }

      function onDepartmentSet(isInit, chainObject) {
        var initDepartmentsIndex = 0;
        var selectName = 'Department';
        if (
          $scope.options.Departments[initDepartmentsIndex] !== undefined &&
          isInit
        ) {
          var curDepartment = (
            $scope.options.Departments[initDepartmentsIndex]
          );
          $scope.selectData.departmentId = curDepartment.id;
          $scope.selectData.departmentMark = curDepartment.mark;
          $scope.model.departmentItem = curDepartment;
          setOkr(
            useId, $scope.selectData.studyYearId,
            $scope.selectData.departmentId,
            $scope.selectData.departmentMark, isInit
          );
        } else if (chainObject !== undefined) {
          if (chainObject.selectName === selectName) {
            $scope.selectData.departmentId = chainObject.chosenObj.id;
            $scope.selectData.departmentMark = chainObject.chosenObj.mark;
            setOkr(
              useId, $scope.selectData.studyYearId,
              $scope.selectData.departmentId,
              $scope.selectData.departmentMark, true
            );
          } else {
            onOkrSet(false, chainObject);
          }
        }
      }

      function setOkr(useId,
                      studyYearId,
                      chosenSubdivisionId,
                      chosenSubdivisionMark,
                      isInit) {
        var selectName = 'Okr';
        var path = (
          'Rnp/' + useId + '/Okr/' + studyYearId + '/' +
          chosenSubdivisionId + '/' + chosenSubdivisionMark
        );
        api.execute('GET', path).then(function (response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, дані відсутні';
            resetSelectDataOptionsAndModel(selectName);
          } else {
            $scope.options.Okrs = response;
            onOkrSet(isInit);
          }
        });
      }

      function onOkrSet(isInit, chainObject) {
        var initOkrIndex = 0;
        var selectName = 'Okr';
        if ($scope.options.Okrs[initOkrIndex] !== undefined && isInit) {
          var curOkr = $scope.options.Okrs[initOkrIndex];
          $scope.selectData.okrId = curOkr.id;
          $scope.model.okrName = curOkr.name;
          // console.log($scope.model.okrName);
          setSpecializations(
            useId,
            $scope.selectData.studyYearId,
            $scope.selectData.departmentId,
            $scope.selectData.departmentMark,
            $scope.selectData.okrId,
            isInit
          );
        } else if (chainObject !== undefined) {
          if (chainObject.selectName === selectName) {
            $scope.selectData.okrId = chainObject.chosenObj.id;
            setSpecializations(
              useId,
              $scope.selectData.studyYearId,
              $scope.selectData.departmentId,
              $scope.selectData.departmentMark,
              $scope.selectData.okrId,
              true
            );
          } else {
            onSpecializationsSet(false, chainObject);
          }
        }
      }

      function setSpecializations(useId,
                                  studyYearId,
                                  chosenSubdivisionId,
                                  chosenSubdivisionMark,
                                  okrId,
                                  isInit) {
        var selectName = 'Specialization';
        var path = (
          'Rnp/' + useId + '/Specialization/' + studyYearId + '/' +
          chosenSubdivisionId + '/' + chosenSubdivisionMark + '/' + okrId
        );
        api.execute('GET', path).then(function (response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, дані відсутні';
            resetSelectDataOptionsAndModel(selectName);
          } else {
            $scope.options.Specializations = response;
            onSpecializationsSet(isInit);
          }
        });
      }

      function onSpecializationsSet(isInit, chainObject) {
        var initSpecializationsIndex = 0;
        var selectName = 'Specialization';
        var curSpecialization = (
          $scope.options.Specializations[initSpecializationsIndex]
        );
        if (curSpecialization !== undefined && isInit) {
          $scope.selectData.specializationId = curSpecialization.id;
          $scope.model.specializationCodeName = (
            curSpecialization.code + '  ' + curSpecialization.name
          );
          setStudyForms(
            useId,
            $scope.selectData.studyYearId,
            $scope.selectData.departmentId,
            $scope.selectData.departmentMark,
            $scope.selectData.specializationId,
            isInit
          );
        } else if (chainObject !== undefined) {
          if (chainObject.selectName === selectName) {
            $scope.selectData.specializationId = chainObject.chosenObj.id;
            setStudyForms(
              useId,
              $scope.selectData.studyYearId,
              $scope.selectData.departmentId,
              $scope.selectData.departmentMark,
              $scope.selectData.specializationId,
              true
            );
          } else {
            onStudyFormsSet(false, chainObject);
          }
        }
      }

      function setStudyForms(useId,
                             studyYearId,
                             chosenSubdivisionId,
                             chosenSubdivisionMark,
                             specializationId,
                             isInit) {
        var selectName = 'StudyForm';
        var path = (
          'Rnp/' + useId + '/StudyForm/' + studyYearId + '/' +
          chosenSubdivisionId + '/' + chosenSubdivisionMark + '/' +
          specializationId
        );
        api.execute('GET', path).then(function (response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, дані відсутні';
            resetSelectDataOptionsAndModel(selectName);
          } else {
            $scope.options.StudyForms = response;
            onStudyFormsSet(isInit);
          }
        });
      }

      function onStudyFormsSet(isInit, chainObject) {
        var initStudyFormsIndex = 0;
        var selectName = 'StudyForm';
        if (
          $scope.options.StudyForms[initStudyFormsIndex] !== undefined &&
          isInit
        ) {
          var curStudyForm = $scope.options.StudyForms[initStudyFormsIndex];
          $scope.selectData.studyFormId = curStudyForm.id;
          $scope.model.studyFormName = curStudyForm.name;

          setXmlCodes(
            useId,
            $scope.selectData.studyYearId,
            $scope.selectData.departmentId,
            $scope.selectData.departmentMark,
            $scope.selectData.specializationId,
            $scope.selectData.studyFormId,
            isInit
          );
        } else if (chainObject !== undefined) {
          if (chainObject.selectName === selectName) {
            $scope.selectData.studyFormId = chainObject.chosenObj.id;
            setXmlCodes(
              useId,
              $scope.selectData.studyYearId,
              $scope.selectData.departmentId,
              $scope.selectData.departmentMark,
              $scope.selectData.specializationId,
              $scope.selectData.studyFormId,
              true
            );
          } else {
            onXmlCodesSet(false, chainObject);
          }
        }
      }

      function setXmlCodes(useId,
                           studyYearId,
                           chosenSubdivisionId,
                           chosenSubdivisionMark,
                           specializationId,
                           studyFormId,
                           isInit) {
        var selectName = 'XmlCodes';
        var path = (
          'Rnp/' + useId + '/XMLCode/' + studyYearId + '/' +
          chosenSubdivisionId + '/' + chosenSubdivisionMark + '/' +
          specializationId + '/' + studyFormId
        );
        api.execute('GET', path).then(function (response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, дані відсутні';
            resetSelectDataOptionsAndModel(selectName);
          } else {
            $scope.options.XmlCodes = response;
            onXmlCodesSet(isInit);
          }
        });
      }

      function onXmlCodesSet(isInit) {
        var initXmlCodesIndex = 0;
        var selectName = 'XmlCodes';
        if (
          $scope.options.XmlCodes[initXmlCodesIndex] !== undefined &&
          isInit
        ) {
          var curXmlCodes = $scope.options.XmlCodes[initXmlCodesIndex];
          $scope.selectData.xmlCodeId = curXmlCodes.id;
          $scope.model.xmlCode = curXmlCodes.name;
          $scope.$emit('rnpIdSelect', {
            userAccountId: useId,
            chosenDepartmentId: $scope.selectData.departmentId,
            chosenDepartmentMark: $scope.selectData.departmentMark,
            rnpId: curXmlCodes.id
          });
        } else if (chainObject !== undefined) {
          if (chainObject.selectName === selectName) {
            $scope.selectData.xmlCodeId = chainObject.chosenObj.id;
            $scope.$emit('rnpIdSelect', {
              userAccountId: useId,
              chosenDepartmentId: $scope.selectData.departmentId,
              chosenDepartmentMark: $scope.selectData.departmentMark,
              rnpId: curXmlCodes.id
            });
          } else {
            //
          }
        }
      }

      function getItemByName(items, name) {
        var item;
        items.forEach(function (curItem) {
          if (curItem.name === name) {
            item = curItem;
          }
        });
        return item;
      }

      function resetSelectDataOptionsAndModel(selectName) {
        $scope.StudyGroups = null;
        $scope.RnpRows = null;
        var idx = chainResponsibility.indexOf(selectName);
        switch (idx) {
          case 0: {
            $scope.options.StudyYears = [];
            $scope.selectData.studyYear = null;
            $scope.model.studyYearName = null;
            break;
          }
          case 1: {
            $scope.options.Departments = [];
            $scope.selectData.departmentId = null;
            $scope.selectData.departmentMark = null;
            $scope.model.departmentItem = null;
            break;
          }
          case 2: {
            $scope.options.Okrs = [];
            $scope.selectData.okrId = null;
            $scope.model.okrName = null;
            break;
          }
          case 3: {
            $scope.options.Specializations = [];
            $scope.selectData.specializationId = null;
            $scope.model.specializationCodeName = null;
            break;
          }
          case 4: {
            $scope.options.StudyForms = [];
            $scope.selectData.studyFormId = null;
            $scope.model.studyFormName = null;
            break;
          }
          case 5: {
            $scope.options.XmlCodes = [];
            $scope.selectData.xmlCodeId = null;
            $scope.model.xmlCode = null;
            break;
          }
          default: {
            break;
          }
        }
      }

      $scope.onChange = function (selectedItem, selectName, items) {
        $scope.errorLabelText = '';
        var chosenObj;
        if (typeof(selectedItem) !== 'object') {
          chosenObj = getItemByName(items, selectedItem);
        } else {
          chosenObj = selectedItem;
        }
        var chainObject = {
          selectName: selectName,
          chosenObj: chosenObj
        };
        // console.log(chainObject);
        onStudyYearsSet(false, chainObject);
      };

    },
    templateUrl: 'views/directives/rnp-input.html',
    restrict: 'EA'
  };

}
