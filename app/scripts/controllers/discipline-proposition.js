'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesPropositionCtrl
 * @description
 * # DisciplinesPropositionCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('DisciplinesPropositionCtrl', function ($scope, $window, $http, Api, UniqueElemsInList, $timeout) {
  	$scope.loader = false;

    

    var initialLoadCafedra = function() {
			//$scope.loader = true;

    	Api.execute("GET", "SelectiveDiscipline/ActualCafedra/")
        .then(function (response) {

        	$scope.allSubdivisions = [];
        	$scope.alldisciplines = []; //change it to allDisciplines soon!!
        	response.forEach(function(item, i, arr){ //you are not using "i" and "arr" so maybe delete it
        		//if (item.typeId === "30") {
        			var name = item.cafedraName;
        			var id = item.cafedraId;
        			$scope.allSubdivisions.push(new SubdivisionsModel(name, id));

        		//}
        	});


          //$scope.allDataFromApi = response.data;
          //alert(response.data);
          //$scope.allSubdivisions = [];

          /* test with:
           Кафедра екології та технології рослинних полімерів ІХФ
           Кафедра української мови, літератури та культури ФЛ
           Кафедра історії ФСП
           Кафедра філософії ФСП
           Кафедра публічного права ФСП
           Кафедра інформаційного права та права інтелектуальної власності ФСП
           */


          /*
          if (!!$scope.allDataFromApi) {
            for (var i = 0; i < $scope.allDataFromApi.length; i++) {
              if ($scope.allDataFromApi[i].typeId == 30) {
                $scope.allSubdivisions.push({
                  name: $scope.allDataFromApi[i].name,
                  id: $scope.allDataFromApi[i].subdivisionId
                });
              }

            }
          }*/
          $scope.loader = false;
          
        }, function (response) {

          $scope.allSubdivisions = [];


        });
    };

    angular.element(document).ready(function () {
    	$scope.loader = true; //delete it from here
    	$timeout(initialLoadCafedra, 1000);

      
    });

    $scope.SendSubdivisionToServer = function () {

      $scope.alldisciplines = [];
      var data = $scope.selectedDiscipline.id;

      //alert(data);
			$scope.loader = true;
      //var url = "SelectiveDiscipline/BlocksDispline/" + data;
      
      
      

      //temp solution
      var url = "cDisciplineBlock.json";
      $http.get(url)

      //var url = "http://api-campus-kpi-ua.azurewebsites.net/selectivediscipline/BlocksDispline/"+data;
      
      
      //worked before but now again something wrong with API
      //var url = "SelectiveDiscipline/BlocksDispline/"+data+"";
      //Api.execute("GET", url)
        .then(function (response) {

            // success callback
            $scope.alldisciplines = [];
            $scope.alldisciplines = response.data;

            //used to work before
            /*response.forEach(function(item, i, arr){ 
        		
        			var okr = item.okr;
        			var blockName = item.blockName;
        			var nameUkr = item.nameUkr;
        			var countCredit = item.countCredit;
        			var annotation = item.annotation;
        			var competence = item.competence;
        			var knowledge = item.knowledge;
        			var skill = item.skill;
        			var cDisciplineBlock8Id = item.cDisciplineBlock8Id;

        			var pictures;
        			if (item.pictures!==null) {
        				pictures = "data:image/jpeg;base64," + item.pictures;
        			}
        			
        			//check this code....
        			var studyYear = item.cdisciplineblockyear8.studyYear;
        			var maxCountStudent = item.cdisciplineblockyear8.maxCountStudent;
        			var isApproved = item.cdisciplineblockyear8.isApproved;
							var yearData = YearDataModel(studyYear, maxCountStudent, isApproved); //new add

        			$scope.alldisciplines.push(new DisciplinesModel(okr, blockName, nameUkr, countCredit, annotation, competence, knowledge, skill, pictures, yearData, cDisciplineBlock8Id));
        			console.log($scope.alldisciplines.pictures);
        		});
            */
            



            console.log($scope.alldisciplines);
            $scope.ifSubdivChosen = function () {
              return Boolean($scope.alldisciplines);
            };

            $scope.sortName = 'nameUkr';
            $scope.sortReverse = false;

            $scope.sortBy = function (propertyName) {
              $scope.sortReverse = ($scope.sortName === propertyName) ? !$scope.sortReverse : true;
              $scope.sortName = propertyName;
            };

            $scope.CurrentYearData = {};
            $scope.CurrentYearDataList = [];

            $scope.getCurrentYearData = function (currentData) {
              $scope.CurrentYearData = currentData;
            };

            $scope.tempListDataMax = {
              allYearsMax: [
                {currentYear: "2016-2017"},
                {currentYear: "2017-2018"},
                {currentYear: "2018-2019"}
              ],
              allApproves: [
                {currentApprove: "+"},
                {currentApprove: "-"},
                {currentApprove: "+/-"}
              ]

            };

            $scope.newDataMax = {
              cDisciplineBlock8Id: "",
              StudyYear: "",
              MaxCountStudent: "",
              IsApproved: ""
            };

            $scope.newData = {
              DcOKRId: "",
              okr: "",
              DcBlock8Id: "",
              DcDiscipline8Id: "",
              DcSubdivisionWhoId: "10197",
              countCredit: null,
              Annotation: "",
              Competence: "",
              Knowledge: "",
              Skill: "",
              Images: ""
            };

            var url = "SelectiveDiscipline/ForDisciplineOffer";
      			Api.execute("GET", url)
        			.then(function (response) {
        				$scope.tempListData = [];
        				$scope.tempListData.allOkr = [];
        				$scope.tempListData.allBlocks = [];
        				$scope.tempListData.allDisciplines = [];
        				$scope.tempListData.allYears = [];
								
        				response.forEach(function(item, i, arr){
        					item.forEach(function(item2, i, arr){
        						if (item2.okr) {
        							var currentOkr = item2.okr;
        							var currentOkrId = item2.dcOKRId;
        							$scope.tempListData.allOkr.push(new AllOkrModel(currentOkr, currentOkrId));
        						} 
        						else {
        							if (item2.blockName) {
        								var currentBlock = item2.blockName;
        								var currentBlockId = item2.dcBlock8Id;
        								$scope.tempListData.allBlocks.push(new AllBlocksModel(currentBlock, currentBlockId));
        							}
        							else {
        								if (item2.disciplineName) {
        									var currentDiscipline = item2.disciplineName;
        									var currentDisciplineId = item2.dcDiscipline8Id;
        									$scope.tempListData.allDisciplines.push(new AllDisciplinesModel(currentDiscipline, currentDisciplineId));
        								}
        								else {
        									var currentYear = item2.studyYear;
        									$scope.tempListData.allYears.push(currentYear);
        								}
        							}
        						}

        						
        					});

        				//var allOkr = item.okr;
        				//var id = item.cafedraId;
        				//$scope.tempListData.push(new SubdivisionsModel(name, id));

        		//}
        	});

        			});


            

						$scope.fileNameChanged1 = function() {
  						console.log("select file");
						}

            
            /*$scope.fileNameChanged = function(event) {
            	alert("how can I open you?");
            	var selectedFile = event.target.files[0];
            	var reader = new FileReader();

            	if (files[0].type.match('image.*')) {
            		var imgtag = document.getElementById("preview");
            		imgtag.title = selectedFile.name;

            		reader.onload = function(event) {
            			imgtag.src = event.target.result;
            		};

            		reader.readAsDataURL(selectedFile);
            		alert("I'm here");  
            	}
            	document.getElementById('files').addEventListener('change', onFileSelected, false);
            }*/
						
            $scope.deleteRowFromTable = function(objToDelete) {
            	console.log("Видалення пропозиції з ID: " + objToDelete.cDisciplineBlock8Id);
            	console.log(objToDelete);
            	/*Api.execute("DELETE", 'SelectiveDiscipline/BlocksDispline', objToDelete.cDisciplineBlock8Id)
                .then(function (response) {
                  $scope.alldisciplines = response.data;
                  },
                  function (response) {
                   alert("Cannot delete new data");
                  }
                );*/

            }

            $scope.editRowFromTable = function(objToEdit) {
            	$scope.newData = objToEdit;
            	//console.log("$scope.newData:");
            	//console.log($scope.newData.DcOKRId);
            	console.log("$scope.newData.okr");
            	console.log($scope.newData.okr);
            	console.log("CurrOkr:");
            	console.log($scope.CurrOkr);            	
            	console.log("go:")

            	for (var i=0; i<$scope.tempListData.allOkr.length; i++){
            		
            		if ($scope.newData.okr==$scope.tempListData.allOkr[i].currentOkr) {
            			console.log($scope.tempListData.allOkr[i].currentOkr);
            			$scope.CurrOkr=$scope.tempListData.allOkr[i].currentOkr;
            		}
            	}
            	console.log("CurrOkr2:");
            	console.log($scope.CurrOkr);
            	console.log($scope.newData);
            }

            $scope.addRowFromTable = function() {


          		$scope.newData = {
              	DcOKRId: "",
              	okr: "",
              	DcBlock8Id: "",
              	DcDiscipline8Id: "",
              	DcSubdivisionWhoId: "10197",
              	countCredit: null,
              	Annotation: "",
              	Competence: "",
              	Knowledge: "",
              	Skill: "",
              	Images: ""
            	};
            	$scope.CurrOkr=$scope.newData.okr;
            }

            $scope.functionOkr = function() {
            	$scope.newData.DcOKRId=$scope.CurrOkr.currentOkrId; 
            	console.log($scope.newData.DcOKRId);	
            }
            

            $scope.sendToServer = function () {
            	//$scope.loader = true;
              $scope.newData.countCredit = parseInt($scope.newData.countCredit);
              //var data = angular.toJson($scope.newData);
              var data = $scope.newData;
              //console.log(data);
              var config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };
              var url = "SelectiveDiscipline/BlocksDispline";
              

              console.log("I'm preparing new data. Wait pls.");
              console.log($scope.newData);
              console.log("readyyyyYyyyyyy!!! goo!!!!!!");

              /*if (($scope.currImgFormat=="image/png")||($scope.currImgFormat=="image/jpeg")||($scope.currImgFormat=="image/gif"))  {
              	console.log("ok");
              	Api.execute("POST", url, data)
              	.then(function (response) {
              		console.log("success");
              		$scope.loader = false;
              	});
              }
              else {
              	console.log("not ok");	
              }*/
              //console.log($scope.newData.countCredit);
              //make a Model with .this...
              $scope.newData = {
	              DcOKRId: "",
  	            DcBlock8Id: "",
    	          DcDiscipline8Id: "",
      	        DcSubdivisionWhoId: "10197",
        	      countCredit: null,
          	    Annotation: "",
            	  Competence: "",
              	Knowledge: "",
              	Skill: "",
              	Images: ""
            	};

              console.log($scope.newData);

              



              // Api.execute("POST", 'some_url', data, config)
              //   .then(function (response) {
              //       $scope.alldisciplines = response.data;
              //     },
              //     function (response) {
              //       alert("Cannot add new data");
              //     }
              //   );
            }

            $scope.loader = false;
          },
          function (response) {

            $scope.alldisciplines = null;
          }
        );
    };

    /* Control (integer + - adding) */
    $scope.MinusCred = function () {
      $scope.newData.countCredit = parseInt($scope.newData.countCredit);

      if ($scope.newData.countCredit !== 0) {
        $scope.newData.countCredit = $scope.newData.countCredit - 1;
        $('.btn-minuse').removeClass('disabled');
        $('.btn-pluss').removeClass('disabled');
      }
      else {
        $('.btn-minuse').addClass('disabled');
      }
    };

    $scope.PlusCred = function () {
      $scope.newData.countCredit = parseInt($scope.newData.countCredit);
      if ($scope.newData.countCredit !== 9) {
        $scope.newData.countCredit = $scope.newData.countCredit + 1;
        $('.btn-pluss').removeClass('disabled');
        $('.btn-minuse').removeClass('disabled');
      }
      else {
        $('.btn-pluss').addClass('disabled');
      }
    };

    var number = document.getElementById('newCred');

    number.onkeydown = function (e) {
      if (!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8)) {
        return false;
      }
    }

    function SubdivisionsModel(name, id) {
      this.name = name;
      this.id = id;
    }

    function DisciplinesModel(okr, blockName, nameUkr, countCredit, annotation, competence,knowledge,skill,pictures, yearData,cDisciplineBlock8Id){
    	this.okr = okr;
      this.blockName = blockName;
      this.nameUkr = nameUkr;
      this.countCredit = countCredit;
      this.annotation = annotation;
      this.competence = competence;
      this.knowledge = knowledge;
      this.skill = skill;
      this.pictures = pictures;
      this.yearData = yearData;
      this.cDisciplineBlock8Id = cDisciplineBlock8Id;
    }

    /*function YearDataModel(studyYear, maxCountStudent, isApproved) {
    	this.studyYear = studyYear;
    	this.maxCountStudent = maxCountStudent;
    	this.isApproved = isApproved;
    }*/

    function AllSelectData(allOkr, allBlocks, allDisciplines, allYears) {
    	this.allOkr = allOkr;
    	this.allBlocks = allBlocks;
    	this.allDisciplines = allDisciplines;
    	this.allYears = allYears;
    }

    function AllOkrModel(currentOkr, currentOkrId) {
    	this.currentOkr = currentOkr;
    	this.currentOkrId = currentOkrId;
    }

    function AllBlocksModel(currentBlock, currentBlockId) {
    	this.currentBlock = currentBlock;
    	this.currentBlockId = currentBlockId;
    }

    function AllDisciplinesModel(currentDiscipline, currentDisciplineId) {
    	this.currentDiscipline = currentDiscipline;
    	this.currentDisciplineId = currentDisciplineId;
    }


    //var ifItIsAllowed = false; ok it works
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}

		


		function handleFileSelect(evt) {
			var files = evt.target.files; 
			$scope.currImgFormat = files[0].type;
			//h('image.*')
			if (((files[0].type=="image/png")||(files[0].type=="image/jpeg")||(files[0].type=="image/gif"))&&(files[0].size<65535)) {
				var reader = new FileReader();
				console.log("img is ok");
				//console.log(files[0].type);
				
				reader.onload = (function(theFile) {
					return function(e) {
						
						var currImg = document.getElementById('preview');
						currImg.src=e.target.result;
          //console.log(currImg.src);
          $scope.newData.Images=currImg.src.substring(23); //without data:image/jpeg;base64, part at the beginning
          currImg.title=escape(theFile.name);

          };
        })(files[0]);
        
        reader.readAsDataURL(files[0]);
      }
    }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);











		

  });



