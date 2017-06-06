(function () {
	'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:CatalogueDisciplinesCtrl
 * @description
 * # CatalogueDisciplinesCtrl
 * Controller of the ecampusApp
 */
	angular
  	.module('ecampusApp')
  	.controller('CatalogueDisciplinesCtrl', CatalogueDisciplinesCtrl);

	CatalogueDisciplinesCtrl.$inject = ['$scope', 'api', 'sharedFiltersData', 'permission'];

	function CatalogueDisciplinesCtrl($scope, api, sharedFiltersData, permission) {		
		/*console.log('token : ',api.getCurrentUser());
		console.log(permission.getPermission());
		console.log(permission.getSubsystemPermission(3));*/

		$scope.loadSpecialities = loadSpecialities;
		$scope.loadSubdivisionsAccordingToPermission = loadSubdivisionsAccordingToPermission;

		var permissionSubdivisions;
		loadSubdivisionsAccordingToPermission();
		$scope.subdivisions = permissionSubdivisions.subdivisions;
		$scope.subdivisions.selected = permissionSubdivisions.subdivisions[0];
						
		$scope.disciplines = [];
		var ifWantToAddRowData = false;
		$scope.hideTable = false;
		$scope.lastEdit = {id: '', name: ''};
		$scope.reloadDisciplines = loadDisciplines;
		var sharedData = sharedFiltersData.getAllFiltersShared();
		if (sharedData.faculties !== '') {			
			$scope.faculties = sharedData.faculties;
			$scope.subdivisions = sharedData.subdivisions;
			$scope.specialities = sharedData.specialities;
			$scope.specializations = sharedData.specializations;
			switch (sharedData.lastEdit.name) {
				case 'subdivision': 
					$scope.reloadDisciplines('not set', sharedData.lastEdit.id, 'not set');
					break;
				case 'speciality': 
					$scope.reloadDisciplines('not set', 'not set', sharedData.lastEdit.id);
					break;
				case 'specialization': 
					$scope.reloadDisciplines(sharedData.lastEdit.id, 'not set', 'not set');
					break;
				default: break;

			}
		} else {			
			$scope.loadSpecialities($scope.subdivisions.selected.id);
		}
		
		$scope.filterSpecialization = true; //!change name		
    $scope.errorLabelText = '';
    $scope.errorLabelTextModal = '';

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

  	//$scope.
  	/*
  	function getAllSubdivisionsByPermSubdiv(allSubdiv, permissionSubdivisions) {
  		return allSubdiv.filter(function(element) {
        return (
          element.parentId === facultyId
        );
      });
  	}*/

    /*function getAllFacultySubdivision(allSubdivisions, facultyId) {
      return allSubdivisions.filter(function(element) {
        return (
          element.parentId === facultyId
        );
      });
    }*/

    /*function filterAllSubdivision(allSubdivisions, subdivisionId) {      
      var typeId = 30;

      return allSubdivisions.filter(function(element) {      	
      		return (      			
          	element.parentId === subdivisionId &&
          	element.type.id === typeId
        	);      	
      });
    }*/

    //function getFacultuBySubdivision(facultySubdivision, subdivisionId) {
    //	if (facultySubdivision)
    //	return
    //}

    /*$scope.filterSubdivision = function(response, facultyId) {
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
    }*/

    /*function loadFaculties() {
      var url = 'Subdivision';

      api.execute('GET', url)
        .then(function(response) {          
          $scope.fullSubdivisionResponse = response;
          $scope.faculties = filterFaculty(response).sort(sortNames);
        }, function(response){
          $scope.errorLabelText = api.errorHandler(response);
        });      
    }*/

    function loadSubdivisionsAccordingToPermission() {
    	permissionSubdivisions = permission.getSubsystemPermission(3);
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
        })
        .catch(function(response) {
          $scope.errorSpecializations = api.errorHandler(response);
        });
    }    

    function loadDisciplines(idSpec, idSubdiv, idSpeciality) {
      var url = '';

      if ((idSpec !== 'not set')&&(idSpec !== undefined)) {
        url = ('CreditModule/Specializations/' + idSpec);
        $scope.lastEdit.name = 'specialization';
        $scope.lastEdit.id = idSpec;
      } else {
        if ((idSubdiv !== 'not set')&&(idSubdiv !== undefined)) {
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
          	$scope.errorLabelText = '';
          }   
        })
        .catch(function(response) {
          $scope.errorDisciplines = api.errorHandler(response);
        });
    };

    $scope.refreshDisc = loadFilterAdd;

    function loadFilterAdd() {
    	var url = 'StudyOrganization/Discipline/Filters';

    	api.execute('GET', url)
        .then(function (response) {
        	$scope.allDisciplines = response.discipline.sort(sortNames);
          $scope.allComponents = response.component;
        })
        .catch(function(response) {
          $scope.errorForSelect = api.errorHandler(response);
        });
    }

    $scope.addDisc = function(subdivId, specialityId, specializationId) {
		  if (!ifWantToAddRowData) {
			//if ($scope.sortReverse) {
			//	$scope.sortReverse = !$scope.sortReverse;
			//}
				var ProfTrainTotalId = '';
  			var ProfTrainTotalSubdivisionId = '';
  			var DcSpecializationId = '';

				if (specializationId) {
					DcSpecializationId = specializationId;
				} else {
					if (specialityId) {
						ProfTrainTotalId = specialityId;
					} else {
						if (subdivId) {
							ProfTrainTotalSubdivisionId = subdivId;
						}
					}
				}
  	 
			  $scope.insertedDisc = {
  				ProfTrainTotalId:ProfTrainTotalId,
  				ProfTrainTotalSubdivisionId:ProfTrainTotalSubdivisionId,
  				Component: {
    				id:''
  				},
  				Discipline8: {
    				id:''
					},
  				Shifr:'',
  				outCredit:'',
  				Description:'',
				  DcSpecializationId:DcSpecializationId
				};

			 $scope.disciplines.unshift($scope.insertedDisc);
			 ifWantToAddRowData = true;
		  }
		};

    $scope.saveDisc = function(editableObj, objDisc) {
    	console.log("obj:");
			console.log(objDisc);
			console.log("editableObj:");
			console.log(editableObj);

			var method = '';
			var url = 'StudyOrganization/Discipline/';

			if (objDisc.Shifr !== '') {			
				method = 'PUT';
				url += objDisc.rtDisciplineId;
			} else {			
				method = 'POST';
			}

			var ProfTrainTotalId = '';
  		var ProfTrainTotalSubdivisionId = '';
  		var DcSpecializationId = '';  		

			if ($scope.specializations.selected && !$scope.filterOkr) {
					DcSpecializationId = $scope.specializations.selected.id;
				} else {
					if ($scope.specialities.selected && !$scope.filterOkr) {						
						ProfTrainTotalId = $scope.specialities.selected.id;
					} else {
						if ($scope.specialities.selected && $scope.filterOkr) {
							ProfTrainTotalSubdivisionId = $scope.specialities.selected.profTrainTotal.subdivisionId;
						}
					}
				}				
  	 			  
  			var Component = {};

  			if (editableObj['objDisc.component']) {
  				Component.id = editableObj['objDisc.component'].id;
  			} else {
  				Component.id = objDisc.component.id;
  			}
  			var Discipline8 = {};

  			if (editableObj['objDisc.discipline8']) {
  				Discipline8.id = editableObj['objDisc.discipline8'].id;
  			} else {
  				Discipline8.id = objDisc.discipline8.id;
  			}

  			var Shifr;
				if (editableObj.shifr) {
  				Shifr = editableObj.shifr;
  			} else {
  				Shifr = objDisc.Shifr;
  			}

  			var OutCredit;
  			OutCredit = !editableObj.outCredit;

				var Description;
				if (editableObj.description) {
					if (editableObj.description===undefined) {
						Description = '';	
					} else {
						Description = editableObj.description;
					}  				
  			} else {
  				Description = objDisc.description;
  			}				  
				
				var sendDisc = new DisciplineModel(
            ProfTrainTotalId, ProfTrainTotalSubdivisionId, DcSpecializationId,
            Component, Discipline8, Shifr, OutCredit, Description
          );

				console.log('sendDisc : ', sendDisc);
				console.log('method : ', method);
				console.log('url : ', url);
				
				api.execute(method, url, sendDisc)
				.then(function(response) {					
					//по специализации			
					switch ($scope.lastEdit.name) {
						case 'subdivision': 
						$scope.reloadDisciplines('not set', $scope.lastEdit.id, 'not set');
						break;
						case 'speciality': 
						$scope.reloadDisciplines('not set', 'not set', $scope.lastEdit.id);
						break;
						case 'specialization': 
						$scope.reloadDisciplines($scope.lastEdit.id, 'not set', 'not set');
						break;
						default:

					}
					$scope.errorLabelText = 'Дані було успішно збережено';		
					console.log(response);
				}, function(response) {					
					$scope.errorLabelText = api.errorHandler(response);
				});


			ifWantToAddRowData = false;
    }

    $scope.removeDisc = function(currentRowDisc) {
    	if (
    		confirm('Ви впеврені що хочете видалити поточну дисципліну?')
    		) {
    		var url = (
    			'StudyOrganization/Discipline/' +
    			currentRowDisc.rtDisciplineId
    			);

    	var method = 'DELETE';

    	api.execute(method, url)
    	.then(function(response) {		
    		//по специализации
    		switch ($scope.lastEdit.name) {
				case 'subdivision': 
					$scope.reloadDisciplines('not set', $scope.lastEdit.id, 'not set');
					break;
				case 'speciality': 
					$scope.reloadDisciplines('not set', 'not set', $scope.lastEdit.id);
					break;
				case 'specialization': 
					$scope.reloadDisciplines($scope.lastEdit.id, 'not set', 'not set');
					break;
				default:

			}
    	}, function(response) {
                // $scope.addMessage(4);      
                $scope.errorLabelText = api.errorHandler(response);
              });
    	}
    };

    $scope.cancelDisc = function(objDisc) {
    	if (!objDisc.name) {
    		$scope.creditModules.shift(objDisc);
    	}
    };

    $scope.checkDiscForm = function(data) {
    	if (data === null || data === '' || data === undefined) {
    		return 'Заповніть це поле!';
    	}
    };

    $scope.showStatus = showStatus;

    function showStatus(value) {
      return value === true ? 'Так' : 'Ні';
    }

    function DisciplineModel(
      ProfTrainTotalId,
      ProfTrainTotalSubdivisionId,
      DcSpecializationId,
      Component,
      Discipline8,
      Shifr,
      OutCredit,
      Description
    ) {
    	this.ProfTrainTotalId = ProfTrainTotalId;
      this.ProfTrainTotalSubdivisionId = ProfTrainTotalSubdivisionId;
      this.DcSpecializationId = DcSpecializationId;
      this.Component = Component;
      this.Discipline8 = Discipline8;
      this.Shifr = Shifr;
      this.OutCredit = OutCredit;
      this.Description = Description;
    };

    function DisciplineNewModel(
      Name, 
      NameShort,
      Abbreviation,
      UserAccount
    ) {
    	this.Name = Name;
    	this.NameShort = NameShort;
			this.Abbreviation = Abbreviation;
			this.UserAccount = UserAccount;
    };

    $scope.getFilterDisciplines = function(search) {
    	//search = search.substring(1, search.length-1);
    	var discList = $scope.allDisciplines.slice();    
    	//var result = '';	
    	for (var i=0, l=discList.length; i<l; i++) {
    		if (search && discList[i].name.toLowerCase().indexOf(search) === -1 ) {    			
    			$scope.errorFilterDisciplines = 'Такої дисципліни не існує';    			
    			$scope.newDiscipline = {};
    			$scope.newDiscipline.Name = search;    			
    		} else {
    			$scope.errorFilterDisciplines = '';
    			break;
    		}
    	}
    };    

    $scope.saveDisciplineModal = function() {
    	$scope.errorLabelTextModal = 'Дисципліну створено успішно';
    	var url = 'StudyOrganization/Discipline/Implement/';
    	var method = 'POST';
			var Name = $scope.newDiscipline.Name;
			var NameShort = $scope.newDiscipline.NameShort;
      var	Abbreviation = $scope.newDiscipline.Abbreviation;
      var UserAccount = '';


      var sendDisc = new DisciplineNewModel(Name, NameShort,
      		Abbreviation, UserAccount);

				console.log('sendDisc : ', sendDisc);
				console.log('method : ', method);
				console.log('url : ', url);

				api.execute(method, url, sendDisc)
				.then(function(response) {										
					$scope.errorLabelText = 'Дані було успішно збережено';
					loadFilterAdd();					
				}, function(response) {					
					$scope.errorLabelText = api.errorHandler(response);
				});
    }

		loadFilterAdd();
		$scope.allDisciplines = [{'id':1, 'name': 'na00me1'},{'id':2, 'name': 'name2'}];
	}

})();
