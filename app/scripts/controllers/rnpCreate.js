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
	$scope.editRnpTab = 'firstTab';
	var ifWantToAddRowData = false;

	$scope.options = {
    cathedras: [],
    specialities: [],    
    specializations: [],
    okrs: []
  };
//somwhere ITem, Name, Code name...
  $scope.model = {
    cathedraName: null,
    specialityItem: null,    
    specializationCodeName: null,
    okrName: null
  };

  $scope.selectData = {
    cathedraId: null,
    specialityId: null,    
    specializationId: null,
    okrId: null
  };

//test
$scope.tempResponseAndrew = {
  "studingYear": {
    "1": "2011-2012",
    "2": "2012-2013",
    "3": "2013-2014",
    "4": "2014-2015",
    "5": "2015-2016",
    "6": "2016-2017",
    "7": "2017-2018",
    "8": "2018-2019",
    "9": "2019-2020"
  },
  "studyForm": {
    "1": "Вечірня",
    "2": "Денна",
    "3": "Дистанційна",
    "4": "Екстернат",
    "5": "Заочна"
  },
  "profTrain": {
    "кафедра інженерії поверхні ЗФ": {
      "бакалавр": {
        "131 Прикладна механіка": "1070",
        "6.050504 Зварювання": "82"
      },
      "магістр": {
        "131 Прикладна механіка": "1071",
        "8.05050403 Відновлення та підвищення зносостійкості деталей і конструкцій": "642",
        "8.092303 Технологія і устаткування відновлення та підвищення зносостійкості машин і конструкцій": "212"
      },
      "спеціаліст": {
        "131 Прикладна механіка": "1072",
        "7.05050403 Відновлення та підвищення зносостійкості деталей і конструкцій": "641",
        "7.092303 Технологія і устаткування відновлення та підвищення зносостійкості машин і конструкцій": "211"
      }
    },
    "кафедра інженерної екології ІЕЕ": {
      "бакалавр": {
        "101 Екологія": "884",
        "6.040106 Екологія, охорона навколишнього середовища та збалансоване природокористування": "19"
      },
      "магістр": {
        "101 Екологія": "885",
        "8.04010601 Екологія та охорона навколишнього середовища": "495",
        "8.070801 Екологія та охорона навколишнього середовища": "346"
      },
      "спеціаліст": {
        "101 Екологія": "886",
        "7.04010601 Екологія та охорона навколишнього середовища": "494",
        "7.070801 Екологія та охорона навколишнього середовища": "345"
      }
    },
    "кафедра інтегрованих технологій машинобудування ММІ": {
      "бакалавр": {
        "133 Галузеве машинобудування": "863",
        "6.050502 Інженерна механіка": "8",
        "6.050503 Машинобудування": "444"
      },
      "магістр": {
        "133 Галузеве машинобудування": "864",
        "8.05050302 Інструментальне виробництво": "473",
        "8.090204 Інструментальне виробництво": "374"
      },
      "спеціаліст": {
        "133 Галузеве машинобудування": "865",
        "7.05050302 Інструментальне виробництво": "472",
        "7.090204 Інструментальне виробництво": "373"
      }
    },
    "кафедра інформаційно-вимірювальної техніки ФАКС": {
      "бакалавр": {
        "152 Метрологія та інформаційно-вимірювальна техніка": "1073",
        "6.051001 Метрологія та інформаційно-вимірювальні технології": "84"
      },
      "магістр": {
        "152 Метрологія та інформаційно-вимірювальна техніка": "1074",
        "8.05100101 Метрологія та вимірювальна техніка": "646",
        "8.091302 Метрологія та вимірювальна техніка": "202"
      },
      "спеціаліст": {
        "152 Метрологія та інформаційно-вимірювальна техніка": "1075",
        "7.05100101 Метрологія та вимірювальна техніка": "645",
        "7.091302 Метрологія та вимірювальна техніка": "201"
      }
    },
    "кафедра інформаційно-телекомунікаційних мереж ІТС": {
      "бакалавр": {
        "172 Телекомунікації та радіотехніка": "833",
        "6.050903 Телекомунікації": "3"
      },
      "магістр": {
        "172 Телекомунікації та радіотехніка": "834",
        "8.05090301 Інформаційні мережі зв'язку": "463",
        "8.092402 Інформаційні мережі зв'язку": "126"
      },
      "спеціаліст": {
        "172 Телекомунікації та радіотехніка": "835",
        "7.05090301 Інформаційні мережі зв'язку": "462",
        "7.092402 Інформаційні мережі зв'язку": "125"
      }
    }
  }
};

  $scope.setCathedras = function() {
  	var path = 'Rnp/Headers';
  	/*api.execute('GET', path)
		.then(function(response) {
			requestComplete(response);
		});

		function requestComplete(response) {
      if (!response || response === '' || response.length === 0) {
        $scope.errorLabelText = 'На жаль, дані відсутні.';        
      } else {
      	console.log('дані є:');
      	for (var cathedraName in response.profTrain) {
      		$scope.options.cathedras.push(cathedraName);
      	}
      	for (var i=0; i<$scope.options.cathedras.length; i++) {
      		console.log($scope.options.cathedras[i]);
      	}
        //$scope. = response;        
        //console.log(response.profTrain);
      }
    }*/
    
    for (var cathedraName in $scope.tempResponseAndrew.profTrain) {
    	$scope.options.cathedras.push(cathedraName);
    }
    for (var i=0; i<$scope.options.cathedras.length; i++) {
    	console.log($scope.options.cathedras[i]);
    }
  }




  $scope.setCathedras();


	//activate();

	/*function activate() {
		var chainResponsibility = [
		'cathedra',
		'speciality',		
		'specialization',
		'okr'
		];
	}*/

	
	$scope.SwitchSections = function(event) {
  	$scope.editRnpTab = event.target.value;
	}

	$('#menu-toggle-1').click(function(e) {
		e.preventDefault();
		$('.wrapperMenuAndResult').toggleClass('activeMenu');
	});

	$('#menu-toggle-2').click(function(e) {
		e.preventDefault();
		$('.wrapperMenuAndResult').toggleClass('activeMenu');
	});

	$('#menu-toggle-3').click(function(e) {
		e.preventDefault();
		$('.wrapperMenuAndResult').toggleClass('activeMenu');
	});

	/*$scope.saveCM = function(editableObj, objCM) {
		console.log("obj:");
		console.log(objCM);
		console.log("editableObj:");
		console.log(editableObj);
	};*/

	$scope.showEditableNameCM = function(editableObj,objCM) {		
		return (objCM.nameCM === '') ? true : false;		
	}	

	//$scope.selectedYear;
	//temp solutions

	$scope.listSpecialityTmp = [];	
	$scope.listSpecializationTmp = [];
	$scope.listOkrTmp = [];
	$scope.listDisciplinesTmp = [{disc:'дисципліна2',idDisc:2}, {disc:'дисципліна3',idDisc:3}, {disc:'дисципліна5',idDisc:5}, {disc:'дисципліна8',idDisc:8}, {disc:'дисципліна9',idDisc:9}, {disc:'дисципліна10',idDisc:10}, {disc:'дисципліна11',idDisc:11}];
	$scope.resultIhorsApiTmp = [];
	$scope.tempListData = [
			{cathForWhom: 'tk1', shortNameDis: 'dis1', nameCM: 'name1'},
			{cathForWhom: 'tk2', shortNameDis: 'dis2', nameCM: 'name2'},
			{cathForWhom: 'tk3', shortNameDis: 'dis3', nameCM: 'name3'},
			{cathForWhom: 'tk4', shortNameDis: 'dis4', nameCM: 'name4'},		
			{cathForWhom: 'tk5', shortNameDis: 'dis5', nameCM: 'name5'},
			{cathForWhom: 'tk6', shortNameDis: 'dis6', nameCM: 'name6'}
	];

	$scope.onChange = function(){


		$scope.listSpecialityTmp = [{specty:'specialty1'},{specty:'specialty2'},{specty:'specialty3'}];
		$scope.listSpecializationTmp = [{specion:'specialization1'},{specion:'specialization2'},{specion:'specialization3'}];
		$scope.listOkrTmp = [{okr: 'бакалавр'}, {okr: 'магістр'},{okr: 'спеціаліст'}];	
		
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

		/*
		switch ($scope.selectedDiscipline.disc) {
			case 'дисципліна1': $scope.resultIhorsApiTmp = [
		{nameCM:'name1', shortNameDis:'dis1',cathForWhom:'tk1',disstribution:'11', description:'aha1'}
	]; break;
			case 'дисципліна2': $scope.resultIhorsApiTmp = [
		{nameCM:'name1', shortNameDis:'dis1',cathForWhom:'tk1',disstribution:'11', description:'aha1'},
		{nameCM:'name2', shortNameDis:'dis2',cathForWhom:'tk2',disstribution:'12', description:'aha2'}
	]; break;
			case 'дисципліна3': $scope.resultIhorsApiTmp = [
		{nameCM:'name1', shortNameDis:'dis1',cathForWhom:'tk1',disstribution:'11', description:'aha1'},
		{nameCM:'name2', shortNameDis:'dis2',cathForWhom:'tk2',disstribution:'12', description:'aha2'},
		{nameCM:'name3', shortNameDis:'dis3',cathForWhom:'tk3',disstribution:'13', description:'aha3'}
	];break;
		}*/
	

	$scope.listCathedraTmp = [{cathedra: 'cathedra1'}, {cathedra: 'cathedra2'}, {cathedra: 'cathedra3'}];

	

	$scope.addCM = function() {
		if (!ifWantToAddRowData) {
			//if ($scope.sortReverse) {
			//	$scope.sortReverse = !$scope.sortReverse;
			//}
			$scope.insertedCM = {
				nameCM:'',
				shortNameDis:'',
				cathForWhom:'',
				disstribution:'',
				description:''
			};

			$scope.resultIhorsApiTmp.unshift($scope.insertedCM);			
			ifWantToAddRowData = true;
		}
	};

	$scope.removeCM = function(currentRowCM) {
		if (
			confirm('Ви впеврені що хочете видалити дані про поточний кредитний модуль?')
		) {
			var url = (
				'some/api/Ihors' //+
				//dataCM.Ihors;
				);
			var method = 'DELETE';
			api.execute(method, url)
			.then(function(response) {
				console.log(response);
                // $('#ModalTableApproved').modal('hide');
                // $scope.sendSubdivisionToServer();
                // $scope.addMessage(1);
        $scope.reloadData();
      }, function(response) {
                // $scope.addMessage(4);
        console.log(response);
      });
		}
	};

	$scope.reloadData = function() {
    ifWantToAddRowData = false;
    location.reload();    
  };
	
	

}