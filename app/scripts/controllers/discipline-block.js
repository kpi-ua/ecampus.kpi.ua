'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesBlockCtrl
 * @description
 * # DisciplinesBlockCtrl
 * Controller of the ecampusApp
 */
 angular.module('ecampusApp')
 .controller('DisciplinesBlockCtrl', function($scope, $http, UniqueElemsInList) {
 	$http.get("http://api-campus-kpi-ua.azurewebsites.net/SelectiveDiscipline/Blocksyear")
 	.then(function(response) {
 		$scope.alldata = response.data;
 		UniqueElemsInList.setData($scope.alldata);
 		$scope.allYears = UniqueElemsInList.getDataUnique('studyyear');	
 		$scope.allOkrs = UniqueElemsInList.getDataUnique('okr');	
 		
 	}, function(response) {
 		$scope.alldata = response.statusText;
 		
 		var msgError = document.createElement('p');
 		msgError.innerHTML = 'На жаль, під час завантаження даних сталася помилка. Спробуйте пізніше. Код: '+response.statusText;
 		msgError.className = "col-xs-12 loadingError";
 		selectYearAndOkr.appendChild(msgError);
 	});
 	


 	$scope.InitializeTree = function() {
 		//if ((($scope.selectedYear!==undefined)||($scope.selectedYear!==null))&&(($scope.selectedOkr!==undefined)||($scope.selectedOkr!==null))) {
 			if (($scope.selectedYear!=undefined)&&($scope.selectedOkr!=undefined)) { 			
 				$scope.dataInTree = UniqueElemsInList.getArrayOfBlocksAndDisc($scope.selectedYear, $scope.selectedOkr, $scope.alldata);
 			}
 			
 			$scope.ifYearAndOkr0Chosen = function() {
 				return Boolean($scope.dataInTree);
 			}
 			
 		}
 	});