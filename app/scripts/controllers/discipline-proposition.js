'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesPropositionCtrl
 * @description
 * # DisciplinesPropositionCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })
  .controller('DisciplinesPropositionCtrl', function ($scope, $window, $http, Api, UniqueElemsInList, $timeout, $filter) {

    var ifWantToAddRowData = false;
    var studyYearFrom = 2013;
    var studyYearTo = 2020;
    $scope.sectionMenu = "generalListMenu"; //studyYearMenu
    //$scope.tempListData = {};
    $scope.selectedYear = "2013-2014";

    $scope.SwitchSections = function (event) {
      $scope.sectionMenu = event.target.value;
      

      if ($scope.sectionMenu == "studyYearMenu") {
        $scope.forSelectFullname = [];
        var listOfFullnames = [], ifExist = false;
        for (var i=0; i<$scope.alldisciplines.length; i++ ){
          listOfFullnames.push($scope.alldisciplines[i].nameFull);
        }

        UniqueElemsInList.setData(listOfFullnames);
        listOfFullnames = UniqueElemsInList.getDataUnique();     
        listOfFullnames.sort();

        for (var i=0; i<listOfFullnames.length; i++) {   
          ifExist = false;
          for (var j=0; j<$scope.alldisciplines.length; j++ ){     
            if ((listOfFullnames[i]==$scope.alldisciplines[j].nameFull)&&(ifExist==false)) {
              ifExist = true;
              $scope.forSelectFullname.push(new forSelectFullnameModel($scope.alldisciplines[j].nameFull,$scope.alldisciplines[j].disciplineBlockId));
            }
          }
        }
        console.log("$scope.forSelectFullname");
        for (var i=0; i < $scope.forSelectFullname.length; i++) {
          console.log($scope.forSelectFullname[i]);
        }
        
        //UniqueElemsInList.setData($scope.forSelectFullname);  
        //$scope.forSelectFullname = [];      
        //$scope.forSelectFullname = UniqueElemsInList.getDataUnique();        
        //$scope.forSelectFullname.sort();
        //console.log("sort");
        //for (var i=0; i < $scope.forSelectFullname.length; i++) {
        //  console.log($scope.forSelectFullname[i]);
        //}
      }
      
     
    };

    $scope.user = {
      status: [2, 3, 5]
    }; 

     $scope.statuses = [
      {value: 1, text: '1'},
      {value: 2, text: '2'},
      {value: 3, text: '3'},
      {value: 4, text: '4'},
      {value: 5, text: '5'},
      {value: 6, text: '6'}
    ]; 
    $scope.allCourses = [1,2,3,4,5,6];

    $scope.allCourses2 = [
      {value: 1, text: '1'},
      {value: 2, text: '2'},
      {value: 3, text: '3'},
      {value: 4, text: '4'},
      {value: 5, text: '5'},
      {value: 6, text: '6'}
    ]; 

    $scope.allLecturers = [
      {
        name: "Mr. One",
        id: 1
      },
      {
        name: "Mr. Two",
        id: 2
      },
      {
        name: "Mrs. Three",
        id: 3
      }
    ];

    $scope.testLecturers = [
      {
        name: "Mr. One",
        id: 1
      },
      {
        name: "Mr. Two",
        id: 2
      }
    ];

    $scope.tempEmployeesData = [
      {
        "employeeName": "Захарченко  Валерій Никанорович",
        "id": 1,
        "studyYear": {
          "isActual": false,
          "name": "2016-2017",
          "id": -1
        },
        "maxCountStudent": 0,
        "isApproved": null,
        "actuality": true,
        "changeDate": "2016-11-21 12-49-08",
        "nameFull": "Назва: Екологічні навчальні дисципліни; Екологічна безпека інженерної діяльності; Освітній рівень: Бакалавр; Викладає: Кафедра екології та технології рослинних полімерів ІХФ"
      },
      {
        "employeeName": "Цукор Валентина Семенівна",
        "id": 2,
        "studyYear": {
          "isActual": false,
          "name": "2016-2017",
          "id": -1
        },
        "maxCountStudent": 1000,
        "isApproved": null,
        "actuality": true,
        "changeDate": "2016-11-21 12-49-08",
        "nameFull": "Назва: Екологічні навчальні дисципліни; Екологічна безпека інженерної діяльності; Освітній рівень: Бакалавр; Викладає: Кафедра екології та технології рослинних полімерів ІХФ"
      },
      {
        "employeeName": "Галанко Андрій Денисович",
        "id": 3,
        "studyYear": {
          "isActual": false,
          "name": "2016-2017",
          "id": -1
        },
        "maxCountStudent": 200,
        "isApproved": null,
        "actuality": true,
        "changeDate": "2016-11-21 12-49-08",
        "nameFull": "Назва: Екологічні навчальні дисципліни; Екологічна безпека інженерної діяльності; Освітній рівень: Бакалавр; Викладає: Кафедра екології та технології рослинних полімерів ІХФ"
      }
    ];

     /*$scope.showStatus = function() {
      var selected = [];
      angular.forEach($scope.statuses, function(s) { 
        if ($scope.user.status.indexOf(s.value) >= 0) {
          selected.push(s.text);
        }
      });
      return selected.length ? selected.join(', ') : 'не вказано';
    };*/

    /*$scope.showStatus = function() {
      var selected = [];
      angular.forEach($scope.allCourses2, function(s) { 
        if ($scope.user.status.indexOf(s.value) >= 0) {
          selected.push(s.text);
        }
      });
      return selected.length ? selected.join(', ') : 'не вказано';
    };*/

    $scope.showStatus = function(currentRow) {
      
      //var selected = [];
   
      /*for (var i=0; i<7; i++){
        if ((currentRow.courses)&&(currentRow.courses.indexOf(i) >= 0)) {
          selected.push(i);  
        }
        
      }*/
      if (currentRow.courses) {
        return currentRow.courses.length ? currentRow.courses.join(', ') : 'не вказано';
      }      
      //return selected.length ? selected.join(', ') : 'не вказано';
    };

    $scope.showTeachersList = function(currentTeachersList) {
      var output = "";
      if (currentTeachersList.employee.length) {
        for (var i=0; i<currentTeachersList.employee.length; i++) {
          output = output + currentTeachersList.employee[i].name
          if (i!=(currentTeachersList.employee.length-1)) {
            output = output + ', ';
          }
        }
      }
      
      return output;
    }

    $scope.ifZeroInTable = function(currentObject, someValue) {
      return (currentObject != null) ?  currentObject[someValue] : 'не визначено2';
    }

    var initialLoadCafedra = function () {

      //Api.execute("GET", "SelectiveDiscipline/ActualCathedra")
      Api.execute("GET", "Subdivision")
        .then(function (response) {
          $scope.allSubdivisions = [];
          $scope.alldisciplines = [];
          $scope.allSubdivisions = response;
        }, function (response) {
          $scope.allSubdivisions = [];
        });
    };

    var getDataSelectBoxes = function () {
      var url = "SelectiveDiscipline/ForDisciplineOffer";
      //var studyYears = UniqueElemsInList.getStudyYearsArray(studyYearFrom, studyYearTo);

      Api.execute("GET", url)
        .then(function (response) {

          $scope.tempListData = response;
          $scope.tempListData.years = [];
          //reload();
          //$scope.selectedYear = UniqueElemsInList.setCurrentYear($scope.tempListData.years);
          console.log("some promises");
          reload();
          
          //for (var i=0; i<$scope.tempListData.okr.length; i++){
          //  console.log($scope.tempListData.okr[i].name);
          //}
          //$scope.tempListData.customYears = [];
          //$scope.tempListData.push(customYears);
          //for (var i = 0; i < studyYears.length; i++) {
          //  $scope.tempListData.customYears.push(new YearListModel(studyYears[i]));
          //}

        }, function (response) {

          $scope.tempListData = response;
          
          /*for (var i = 0; i < $scope.tempListData.okr.length; i++) {
            console.log($scope.tempListData.okr[i].name);
          }

          for (var i = 0; i < $scope.tempListData.dcBlock8.length; i++) {
            console.log($scope.tempListData.dcBlock8[i].name);
          }*/

        }, function (response) {


        });

    }

    angular.element(document).ready(function () {
      initialLoadCafedra();
      getDataSelectBoxes();


    });

    $scope.checkProposForm = function (data) {
      console.log(data);
      if (data == null || data == "") {
        return "Заповніть це поле!";
      }
    };

    $scope.checkYearForm = function (data) {
      //for (var i = 0; i < $scope.CurrentYearData.yearData.length; i++) {

        //if (data == $scope.CurrentYearData.yearData[i].studyYear.name) {
        //  return "Такі дані вже існують";
        //}
      //}
      if (data == null || data == "") {
        return "Заповніть це поле!";
      }
    };

    $scope.showUaWords = function (current) {
      

      switch (current.isApproved) {
        case true:
        current.isApproved = "так";        
        break;
        case false:
        current.isApproved = "ні";
        break;
        case null:
        current.isApproved = "не визначено";
        break;
      }
      return current.isApproved;
    }

    $scope.SendSubdivisionToServer = function () {

      $scope.alldisciplines = [];
      
      var data = $scope.selectedDiscipline.id;

      var url = "SelectiveDiscipline/BlocksDispline/" + data;

      Api.execute("GET", url)
        .then(function (response) {
            response.forEach(function (item, i, arr) {
              var okr = item.okr;
              var blockName = item.blockName;
              var nameUkr = item.nameUkr;
              var countCredit = item.countCredit;
              var annotation = item.annotation;
              var competence = item.competence;
              var knowledge = item.knowledge;
              var skill = item.skill;
              var disciplineBlockId = item.disciplineBlockId;
              var yearData = [];
              var courses = [];   
              var nameFull = item.nameFull;           

              var pictures;
              if (item.pictures !== null) {
                pictures = "data:image/jpeg;base64," + item.pictures;
              }

              
              for (var i=0; i<item.courses.length; i++){
                for (var j=1; j<7; j++) {
                  if (j==item.courses[i]) {
                    courses.push(j);
                    //console.log(j);
                  }
                }
              };


              
              item.disciplineBlockYear.forEach(function (item2, i, arr) {
                var studyYear = item2.studyYear;
                var maxCountStudent = item2.maxCountStudent;
                //var isApproved = item2.isApproved; 
                        
                var isApproved = $scope.showUaWords(item2);
                
                var idBlockYear = item2.id;
                yearData.push(new YearDataModel(studyYear, maxCountStudent, isApproved, idBlockYear)); //new add
              });

              $scope.alldisciplines.push(new DisciplinesModel(okr, blockName, nameUkr, countCredit, annotation, competence, knowledge, skill, pictures, yearData, disciplineBlockId, courses, nameFull));
              
            });

            
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
            $scope.CurrentData = {};

            $scope.getCurrentYearData = function (currentData) {
              $scope.CurrentYearData = currentData;
              $scope.CurrentData = currentData;
              
              //$scope.showUaWords($scope.CurrentYearData);
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

            $scope.testIsApproved = [
              {
                name: "так",
                status: false
              },
              {
                name: "ні",
                status: true
              },
              {
                name: "не визначено",
                status: null
              }
            ];

            


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


            $scope.addProposition = function () {
              //show or hide adding row in the Proposition-table
              if (!ifWantToAddRowData) {
                $scope.insertedProposition = {
                  okr: "",
                  blockName: "",
                  nameUkr: "",
                  countCredit: null,
                  annotation: "",
                  competence: "",
                  knowledge: "",
                  skill: "",
                  pictures: "",
                  yearData: "",
                  disciplineBlockId: ""
                };
                $scope.alldisciplines.unshift($scope.insertedProposition);
                //for (var i = 0; i < $scope.alldisciplines.length; i++) {
                //  console.log($scope.alldisciplines[i]);
                //}
                ifWantToAddRowData = true;
              }
            }

            $scope.addYear = function () {
              //objYear.studyYear.name
              if (!ifWantToAddRowData) {
                var currentYear = UniqueElemsInList.setCurrentYear($scope.tempListData.years);
                $scope.insertedYear = {
                  //studyYear: UniqueElemsInList.setCurrentYear($scope.tempListData.cdiscipleneblockyear8),
                  //studyYear: "",
                  studyYear: {
                    name: currentYear.name  //cdiscipleneblockyear8)
                  },
                  maxCountStudent: "",
                  isApproved: "",
                  idBlockYear: ""
                };
                $scope.CurrentYearData.yearData.unshift($scope.insertedYear);
                ifWantToAddRowData = true;
                console.log("$scope.insertedYear");
                console.log($scope.insertedYear);
              }
            }

            $scope.addPropositionOnStudyYear = function() {
              //$scope.studyYearData
              if (!ifWantToAddRowData) {
                $scope.insertedPropositionOnStudyYear = {
                  employee: {},
                  maxCountStudent: "",
                  isApproved: "",
                  nameFull: "",
                  idBlockYear: ""
                };
                $scope.studyYearData.unshift($scope.insertedPropositionOnStudyYear);
                ifWantToAddRowData = true;
              }
            };

            $scope.saveProposition = function (data, proposition) {
              //data is what you are editing  (current row in the table). Variables with e-name.
              //duting editing it is another, check out and be careful

              //console.log("data and proposition");
              //console.log(data);
              //console.log(proposition);

              //console.log("data and proposition");
              //console.log(data);
              //console.log(proposition);
              /*for (var i = 0; i < $scope.alldisciplines.length; i++) {
                if (($scope.alldisciplines[i].okr == data.okr) && ($scope.alldisciplines[i].blockName == data.blockName) && ($scope.alldisciplines[i].nameUkr == data.nameUkr)) {
                  console.log("повтор");
                  $scope.SendSubdivisionToServer();
                  return;
                }
              }*/
              var url = "SelectiveDiscipline/BlocksDispline";
              var method = "";
              var BlockId = getBlockIdByName($scope.tempListData.dcBlock8, data.blockName),
                DisciplineId = getDisciplineIdByName($scope.tempListData.dcDiscipline8, data.nameUkr),
                DcOKRId = getOkrIdByName($scope.tempListData.okr, data.okr),
                DcSubdivisionWhoId = $scope.selectedDiscipline.id,
                Knowledge = proposition.knowledge,
                Competence = proposition.competence,
                Skill = proposition.skill,
                Annotation = proposition.annotation,
                Picture = "",
                CountCredit = data.countCredit,
                disciplineBlockId = proposition.disciplineBlockId,
                Course1 = true,
                Course2 = true,
                Course3 = true,
                Course4 = true,
                Course5 = true,
                Course6 = true;


                //console.log($scope.user.status);
                //console.log(data);
                //console.log(data.courses);
                /*for (var key in proposition) {
                    console.log( "Ключ: " + key + " значение: " + proposition[key] );
                    if (key == "courses") {
                      for (var i=0; i< key.length; i++){
                        console.log(key[i]);  
                      }
                      
                    }
                }*/
                //arr.forEach(function(item, i, arr) {
                //  alert( i + ": " + item + " (массив:" + arr + ")" );
                //});
                //console.log(proposition.courses.length);
                //console.log(proposition.courses["0"]);
                //console.log(proposition.courses[1]);
                //console.log("editable courses");
                
                //console.log("new varianttt");
                //console.log(proposition.courses.0);
                //console.log(proposition.courses.1);
                

                //console.log(data.courses);
                for (var i=0; i<7; i++) {
                  //console.log(proposition.courses.indexOf(i));
                  //console.log(data.courses[i]);
                  switch (data.courses[i]) {
                    case 1:
                      Course1 = false;
                      break;
                    case 2:
                      Course2 = false;
                      break;
                    case 3:
                      Course3 = false;
                      break;
                    case 4:
                      Course4 = false;
                      break;
                    case 5:
                      Course5 = false;
                      break;
                    case 6:
                      Course6 = false;
                      break;
                  };
                }

              if (proposition.pictures) {
                Picture = proposition.pictures.substring(23);
              }

              if (proposition.disciplineBlockId) {
                url = url + "/" + proposition.disciplineBlockId;
                method = "PUT";
              }
              else {
                method = "POST";
                Knowledge = null;
                Competence = null;
                Skill = null;
                Annotation = null;
                //Picture = "";
              }
              var newRowProposition = new PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId, Course1, Course2, Course3, Course4, Course5, Course6);
              console.log(url);
              console.log(newRowProposition);

              Api.execute(method, url, newRowProposition)
                .then(function (response) {
                  console.log("ok");
                  console.log(response);
                  $scope.SendSubdivisionToServer();
                }, function (response) {
                  console.log("not ok!!!");
                  console.log(response);
                });
              console.log("disciplineBlockId");
              console.log(disciplineBlockId);

              ifWantToAddRowData = false;
            }

            $scope.saveYear = function (data, year) {
              console.log("data and year");
              console.log(data);
              console.log(year);
              var url = "SelectiveDiscipline/BlocksDisplineYear";
              var method = "";
              console.log("data.studyYear");
              console.log(data.studyYear);
              var //$scope.CurrentYearData.disciplineBlockId,
                //cDisciplineBlock8Id
                StudyYear = {},
                MaxCountStudent = data.maxCountStudent,
                IsApproved = getApprovedByName($scope.testIsApproved, data.isApproved),
                DisciplineBlock8Id;
              if ($scope.sectionMenu == "studyYearMenu") {
                //DisciplineBlock8Id = $scope.alldisciplines.disciplineBlockId;
                DisciplineBlock8Id = getDisciplineBlockIdByFullName($scope.forSelectFullname, data.nameFull);
                // getDisciplineIdByName($scope.tempListData.dcDiscipline8, data.nameUkr),
                StudyYear.Name = $scope.selectedYear.name;
              }
              else {
                DisciplineBlock8Id = $scope.CurrentYearData.disciplineBlockId;
                StudyYear.Name = data.studyYear;
              }
              
              //DcSubdivisionWhoId = $scope.selectedDiscipline.id,
              //$scope.CurrentYearData.disciplineBlockId;
              
              var newRowYear = new YearModel(StudyYear, MaxCountStudent, IsApproved, DisciplineBlock8Id);
              console.log("newRowYear");
              console.log(newRowYear);
              
              
              if (year.idBlockYear) {
                //url = url + "/" + $scope.CurrentYearData.disciplineBlockId;
                method = "PUT";
                url = url + "/" + year.idBlockYear;
              }
              else {
                method = "POST";
              }
              console.log(method);
              console.log(url);

              Api.execute(method, url, newRowYear)
                .then(function (response) {
                  console.log("ok");
                  console.log(response);
                  $('#ModalTableApproved').modal('hide');
                  //$scope.sectionMenu = "generalListMenu";
                  $scope.SendSubdivisionToServer();
                  $scope.initializeStudyYear();
                }, function (response) {
                  console.log("not ok!!!");
                  console.log(response);
                });

              ifWantToAddRowData = false;

            }            

            $scope.removeProposition = function (proposition) {
              
              if (confirm("Ви впеврені що хочете видалити цю пропозицію?")) {
                var url = "SelectiveDiscipline/BlocksDispline/" + proposition.disciplineBlockId;
                var method = "DELETE";
                Api.execute(method, url)
                  .then(function (response) {                    
                    console.log(response);
                    $scope.SendSubdivisionToServer();
                  }, function (response) {                    
                    console.log(response);
                  });                
              }
            }

            $scope.removeYear = function (year) {              
              if (confirm("Ви впеврені що хочете видалити дані про поточний рік?")) {
                var url = "SelectiveDiscipline/BlocksDisplineYear/" + year.idBlockYear;
                var method = "DELETE";
                Api.execute(method, url)
                  .then(function (response) {                    
                    console.log(response);
                    $('#ModalTableApproved').modal('hide');
                    $scope.SendSubdivisionToServer();
                  }, function (response) {                    
                    console.log(response);
                  });                
              }
            }

            $scope.removePropositionOnStudyYear = function(proposition) {
              if (confirm("Ви впеврені що хочете видалити дані про поточну пропозицію?")) {
                var url = "SelectiveDiscipline/BlocksDisplineYear/" + getDisciplineBlockIdByFullName($scope.forSelectFullname, proposition.nameFull);

                var method = "DELETE";
                Api.execute(method, url)
                  .then(function (response) {                    
                    console.log(response);                    
                    $scope.SendSubdivisionToServer();
                    $scope.initializeStudyYear();
                  }, function (response) {                    
                    console.log(response);
                  });               
              }
            }

            $scope.addDescription = function () {

              var BlockId = getBlockIdByName($scope.tempListData.dcBlock8, $scope.CurrentYearData.blockName),
                DisciplineId = getDisciplineIdByName($scope.tempListData.dcDiscipline8, $scope.CurrentYearData.nameUkr),
                DcOKRId = getOkrIdByName($scope.tempListData.okr, $scope.CurrentYearData.okr),
                DcSubdivisionWhoId = $scope.selectedDiscipline.id,
                Knowledge = $scope.CurrentYearData.knowledge,
                Competence = $scope.CurrentYearData.competence,
                Skill = $scope.CurrentYearData.skill,
                Annotation = $scope.CurrentYearData.annotation,
                CountCredit = $scope.CurrentYearData.countCredit,
                Picture = $scope.newData.Images,
                //$scope.newData.Images;
                disciplineBlockId = $scope.CurrentYearData.disciplineBlockId,
                Course1 = true,
                Course2 = true,
                Course3 = true,
                Course4 = true,
                Course5 = true,
                Course6 = true;

                for (var i=0; i<7; i++) {
                  switch ($scope.CurrentYearData.courses[i]) {
                    case 1:
                      Course1 = false;
                      break;
                    case 2:
                      Course2 = false;
                      break;
                    case 3:
                      Course3 = false;
                      break;
                    case 4:
                      Course4 = false;
                      break;
                    case 5:
                      Course5 = false;
                      break;
                    case 6:
                      Course6 = false;
                      break;
                  };
                }
                

              var editedRowProposition = new PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId, Course1, Course2, Course3, Course4, Course5, Course6);

              

              var method = "PUT";
              var url = "SelectiveDiscipline/BlocksDispline/" + $scope.CurrentYearData.disciplineBlockId;

              Api.execute(method, url, editedRowProposition)
                .then(function (response) {
                  
                  console.log(response);
                  $('#ModalAdditionalInfo').modal('hide');
                  $scope.SendSubdivisionToServer();
                }, function (response) {
                  
                  console.log(response);
                });
            }

            var getOkrIdByName = function (okrList, okrName) {
              var okrId = "";
              okrList.forEach(function (item, iter, arr) {
                if (item.name == okrName) {
                  okrId = item.id;
                }
              });
              return okrId;
            }

            var getBlockIdByName = function (blockList, blockName) {
              var blockId = "";
              blockList.forEach(function (item, iter, arr) {
                if (item.name == blockName) {
                  blockId = item.id;
                }
              });
              return blockId;
            }

            var getDisciplineIdByName = function (disciplineList, disciplineName) {
              var disciplineId = "";
              disciplineList.forEach(function (item, iter, arr) {
                if (item.name == disciplineName) {
                  disciplineId = item.id;
                }
              });
              return disciplineId;
            }

            var getApprovedByName = function (approveList, approveName) {
              var approveStatus = "";
              approveList.forEach(function (item, iter, arr) {
                if (item.name == approveName) {
                  approveStatus = item.status;
                }
              });
              return approveStatus;
            }

            var getDisciplineBlockIdByFullName = function (disciplineBlockList, disciplineBlockName) {
              var disciplineBlockId = "";
              disciplineBlockList.forEach(function (item, iter, arr) {
                if (item.nameFull == disciplineBlockName) {
                  disciplineBlockId = item.DisciplineBlock8Id;
                }
              });
              return disciplineBlockId;
            }


            $scope.fileNameChanged1 = function () {
              console.log("select file");
            }

            $scope.editRowFromTable = function (objToEdit) {
              $scope.newData = objToEdit;    

              for (var i = 0; i < $scope.tempListData.allOkr.length; i++) {

                if ($scope.newData.okr == $scope.tempListData.allOkr[i].currentOkr) {
                  
                  $scope.CurrOkr = $scope.tempListData.allOkr[i].currentOkr;
                }
              }

            }

            $scope.functionOkr = function () {
              $scope.newData.DcOKRId = $scope.CurrOkr.currentOkrId;
              
            }


            $scope.sendToServer = function () {
              //$scope.loader = true;
              $scope.newData.countCredit = parseInt($scope.newData.countCredit);
              //var data = angular.toJson($scope.newData);
              var data = $scope.newData;
              
              var config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };
              var url = "SelectiveDiscipline/BlocksDispline";          

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


            };

          },
          function (response) {
            
            $scope.alldisciplines = null;
          }
        );
    };

    $scope.ifCathedraAndYearChosen = function() {          
      var currCathedra = $scope.selectedDiscipline;
      var currYear = $scope.selectedYear;
      if ((currYear!==null)&&(currYear!==undefined)&&(currCathedra!==undefined)) {
        return true;
      }
      else {        
        return false;
      }
    };

    $scope.initializeStudyYear = function() {
      var method = "GET",
          url = "SelectiveDiscipline/DisciplineEmployee";
          //{Id}/{studyyear}"
      if ($scope.ifCathedraAndYearChosen()) {
        url = url + "/" + $scope.selectedDiscipline.id + "/" + $scope.selectedYear.name;
        
        Api.execute(method, url)
        .then(function (response) {
          $scope.studyYearData = response;
          for (var i=0; i<$scope.studyYearData.length; i++){
            $scope.studyYearData[i].isApproved = $scope.showUaWords($scope.studyYearData[i]);
          }          
          console.log("$scope.studyYearData idBlockYear");
          console.log($scope.studyYearData);
        }, function (response) {
          
          
        }); 
      }
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

    function DisciplinesModel(okr, blockName, nameUkr, countCredit, annotation, competence, knowledge, skill, pictures, yearData, disciplineBlockId, courses, nameFull) {
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
      this.disciplineBlockId = disciplineBlockId;
      this.courses = courses;
      this.nameFull = nameFull;
    }

    function YearDataModel(studyYear, maxCountStudent, isApproved, idBlockYear) {
      this.studyYear = studyYear;
      this.maxCountStudent = maxCountStudent;
      this.isApproved = isApproved;
      this.idBlockYear = idBlockYear;
    }

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

    function PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId, Course1, Course2, Course3, Course4, Course5, Course6) {
      this.BlockId = BlockId;
      this.DisciplineId = DisciplineId;
      this.DcOKRId = DcOKRId;
      this.DcSubdivisionWhoId = DcSubdivisionWhoId;
      this.Knowledge = Knowledge;
      this.Competence = Competence;
      this.Skill = Skill;
      this.Annotation = Annotation;
      this.CountCredit = CountCredit;
      this.Picture = Picture;
      if (disciplineBlockId != "") {
        this.disciplineBlockId = disciplineBlockId;
      }
      this.Course1 = Course1;
      this.Course2 = Course2;
      this.Course3 = Course3;
      this.Course4 = Course4;
      this.Course5 = Course5;
      this.Course6 = Course6;
    }

    function YearModel(StudyYear, MaxCountStudent, IsApproved, DisciplineBlock8Id) {
      this.StudyYear = StudyYear;
      this.MaxCountStudent = MaxCountStudent;
      this.IsApproved = IsApproved;
      this.DisciplineBlock8Id = DisciplineBlock8Id;
    }

    function YearListModel(name) {
      this.name = name;
    }

    function forSelectFullnameModel(nameFull, DisciplineBlock8Id) {
      this.nameFull = nameFull;
      this.DisciplineBlock8Id = DisciplineBlock8Id;
    }



    //var ifItIsAllowed = false; ok it works
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }

          function reload() {
            if (!!Api.getToken()) {
                var sClaim = Api.decodeToken(Api.getToken());

                if (!!sClaim) {
                    sClaim = JSON.parse(sClaim);
                }
                                
                var path = "Attestation/studyYear";
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль, роки  у базі даних відсутні.";
                    } else {
                        //response.sort(compareYearsActuality);
                        //$scope.stydyYearsAttest = response;
                        

                        $scope.tempListData.years = response;

                        for (var i = 0; i < $scope.tempListData.years.length; i++) {
                          console.log($scope.tempListData.years[i].name);
                        }        

                        $scope.selectedYear = UniqueElemsInList.setCurrentYear($scope.tempListData.years);                
                        //$scope.selectedYear = $scope.tempListData.years[4];                                        
                        
                        //$scope.selectData.StudyYear = $scope.stydyYears[response.length-1].name;
                    }                    
                },function(response, status,headers){

                });                
            }
        }

        



    function handleFileSelect(evt) {
      var files = evt.target.files;
      $scope.currImgFormat = files[0].type;
      //h('image.*')
      if (((files[0].type == "image/png") || (files[0].type == "image/jpeg") || (files[0].type == "image/gif")) && (files[0].size < 65535)) {
        var reader = new FileReader();
        console.log("img is ok");
        //console.log(files[0].type);

        reader.onload = (function (theFile) {
          return function (e) {

            var currImg = document.getElementById('preview');
            currImg.src = e.target.result;
            //console.log(currImg.src);
            $scope.newData.Images = currImg.src.substring(23); //without data:image/jpeg;base64, part at the beginning
            currImg.title = escape(theFile.name);

          };
        })(files[0]);

        reader.readAsDataURL(files[0]);
      }
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);


  });



