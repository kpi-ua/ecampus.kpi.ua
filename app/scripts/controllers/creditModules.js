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
		$scope.filterSpecialization = true; //!change name		
    $scope.errorLabelText = '';
    $scope.lastEdit = {id: '', name: ''};

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
        }, function(response){
          $scope.errorLabelText = api.errorHandler(response);
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

    /*$scope.loadOkr = function (specialityId) {
    	//$scope.allOkr = uniqueSpecialities($scope.specialities, 'okr').sort(sortNames);
    	$scope.allOkr = filterSpecializations($scope.specialities, specialityId);
    	console.log('$scope.allOkr : ', $scope.allOkr);
*/
      /*var url = 'StudyOrganization/okr';

      api.execute('GET', url)
        .then(function (response) {
          $scope.allOkr = response.sort(sortNames);
          console.log("$scope.allOkr : ", $scope.allOkr);
        });*/
    //}

    $scope.loadSpecialities = function(subdivisionId) {
      var url = ('StudyOrganization/ProfTrains/' + subdivisionId);

      api.execute('GET', url)
        .then(function(response) {             
          var specialitiesWithOkr = filterSpecialities(response, subdivisionId);
          $scope.allSpecialities = specialitiesWithOkr;          
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr, 'specialization').sort(sortNames);          
        }, function(response){
          $scope.errorLabelText = api.errorHandler(response);
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
        }, function(response){
          $scope.errorLabelText = api.errorHandler(response);
        });      
    }

    $scope.reloadDisciplines = loadDisciplines;

    function loadDisciplines(idSpec, idSubdiv, idSpeciality) {
      var url = '';

      if (idSpec !== 'not set') {
        url = ('CreditModule/Specializations/' + idSpec);
        $scope.lastEdit.name = 'specialization';
        $scope.lastEdit.id = idSpec;
      } else {
        if (idSubdiv !== 'not set') {
          url = ('StudyOrganization/Discipline/rtProfTrainTotalSubdiv/' + idSubdiv);
          $scope.lastEdit.name = 'subdivision';
          $scope.lastEdit.id = idSubdiv;
        } else {
          url = ('StudyOrganization/Discipline/rtProfTrainTotal/' + idSpeciality);
          $scope.lastEdit.name = 'speciality';
          $scope.lastEdit.id = idSpeciality;
        }
      }

      /*if (idSpec === 'not set') {
      	url += ('CreditModule/Specializations/' + idSubdiv);
        $scope.lastEdit.name = 'specialization';
        $scope.lastEdit.id = idSubdiv;
      } else {
      	url += ('StudyOrganization/Discipline/rtProfTrainTotalSubdiv/' + idSpec);
        $scope.lastEdit.name = 'subdivision';
        $scope.lastEdit.id = idSpec;
      }*/

      api.execute('GET', url)
        .then(function(response) {          
          $scope.disciplines = response;     
          if (!response || response === '' || response.length === 0) {
            $scope.errorLabelText = 'На жаль, дані відсутні';
          }             
        }, function(response){
          $scope.errorLabelText = api.errorHandler(response);
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
			//if ($scope.sortReverse) {
			//	$scope.sortReverse = !$scope.sortReverse;
			//}
			  $scope.insertedCM = {
				  id: $scope.disciplines.selected.rtDisciplineId,
          nameFull: $scope.disciplines.selected.discipline8.name,
				  name:'',
				  nameShort:'',
          readWhomName: $scope.subdivisions.selected.name,
				  whomRead: {
  					name: $scope.subdivisions.selected.name, 
					 id: $scope.subdivisions.selected.id
				  }//,
				//disstribution:''				
			   };

        $scope.creditModules.unshift($scope.insertedCM);			
        ifWantToAddRowData = true;
		  }
	 };

	$scope.saveCM = function(editableObj, objCM) {
		console.log("obj:");
		console.log(objCM);
		console.log("editableObj:");
		console.log(editableObj);

		var nameFull, name, nameShort, method, whomRead;
		var url = 'CreditModule/';
    var competence = '';
    var knowledge = '';
    var skill = '';
    var PropositionId = '';

//whomRead = editableObj.whomRead.id
		if (objCM.name !== '') {
			//nameCM = editableObj.name;			
			method = 'PUT';
			url += objCM.id;
		} else {
			//nameCM = objCM.name;
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
            //nameCM, subdivisions.selected.id
            name, whomRead, $scope.disciplines.selected.rtDisciplineId,
            nameShort, competence, knowledge, skill, PropositionId
          );

		ifWantToAddRowData = false;
		api.execute(method, url, sendCM)
			.then(function(response) {
							
        loadCM($scope.disciplines.selected.rtDisciplineId);
        $scope.errorLabelText = 'Дані було успішно збережено';		
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
	
	loadFaculties();
	//loadCM(14);
	loadAllSubdivisions();
}

})();