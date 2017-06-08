(function () {
	'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:CreditModulesCtrl
 * @description
 * # CreditModulesCtrl
 * Controller of the ecampusApp
 */
	angular
  	.module('ecampusApp')
  	.controller('CreditModulesCtrl', CreditModulesCtrl);

	CreditModulesCtrl.$inject = ['$scope', 'api', 'sharedFiltersData', '$location', 'permission'];

	function CreditModulesCtrl($scope, api, sharedFiltersData, $location, permission) {
		var ifWantToAddRowData = false;
		$scope.hideTable = false;
		$scope.filterSpecialization = true;
    $scope.errorLabelText = '';
    $scope.errorLabelTextModal = '';
    $scope.lastEdit = {id: '', name: ''};

    $scope.loadSpecialities = loadSpecialities;

    $scope.permissionSubdivisions = permission.getSubsystemPermission(3);

    if ($scope.permissionSubdivisions.length != 0) {      
      $scope.subdivisions = $scope.permissionSubdivisions.subdivisions;
      $scope.subdivisions.selected = $scope.permissionSubdivisions.subdivisions[0];
      $scope.loadSpecialities($scope.subdivisions.selected.id);
    }    

    $scope.allowPermission = function() {      
      if ($scope.permissionSubdivisions!=null) {
        for (var i=0, l=$scope.permissionSubdivisions.subdivisions.length; i<l; i++) {      
          if ($scope.permissionSubdivisions.subdivisions[i].id == $scope.subdivisions.selected.id) {
            return true;  
          } else {
            return false;  
          }
        } 
      }
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
          element.subdivision.id === subdivisionId &&
          element.actualityDcprof === actuality
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
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr, 'specialization').sort(sortNames);
          $scope.errorSpecialities = '';
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
      var url;
      if (specialityId != undefined) {
        url = ('StudyOrganization/Specialization?specialityId=' + specialityId);
      } else {return;}

      api.execute('GET', url)
        .then(function(response) {
          $scope.specializationsForModal = response;
          var specializationsResponse = response;       
    			$scope.specializations = filterSpecializations(specializationsResponse,$scope.specialities.selected.profTrainTotal.subdivisionId);    			
          $scope.errorSpecializations = '';
        })
        .catch(function(response) {
          $scope.errorSpecializations = api.errorHandler(response);
        });
    }

    $scope.reloadDisciplines = loadDisciplines;

    function loadDisciplines(idSpec, idSubdiv, idSpeciality) {
      var url = '';

      if ((idSpec !== 'not set')&&(idSpec !== undefined)&&(!$scope.filterOkr)) {
        url = ('CreditModule/Specializations/' + idSpec);
        $scope.lastEdit.name = 'specialization';
        $scope.lastEdit.id = idSpec;
      } else {
        if ((idSubdiv !== 'not set')&&(idSubdiv !== undefined)&&($scope.filterOkr)) {
          url = ('StudyOrganization/Discipline/rtProfTrainTotalSubdiv/' + idSubdiv);
          $scope.lastEdit.name = 'subdivision';
          $scope.lastEdit.id = idSubdiv;
        } else {
          if ((idSpeciality !== 'not set') && (idSpeciality !== undefined)) {
            url = ('StudyOrganization/Discipline/rtProfTrainTotal/' + idSpeciality);
            $scope.lastEdit.name = 'speciality';
            $scope.lastEdit.id = idSpeciality;  
          } else {
            return;
          }
        }
      }  

      api.execute('GET', url)
        .then(function(response) {          
          $scope.disciplines = response;     
          if (!response || response === '' || response.length === 0) {
            $scope.errorLabelText = 'На жаль, дані відсутні';
          } else {
            $scope.errorDisciplines = '';
          }
        })
        .catch(function(response) {
          $scope.errorDisciplines = api.errorHandler(response);
        });
    }

    $scope.loadCM = loadCM;

    function loadCM(rtdisciplineId) {    	
    	if (!rtdisciplineId) {
				$scope.creditModules = [];
        $scope.disciplines = [];
				$scope.disciplines.selected = null;
				return;
    	}
    	var url = ('CreditModule/' + rtdisciplineId);      

    	api.execute('GET', url)
        .then(function(response) {
          var responseLen = response.length;
          if (!response || response === '' || response.length === 0) {
            $scope.errorLabelText = 'На жаль, дані відсутні';
          }
          $scope.creditModules = response;                         
        }, function(response){
          $scope.errorLabelText = api.errorHandler(response);
        });
    }

    function checkParameter(value) {
      return value === 'not set';
    }

    function checkForUndefined(value) {
      return typeof value == 'undefined';
    }

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

    function loadAllSubdivisions() {
      var url = 'Subdivision';
      var method = 'GET';
      $scope.allSubdivisions = [];

      api.execute(method, url)
      .then(function(response) {        
        var allSubdiv = response;
        $scope.allSubdivisions = filterSubdivisionSelect(allSubdiv);
        if (!response || response === '' || response.length === 0) {
          $scope.errorLabelText = 'На жаль, дані відсутні';
        }

      }, function(response) {
        $scope.allSubdivisions = [];
        $scope.errorLabelText = api.errorHandler(response);
      });
    };
	
	  $scope.addCM = function() {
		  if (!ifWantToAddRowData) {
			  $scope.insertedCM = {
				  id: $scope.disciplines.selected.rtDisciplineId,
          nameFull: $scope.disciplines.selected.discipline8.name,
				  name:'',
				  nameShort:'',
          readWhomName: $scope.subdivisions.selected.name,
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
    var competence = '';
    var knowledge = '';
    var skill = '';
    var PropositionId = '';

		if (objCM.name !== '') {
			method = 'PUT';
			url += objCM.id;
		} else {			
			method = 'POST';
		}

		if (editableObj.name) {
			name = editableObj.name;
		} else {
			name = objCM.name;
		}

		if (editableObj.readWhomName.id) {
			whomRead = editableObj.readWhomName.id;
		} else {    
      if (!objCM.readWhomId) {
        whomRead = $scope.subdivisions.selected.id;
      } else {
	      whomRead = objCM.readWhomId;
      }
		}

		if (editableObj.nameShort) {
			nameShort = editableObj.nameShort;
		} else {
			nameShort = objCM.nameShort;
		}

		var sendCM = new CreditModuleModel(            
            name, whomRead, $scope.disciplines.selected.rtDisciplineId,
            nameShort, competence, knowledge, skill, PropositionId
          );
		
		api.execute(method, url, sendCM)
			.then(function(response) {
							
        loadCM($scope.disciplines.selected.rtDisciplineId);
        $scope.errorLabelText = 'Дані було успішно збережено';
        ifWantToAddRowData = false;
			}, function(response) {
				
				loadCM($scope.disciplines.selected.rtDisciplineId);
        $scope.errorLabelText = api.errorHandler(response);
			});

	};

	$scope.removeCM = function(currentRowCM) {
		if (
			confirm('Ви впеврені що хочете видалити поточний кредитний модуль?')
		) {
			var url = (
				'/CreditModule/' +
				currentRowCM.id				
			);
			
			var method = 'DELETE';
			
			api.execute(method, url)
			.then(function(response) {		
				loadCM($scope.disciplines.selected.rtDisciplineId);      
      }, function(response) {
                // $scope.addMessage(4);      
        $scope.errorLabelText = api.errorHandler(response);
      });
		}
	};

  $scope.addDescription = function() {    
    var url = ('CreditModule/' + $scope.currentData.id);
    var method = 'PUT';
    var nameFull = $scope.currentData.nameFull;
    var name = $scope.currentData.nameShort;
    var nameShort = $scope.currentData.nameShort;
    var whomRead = $scope.currentData.readWhomId;
    var competence = $scope.currentData.competence;
    var knowledge = $scope.currentData.knowledge;
    var skill = $scope.currentData.skill;    
    var PropositionId = '';

    var sendCM = new CreditModuleModel(            
            name, whomRead, $scope.disciplines.selected.rtDisciplineId,
            nameShort, competence, knowledge, skill, PropositionId
          );

    api.execute(method, url, sendCM)
      .then(function(response) {
              
        loadCM($scope.disciplines.selected.rtDisciplineId);
        $scope.errorLabelTextModal = 'Дані було успішно збережено';    
        ifWantToAddRowData = false;
      }, function(response) {
        
        loadCM($scope.disciplines.selected.rtDisciplineId);
        $scope.errorLabelTextModal = api.errorHandler(response);
      });
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
    whomRead,
    rtDisciplineId,
    nameShort,
    Competence,
    Knowledge,
    Skill,
    PropositionId    
  ) {
    this.Name = name;
    this.WhomReadId = whomRead;
    this.Id = rtDisciplineId;    
    this.ShortName = nameShort
    this.Competence = Competence;
    this.Knowledge = Knowledge;
    this.Skill = Skill;
    this.PropositionId = PropositionId;    
  };

	$scope.reloadData = function() {
    ifWantToAddRowData = false;
    location.reload();    
  };

  $scope.getCurrentData = function(objCM) {
    $scope.currentData = objCM;
  };

  $scope.shareFilters = function(
    faculties, subdivisions,
    specialities, specializations,
    lastEdit
  ) {    
    sharedFiltersData.setAllFiltersShared(
      faculties, subdivisions,
      specialities, specializations,
      lastEdit
      );
    $location.path('/catalogue-discipline');
  }
			
	loadAllSubdivisions();
}

})();