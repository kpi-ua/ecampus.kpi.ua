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

	RnpCreateCtrl.$inject = ['$scope', 'api'];

	function RnpCreateCtrl($scope, api) {
		var ifWantToAddRowData = false;
		$scope.hideTable = false;
		$scope.filterSpecialization = true; //!change name!!!
		
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
      var facultiesId = 10437;      
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

    $scope.loadSpecialities = function(subdivisionId) {    	
      var url = ('StudyOrganization/ProfTrains/' + subdivisionId);

      api.execute('GET', url)
        .then(function(response) {        
          var specialitiesWithOkr = filterSpecialities(response, subdivisionId);
          $scope.allSpecialities = specialitiesWithOkr;
          
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr, 'specialization').sort(sortNames);          
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
      var url = ('StudyOrganization/Specialization?specialityId=' + specialityId);

      api.execute('GET', url)
        .then(function(response) {
          $scope.specializationsForModal = response;
          var specializationsResponse = response;
 
    			$scope.specializations = filterSpecializations(specializationsResponse,$scope.specialities.selected.profTrainTotal.subdivisionId);    			
        });      
    }

    $scope.reloadDisciplines = loadDisciplines;

    function loadDisciplines(idSubdiv, idSpec) {
      var url = '';

      if (idSpec === 'not set') {
      	url += ('CreditModule/Specializations/' + idSubdiv);	
      } else {
      	url += ('StudyOrganization/Discipline/rtProfTrainTotalSubdiv/' + idSpec);
      }

      api.execute('GET', url)
        .then(function(response) {          
          $scope.disciplines = response;                    
        });      
    }

    $scope.loadCM = loadCM;

    function loadCM(rtdisciplineId) {    	
    	if (!rtdisciplineId) {
				$scope.creditModules = [];
				$scope.disciplines.selected = null;
				return;
    	}
    	var url = ('CreditModule/' + rtdisciplineId);

    	api.execute('GET', url)
        .then(function(response) {
          var responseLen = response.length;

          $scope.creditModules = response;     
        });
       
    }

    function checkParameter(value) {
      return value === 'not set';
    }

    function checkForUndefined(value) {
      return typeof value == 'undefined';
    }

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

	$scope.onChange = function(){		
		var id = $scope.selectedDiscipline.idDisc;
		var path = 'StudyOrganizationDiscipline/CreditModule/' + id;

		api.execute('GET', path)
		.then(function(response) {
			requestComplete(response);
		});

		function requestComplete(response) {
      if (!response || response === '' || response.length === 0) {
        $scope.errorLabelText = 'На жаль, дані відсутні.';        
      } else {
        $scope.resultIhorsApiTmp = response;        
      }
    }
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

	function loadAllSubdivisions() {
		var url = 'Subdivision';
		var method = 'GET';
		$scope.allSubdivisions = [];

		api.execute(method, url)
      .then(function(response) {        
        var allSubdiv = response;
        $scope.allSubdivisions = filterSubdivisionSelect(allSubdiv);

      }, function(response) {
        $scope.allSubdivisions = [];
      });
	};

	$scope.addCM = function() {
		if (!ifWantToAddRowData) {
			$scope.insertedCM = {
				nameFull: $scope.disciplines.selected.discipline8.name,
				name:'',
				nameShort:'',
				whomRead: {
					name: $scope.subdivisions.selected.name, 
					id: $scope.subdivisions.selected.id
				}				
			};

			$scope.creditModules.unshift($scope.insertedCM);			
			ifWantToAddRowData = true;
		}
	};

	$scope.saveCM = function(editableObj, objCM) {
		var nameFull, name, nameShort, method, whomRead;
		var url = 'CreditModule/';

		if (objCM.name !== '') {			
			method = 'PUT';
			url += $scope.disciplines.selected.discipline8.id;
		} else {			
			method = 'POST';
		}

		if (editableObj.name) {
			name = editableObj.name;
		} else {
			name = objCM.name;
		}

		if (editableObj.whomRead.id) {
			whomRead = editableObj.whomRead.id;
		} else {
			whomRead = objCM.id;
		}

		if (editableObj.nameShort) {
			nameShort = editableObj.nameShort;
		} else {
			nameShort = objCM.nameShort;
		}

		var sendCM = new CreditModuleModel(            
            name, whomRead
          );

		ifWantToAddRowData = false;
		/*api.execute(method, url, sendCM)
			.then(function(response) {										
			}, function(response) {				
				loadCM($scope.disciplines.selected.rtDisciplineId);
			});*/

	};

	$scope.removeCM = function(currentRowCM) {
		/*if (
			confirm('Ви впеврені що хочете видалити поточний кредитний модуль?')
		) {
			var url = (
				'/CreditModule/' +
				currentRowCM.id				
			);
		
			var method = 'DELETE';
			
		}*/
	};

	$scope.cancelCM = function(objCM) {
		if (!objCM.name) {
			$scope.creditModules.shift(objCM);
		}
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

	loadFaculties();		
	loadAllSubdivisions();
}

})();