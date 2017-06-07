(function () {
	'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:RnpCreateCtrl
 * @description
 * # RnpCreateCtrl
 * Controller of the ecampusApp
 */
	angular
  	.module('ecampusApp')
  	.controller('RnpCreateCtrl', RnpCreateCtrl);

	RnpCreateCtrl.$inject = ['$scope', 'api', '$timeout', 'permission', 'uniqueElemsInList'];

	function RnpCreateCtrl($scope, api, $timeout, permission, uniqueElemsInList) {
    $scope.loadSpecialities = loadSpecialities;
    $scope.loadSubdivisionsAccordingToPermission = loadSubdivisionsAccordingToPermission;
    $scope.loadStudyYears = loadStudyYears;
    $scope.loadOkr = loadOkr;
    $scope.loadStudyForms = loadStudyForms;

    var permissionSubdivisions;
    loadSubdivisionsAccordingToPermission();
    $scope.subdivisions = permissionSubdivisions.subdivisions;
    $scope.subdivisions.selected = permissionSubdivisions.subdivisions[0];
    $scope.loadSpecialities($scope.subdivisions.selected.id);

		var ifWantToAddRowData = false;
		$scope.hideTable = false;
		$scope.filterSpecialization = true;

    $scope.courses = [{id: 1},{id: 2},{id: 3},{id: 4},{id: 5},{id: 6},{id: 7},{id: 8}];
		
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
        toggleClass(npContent, 'col-md-7');
        changeButtonText(toggleButton);
      }

      toggleButton.addEventListener('click', toggle);      
    }

  //any other solution (exept the one below) leads to work only after page reload in Chrome
  	$(document).ready(toggleSidebar);

  	function sortNames(a, b) {
  		var name1 = a.name;
  		var name2 = b.name;

  		return name1.localeCompare(name2);
  	}

    function filterSpecialities(allSpecialities, subdivisionId) {
      var actuality = true;

      return allSpecialities.filter(function(element) {
        return (
          element.subdivision.id === subdivisionId
        );
      });
    }

    function uniqueSpecialities(arr, criterion) {
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

    function loadSpecialities(subdivisionId) {    	
      var url;
      if (subdivisionId != undefined) {
        url = ('StudyOrganization/ProfTrains/' + subdivisionId);
      } else {return;}

      api.execute('GET', url)
        .then(function(response) {        
          var specialitiesWithOkr = filterSpecialities(response, subdivisionId);
          $scope.allSpecialities = specialitiesWithOkr;
          $scope.errorSpecialities = '';          
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr, 'specialization').sort(sortNames);          
        })
        .catch(function(response) {
          $scope.errorSpecialities = api.errorHandler(response);
        });      
    };

    function uniqueSpecializations(arr) {    
    	var filteredArr = [];
    	var arrOfNames = [];
    	for (var i=0, l=arr.length; i<l; i++) {    		
    		if (arrOfNames.indexOf(arr[i].specialization) === -1 && 
    		arr[i].specialization !== '' && 
    		arr[i].specialization !== null) {
    			filteredArr.push(arr[i]);
    			arrOfNames.push(arr[i].specialization);
    		}
    	}

    	return filteredArr;
    }

    function filterSpecializations(allSpecializations, subdivId) {
    	return allSpecializations.filter(function(element) {        
        return (
          element.rtProfTrainTotalSubdivisionId === subdivId
        );
      });
    }    

    $scope.loadSpecializations = loadSpecializations;

    function loadSpecializations(specialityId) {
      var url = 'StudyOrganization/Specialization';

      if (!!specialityId){
        url += '?specialityId=' + specialityId;
      }

      api.execute('GET', url)
        .then(function(response) {
          $scope.specializationsForModal = response;
          var specializationsResponse = response;
          $scope.errorSpecializations = '';
    			$scope.specializations = filterSpecializations(specializationsResponse,$scope.specialities.selected.profTrainTotal.subdivisionId);
        })
        .catch(function(response) {
          $scope.errorSpecializations = api.errorHandler(response);
        });      
    }

    function loadStudyYears() {
      var url = 'studyYears';

      api.execute('GET', url)
        .then(function(response) {
          $scope.studyYears = response.sort(sortNames);
          $scope.errorStudyYears = '';    
          $scope.studyYears.selected = uniqueElemsInList.setCurrentYear(
            $scope.studyYears
          );    
        })
        .catch(function(response) {
          $scope.errorStudyYears = api.errorHandler(response);
        })
    }    

    function loadOkr() {
      var url = 'StudyOrganization/okr';

      api.execute('GET', url)
        .then(function (response) {
          $scope.allOkr = response.sort(sortNames);
          $scope.errorOkr = '';
        })
        .catch(function(response) {
          $scope.errorOkr = api.errorHandler(response);
        })
    }

    function loadStudyForms() {
      var url = 'studyForms';

      api.execute('GET', url)
        .then(function(response) {
          $scope.studyFormsForModal = response.sort(sortNames);
          $scope.studyForms = response.sort(sortNames);
          $scope.errorStudyForms = '';
        })
        .catch(function(response) {
          $scope.errorStudyForms = api.errorHandler(response);
        })
    }

    function loadSubdivisionsAccordingToPermission() {
      permissionSubdivisions = permission.getSubsystemPermission(3);
    }
    
    function checkParameter(value) {
      return value === 'not set';
    }

    function checkForUndefined(value) {
      return typeof value == 'undefined';
    }

    $scope.reloadRnp = loadRnp;

    function loadRnp(specializationId, studyingYearId, studyFormId, courseId) {
      var url = 'RNP';
      var urlNp = 'Np?';      

      if (
        !checkForUndefined(specializationId) ||
        !checkForUndefined(studyingYearId) ||
        !checkForUndefined(studyFormId) ||
        !checkForUndefined(courseId)
      ) {
        var parameters = [];
        url += '/NP?';

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

        if (
          !checkParameter(courseId) &&
          !checkForUndefined(courseId)
        ) {
          var courseParameter = {
            name: 'Course', value: courseId
          };

          parameters.push(courseParameter);
        }

        var len = parameters.length;

        for(var i = 0; i < len; i++) {
          var currentParameter = parameters[i];

          url += ('&' + currentParameter.name + '=' + (+currentParameter.value));
          if (currentParameter.name != 'Course') {
            urlNp += ('&' + currentParameter.name + '=' + (+currentParameter.value));
          }
        }
      }          

      api.execute('GET', url)
        .then(function(response) {
          var responseLen = response.length;
          $scope.rnps = response;          
        })
        .catch(function(response) {
            $scope.errorRnp = api.errorHandler(response);
        })
      
      $timeout(function() {
      api.execute('GET', urlNp)
        .then(function(response) {
          var responseLen = response.length;
          $scope.nps = response;
        })
        .catch(function(response) {
            $scope.errorNp = api.errorHandler(response);
        })
        }, 2000);
    }

    $scope.showStatus = showStatus;

    function showStatus(value) {
      return value === true ? 'Aктуально' : 'Не актуально' ;
    }

    $scope.addRnp = function() {
      if (!ifWantToAddRowData) {
        $scope.insertedRnp = {
          name: '',
          actuality: '',
          protocolNumber: '',           
          speciality: '',
          yearRnp: '',
          okr: '',
          studyForm: '',
          course: ''          
        };

        $scope.rnps.unshift($scope.insertedRnp);
        ifWantToAddRowData = true;
      }
    }

    $scope.saveRnp = function(editableObj, objRnp) {
      var method = '';
      var url = 'RNP/NP/';
      if (objRnp.name) {
        method = 'PUT';
        url += objRnp.id;
      } else {
        method = 'POST';
      }

      var Id;
      if (editableObj.np_name) {
        Id = editableObj.np_name.id;
      } else {
        Id = objRnp.np_name.id;
      }

      var StudyYearId;
      if (editableObj.yearRnp) {
        StudyYearId = editableObj.yearRnp.id;
      } else {
        StudyYearId = objRnp.yearRnp.id;
      }

      var Name;
      if (editableObj.name) {
        Name = editableObj.name;
      } else {
        Name = objRnp.name;
      }

      var Course = '';
      var ProtocolNumber = '';

      var sendRnp = new RnpModel(
            Name, Id, StudyYearId,
            Course, ProtocolNumber
          );

        api.execute(method, url, sendRnp)
        .then(function(response) {                    
          $scope.errorLabelText = 'Дані було успішно збережено';                 
        }, function(response) {         
          $scope.errorLabelText = api.errorHandler(response);
        });
    }

    $scope.removeRnp = function(currentRowRnp) {
      if (
        confirm('Ви впеврені що хочете видалити поточний РНП?')
        ) {
        var url = (
          'RNP/NP/' +
          currentRowRnp.id
          );

      var method = 'DELETE';

      api.execute(method, url)
      .then(function(response) {    
        //по специализации        
      }, function(response) {
        $scope.errorLabelText = api.errorHandler(response);
        });
      }
    };

    function RnpModel(
      Name, 
      Id, 
      StudyYearId,
      Course, 
      ProtocolNumber
    ) {
      this.Name = Name;
      this.Id = Id;
      this.StudyYearId = StudyYearId;
      this.Course = Course;
      this.ProtocolNumber = ProtocolNumber;
    };


	$scope.editRnpTab = 'firstTab';

  $scope.setCathedras = function() {
  	var path = 'Rnp/Headers';  
        
  }

  $scope.setCathedras();
	
	$scope.SwitchSections = function(event) {
  	$scope.editRnpTab = event.target.value;
	}

	$('#menu-toggle').click(function(e) {
		e.preventDefault();
		$('.wrapperMenuAndResult').toggleClass('activeMenu');
	});

	$scope.showEditableNameCM = function(editableObj,objCM) {		
		return (objCM.nameCM === '') ? true : false;		
	}		

	function filterSubdivisionSelect(arr) {
		var result=[];

		for (var i=0, l=arr.length; i<l; i++) {
			if (arr[i].name.indexOf('Кафедра') !== -1) {
				result.push(arr[i]);
			}
		}	

		return result;
	}

	$scope.checkCMForm = function(data) {
    if (data === null || data === '' || data === undefined) {
      return 'Заповніть це поле!';
    }
  };

	function CreditModuleModel(
    name,
    whomRead    
  ) {
    this.name = name;
    this.whomRead = whomRead;    
  }

	$scope.reloadData = function() {
    ifWantToAddRowData = false;
    location.reload();    
  };

  $scope.applyFilterRnp = function(objRnp){    
    if ($scope.allOkr.selected) {
      if (objRnp.okr !== $scope.allOkr.selected.name) {
        return false;
      }      
    }

    if ($scope.studyForms.selected) {
      if (objRnp.studyForm !== $scope.studyForms.selected.name) {
        return false;
      }
    }

    if ($scope.courses.selected) {
      if (objRnp.course !== $scope.courses.selected.name) {
        return false;
      }
    }
    return true;
  }
  
  loadStudyYears();
  loadStudyForms();
  loadOkr();  
  
}

})();