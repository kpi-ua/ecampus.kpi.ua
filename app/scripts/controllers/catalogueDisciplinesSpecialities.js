(function () {
	'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:CatalogueDisciplinesCpesialitiesCtrl
 * @description
 * # CatalogueDisciplinesCpesialitiesCtrl
 * Controller of the ecampusApp
 */
	angular
  	.module('ecampusApp')
  	.controller('CatalogueDisciplinesCpesialitiesCtrl', CatalogueDisciplinesCpesialitiesCtrl);

	CatalogueDisciplinesCpesialitiesCtrl.$inject = ['$scope', 'api', 'sharedFiltersData', 'permission'];

	function CatalogueDisciplinesCpesialitiesCtrl($scope, api, sharedFiltersData, permission) {
		$scope.loadSpecialities = loadSpecialities;
		$scope.loadSubdivisionsAccordingToPermission = loadSubdivisionsAccordingToPermission;
    $scope.reloadDisciplines = loadDisciplines;
    $scope.filterSubdivision = filterAllSubdivision;
    $scope.loadOkr = loadOkr;
						
		$scope.disciplines = [];
		var ifWantToAddRowData = false;
		$scope.hideTable = false;
		$scope.lastEdit = {id: '', name: ''};
    loadSubdivisionsAccordingToPermission();
    
		var sharedData = sharedFiltersData.getAllFiltersShared();
		
		$scope.filterSpecialization = true;
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

    function filterAllSubdivision(allSubdivisions) {
      // typeId value for faculty subdivisions
      var typeId = 30;

      return allSubdivisions.filter(function(element) {
        return (
          element.type.id === typeId
        );
      });
    }

    function loadFaculties() {
      var url = 'Subdivision';
      var method = 'GET';

      api.execute(method, url)
        .then(function(response) {
          $scope.fullSubdivisionResponse = response;
          $scope.subdivisions = filterAllSubdivision(response).sort(sortNames);
          $scope.subdivisions.selected = $scope.subdivisions[9];
          $scope.reloadDisciplines('not set', $scope.subdivisions.selected.id);
          loadFilterAdd();
          $scope.loadSpecialities($scope.subdivisions.selected.id);
        })
        .catch(function(response) {
          $scope.errorSubdivisions = api.errorHandler(response);
        })
    }

  	function sortNames(a, b) {
  		var name1 = a.name;
  		var name2 = b.name;

  		return name1.localeCompare(name2);
  	}

    function loadSubdivisionsAccordingToPermission() {
      var permissionSubdivisions;
      permissionSubdivisions = permission.getSubsystemPermission(3); //temp
      //permissionSubdivisions = permission.getSubsystemPermission(26);
      if (permissionSubdivisions) {
        console.log('ok, it has permission, some subdivisions...');
        $scope.subdivisions = permissionSubdivisions.subdivisions;
        $scope.subdivisions.selected = permissionSubdivisions.subdivisions[0];
        $scope.reloadDisciplines('not set', $scope.subdivisions.selected.id);
        $scope.loadSpecialities($scope.subdivisions.selected.id);
      } else {
        console.log('no, there is no permission, load all subdivisions');
        loadFaculties();
      }
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
          $scope.specialities = uniqueSpecialities(specialitiesWithOkr, 'specialization').sort(sortNames);
          console.log(response);
          $scope.errorSpecialities = '';
        })
        .catch(function(response) {
          $scope.errorSpecialities = api.errorHandler(response);
        });
    };

    function filterOkr(allSpecialities, specialityId){
      return allSpecialities.filter(function(element) {
        return (
          element.id === specialityId        
        );
      });
    }

    function loadOkr (specialityId) {
      $scope.allOkr = filterOkr($scope.allSpecialities, specialityId);
    }

    function loadDisciplines(idSpec, idSubdiv, idSpeciality) {
      var url = '';

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
      
      api.execute('GET', url)
        .then(function(response) {
          $scope.disciplines = response;
          console.log($scope.disciplines);
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
    	var url = ('StudyOrganization/Discipline/Filters/' + $scope.subdivisions.selected.id);

    	api.execute('GET', url)
        .then(function (response) {
        	$scope.allDisciplines = response.discipline.sort(sortNames);
          $scope.allComponents = response.component.sort(sortNames);;
          $scope.errorForSelect = '';
        })
        .catch(function(response) {
          $scope.errorForSelect = api.errorHandler(response);
        });
    }

    $scope.addDisc = function(subdivId, specialityId, specializationId) {
		  if (!ifWantToAddRowData) {
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
      
      if ($scope.specialities) {
        if ($scope.specialities.selected) {
          ProfTrainTotalId = $scope.specialities.selected.id;
        }
      } else {
        if ($scope.subdivisions.selected) {
          ProfTrainTotalSubdivisionId = $scope.subdivisions.selected.id;
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

        var Actuality;
        Actuality = !editableObj.actuality;

				var Description = objDisc.description;
				
				var sendDisc = new DisciplineModel(
            ProfTrainTotalId, ProfTrainTotalSubdivisionId, DcSpecializationId,
            Component, Discipline8, Shifr, OutCredit, Description,
            Actuality
          );
				
				api.execute(method, url, sendDisc)
				.then(function(response) {										
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
					ifWantToAddRowData = false;
				}, function(response) {					
					$scope.errorLabelText = api.errorHandler(response);
				});			
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
  	  		$scope.errorLabelText = 'Видалення дисципліни пройшло успішно';
    		}, function(response) {                   
         $scope.errorLabelText = api.errorHandler(response);
      	});
    	}
  	};

    $scope.cancelDisc = function(objDisc) {
    	if (!objDisc.name) {
    		$scope.disciplines.shift(objDisc);
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
      Description,
      Actuality
    ) {
    	this.ProfTrainTotalId = ProfTrainTotalId;
      this.ProfTrainTotalSubdivisionId = ProfTrainTotalSubdivisionId;
      this.DcSpecializationId = DcSpecializationId;
      this.Component = Component;
      this.Discipline8 = Discipline8;
      this.Shifr = Shifr;
      this.OutCredit = OutCredit;
      this.Description = Description;
      this.Actuality = Actuality;
    };

    function DisciplineNewModel(
      Name, 
      NameShort,
      Abbreviation,
      UserAccount,
      DcOKRId,
      DcSubdivisionWhoId
    ) {
    	this.Name = Name;
    	this.NameShort = NameShort;
			this.Abbreviation = Abbreviation;
			this.UserAccount = UserAccount;
			this.DcOKRId = DcOKRId;
      this.DcSubdivisionWhoId = DcSubdivisionWhoId;
    };

    $scope.getFilterDisciplines = function(search) {    	
    	var discList = $scope.allDisciplines.slice();
    	var l=discList.length;
    	if (l===0){
    		if (search!=='') {
    			$scope.newDiscipline = {};
    			$scope.newDiscipline.Name = search;
    			return;
    		} else {
    			$scope.errorFilterDisciplines = 'Дисципліни відсутні';
    			return;
    		}
    	}
    	
    	for (var i=0; i<l; i++) {
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
    	
    	var url = 'StudyOrganization/Discipline/Implement/';
    	var method = 'POST';
			var Name;   			
			var NameShort = $scope.newDiscipline ? $scope.newDiscipline.NameShort : '';
      var	Abbreviation = $scope.newDiscipline ? $scope.newDiscipline.Abbreviation : '';
      var UserAccount = '';
      var DcOKRId = 1;
			var DcSubdivisionWhoId;			
			
    	if ((!$scope.newDiscipline) || ($scope.newDiscipline === undefined)) {
    		$scope.errorNameModal = 'Заповніть це поле';				
    	} else {
				Name = $scope.newDiscipline.Name;
    		$scope.errorNameModal = '';
    	}
    	
      if ((!$scope.allSubdivisions.selected) || ($scope.allSubdivisions.selected === undefined)) {
    		$scope.errorSubdivModal = 'Заповніть це поле';			
    	} else {
				DcSubdivisionWhoId = $scope.allSubdivisions.selected.id				
    		$scope.errorSubdivModal = '';
    	}

      var sendDisc = new DisciplineNewModel(Name, NameShort,
      		Abbreviation, UserAccount, DcOKRId, DcSubdivisionWhoId);

				api.execute(method, url, sendDisc)
				.then(function(response) {										
					$scope.errorLabelTextModal = 'Дисципліну створено успішно';							
					loadFilterAdd();
				}, function(response) {					
					$scope.errorLabelTextModal = api.errorHandler(response);
				});
    }

    $scope.getCurrentData = function(objDisc) {
    	$scope.currentData = objDisc;
  	};

  	$scope.addDescription = function() {
  		var url = ('StudyOrganization/Discipline/' + $scope.currentData.rtDisciplineId);
  		var method = 'PUT';
  		var ProfTrainTotalId = $scope.currentData.profTrainTotalId;
  		var ProfTrainTotalSubdivisionId = $scope.currentData.profTrainTotalSubdivisionId;
  		var DcSpecializationId = $scope.currentData.dcSpecializationId;
  		var Component = $scope.currentData.component;
  		var Discipline8 = $scope.currentData.discipline8;
  		var Shifr = $scope.currentData.shifr;
  		var OutCredit = !$scope.currentData.outCredit;
  		var Description = $scope.currentData.description;
  		var Competence = $scope.currentData.competence;
  		var Knowledge = $scope.currentData.knowledge;
  		var Skill = $scope.currentData.skill;

  		var sendDisc = new DisciplineModel(
  			ProfTrainTotalId, ProfTrainTotalSubdivisionId, DcSpecializationId,
  			Component, Discipline8, Shifr, OutCredit, Description,
  			Competence, Knowledge, Skill
  			);

				api.execute(method, url, sendDisc)
				.then(function(response) {										
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
					$scope.errorLabelTextModal = 'Дані було успішно збережено';							
				}, function(response) {					
					$scope.errorLabelTextModal = api.errorHandler(response);
				});
  	};

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
        
        if (!response || response === '' || response.length === 0) {
          $scope.errorLabelText = 'На жаль, дані відсутні';
        } else {
        	$scope.allSubdivisions = filterSubdivisionSelect(allSubdiv);
        	$scope.errorSubdivModal = '';
        }

      }, function(response) {
        $scope.allSubdivisions = [];
        $scope.errorSubdivModal = api.errorHandler(response);
      });
    };

    $scope.loadAllSubdivisions = loadAllSubdivisions;

		loadAllSubdivisions();
	}

})();
