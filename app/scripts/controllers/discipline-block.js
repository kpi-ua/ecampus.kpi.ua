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
 		for (var i=0; i<$scope.alldata.length; i++) {
 			if ($scope.alldata[i].countLecture==null) {
 			$scope.alldata[i].countLecture="Не визначено";
 		}	
 		}
 		UniqueElemsInList.setData($scope.alldata);
 		$scope.allYears = UniqueElemsInList.getDataUnique('studyPeriod.all');	
 		$scope.allOkrs = UniqueElemsInList.getDataUnique('okr');	
 		//$scope.whichYear();
 		$scope.selectedYear = UniqueElemsInList.setCurrentYear($scope.allYears);
 		

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
 				console.log("aha! the conditions are appropriate");
 				$scope.dataInTree = UniqueElemsInList.getArrayOfBlocksAndDisc($scope.selectedYear, $scope.selectedOkr, $scope.alldata);
 			}
 			
 			$scope.ifYearAndOkr0Chosen = function() {
 				//console.log("$scope.dataInTree (ng-show)");
 				//console.log(Boolean($scope.dataInTree));
 				if (($scope.dataInTree)&&($scope.dataInTree.length!==0)) {
 					return Boolean($scope.dataInTree);
 				}
 			}
 			
 		}

 	$scope.ifTreeLengthZero = function() {
 		if (($scope.selectedYear==null)||($scope.selectedOkr==null)){
 			return true;
 		}
 		if($scope.dataInTree){
 			if($scope.dataInTree.length!==0){
 				return false;
 			}
 		}
 		else {
 			return true;
 		}
 	}

 	$scope.ifNull = function(inputData) {
      if (inputData == null) {
        inputData = "Не визначено";
      }
    }

 	});