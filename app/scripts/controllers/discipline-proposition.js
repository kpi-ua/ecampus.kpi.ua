'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesPropositionCtrl
 * @description
 * # DisciplinesPropositionCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })
  .controller('DisciplinesPropositionCtrl', function($scope, $window, $http, Api, UniqueElemsInList, $timeout, $filter) {
    var ifWantToAddRowData = false;
    var studyYearFrom = 2013;
    var studyYearTo = 2020;
    $scope.sortName = 'nameUkr';
    $scope.sortReverse = false;
    $scope.sectionMenu = 'generalListMenu'; //studyYearMenu
    //$scope.tempListData = {};
    $scope.selectedYear = '2013-2014';
    $scope.forSelectFullNameNew = [];
    $scope.messageCurrent = '';


    $scope.allMessages = [
      'Дані було успішно збережено',
      'Видалення даних пройшло успішно'
    ];

    $scope.onSelected = function(selectedItem) {
      setTimeout(function() {
        $(':focus').blur();
      });
    };

    $scope.showTempData = function() {
    };

    $scope.saveLectureFromUiSelect = function(lecturer) {
      $scope.selectedLecturer = lecturer;
    };

    $scope.saveFullnameFromUiSelect = function(nameFull) {
      $scope.selectedNameFull = nameFull;
    };

    $scope.loadLecturers = function(namePattern) {
      if (namePattern.length > 2) {
        var url = 'account/employee/find/' + namePattern;
        // url + namePattern (3 first symbol of group)
        Api.execute('GET', url)
          .then(function(response) {
            $scope.errorMessageLecturers = '';
            $scope.lecturersList = response;
          }, function() {
            $scope.errorMessageLecturers = 'Не вдалося завантажити список груп';
            $scope.lecturersList = null;
          });
      } else {
        $scope.errorMessageLecturers = (
          'Введіть більше 3-х символів для пошуку викладача'
        );
      }
    };

    var separateFullname = function(fullName, field) {
      var keyWords = ['Назва: ', 'Освітній рівень: ', 'Викладає: '];
      var output = '';
      var pos1 = fullName.lastIndexOf(keyWords[field]) + keyWords[field].length;
      var pos2;

      if (field === 2) {
        pos2 = fullName.length;
      } else {
        pos2 = fullName.indexOf(keyWords[field + 1]) - 2;
      }

      for (var i = pos1; i < pos2; i++) {
        output += fullName[i];
      }
      return output;
    };

    $scope.SwitchSections = function(event) {
      $scope.sectionMenu = event.target.value;

      if ($scope.sectionMenu === 'studyYearMenu') {
        $scope.forSelectFullname = [];
        $scope.forSelectFullNameNew = [];
        var name, okr, cathedra, fullName, disciplineBlockId;
        var listOfFullnames = [], ifExist = false;

        var i, j;

        for (i = 0; i < $scope.alldisciplines.length; i++) {
          listOfFullnames.push($scope.alldisciplines[i].nameFull);
        }

        UniqueElemsInList.setData(listOfFullnames);
        listOfFullnames = UniqueElemsInList.getDataUnique();
        listOfFullnames.sort();

        // $scope.studyYearData[i].name = name;
        // $scope.studyYearData[i].okr = okr;
        // $scope.studyYearData[i].cathedra = cathedra;

        for (i = 0; i < listOfFullnames.length; i++) {
          ifExist = false;
          for (j = 0; j < $scope.alldisciplines.length; j++) {
            if (
              listOfFullnames[i] === $scope.alldisciplines[j].nameFull &&
              !ifExist
            ) {
              ifExist = true;

              name = separateFullname($scope.alldisciplines[j].nameFull, 0);
              okr = separateFullname($scope.alldisciplines[j].nameFull, 1);
              cathedra = separateFullname($scope.alldisciplines[j].nameFull, 2);
              fullName = $scope.alldisciplines[j].nameFull;
              disciplineBlockId = $scope.alldisciplines[j].disciplineBlockId;

              $scope.forSelectFullNameNew.push(new forSelectFullNameNewModel(name, okr, cathedra, fullName, disciplineBlockId));
              $scope.forSelectFullname.push(new forSelectFullnameModel($scope.alldisciplines[j].nameFull, $scope.alldisciplines[j].disciplineBlockId));
            }
          }
        }
      }
    };

    $scope.user = {
      status: [2, 3, 5]
    };

    $scope.statuses = [
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' },
      { value: 6, text: '6' }
    ];
    $scope.allCourses = [1, 2, 3, 4, 5, 6];

    $scope.allCourses2 = [
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' },
      { value: 6, text: '6' }
    ];

    $scope.allLecturers = [
      { name: 'Mr. One', id: 1 },
      { name: 'Mr. Two', id: 2 },
      { name: 'Mrs. Three', id: 3 }
    ];

    $scope.testLecturers = [
      { name: 'Mr. One', id: 1 },
      { name: 'Mr. Two', id: 2 }
    ];

    $scope.tempEmployeesData = [
      {
        employeeName: 'Захарченко  Валерій Никанорович',
        id: 1,
        studyYear: {
          isActual: false,
          name: '2016-2017',
          id: -1
        },
        maxCountStudent: 0,
        isApproved: null,
        actuality: true,
        changeDate: '2016-11-21 12-49-08',
        nameFull: 'Назва: Екологічні навчальні дисципліни; Екологічна безпека інженерної діяльності; Освітній рівень: Бакалавр; Викладає: Кафедра екології та технології рослинних полімерів ІХФ'
      },
      {
        employeeName: 'Цукор Валентина Семенівна',
        id: 2,
        studyYear: {
          isActual: false,
          name: '2016-2017',
          id: -1
        },
        maxCountStudent: 1000,
        isApproved: null,
        actuality: true,
        changeDate: '2016-11-21 12-49-08',
        nameFull: 'Назва: Екологічні навчальні дисципліни; Екологічна безпека інженерної діяльності; Освітній рівень: Бакалавр; Викладає: Кафедра екології та технології рослинних полімерів ІХФ'
      },
      {
        employeeName: 'Галанко Андрій Денисович',
        id: 3,
        studyYear: {
          isActual: false,
          name: '2016-2017',
          id: -1
        },
        maxCountStudent: 200,
        isApproved: null,
        actuality: true,
        changeDate: '2016-11-21 12-49-08',
        nameFull: 'Назва: Екологічні навчальні дисципліни; Екологічна безпека інженерної діяльності; Освітній рівень: Бакалавр; Викладає: Кафедра екології та технології рослинних полімерів ІХФ'
      }
    ];

    $scope.newSubmit = function(x) {
      //
    };

    $scope.showStatus = function(currentRow) {
      if (currentRow.courses) {
        return currentRow.courses.length ? currentRow.courses.join(', ') : 'не вказано';
      }
    };

    $scope.showTeachersList = function(currentTeachersList) {
      var output = '', sortedList = [];
      if (currentTeachersList.employee.length) {
        var i;
        for (i = 0; i < currentTeachersList.employee.length; i++) {
          sortedList.push(currentTeachersList.employee[i].name);
        }
        sortedList.sort();

        for (i = 0; i < sortedList.length; i++) {
          output += sortedList[i];
          if (i !== (sortedList.length - 1)) {
            output += ',\n';
          }
        }

        /*for (var i = 0; i < currentTeachersList.employee.length; i++) {
          output = output + currentTeachersList.employee[i].name
          if (i!=(currentTeachersList.employee.length-1)) {
            output = output + ', \n';
          }
        }*/
      }
      return output;
    };

    $scope.ifZeroInTable = function(currentObject, someValue) {
      return (currentObject !== null) ? currentObject[someValue] : 'не визначено2';
    };

    $scope.setColspan = function(colspan) {
      $scope.amountColspan = colspan;
    };

    var initialLoadCafedra = function() {

      //Api.execute('GET', 'SelectiveDiscipline/ActualCathedra')
      Api.execute('GET', 'Subdivision')
        .then(function(response) {
          $scope.allSubdivisions = [];
          $scope.alldisciplines = [];
          $scope.allSubdivisions = response;
          $scope.testLecturersShow = [];
        }, function(response) {
          $scope.allSubdivisions = [];
        });
    };

    var getDataSelectBoxes = function() {
      var url = 'SelectiveDiscipline/ForDisciplineOffer';

      Api.execute('GET', url)
        .then(function(response) {

          $scope.tempListData = response;
          $scope.tempListData.years = [];
          console.log('some promises');
          reload();
        }, function(response) {
          $scope.tempListData = response;
        }, function(response) {
        });
    };

    angular.element(document).ready(function() {
      initialLoadCafedra();
      getDataSelectBoxes();
    });

    $scope.checkProposForm = function(data) {
      if (data === null || data === '') {
        return 'Заповніть це поле!';
      }
    };

    $scope.checkYearForm = function(data) {
      if (data === null || data === '') {
        return 'Заповніть це поле!';
      }
    };

    $scope.showUaWords = function(current) {
      switch (current.isApproved) {
        case true: current.isApproved = 'так'; break;
        case false: current.isApproved = 'ні'; break;
        case null: current.isApproved = 'не визначено'; break;
      }
      return current.isApproved;
    };


    $scope.SendSubdivisionToServer = function() {

      $scope.alldisciplines = [];
      var data = $scope.selectedDiscipline.id;
      var url = 'SelectiveDiscipline/BlocksDispline/' + data;

      Api.execute('GET', url)
        .then(function(response) {
          response.forEach(function(item) {
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
              pictures = 'data:image/jpeg;base64,' + item.pictures;
            }

            for (var i = 0; i < item.courses.length; i++) {
              for (var j = 1; j < 7; j++) {
                if (j === item.courses[i]) {
                  courses.push(j);
                }
              }
            }

            item.disciplineBlockYear.forEach(function(item2) {
              var studyYear = item2.studyYear;
              var maxCountStudent = item2.maxCountStudent;
              // var isApproved = item2.isApproved;
              var isApproved = $scope.showUaWords(item2);
              var idBlockYear = item2.id;
              yearData.push(
                new YearDataModel(
                  studyYear, maxCountStudent, isApproved, idBlockYear
                )
              ); //new add
            });

            $scope.alldisciplines.push(
              new DisciplinesModel(
                okr, blockName, nameUkr, countCredit, annotation,
                competence, knowledge, skill, pictures, yearData,
                disciplineBlockId, courses, nameFull
              )
            );
          });

          $scope.ifSubdivChosen = function() {
            return Boolean($scope.alldisciplines);
          };

          $scope.sortBy = function(propertyName) {
            $scope.sortReverse = (
              $scope.sortName === propertyName ? !$scope.sortReverse : true
            );
            $scope.sortName = propertyName;
          };

          $scope.CurrentYearData = {};
          $scope.CurrentYearDataList = [];
          $scope.CurrentData = {}; //--------------------------------
          $scope.dataWithLecturers = {};

          $scope.getCurrentYearData = function(currentData) {
            $scope.CurrentYearData = currentData;
            $scope.CurrentData = currentData;
            // $scope.showUaWords($scope.CurrentYearData);
          };

          $scope.getCurrentDataWithLecturers = function(obj) {
            $scope.dataWithLecturers = obj;
          };

          $scope.tempListDataMax = {
            allYearsMax: [
              { currentYear: '2016-2017' },
              { currentYear: '2017-2018' },
              { currentYear: '2018-2019' }
            ],
            allApproves: [
              { currentApprove: '+' },
              { currentApprove: '-' },
              { currentApprove: '+/-' }
            ]

          };

          $scope.testIsApproved = [
            { name: 'так', status: false },
            { name: 'ні', status: true },
            { name: 'не визначено', status: null }
          ];

          $scope.newDataMax = {
            cDisciplineBlock8Id: '',
            StudyYear: '',
            MaxCountStudent: '',
            IsApproved: ''
          };

          $scope.newData = {
            DcOKRId: '',
            okr: '',
            DcBlock8Id: '',
            DcDiscipline8Id: '',
            DcSubdivisionWhoId: '10197',
            countCredit: null,
            Annotation: '',
            Competence: '',
            Knowledge: '',
            Skill: '',
            Images: ''
          };


          $scope.addProposition = function() {
            //show or hide adding row in the Proposition-table
            if (!ifWantToAddRowData) {
              if ($scope.sortReverse) {
                $scope.sortReverse = !$scope.sortReverse;
              }
              $scope.insertedProposition = {
                okr: '',
                blockName: '',
                nameUkr: '',
                countCredit: null,
                annotation: '',
                competence: '',
                knowledge: '',
                skill: '',
                pictures: '',
                yearData: '',
                disciplineBlockId: ''
              };

              $scope.alldisciplines.unshift($scope.insertedProposition);
              console.log('unshift: ', $scope.alldisciplines);
              /*if (!$scope.sortReverse) {
                $scope.alldisciplines.unshift($scope.insertedProposition);
                console.log('unshift: ', $scope.alldisciplines);
              } else {
                $scope.alldisciplines.push($scope.insertedProposition);
                console.log('push: ', $scope.alldisciplines);
              }*/
              ifWantToAddRowData = true;
            }
          };

          $scope.addYear = function() {
              //objYear.studyYear.name
            if (!ifWantToAddRowData) {
              if ($scope.sortReverse) {
                $scope.sortReverse = !$scope.sortReverse;
              }
              var currentYear = UniqueElemsInList.setCurrentYear($scope.tempListData.years);
              $scope.insertedYear = {
                // studyYear: UniqueElemsInList.setCurrentYear($scope.tempListData.cdiscipleneblockyear8),
                // studyYear: '',
                studyYear: {
                  name: currentYear.name  //cdiscipleneblockyear8)
                },
                maxCountStudent: '',
                isApproved: '',
                idBlockYear: ''
              };
              $scope.CurrentYearData.yearData.unshift($scope.insertedYear);
              ifWantToAddRowData = true;
            }
          };

          $scope.addPropositionOnStudyYear = function() {
            // $scope.studyYearData
            if (!ifWantToAddRowData) {
              if ($scope.sortReverse) {
                $scope.sortReverse = !$scope.sortReverse;
              }
              $scope.insertedPropositionOnStudyYear = {
                employee: {},
                maxCountStudent: '',
                isApproved: '',
                nameFull: '',
                idBlockYear: ''
              };
              $scope.studyYearData.unshift($scope.insertedPropositionOnStudyYear);
              ifWantToAddRowData = true;
            }
          };

          $scope.addLecturer = function() {
            if (!ifWantToAddRowData) {
              if ($scope.sortReverse) {
                $scope.sortReverse = !$scope.sortReverse;
              }
              $scope.insertedLecturer = {
                id: '',
                fullName: ''
              };
              $scope.dataWithLecturers.employee.unshift($scope.insertedLecturer);
              ifWantToAddRowData = true;
            }
          };

          var getBlockIdByName = function(blockList, blockName) {
            var blockId = '';
            blockList.forEach(function(item, iter, arr) {
              if (item.name === blockName) {
                blockId = item.id;
              }
            });
            return blockId;
          };

          $scope.saveProposition = function(data, proposition) {
            // data is what you are editing  (current row in the table). Variables with e-name.
            // duting editing it is another, check out and be careful
            console.log('data, proposition, $scope.newData.Images');
            console.log(data);
            console.log(proposition);
            console.log('ккк', $scope.newData.Images, 'ккк');
            var url = 'SelectiveDiscipline/BlocksDispline';
            var method = '';
            var BlockId = getBlockIdByName($scope.tempListData.dcBlock8, data.blockName);
            var DisciplineId = getDisciplineIdByName($scope.tempListData.dcDiscipline8, data.nameUkr);
            var DcOKRId = getOkrIdByName($scope.tempListData.okr, data.okr);
            var DcSubdivisionWhoId = $scope.selectedDiscipline.id;
            var Knowledge = proposition.knowledge;
            var Competence = proposition.competence;
            var Skill = proposition.skill;
            var Annotation = proposition.annotation;
            var Picture = '';
            var CountCredit = data.countCredit;
            var disciplineBlockId = proposition.disciplineBlockId;
            var Course1 = true;
            var Course2 = true;
            var Course3 = true;
            var Course4 = true;
            var Course5 = true;
            var Course6 = true;

            if (
              $scope.newData.Images !== '' &&
              $scope.newData.Images !== ' '
            ) {
              Picture = $scope.newData.Images;
              console.log('Picture = $scope.newData.Images;');
            } else if ($scope.newData.Images === ' ') {
              Picture = '';
              console.log('Picture = "";');
            } else if (
              proposition.pictures !== '' &&
              $scope.newData.Images === '' &&
              proposition.pictures
            ) {
              Picture = proposition.pictures.substring(23);
              console.log('Picture = proposition.pictures.substring(23);');
            }

            /*for (var key in proposition) {
                console.log( 'Ключ: ' + key + ' значение: ' + proposition[key] );
                if (key === 'courses') {
                  for (var i = 0; i < key.length; i++) {
                    console.log(key[i]);
                  }
                }
            }*/
            //arr.forEach(function(item, i, arr) {
            //  alert( i + ': ' + item + ' (массив:' + arr + ')' );
            //});

            var i;

            if (data.courses) {
              for (i = 0; i < 7; i++) {
                switch (data.courses[i]) {
                  case 1: Course1 = false; break;
                  case 2: Course2 = false; break;
                  case 3: Course3 = false; break;
                  case 4: Course4 = false; break;
                  case 5: Course5 = false; break;
                  case 6: Course6 = false; break;
                }
              }
            }

            if (proposition.disciplineBlockId) {
              url += '/' + proposition.disciplineBlockId;
              method = 'PUT';
            } else {
              method = 'POST';
              for (i = 0; i < $scope.alldisciplines.length; i++) {
                if (($scope.alldisciplines[i].okr === data.okr) && ($scope.alldisciplines[i].blockName === data.blockName) && ($scope.alldisciplines[i].nameUkr === data.nameUkr)) {
                  console.log('повтор');
                  $scope.reloadData();
                }
              }
              Knowledge = null;
              Competence = null;
              Skill = null;
              Annotation = null;
              //Picture = '';
            }
            var newRowProposition = new PropositionModel(BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId, Knowledge, Competence, Skill, Annotation, CountCredit, Picture, disciplineBlockId, Course1, Course2, Course3, Course4, Course5, Course6);

            console.log('newRowProposition - .', newRowProposition, '.');
            Api.execute(method, url, newRowProposition)
              .then(function(response) {
                console.log(response);
                $scope.SendSubdivisionToServer();
                $scope.newData.Images = '';
                $scope.messageCurrent = $scope.allMessages[0];
                $('#messageView').addClass('hideMessage');
              }, function(response) {
                console.log(response);
              });
            ifWantToAddRowData = false;
          };

          $scope.saveYear = function(data, year) {
            console.log('data selectedNameFull year');
            console.log(data);
            console.log($scope.selectedNameFull);
            console.log(year);
            var url = 'SelectiveDiscipline/BlocksDisplineYear';
            var method = '';
            var //$scope.CurrentYearData.disciplineBlockId,
                //cDisciplineBlock8Id
                StudyYear = {},
                MaxCountStudent = data.maxCountStudent,
                IsApproved = getApprovedByName($scope.testIsApproved, data.isApproved),
                DisciplineBlock8Id;
            if ($scope.sectionMenu === 'studyYearMenu') {
              if (($scope.selectedNameFull) && (!angular.equals($scope.selectedNameFull, {}))) {
                DisciplineBlock8Id = $scope.selectedNameFull.disciplineBlockId;
              } else {
                  //DisciplineBlock8Id = getDisciplineBlockIdByFullName($scope.forSelectFullNameNew, year.nameFull);
                DisciplineBlock8Id = year.id;
              }

                // getDisciplineIdByName($scope.tempListData.dcDiscipline8, data.nameUkr),
              StudyYear.Name = $scope.selectedYear.name;
            } else {
              DisciplineBlock8Id = $scope.CurrentYearData.disciplineBlockId;
              StudyYear.Name = data.studyYear;
            }

            // DcSubdivisionWhoId = $scope.selectedDiscipline.id,
            // $scope.CurrentYearData.disciplineBlockId;

            var newRowYear = new YearModel(StudyYear, MaxCountStudent, IsApproved, DisciplineBlock8Id);

            if (year.idBlockYear) {
              // url += '/' + $scope.CurrentYearData.disciplineBlockId;
              method = 'PUT';
              url += '/' + year.idBlockYear;
            } else {
              method = 'POST';
            }

            console.log('new checking obj before sending');
            console.log(newRowYear);
            console.log(url);

            Api.execute(method, url, newRowYear)
              .then(function(response) {
                console.log(response);
                $('#ModalTableApproved').modal('hide');
                  //$scope.sectionMenu = 'generalListMenu';
                $scope.selectedNameFull = {};
                $scope.SendSubdivisionToServer();
                $scope.initializeStudyYear();
              }, function(response) {
                console.log(response);
              });

            ifWantToAddRowData = false;
          };

          $scope.saveLector = function(teacher) {
            var method = 'PUT';
            var url = 'SelectiveDiscipline/DisciplineEmployee/';
            // + teacher.yeardata.idBlockYear + '/' + $scope.lecturer.id
            if (teacher.id === '') {
              method = 'POST';
              url += $scope.dataWithLecturers.idBlockYear + '/' + $scope.selectedLecturer.id;
            } else {
              url += teacher.id + '/' + $scope.selectedLecturer.id + '/' + $scope.dataWithLecturers.idBlockYear;
            }
            Api.execute(method, url)
              .then(function(response) {
                console.log(response);
                $('#ModalAddLecturer').modal('hide');
                $scope.selectedLecturer = {};
                $scope.SendSubdivisionToServer();
                $scope.initializeStudyYear();
              }, function(response) {
                console.log(response);
              });

            ifWantToAddRowData = false;
          };

          $scope.removeProposition = function(proposition) {
            if (confirm('Ви впеврені що хочете видалити цю пропозицію?')) {
              var url = 'SelectiveDiscipline/BlocksDispline/' + proposition.disciplineBlockId;
              var method = 'DELETE';
              Api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                  //$scope.SendSubdivisionToServer();
                  $scope.reloadData();
                  $scope.messageCurrent = $scope.allMessages[1];
                  $('#messageView').addClass('hideMessage');
                }, function(response) {
                  console.log(response);
                });
            }
          };

          $scope.removeYear = function(year) {
            if (confirm('Ви впеврені що хочете видалити дані про поточний рік?')) {
              var url = 'SelectiveDiscipline/BlocksDisplineYear/' + year.idBlockYear;
              var method = 'DELETE';
              Api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                    /*$('#ModalTableApproved').modal('hide');
                    $scope.SendSubdivisionToServer();*/
                  $scope.reloadData();
                }, function(response) {
                  console.log(response);
                });
            }
          };

          $scope.removePropositionOnStudyYear = function(proposition) {
            if (confirm('Ви впеврені що хочете видалити дані про поточну пропозицію?')) {
              var url = 'SelectiveDiscipline/BlocksDisplineYear/' + proposition.idBlockYear; //getDisciplineBlockIdByFullName($scope.forSelectFullname, proposition.nameFull);

              var method = 'DELETE';
              Api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                  $scope.reloadData();
                  //$scope.SendSubdivisionToServer();
                  //$scope.initializeStudyYear();
                }, function(response) {
                  console.log(response);
                });
            }
          };


          $scope.removeLecturer = function(lecturer) {
            if (confirm('Ви впеврені що хочете видалити дані про викладача?')) {
              var url = 'SelectiveDiscipline/DisciplineEmployee/' + lecturer.id;

              var method = 'DELETE';
              Api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                  $scope.reloadData();
                    /*$('#ModalAddLecturer').modal('hide');
                    $scope.SendSubdivisionToServer();
                    $scope.initializeStudyYear();*/
                }, function(response) {
                  console.log(response);
                });
            }
          };

          $scope.removeImg = function() {
            var currImg = document.getElementById('imgPreview' + $scope.idFilePreview);
            currImg.src = ' ';
            $scope.newData.Images = ' ';
          };

          $scope.addDescription = function() {

            var BlockId = getBlockIdByName(
              $scope.tempListData.dcBlock8,
              $scope.CurrentYearData.blockName
            );
            var DisciplineId = getDisciplineIdByName(
              $scope.tempListData.dcDiscipline8,
              $scope.CurrentYearData.nameUkr
            );
            var DcOKRId = getOkrIdByName(
              $scope.tempListData.okr,
              $scope.CurrentYearData.okr
            );
            var DcSubdivisionWhoId = $scope.selectedDiscipline.id;
            var Knowledge = $scope.CurrentYearData.knowledge;
            var Competence = $scope.CurrentYearData.competence;
            var Skill = $scope.CurrentYearData.skill;
            var Annotation = $scope.CurrentYearData.annotation;
            var CountCredit = $scope.CurrentYearData.countCredit;
            var Picture = $scope.newData.Images;
            // $scope.newData.Images;
            var disciplineBlockId = $scope.CurrentYearData.disciplineBlockId;
            var Course1 = true;
            var Course2 = true;
            var Course3 = true;
            var Course4 = true;
            var Course5 = true;
            var Course6 = true;

            for (var i = 0; i < 7; i++) {
              switch ($scope.CurrentYearData.courses[i]) {
                case 1: Course1 = false; break;
                case 2: Course2 = false; break;
                case 3: Course3 = false; break;
                case 4: Course4 = false; break;
                case 5: Course5 = false; break;
                case 6: Course6 = false; break;
              }
            }

            var editedRowProposition = new PropositionModel(
              BlockId, DisciplineId, DcOKRId, DcSubdivisionWhoId,
              Knowledge, Competence, Skill, Annotation, CountCredit,
              Picture, disciplineBlockId,
              Course1, Course2, Course3, Course4, Course5, Course6
            );

            var method = 'PUT';
            var url = (
              'SelectiveDiscipline/BlocksDispline/' +
              $scope.CurrentYearData.disciplineBlockId
            );

            Api.execute(method, url, editedRowProposition)
              .then(function(response) {
                console.log(response);
                $('#ModalAdditionalInfo').modal('hide');
                $scope.SendSubdivisionToServer();
              }, function(response) {
                console.log(response);
              });
          };

          var getOkrIdByName = function(okrList, okrName) {
            var okrId = '';
            okrList.forEach(function(item, iter, arr) {
              if (item.name === okrName) {
                okrId = item.id;
              }
            });
            return okrId;
          };


          var getDisciplineIdByName = function(disciplineList, disciplineName) {
            var disciplineId = '';
            disciplineList.forEach(function(item, iter, arr) {
              if (item.name === disciplineName) {
                disciplineId = item.id;
              }
            });
            return disciplineId;
          };

          var getApprovedByName = function(approveList, approveName) {
            var approveStatus = '';
            approveList.forEach(function(item, iter, arr) {
              if (item.name === approveName) {
                approveStatus = item.status;
              }
            });
            return approveStatus;
          };

          var getDisciplineBlockIdByFullName = function(
            disciplineBlockList,
            disciplineBlockName
          ) {
            var disciplineBlockId = '';
            for (var i = 0; i < disciplineBlockList.length; i++) {
              if (disciplineBlockList[i].fullName === disciplineBlockName) {
                disciplineBlockId = disciplineBlockList[i].disciplineBlockId;
              }
            }
            return disciplineBlockId;
          };

          $scope.fileNameChanged1 = function() {
            console.log('select file');
          };

          $scope.editRowFromTable = function(objToEdit) {
            $scope.newData = objToEdit;
            for (var i = 0; i < $scope.tempListData.allOkr.length; i++) {
              if (
                $scope.newData.okr === $scope.tempListData.allOkr[i].currentOkr
              ) {
                $scope.CurrOkr = $scope.tempListData.allOkr[i].currentOkr;
              }
            }
          };

          $scope.functionOkr = function() {
            $scope.newData.DcOKRId = $scope.CurrOkr.currentOkrId;
          };

          $scope.sendToServer = function() {
            //$scope.loader = true;
            $scope.newData.countCredit = parseInt($scope.newData.countCredit);
            //var data = angular.toJson($scope.newData);
            var data = $scope.newData;
            var config = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
            };
            var url = 'SelectiveDiscipline/BlocksDispline';

            $scope.newData = {
              DcOKRId: '',
              DcBlock8Id: '',
              DcDiscipline8Id: '',
              DcSubdivisionWhoId: '10197',
              countCredit: null,
              Annotation: '',
              Competence: '',
              Knowledge: '',
              Skill: '',
              Images: ''
            };

          };

        },
        function(response) {
          $scope.alldisciplines = null;
        }
      );
    };

    $scope.ifCathedraAndYearChosen = function() {
      var currCathedra = $scope.selectedDiscipline;
      var currYear = $scope.selectedYear;
      if (
        currYear !== null &&
        currYear !== undefined &&
        currCathedra !== undefined
      ) {
        return true;
      } else {
        return false;
      }
    };

    $scope.initializeStudyYear = function() {
      var method = 'GET';
      var url = 'SelectiveDiscipline/DisciplineEmployee';
      // {Id}/{studyyear}'
      if ($scope.ifCathedraAndYearChosen()) {
        url += (
          '/' + $scope.selectedDiscipline.id + '/' +
          $scope.selectedYear.name
        );
        Api.execute(method, url)
          .then(function(response) {
            $scope.studyYearData = response;
            $scope.selectedNamefull = {};

            for (var i = 0; i < $scope.studyYearData.length; i++) {
              $scope.studyYearData[i].isApproved = $scope.showUaWords(
                $scope.studyYearData[i]
              );
            }
            // for (var i = 0; i < $scope.forSelectFullNameNew.length; i++) {
            //   console.log($scope.forSelectFullNameNew);
            // }
          }, function(response) {
            //
          });
      }
    };


    $scope.reloadData = function() {
      $('#ModalAdditionalInfo').modal('hide');
      $('#ModalTableApproved').modal('hide');
      $('#ModalAddLecturer').modal('hide');
      ifWantToAddRowData = false;
      $scope.SendSubdivisionToServer();
      $scope.initializeStudyYear();
    };

    /* Control (integer + - adding) */
    $scope.MinusCred = function() {
      $scope.newData.countCredit = parseInt($scope.newData.countCredit);
      if ($scope.newData.countCredit !== 0) {
        $scope.newData.countCredit--;
        $('.btn-minuse').removeClass('disabled');
        $('.btn-pluss').removeClass('disabled');
      } else {
        $('.btn-minuse').addClass('disabled');
      }
    };

    $scope.PlusCred = function() {
      $scope.newData.countCredit = parseInt($scope.newData.countCredit);
      if ($scope.newData.countCredit !== 9) {
        $scope.newData.countCredit++;
        $('.btn-pluss').removeClass('disabled');
        $('.btn-minuse').removeClass('disabled');
      } else {
        $('.btn-pluss').addClass('disabled');
      }
    };

    var number = document.getElementById('newCred');

    number.onkeydown = function(e) {
      if (!(
        (e.keyCode > 95 && e.keyCode < 106) ||
        (e.keyCode > 47 && e.keyCode < 58) ||
        e.keyCode === 8
      )) {
        return false;
      }
    };

    function SubdivisionsModel(name, id) {
      this.name = name;
      this.id = id;
    }

    function DisciplinesModel(
      okr,
      blockName,
      nameUkr,
      countCredit,
      annotation,
      competence,
      knowledge,
      skill,
      pictures,
      yearData,
      disciplineBlockId,
      courses,
      nameFull
    ) {
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

    function YearDataModel(
      studyYear,
      maxCountStudent,
      isApproved,
      idBlockYear
    ) {
      this.studyYear = studyYear;
      this.maxCountStudent = maxCountStudent;
      this.isApproved = isApproved;
      this.idBlockYear = idBlockYear;
    }

    function AllSelectData(
      allOkr,
      allBlocks,
      allDisciplines,
      allYears
    ) {
      this.allOkr = allOkr;
      this.allBlocks = allBlocks;
      this.allDisciplines = allDisciplines;
      this.allYears = allYears;
    }

    function AllOkrModel(
      currentOkr,
      currentOkrId
    ) {
      this.currentOkr = currentOkr;
      this.currentOkrId = currentOkrId;
    }

    function AllBlocksModel(
      currentBlock,
      currentBlockId
    ) {
      this.currentBlock = currentBlock;
      this.currentBlockId = currentBlockId;
    }

    function AllDisciplinesModel(
      currentDiscipline,
      currentDisciplineId
    ) {
      this.currentDiscipline = currentDiscipline;
      this.currentDisciplineId = currentDisciplineId;
    }

    function PropositionModel(
      BlockId,
      DisciplineId,
      DcOKRId,
      DcSubdivisionWhoId,
      Knowledge,
      Competence,
      Skill,
      Annotation,
      CountCredit,
      Picture,
      disciplineBlockId,
      Course1,
      Course2,
      Course3,
      Course4,
      Course5,
      Course6
    ) {
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
      if (disciplineBlockId !== '') {
        this.disciplineBlockId = disciplineBlockId;
      }
      this.Course1 = Course1;
      this.Course2 = Course2;
      this.Course3 = Course3;
      this.Course4 = Course4;
      this.Course5 = Course5;
      this.Course6 = Course6;
    }

    function YearModel(
      StudyYear,
      MaxCountStudent,
      IsApproved,
      DisciplineBlock8Id
    ) {
      this.StudyYear = StudyYear;
      this.MaxCountStudent = MaxCountStudent;
      this.IsApproved = IsApproved;
      this.DisciplineBlock8Id = DisciplineBlock8Id;
    }

    function YearListModel(name) {
      this.name = name;
    }

    function forSelectFullnameModel(
      nameFull,
      DisciplineBlock8Id
    ) {
      this.nameFull = nameFull;
      this.DisciplineBlock8Id = DisciplineBlock8Id;
    }

    function forSelectFullNameNewModel(
      name,
      okr,
      cathedra,
      fullName,
      disciplineBlockId
    ) {
      this.name = name;
      this.okr = okr;
      this.cathedra = cathedra;
      this.fullName = fullName;
      this.disciplineBlockId = disciplineBlockId;
    }

    //var ifItIsAllowed = false; ok it works
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }

    function reload() {
      if (Api.getToken()) {
        var sClaim = Api.decodeToken(Api.getToken());
        if (sClaim) {
          sClaim = JSON.parse(sClaim);
        }
        var path = 'Attestation/studyYear';
        Api.execute('GET', path).then(function(response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, роки  у базі даних відсутні.';
          } else {
            //response.sort(compareYearsActuality);
            //$scope.stydyYearsAttest = response;
            $scope.tempListData.years = response;
            $scope.selectedYear = UniqueElemsInList.setCurrentYear($scope.tempListData.years);
            //$scope.selectedYear = $scope.tempListData.years[4];
            //$scope.selectData.StudyYear = $scope.stydyYears[response.length-1].name;
          }
        }, function(response, status, headers) {
          //
        });
      }
    }

    $scope.makeEvent = function(id) {
      console.log('id', id);
      $scope.idFilePreview = id;
      document
        .getElementById('imgInp' + id)
        .addEventListener('change', handleFileSelect, false);
    };

    function handleFileSelect(evt) {
      var files = evt.target.files;
      $scope.currImgFormat = files[0].type;
      var currImg = document.getElementById('imgPreview' + $scope.idFilePreview);
      //h('image.*')
      if (
        (
          files[0].type === 'image/png' ||
          files[0].type === 'image/jpeg' ||
          files[0].type === 'image/gif'
        ) && files[0].size < 65535
      ) {
        var reader = new FileReader();
        console.log('img is ok');

        reader.onload = (function(theFile) {
          return function(e) {
            currImg.src = e.target.result;
            $scope.newData.Images = currImg.src.substring(23);
            //without data:image/jpeg;base64, part at the beginning
            currImg.title = escape(theFile.name);

          };
        })(files[0]);

        reader.readAsDataURL(files[0]);
      } else {
        console.log('img is not ok');
        $scope.newData.Images = '';
        currImg.src = ' ';
      }
    }

  });
