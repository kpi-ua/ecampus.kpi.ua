'use strict';

angular
  .module('ecampusApp')
  .directive('rnpInput', rnpInput);

rnpInput.$inject = ['api'];

function rnpInput(api) {
  return {
    link: link,
    templateUrl: 'views/directives/rnpInput.html',
    restrict: 'EA'
  };

  function link($scope) {

    var useId = api.getCurrentUser().id;
    var chainResponsibility = [];
    var completeHandler = requestComplete;
    var failureHandler = errorHandlerMy;
    var settersOption = getSettersOptions();
    $scope.onChange = onChange;

    activate();

    function activate() {
      chainResponsibility = [
        'StudyYear',
        'Department',
        'Okr',
        'Specialization',
        'StudyForm',
        'XmlCodes'
      ];

      var studyYearsOptions = settersOption['StudyYear'];
      var studyYearsSetter = new SetSelectOptionForRnp(
        studyYearsOptions.selectName, studyYearsOptions.optionDestination,
        studyYearsOptions.nextChainFunction
      );
      var path = 'studyYears';
      studyYearsSetter.set(path, true);
    }

    function onStudyYearsSet(isInit, chainObject, userId) {
      userId = userId || useId;
      // var initStudyYearIndex = 0;
      var initStudyYearIndex = 5;
      var path = '';

      var departmentOptions = settersOption['Department'];
      var departmentSetter = new SetSelectOptionForRnp(
        departmentOptions.selectName,
        departmentOptions.optionDestination,
        departmentOptions.nextChainFunction
      );

      var selectName = 'StudyYear';
      if (
        $scope.options.StudyYears[initStudyYearIndex] !== undefined &&
        isInit
      ) {
        var StudyYear = $scope.options.StudyYears[initStudyYearIndex];
        $scope.selectData.studyYearId = StudyYear.id;
        $scope.model.studyYearName = StudyYear.name;

        path = (
          'Rnp/' + userId +
          '/Subdivision/' + $scope.selectData.studyYearId
        );
        departmentSetter.set(path, isInit);

      } else if (chainObject !== undefined) {
        if (chainObject.selectName === selectName) {
          $scope.selectData.studyYearId = chainObject.chosenObj.id;

          path = (
            'Rnp/' + userId +
            '/Subdivision/' + $scope.selectData.studyYearId
          );
          departmentSetter.set(path, true);

        } else {
          onDepartmentSet(false, chainObject);
        }
      }
    }

    function onDepartmentSet(isInit, chainObject, userId) {
      userId = userId || useId;
      var initDepartmentsIndex = 0;
      var selectName = 'Department';
      var path = '';
      var okrOptions = settersOption['Okr'];
      var okrSetter = new SetSelectOptionForRnp(
        okrOptions.selectName,
        okrOptions.optionDestination,
        okrOptions.nextChainFunction
      );
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

        path = (
          'Rnp/' + useId + '/Okr/' + $scope.selectData.studyYearId +
          '/' + $scope.selectData.departmentId +
          '/' + $scope.selectData.departmentMark
        );
        okrSetter.set(path, isInit);
      } else if (chainObject !== undefined) {
        if (chainObject.selectName === selectName) {
          $scope.selectData.departmentId = chainObject.chosenObj.id;
          $scope.selectData.departmentMark = chainObject.chosenObj.mark;

          path = (
            'Rnp/' + useId + '/Okr/' + $scope.selectData.studyYearId +
            '/' + $scope.selectData.departmentId +
            '/' + $scope.selectData.departmentMark
          );
          okrSetter.set(path, true);
        } else {
          onOkrSet(false, chainObject);
        }
      }
    }

    function onOkrSet(isInit, chainObject, userId) {
      userId = userId || useId;
      var initOkrIndex = 0;
      var selectName = 'Okr';
      var path = '';
      var specializationOptions = settersOption['Specialization'];
      var specializationSetter = new SetSelectOptionForRnp(
        specializationOptions.selectName,
        specializationOptions.optionDestination,
        specializationOptions.nextChainFunction
      );
      if ($scope.options.Okrs[initOkrIndex] !== undefined && isInit) {
        var curOkr = $scope.options.Okrs[initOkrIndex];
        $scope.selectData.okrId = curOkr.id;
        $scope.model.okrName = curOkr.name;
        path = 'Rnp/' + useId + '/Specialization/' +
          $scope.selectData.studyYearId + '/' +
          $scope.selectData.departmentId + '/' +
          $scope.selectData.departmentMark + '/' +
          $scope.selectData.okrId;
        specializationSetter.set(path, isInit);
      } else if (chainObject !== undefined) {
        if (chainObject.selectName === selectName) {
          $scope.selectData.okrId = chainObject.chosenObj.id;
          path = 'Rnp/' + useId + '/Specialization/' +
            $scope.selectData.studyYearId + '/' +
            $scope.selectData.departmentId + '/' +
            $scope.selectData.departmentMark + '/' +
            $scope.selectData.okrId;
          specializationSetter.set(path, true);
        } else {
          onSpecializationsSet(false, chainObject);
        }
      }
    }

    function onSpecializationsSet(isInit, chainObject, userId) {
      userId = userId || useId;
      var initSpecializationsIndex = 0;
      var selectName = 'Specialization';
      var path = '';
      var studyFormOptions = settersOption['StudyForm'];
      var studyFormSetter = new SetSelectOptionForRnp(
        studyFormOptions.selectName,
        studyFormOptions.optionDestination,
        studyFormOptions.nextChainFunction
      );
      var curSpecialization = (
        $scope.options.Specializations[initSpecializationsIndex]
      );
      if (curSpecialization !== undefined && isInit) {
        $scope.selectData.specializationId = curSpecialization.id;
        $scope.model.specializationCodeName = (
          curSpecialization.code + '  ' + curSpecialization.name
        );
        path = (
          'Rnp/' + useId + '/StudyForm/' + $scope.selectData.studyYearId +
          '/' + $scope.selectData.departmentId +
          '/' + $scope.selectData.departmentMark +
          '/' + $scope.selectData.specializationId
        );
        studyFormSetter.set(path, isInit);
      } else if (chainObject !== undefined) {
        if (chainObject.selectName === selectName) {
          $scope.selectData.specializationId = chainObject.chosenObj.id;
          path = (
            'Rnp/' + useId + '/StudyForm/' +
            $scope.selectData.studyYearId + '/' +
            $scope.selectData.departmentId + '/' +
            $scope.selectData.departmentMark + '/' +
            $scope.selectData.specializationId
          );
          studyFormSetter.set(path, true);
        } else {
          onStudyFormsSet(false, chainObject);
        }
      }
    }

    function onStudyFormsSet(isInit, chainObject, userId) {
      userId = userId || useId;
      var initStudyFormsIndex = 0;
      var selectName = 'StudyForm';
      var path = '';
      var xmlCodesOptions = settersOption['XmlCodes'];
      var xmlCodesSetter = new SetSelectOptionForRnp(
        xmlCodesOptions.selectName,
        xmlCodesOptions.optionDestination,
        xmlCodesOptions.nextChainFunction
      );
      if (
        $scope.options.StudyForms[initStudyFormsIndex] !== undefined &&
        isInit
      ) {
        var curStudyForm = $scope.options.StudyForms[initStudyFormsIndex];
        $scope.selectData.studyFormId = curStudyForm.id;
        $scope.model.studyFormName = curStudyForm.name;
        path = (
          'Rnp/' + useId + '/XMLCode/' +
          $scope.selectData.studyYearId + '/' +
          $scope.selectData.departmentId + '/' +
          $scope.selectData.departmentMark + '/' +
          $scope.selectData.specializationId + '/' +
          $scope.selectData.studyFormId
        );
        xmlCodesSetter.set(path, isInit);
      } else if (chainObject !== undefined) {
        if (chainObject.selectName === selectName) {
          $scope.selectData.studyFormId = chainObject.chosenObj.id;
          path = (
            'Rnp/' + useId + '/XMLCode/' +
            $scope.selectData.studyYearId + '/' +
            $scope.selectData.departmentId + '/' +
            $scope.selectData.departmentMark + '/' +
            $scope.selectData.specializationId + '/' +
            $scope.selectData.studyFormId
          );
          xmlCodesSetter.set(path, true);
        } else {
          onXmlCodesSet(false, chainObject);
        }
      }
    }

    function onXmlCodesSet(isInit, chainObject) {
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
      items.forEach(function(curItem) {
        if (curItem.name === name) {
          item = curItem;
        }
      });
      return item;
    }

    function SetSelectOptionForRnp(
      selectName,
      optionDestination,
      nextChainFunction,
      completeHandler,
      failureHandler
    ) {
      completeHandler = completeHandler || requestComplete;
      failureHandler = failureHandler || errorHandlerMy;
      var self = this;
      this.selectName = selectName;
      this.optionDestination = optionDestination;
      this.nextChainFunction = nextChainFunction;
      this.completeHandler = completeHandler;
      this.failureHandler = failureHandler;
      this.set = function(requestPath, isInit) {
        api.execute('GET', requestPath)
          .then(function(response) {
            self.completeHandler(
              response,
              isInit,
              self.selectName,
              self.nextChainFunction,
              self.optionDestination
            );
          })
          .catch(self.failureHandler);
      };
    }

    function requestComplete(
      response,
      isInit,
      selectName,
      nextChainFunction,
      optionDestination
    ) {
      if (!response || response === '' || response.length === 0) {
        $scope.errorLabelText = 'На жаль, дані відсутні.';
        resetSelectDataOptionsAndModel(selectName);
      } else {
        $scope.options[optionDestination] = response;
        nextChainFunction(isInit);
      }
    }

    function resetSelectDataOptionsAndModel(selectName) {
      $scope.StudyGroups = null;
      $scope.RnpRows = null;
      var idx = chainResponsibility.indexOf(selectName);
      // This switch have cascade cleaning,
      // So we must clean ALL fields below the chosen field/
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

    function onChange(selectedItem, selectName, items) {
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
    }

    function errorHandlerMy(response, status, headers) {
      $scope.errorLabelText = api.errorHandler(response);
    }

    function getSettersOptions() {
      return {
        StudyYear: {
          selectName: 'StudyYear',
          optionDestination: 'StudyYears',
          nextChainFunction: onStudyYearsSet,
        },
        Department: {
          selectName: 'Department',
          optionDestination: 'Departments',
          nextChainFunction: onDepartmentSet,
        },
        Okr: {
          selectName: 'Okr',
          optionDestination: 'Okrs',
          nextChainFunction: onOkrSet,
        },
        Specialization: {
          selectName: 'Specialization',
          optionDestination: 'Specializations',
          nextChainFunction: onSpecializationsSet,
        },
        StudyForm: {
          selectName: 'StudyForm',
          optionDestination: 'StudyForms',
          nextChainFunction: onStudyFormsSet,
        },
        XmlCodes: {
          selectName: 'XmlCodes',
          optionDestination: 'XmlCodes',
          nextChainFunction: onXmlCodesSet,
        }
      };
    }

  }
}
