'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesPropositionCtrl
 * @description
 * # DisciplinesPropositionCtrl
 * Controller of the ecampusApp
 */
 angular.module('ecampusApp')
 .controller('DisciplinesPropositionCtrl', function($scope, $http, UniqueElemsInList) {
 	
 	angular.element(document).ready(function () {
 		$http.get("http://api-campus-kpi-ua.azurewebsites.net/Subdivision/")
 		.then(function(response) {
 			$scope.allDataFromApi = response.data;
 			
 			$scope.allSubdivisions=[];
 			
			/* test with:
			Кафедра екології та технології рослинних полімерів ІХФ
			Кафедра української мови, літератури та культури ФЛ
			Кафедра історії ФСП
			Кафедра філософії ФСП
			Кафедра публічного права ФСП
			Кафедра інформаційного права та права інтелектуальної власності ФСП
			*/
			
 			for (var i=0; i<$scope.allDataFromApi.length; i++){
 				if ($scope.allDataFromApi[i].typeId==30){
 					$scope.allSubdivisions.push({name: $scope.allDataFromApi[i].name, id: $scope.allDataFromApi[i].subdivisionId});
 				}
 			}
 			
 			$scope.alldisciplines = [];
 		}, function(response) {	
 			
 			
 			var msgError = document.createElement('p');
 			msgError.innerHTML = 'На жаль, під час завантаження даних сталася помилка. Спробуйте пізніше. Код: '+response.statusText;
 			msgError.className = "col-xs-12 loadingError";
 			selectSubdiv.appendChild(msgError);
 			
 		});
 	});

 	$scope.SendSubdivisionToServer = function() {
 		$scope.alldisciplines = [];	
 		var data = $scope.selectedDiscipline.id;		
 		var url = "http://api-campus-kpi-ua.azurewebsites.net/SelectiveDiscipline/BlocksDispline/"+data;
 		$http.get(url)
 		.then(
 			function(response){
			// success callback
			$scope.alldisciplines = response.data;
			$scope.ifSubdivChosen = function() {
				return Boolean($scope.alldisciplines);
			}
			
			$scope.sortName = 'nameUkr';
			$scope.sortReverse = false;
			
			$scope.sortBy = function(propertyName) {
				$scope.sortReverse = ($scope.sortName === propertyName) ? !$scope.sortReverse : true;
				$scope.sortName = propertyName;
			};

			$scope.CurrentYearData = {};
			$scope.CurrentYearDataList = [];

			$scope.getCurrentYearData = function(currentData){
				$scope.CurrentYearData = currentData;
			}

			UniqueElemsInList.setData($scope.alldisciplines);
			$scope.allOkr = UniqueElemsInList.getDataUnique('okr');
			
			
			$scope.newData = {
				okr: "",
				blockName: "",
				nameUkr: "",
				subdivisionName: "",
				countCredit: null,
				annotation: "",
				annotationEng: "",
				competence: "",
				knowledge: "",
				skill: "",
				pictures: null
			};
			
			
			$scope.sendToServer = function() {
				var data = $scope.newData;
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				}
				console.log("I'm preparing new data. Wait pls.");
				console.log($scope.newData);	
			}
		}, 
		function(response){
			// failure callback
			
			var msgError = document.createElement('p');
			msgError.innerHTML = 'На жаль, під час завантаження даних сталася помилка. Спробуйте пізніше. Код: '+response.statusText;
			msgError.className = "col-xs-12 loadingError";
			selectSubdiv.appendChild(msgError);
		}
		);
 	}
 });



 