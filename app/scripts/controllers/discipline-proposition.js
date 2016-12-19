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

    var getDataSelectBoxes = function() {
              var url = "SelectiveDiscipline/ForDisciplineOffer";
              var studyYears = UniqueElemsInList.getStudyYearsArray(studyYearFrom, studyYearTo);

              Api.execute("GET", url)
              .then(function (response) {
                
                $scope.tempListData = response;
                
                //for (var i=0; i<$scope.tempListData.okr.length; i++){
                //  console.log($scope.tempListData.okr[i].name);  
                //}
                $scope.tempListData.customYears = [];
                //$scope.tempListData.push(customYears);
                for (var i = 0; i < studyYears.length; i++) {
                  $scope.tempListData.customYears.push(new YearListModel(studyYears[i]));
                }

              }, function (response) {

          $scope.tempListData = response;

          for (var i = 0; i < $scope.tempListData.okr.length; i++) {
            console.log($scope.tempListData.okr[i].name);
          }

          for (var i = 0; i < $scope.tempListData.dcBlock8.length; i++) {
            console.log($scope.tempListData.dcBlock8[i].name);
          }

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
        return "Заполніть це поле!";
      }
    };

    $scope.checkYearForm = function (data) {
      for (var i = 0; i < $scope.CurrentYearData.yearData.length; i++){
        if (data == $scope.CurrentYearData.yearData[i].studyYear.name) {
          return "Такі дані вже існують";
        }        
      }
      if (data == null || data == "") {
        return "Заполніть це поле!";
      }
    };

    $scope.SendSubdivisionToServer = function () {

      $scope.alldisciplines = [];
      console.log($scope.selectedDiscipline.id);
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

              var pictures;
              if (item.pictures !== null) {
                pictures = "data:image/jpeg;base64," + item.pictures;
              }

              item.disciplineBlockYear.forEach(function (item2, i, arr) {
                var studyYear = item2.studyYear;
                var maxCountStudent = item2.maxCountStudent;
                var isApproved = item2.isApproved;
                var disciplineBlockYearId = item2.disciplineBlockYearId;
                yearData.push(new YearDataModel(studyYear, maxCountStudent, isApproved, disciplineBlockYearId)); //new add
              });

              $scope.alldisciplines.push(new DisciplinesModel(okr, blockName, nameUkr, countCredit, annotation, competence, knowledge, skill, pictures, yearData, disciplineBlockId));
              console.log($scope.alldisciplines);
            });

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
            $scope.CurrentData = {};

            $scope.getCurrentYearData = function (currentData) {
              $scope.CurrentYearData = currentData;
              $scope.CurrentData = currentData;
              console.log("currentyeardata:");
              console.log($scope.CurrentYearData);
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

            $scope.showUaWords = function (current) {
              console.log("testing view");

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
            }


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
                $scope.insertedYear = {
                  //studyYear: UniqueElemsInList.setCurrentYear($scope.tempListData.cdiscipleneblockyear8),
                  //studyYear: "",
                  studyYear: {
                    name: UniqueElemsInList.setCurrentYear($scope.tempListData.cdiscipleneblockyear8)
                  },
                  maxCountStudent: "",
                  isApproved: "",
                  disciplineBlockYearId: ""
                };
                $scope.CurrentYearData.yearData.unshift($scope.insertedYear);
                ifWantToAddRowData = true;
              }
            }

            $scope.saveProposition = function (data, proposition) {
              console.log("data and proposition");
              console.log(data);
              console.log(proposition);
              for (var i = 0; i < $scope.alldisciplines.length; i++) {
                if (($scope.alldisciplines[i].okr==data.okr)&&($scope.alldisciplines[i].blockName==data.blockName)&&($scope.alldisciplines[i].nameUkr==data.nameUkr)) {
                  console.log("повтор");
                  $scope.SendSubdivisionToServer();
                  return;
                }
              }
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
                  disciplineBlockId = proposition.disciplineBlockId;
              
              if (proposition.pictures) {
                Picture = proposition.pictures.substring(23);
              }  

              if (proposition.disciplineBlockId){
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
              var newRowProposition = new PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId);
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
              var //disciplineBlockYearId = year.disciplineBlockYearId,
                //$scope.CurrentYearData.disciplineBlockId,
                //cDisciplineBlock8Id
                StudyYear = {},
                MaxCountStudent = data.maxCountStudent,
                IsApproved = getApprovedByName($scope.testIsApproved, data.isApproved),
                DisciplineBlock8Id = $scope.CurrentYearData.disciplineBlockId;
              //DcSubdivisionWhoId = $scope.selectedDiscipline.id,
              //$scope.CurrentYearData.disciplineBlockId;
              StudyYear.Name = data.studyYear;
              var newRowYear = new YearModel(StudyYear, MaxCountStudent, IsApproved, DisciplineBlock8Id);
              console.log("newRowYear");
              console.log(newRowYear);
              //console.log("newRowYear.disciplineBlockYearId");
              //console.log(newRowYear.disciplineBlockYearId);
              if (year.disciplineBlockYearId) {
                //url = url + "/" + $scope.CurrentYearData.disciplineBlockId;
                method = "PUT";
                url = url + "/" + year.disciplineBlockYearId;
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
                  $scope.SendSubdivisionToServer();
                }, function (response) {
                  console.log("not ok!!!");
                  console.log(response);
                });

              ifWantToAddRowData = false;

            }

            $scope.removeProposition = function (proposition) {
              //console.log(url);
              if (confirm("Ви впеврені що хочете видалити цю пропозицію?")) {
                var url = "SelectiveDiscipline/BlocksDispline/" + proposition.disciplineBlockId;
                var method = "DELETE";
                Api.execute(method, url)
                  .then(function (response) {
                    console.log("deleted!");
                    console.log(response);
                    $scope.SendSubdivisionToServer();
                  }, function (response) {
                    console.log("cauldn't delete!");
                    console.log(response);
                  });
                console.log(url);
              }
            }

            $scope.removeYear = function (year) {
              console.log(year.disciplineBlockYearId);
              //console.log(url);
              if (confirm("Ви впеврені що хочете видалити дані про поточний рік?")) {
                var url = "SelectiveDiscipline/BlocksDisplineYear/" + year.disciplineBlockYearId;
                var method = "DELETE";
                Api.execute(method, url)
                  .then(function (response) {
                    console.log("deleted!");
                    console.log(response);
                    $('#ModalTableApproved').modal('hide');
                    $scope.SendSubdivisionToServer();
                  }, function (response) {
                    console.log("cauldn't delete!");
                    console.log(response);
                  });
                console.log(url);
              }
            }

            $scope.addDescription = function () {

              console.log("after");
              console.log($scope.CurrentYearData);


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
                disciplineBlockId = $scope.CurrentYearData.disciplineBlockId;

              var editedRowProposition = new PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId);

              console.log(editedRowProposition);

              var method = "PUT";
              var url = "SelectiveDiscipline/BlocksDispline/" + $scope.CurrentYearData.disciplineBlockId;

              Api.execute(method, url, editedRowProposition)
                .then(function (response) {
                  console.log("ok");
                  console.log(response);
                  $('#ModalAdditionalInfo').modal('hide');
                  $scope.SendSubdivisionToServer();
                }, function (response) {
                  console.log("not ok!!!");
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


            $scope.fileNameChanged1 = function () {
              console.log("select file");
            }

            $scope.editRowFromTable = function (objToEdit) {
              $scope.newData = objToEdit;
              //console.log("$scope.newData:");
              //console.log($scope.newData.DcOKRId);
              console.log("$scope.newData.okr");
              console.log($scope.newData.okr);
              console.log("CurrOkr:");
              console.log($scope.CurrOkr);
              console.log("go:")

              for (var i = 0; i < $scope.tempListData.allOkr.length; i++) {

                if ($scope.newData.okr == $scope.tempListData.allOkr[i].currentOkr) {
                  console.log($scope.tempListData.allOkr[i].currentOkr);
                  $scope.CurrOkr = $scope.tempListData.allOkr[i].currentOkr;
                }
              }
              console.log("CurrOkr2:");
              console.log($scope.CurrOkr);
              console.log($scope.newData);
            }

            $scope.functionOkr = function () {
              $scope.newData.DcOKRId = $scope.CurrOkr.currentOkrId;
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


            };

          },
          function (response) {
            console.log("whooops");
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

    function DisciplinesModel(okr, blockName, nameUkr, countCredit, annotation, competence, knowledge, skill, pictures, yearData, disciplineBlockId) {
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
    }

    function YearDataModel(studyYear, maxCountStudent, isApproved, disciplineBlockYearId) {
      this.studyYear = studyYear;
      this.maxCountStudent = maxCountStudent;
      this.isApproved = isApproved;
      this.disciplineBlockYearId = disciplineBlockYearId;
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

    function PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId) {
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



