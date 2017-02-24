'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesPropositionCtrl
 * @description
 * # DisciplinesPropositionCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';    // bootstrap3 theme. Can be also 'bs2', 'default'
  })
  .controller('DisciplinesPropositionCtrl', DisciplinesPropositionCtrl);

DisciplinesPropositionCtrl.$inject = ['$scope', '$timeout', 'api', 'uniqueElemsInList']

function DisciplinesPropositionCtrl($scope, $timeout, api, uniqueElemsInList) {
  var ifWantToAddRowData = false;

  $scope.sortName = 'nameUkr';
  $scope.sortReverse = false;
  $scope.sectionMenu = 'generalListMenu'; //studyYearMenu

  $scope.selectedYear = '2013-2014';
  $scope.forSelectFullNameNew = [];
  $scope.messageCurrent = '';

  $scope.allMessages = [
    'Дані було успішно збережено',
    'Видалення даних пройшло успішно',
    'Не вдалося зберегти дані. Така інформація вже існує.',
    'Не вдалося зберегти дані. Перевірте коректність інформації та стан підключення до Інтернету.',
    'Не вдалося видалити дані. Перевірте стан підключення до Інтернету.'
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
    $scope.selectedNameFullEdited = 1;
  };

  $scope.loadLecturers = function(namePattern) {
    if (namePattern.length > 2) {
      var url = 'account/employee/find/' + namePattern;
      // url + namePattern (3 first symbol of group)
      api.execute('GET', url)
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
      var listOfFullnames = [];
      var ifExist = false;

      var i, j;

      for (i = 0; i < $scope.alldisciplines.length; i++) {
        listOfFullnames.push($scope.alldisciplines[i].nameFull);
      }

      uniqueElemsInList.setData(listOfFullnames);
      listOfFullnames = uniqueElemsInList.getDataUnique();
      listOfFullnames.sort();

      for (i = 0; i < listOfFullnames.length; i++) {
        ifExist = false;
        for (j = 0; j < $scope.alldisciplines.length; j++) {
          if (
            listOfFullnames[i] === $scope.alldisciplines[j].nameFull && !ifExist
          ) {
            ifExist = true;
            name = separateFullname($scope.alldisciplines[j].nameFull, 0);
            okr = separateFullname($scope.alldisciplines[j].nameFull, 1);
            cathedra = separateFullname($scope.alldisciplines[j].nameFull, 2);
            fullName = $scope.alldisciplines[j].nameFull;
            disciplineBlockId = $scope.alldisciplines[j].disciplineBlockId;

            $scope.forSelectFullNameNew.push(
              new ForSelectFullNameNewModel(
                name, okr, cathedra, fullName, disciplineBlockId
              )
            );
            $scope.forSelectFullname.push(
              new ForSelectFullnameModel(
                $scope.alldisciplines[j].nameFull,
                $scope.alldisciplines[j].disciplineBlockId
              )
            );
          }
        }
      }
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
  $scope.allCourses = [1, 2, 3, 4, 5, 6];

  $scope.allCourses2 = [
    {value: 1, text: '1'},
    {value: 2, text: '2'},
    {value: 3, text: '3'},
    {value: 4, text: '4'},
    {value: 5, text: '5'},
    {value: 6, text: '6'}
  ];

  $scope.allLecturers = [
    {name: 'Mr. One', id: 1},
    {name: 'Mr. Two', id: 2},
    {name: 'Mrs. Three', id: 3}
  ];

  $scope.testLecturers = [
    {name: 'Mr. One', id: 1},
    {name: 'Mr. Two', id: 2}
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
      return (
        currentRow.courses.length ?
          currentRow.courses.join(', ') : 'не вказано'
      );
    }
  };

  $scope.showTeachersList = function(currentTeachersList) {
    var output = '';
    var sortedList = [];
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
    return (
      (currentObject !== null) ?
        currentObject[someValue] : 'не визначено2'
    );
  };

  $scope.setColspan = function(colspan) {
    $scope.amountColspan = colspan;
  };

  var initialLoadCafedra = function() {

    //api.execute('GET', 'SelectiveDiscipline/ActualCathedra')
    api.execute('GET', 'Subdivision')
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

    api.execute('GET', url)
      .then(function(response) {
        $scope.tempListData = response;
        $scope.tempListData.years = [];
        console.log('some promises');
        reload();
      }, function(response) {
        $scope.tempListData = response;
      }, function(response) {
        //
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
      case true:
        current.isApproved = 'так';
        break;
      case false:
        current.isApproved = 'ні';
        break;
      case null:
        current.isApproved = 'не визначено';
        break;
    }
    return current.isApproved;
  };


  $scope.sendSubdivisionToServer = function() {

    $scope.alldisciplines = [];
    var data = $scope.selectedDiscipline.id;
    var url = 'SelectiveDiscipline/BlocksDispline/' + data;

    api.execute('GET', url)
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
            for (var i = 0; i < $scope.CurrentYearData.yearData.length; i++) {
              $scope.allYearsList.push(
                $scope.CurrentYearData.yearData[i].studyYear.name
              );
            }
            // $scope.showUaWords($scope.CurrentYearData);
          };

          $scope.getCurrentDataWithLecturers = function(obj) {
            $scope.dataWithLecturers = obj;
          };

          $scope.tempListDataMax = {
            allYearsMax: [
              {currentYear: '2016-2017'},
              {currentYear: '2017-2018'},
              {currentYear: '2018-2019'}
            ],
            allApproves: [
              {currentApprove: '+'},
              {currentApprove: '-'},
              {currentApprove: '+/-'}
            ]

          };

          $scope.testIsApproved = [
            {name: 'так', status: false},
            {name: 'ні', status: true},
            {name: 'не визначено', status: null}
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
            // show or hide adding row in the Proposition-table
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
              ifWantToAddRowData = true;
            }
          };

          $scope.addYear = function() {
            // objYear.studyYear.name
            if (!ifWantToAddRowData) {
              if ($scope.sortReverse) {
                $scope.sortReverse = !$scope.sortReverse;
              }
              var currentYear = uniqueElemsInList.setCurrentYear($scope.tempListData.years);
              $scope.insertedYear = {
                // studyYear: uniqueElemsInList.setCurrentYear($scope.tempListData.cdiscipleneblockyear8),
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
            // data is what you are editing  (current row in the table).
            // Variables with e-name.
            // duting editing it is another, check out and be careful
            console.log('data, proposition, $scope.newData.Images');
            console.log(data);
            console.log(proposition);
            console.log('ккк', $scope.newData.Images, 'ккк');
            var url = 'SelectiveDiscipline/BlocksDispline';
            var method = '';
            var blockId = getBlockIdByName(
              $scope.tempListData.dcBlock8,
              data.blockName
            );
            var disciplineId = getDisciplineIdByName(
              $scope.tempListData.dcDiscipline8,
              data.nameUkr
            );
            var dcOKRId = getOkrIdByName($scope.tempListData.okr, data.okr);
            var dcSubdivisionWhoId = $scope.selectedDiscipline.id;
            var knowledge = proposition.knowledge;
            var competence = proposition.competence;
            var skill = proposition.skill;
            var annotation = proposition.annotation;
            var picture = '';
            var countCredit = data.countCredit;
            var disciplineBlockId = proposition.disciplineBlockId;
            var course1 = true;
            var course2 = true;
            var course3 = true;
            var course4 = true;
            var course5 = true;
            var course6 = true;

            if (
              $scope.newData.Images !== '' &&
              $scope.newData.Images !== ' '
            ) {
              picture = $scope.newData.Images;
              console.log('Picture = $scope.newData.Images;');
            } else if ($scope.newData.Images === ' ') {
              picture = '';
              console.log('Picture = "";');
            } else if (
              proposition.pictures !== '' &&
              $scope.newData.Images === '' &&
              proposition.pictures
            ) {
              picture = proposition.pictures.substring(23);
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
                  case 1:
                    course1 = false;
                    break;
                  case 2:
                    course2 = false;
                    break;
                  case 3:
                    course3 = false;
                    break;
                  case 4:
                    course4 = false;
                    break;
                  case 5:
                    course5 = false;
                    break;
                  case 6:
                    course6 = false;
                    break;
                }
              }
            }

            if (proposition.disciplineBlockId) {
              url += '/' + proposition.disciplineBlockId;
              method = 'PUT';
            } else {
              method = 'POST';
              for (i = 0; i < $scope.alldisciplines.length; i++) {
                if (
                  $scope.alldisciplines[i].okr === data.okr &&
                  $scope.alldisciplines[i].blockName === data.blockName &&
                  $scope.alldisciplines[i].nameUkr === data.nameUkr
                ) {
                  console.log('повтор');
                  $scope.reloadData();
                  // $scope.addMessage(2);
                  return;
                }
              }
              knowledge = null;
              competence = null;
              skill = null;
              annotation = null;
              // picture = '';
            }
            var newRowProposition = new PropositionModel(
              blockId, disciplineId, dcOKRId, dcSubdivisionWhoId,
              knowledge, competence, skill, annotation, countCredit,
              picture, disciplineBlockId,
              course1, course2, course3, course4, course5, course6
            );

            console.log('newRowProposition - .', newRowProposition, '.');
            api.execute(method, url, newRowProposition)
              .then(function(response) {
                console.log(response);
                $scope.sendSubdivisionToServer();
                $scope.newData.Images = '';
                // $scope.addMessage(0);
                $scope.messageCurrent = $scope.allMessages[0];
                $('#messageView').addClass('hideMessage');
              }, function(response) {
                // $scope.addMessage(3);
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
            // var $scope.CurrentYearData.disciplineBlockId,
            // cDisciplineBlock8Id
            var studyYear = {};
            var maxCountStudent = data.maxCountStudent;
            var isApproved = getApprovedByName(
              $scope.testIsApproved,
              data.isApproved
            );
            var disciplineBlock8Id;
            if ($scope.sectionMenu === 'studyYearMenu') {
              if (
                $scope.selectedNameFull && !angular.equals($scope.selectedNameFull, {})
              ) {
                disciplineBlock8Id = $scope.selectedNameFull.disciplineBlockId;
              } else {
                // disciplineBlock8Id = getDisciplineBlockIdByFullName(
                //   $scope.forSelectFullNameNew, year.nameFull
                // );
                disciplineBlock8Id = year.id;
              }
              // getDisciplineIdByName(
              //   $scope.tempListData.dcDiscipline8,
              //   data.nameUkr
              // ),
              studyYear.Name = $scope.selectedYear.name;
            } else {
              disciplineBlock8Id = $scope.CurrentYearData.disciplineBlockId;
              studyYear.Name = data.studyYear;
            }

            // DcSubdivisionWhoId = $scope.selectedDiscipline.id,
            // $scope.CurrentYearData.disciplineBlockId;

            var newRowYear = new YearModel(
              studyYear,
              maxCountStudent,
              isApproved,
              disciplineBlock8Id
            );

            if (year.idBlockYear) {
              // url += '/' + $scope.CurrentYearData.disciplineBlockId;
              method = 'PUT';
              url += '/' + year.idBlockYear;
              if ($scope.sectionMenu != 'studyYearMenu') {
                for (var i = 0; i < $scope.allYearsList.length; i++) {
                  if (
                    data.studyYear === $scope.allYearsList[i] &&
                    data.studyYear != year.studyYear.name
                  ) {
                    $scope.reloadData();
                    // $scope.addMessage(2);
                    console.log('error while edit');
                    return;
                  }
                }
              } else {
                for (var i = 0; i < $scope.allDisciplinesList.length; i++) {
                  if ((DisciplineBlock8Id == $scope.allDisciplinesList[i]) && ($scope.selectedNameFullEdited == 1)) {
                    console.log(i, " ", $scope.selectedNameFullEdited);
                    $scope.reloadData();
                    //$scope.addMessage(2);
                    console.log("error while edit right");
                    return;
                  }
                }
              }
            } else {
              method = 'POST';
              if ($scope.sectionMenu !== 'studyYearMenu') {
                for (var i = 0; i < $scope.allYearsList.length; i++) {
                  if (data.studyYear === $scope.allYearsList[i]) {
                    $scope.reloadData();
                    // $scope.addMessage(2);
                    console.log('error while add');
                    return;
                  }
                }
              } else {
                for (var i = 0; i < $scope.allDisciplinesList.length; i++) {
                  console.log(
                    '$scope.allDisciplinesList[i]', $scope.allDisciplinesList[i]
                  );
                  console.log('DisciplineBlock8Id', DisciplineBlock8Id);
                  if (
                    DisciplineBlock8Id === $scope.allDisciplinesList[i] ||
                    $scope.selectedNameFullEdited !== 1
                  ) {
                    $scope.reloadData();
                    // $scope.addMessage(2);
                    console.log('error while add right');
                    return;
                  }
                }
              }
            }

            console.log('new checking obj before sending');
            console.log(newRowYear);
            console.log(url);

            api.execute(method, url, newRowYear)
              .then(function(response) {
                console.log(response);
                $('#ModalTableApproved').modal('hide');
                //$scope.sectionMenu = 'generalListMenu';
                $scope.selectedNameFull = {};
                $scope.sendSubdivisionToServer();
                $scope.initializeStudyYear();
                // $scope.addMessage(0);
                $scope.selectedNameFullEdited = 0;
              }, function(response) {
                // $scope.addMessage(3);
                $scope.selectedNameFullEdited = 0;
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
              url += (
                $scope.dataWithLecturers.idBlockYear + '/' +
                $scope.selectedLecturer.id
              );
            } else {
              url += (
                teacher.id + '/' + $scope.selectedLecturer.id +
                '/' + $scope.dataWithLecturers.idBlockYear
              );
            }
            api.execute(method, url)
              .then(function(response) {
                console.log(response);
                $('#ModalAddLecturer').modal('hide');
                $scope.selectedLecturer = {};
                $scope.sendSubdivisionToServer();
                $scope.initializeStudyYear();
                // $scope.addMessage(0);
              }, function(response) {
                // $scope.addMessage(3);
                console.log(response);
              });

            ifWantToAddRowData = false;
          };

          $scope.removeProposition = function(proposition) {
            if (confirm('Ви впеврені що хочете видалити цю пропозицію?')) {
              var url = (
                'SelectiveDiscipline/BlocksDispline/' +
                proposition.disciplineBlockId
              );
              var method = 'DELETE';
              api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                  // $scope.sendSubdivisionToServer();
                  $scope.reloadData();
                  // $scope.addMessage(1);
                }, function(response) {
                  console.log(response);
                });
            }
          };

          $scope.removeYear = function(year) {
            if (
              confirm('Ви впеврені що хочете видалити дані про поточний рік?')
            ) {
              var url = (
                'SelectiveDiscipline/BlocksDisplineYear/' +
                year.idBlockYear
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

          $scope.removePropositionOnStudyYear = function(proposition) {
            if (confirm(
                'Ви впеврені що хочете видалити дані про поточну пропозицію?'
              )) {
              var url = (
                'SelectiveDiscipline/BlocksDisplineYear/' +
                proposition.idBlockYear
              );
              // getDisciplineBlockIdByFullName(
              //   $scope.forSelectFullname,
              //   proposition.nameFull
              // );

              var method = 'DELETE';
              api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                  $scope.reloadData();
                  //$scope.sendSubdivisionToServer();
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
              api.execute(method, url)
                .then(function(response) {
                  console.log(response);
                  $scope.reloadData();
                  // $scope.addMessage(1);
                  // $('#ModalAddLecturer').modal('hide');
                  // $scope.sendSubdivisionToServer();
                  // $scope.initializeStudyYear();
                }, function(response) {
                  // $scope.addMessage(4);
                  console.log(response);
                });
            }
          };

          $scope.removeImg = function() {
            var currImg = document.getElementById(
              'imgPreview' + $scope.idFilePreview
            );
            currImg.src = ' ';
            $scope.newData.Images = ' ';
          };

          $scope.addDescription = function() {

            var blockId = getBlockIdByName(
              $scope.tempListData.dcBlock8,
              $scope.CurrentYearData.blockName
            );
            var disciplineId = getDisciplineIdByName(
              $scope.tempListData.dcDiscipline8,
              $scope.CurrentYearData.nameUkr
            );
            var dcOKRId = getOkrIdByName(
              $scope.tempListData.okr,
              $scope.CurrentYearData.okr
            );
            var dcSubdivisionWhoId = $scope.selectedDiscipline.id;
            var knowledge = $scope.CurrentYearData.knowledge;
            var competence = $scope.CurrentYearData.competence;
            var skill = $scope.CurrentYearData.skill;
            var annotation = $scope.CurrentYearData.annotation;
            var countCredit = $scope.CurrentYearData.countCredit;
            var picture = '';
            // $scope.newData.Images;
            var disciplineBlockId = $scope.CurrentYearData.disciplineBlockId;
            var course1 = true;
            var course2 = true;
            var course3 = true;
            var course4 = true;
            var course5 = true;
            var course6 = true;

            if ($scope.CurrentYearData.pictures) {
              picture = $scope.CurrentYearData.pictures.substring(23);
            }

            for (var i = 0; i < 7; i++) {
              switch ($scope.CurrentYearData.courses[i]) {
                case 1:
                  course1 = false;
                  break;
                case 2:
                  course2 = false;
                  break;
                case 3:
                  course3 = false;
                  break;
                case 4:
                  course4 = false;
                  break;
                case 5:
                  course5 = false;
                  break;
                case 6:
                  course6 = false;
                  break;
              }
            }

            var editedRowProposition = new PropositionModel(
              blockId, disciplineId, dcOKRId, dcSubdivisionWhoId,
              knowledge, competence, skill, annotation, countCredit,
              picture, disciplineBlockId,
              course1, course2, course3, course4, course5, course6
            );

            var method = 'PUT';
            var url = (
              'SelectiveDiscipline/BlocksDispline/' +
              $scope.CurrentYearData.disciplineBlockId
            );

            api.execute(method, url, editedRowProposition)
              .then(function(response) {
                console.log(response);
                $('#ModalAdditionalInfo').modal('hide');
                $scope.sendSubdivisionToServer();
              }, function(response) {
                console.log(response);
              });
          };

          function getOkrIdByName(okrList, okrName) {
            var okrId = '';
            okrList.forEach(function(item, iter, arr) {
              if (item.name === okrName) {
                okrId = item.id;
              }
            });
            return okrId;
          }

          function getDisciplineIdByName(disciplineList, disciplineName) {
            var disciplineId = '';
            disciplineList.forEach(function(item, iter, arr) {
              if (item.name === disciplineName) {
                disciplineId = item.id;
              }
            });
            return disciplineId;
          }

          function getApprovedByName(approveList, approveName) {
            var approveStatus = '';
            approveList.forEach(function(item, iter, arr) {
              if (item.name === approveName) {
                approveStatus = item.status;
              }
            });
            return approveStatus;
          }

          function getDisciplineBlockIdByFullName(disciplineBlockList,
                                                  disciplineBlockName) {
            var disciplineBlockId = '';
            for (var i = 0; i < disciplineBlockList.length; i++) {
              if (disciplineBlockList[i].fullName === disciplineBlockName) {
                disciplineBlockId = disciplineBlockList[i].disciplineBlockId;
              }
            }
            return disciplineBlockId;
          }

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
            // $scope.loader = true;
            $scope.newData.countCredit = parseInt($scope.newData.countCredit);
            // var data = angular.toJson($scope.newData);
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
    return (
      currYear !== null &&
      currYear !== undefined &&
      currCathedra !== undefined
    );
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
      api.execute(method, url)
        .then(function(response) {
          $scope.studyYearData = response;
          console.log('$scope.studyYearData', $scope.studyYearData);
          $scope.selectedNamefull = {};
          $scope.allDisciplinesList = [];

          for (var i = 0; i < $scope.studyYearData.length; i++) {
            $scope.studyYearData[i].isApproved = $scope.showUaWords(
              $scope.studyYearData[i]
            );
            $scope.allDisciplinesList.push($scope.studyYearData[i].id);
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
    $scope.sendSubdivisionToServer();
    $scope.initializeStudyYear();
  };

  $scope.addMessage = function(numberOfMessage) {
    $scope.ifMessage = true;
    $scope.messageCurrent = $scope.allMessages[numberOfMessage];
    $timeout(function() {
      $scope.ifMessage = false;
    }, 6000);
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

  function DisciplinesModel(okr,
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
                            nameFull) {
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

  function YearDataModel(studyYear,
                         maxCountStudent,
                         isApproved,
                         idBlockYear) {
    this.studyYear = studyYear;
    this.maxCountStudent = maxCountStudent;
    this.isApproved = isApproved;
    this.idBlockYear = idBlockYear;
  }

  function AllSelectData(allOkr,
                         allBlocks,
                         allDisciplines,
                         allYears) {
    this.allOkr = allOkr;
    this.allBlocks = allBlocks;
    this.allDisciplines = allDisciplines;
    this.allYears = allYears;
  }

  function AllOkrModel(currentOkr,
                       currentOkrId) {
    this.currentOkr = currentOkr;
    this.currentOkrId = currentOkrId;
  }

  function AllBlocksModel(currentBlock,
                          currentBlockId) {
    this.currentBlock = currentBlock;
    this.currentBlockId = currentBlockId;
  }

  function AllDisciplinesModel(currentDiscipline,
                               currentDisciplineId) {
    this.currentDiscipline = currentDiscipline;
    this.currentDisciplineId = currentDisciplineId;
  }

  function PropositionModel(blockId,
                            disciplineId,
                            dcOKRId,
                            dcSubdivisionWhoId,
                            knowledge,
                            competence,
                            skill,
                            annotation,
                            countCredit,
                            picture,
                            disciplineBlockId,
                            course1,
                            course2,
                            course3,
                            course4,
                            course5,
                            course6) {
    this.BlockId = blockId;
    this.DisciplineId = disciplineId;
    this.DcOKRId = dcOKRId;
    this.DcSubdivisionWhoId = dcSubdivisionWhoId;
    this.Knowledge = knowledge;
    this.Competence = competence;
    this.Skill = skill;
    this.Annotation = annotation;
    this.CountCredit = countCredit;
    this.Picture = picture;
    if (disciplineBlockId !== '') {
      this.disciplineBlockId = disciplineBlockId;
    }
    this.Course1 = course1;
    this.Course2 = course2;
    this.Course3 = course3;
    this.Course4 = course4;
    this.Course5 = course5;
    this.Course6 = course6;
  }

  function YearModel(studyYear,
                     maxCountStudent,
                     isApproved,
                     disciplineBlock8Id) {
    this.StudyYear = studyYear;
    this.MaxCountStudent = maxCountStudent;
    this.IsApproved = isApproved;
    this.DisciplineBlock8Id = disciplineBlock8Id;
  }

  function YearListModel(name) {
    this.name = name;
  }

  function ForSelectFullnameModel(nameFull,
                                  disciplineBlock8Id) {
    this.nameFull = nameFull;
    this.DisciplineBlock8Id = disciplineBlock8Id;
  }

  function ForSelectFullNameNewModel(name,
                                     okr,
                                     cathedra,
                                     fullName,
                                     disciplineBlockId) {
    this.name = name;
    this.okr = okr;
    this.cathedra = cathedra;
    this.fullName = fullName;
    this.disciplineBlockId = disciplineBlockId;
  }

  // var ifItIsAllowed = false; ok it works
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  function reload() {
    if (api.getToken()) {
      var sClaim = api.decodeToken(api.getToken());
      if (sClaim) {
        sClaim = JSON.parse(sClaim);
      }
      var path = 'Attestation/studyYear';
      api.execute('GET', path).then(function(response) {
        if (!response || response === '') {
          $scope.errorLabelText = 'На жаль, роки  у базі даних відсутні.';
        } else {
          //response.sort(compareYearsActuality);
          //$scope.stydyYearsAttest = response;
          $scope.tempListData.years = response;
          $scope.selectedYear = uniqueElemsInList.setCurrentYear(
            $scope.tempListData.years
          );
          // $scope.selectedYear = $scope.tempListData.years[4];
          // $scope.selectData.StudyYear =
          //   $scope.stydyYears[response.length-1].name;
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
    var ft = files[0].type;
    var size = files[0].size;
    var ext = ['image/png', 'image/jpeg', 'image/gif'];
    if (ext.indexOf(ft) > -1 && size < 65535) {
      var reader = new FileReader();
      console.log('img is ok');

      reader.onload = (function(theFile) {
        return function(e) {
          currImg.src = e.target.result;
          $scope.newData.Images = currImg.src.substring(23);
          // without data:image/jpeg;base64, part at the beginning
          currImg.title = escape(theFile.name);
        };
      })(files[0]);

      reader.readAsDataURL(files[0]);
      $scope.msgImg = '';
      document.getElementById(
        'msgImg' + $scope.idFilePreview
      ).innerHTML = $scope.msgImg;
    } else {
      console.log('img is not ok');
      $scope.newData.Images = '';
      currImg.src = ' ';
      $scope.msgImg = 'Розмір зображення не повинен перевищувати 64Кб';
      document.getElementById(
        'msgImg' + $scope.idFilePreview
      ).innerHTML = $scope.msgImg;
    }
  }

}
