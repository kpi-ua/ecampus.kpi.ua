'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesSpecializationCtrl
 * @description
 * # DisciplinesSpecializationCtrl
 * Controller of the ecampusApp
 */
angular
    .module('ecampusApp')
    .controller('DisciplinesSpecializationCtrl', DisciplinesSpecializationCtrl);

DisciplinesSpecializationCtrl.$inject = ['$scope', 'api'];

function DisciplinesSpecializationCtrl($scope, api) {
  var subsystemIdMain = 20;

  $scope.errorLabelText = '';
  $scope.selectData = {
    CathedraId: null,
    Okr: null,
    StudyForm: null,
    Direction: null,
    StudyYear: null,
    RtProfTrainTotalSubdivisionId: null,
    Patterns: [],
    StudyGroup: null
  };
  $scope.ShowDecanatCount = false;

  $scope.SelectAllCB = false;
  $scope.sumStudCount = null;
  $scope.sumStudCountResponse = [];

  $scope.sortType = 'Cycle.Name'; // значение сортировки по умолчанию
  $scope.sortReverse = true; // обратная сортировка

  $scope.sortTypeBlock = 'MaxCountStudent'; // значение сортировки по умолчанию
  $scope.sortReverseBlock = false;  // обратная сортировка

  $scope.section = 'specialization';
  $scope.semester = '';
  $scope.blockIdShow = 0;

  $scope.Dc = {
    Cycles: [],
    Blocks: [],
    Courses: [],
    StudyForms: [],
    StudyGroupsContract: [
      { id: -1, name: '' },
      { id: 0, name: 'Бюджет' },
      { id: 1, name: 'Контракт' },
      { id: 2, name: 'Змішана' },
    ],
    Semesters: []
  };

  reload();

  function reload() {
    if (api.getToken()) {
      var sClaim = api.decodeToken(api.getToken());
      if (sClaim) {
        sClaim = JSON.parse(sClaim);
        getPermissionSubsystemFromTokenBySubsystemId(sClaim.id,subsystemIdMain,setSubsystems);
      }

      // console.log(sClaim);
      if ($scope.subsystems === []) {
        $scope.errorLabelText = 'Кафедры не найдены.';
      }
      var path = 'blocks';
      api.execute('GET', path)
          .then(function(response) {
            if (!response || response === '' || response.length === 0) {
              $scope.errorLabelText = 'На жаль, блоки  у базі даних відсутні.';
            } else {
              $scope.Dc.Blocks = response;
            }
            $scope.safeApply();
          })
          .catch(errorHandlerMy);
      path = 'cycles';
      api.execute('GET', path)
          .then(function(response) {
            if (!response || response === '' || response.length === 0) {
              $scope.errorLabelText = (
                  'На жаль, цикли дисциплін  у базі даних відсутні.'
              );
            } else {
              $scope.Dc.Cycles = response;
            }
            $scope.safeApply();
          })
          .catch(errorHandlerMy);
      path = 'Attestation/studyYear';
      api.execute('GET', path)
          .then(function(response) {
            if (!response || response === '' || response.length === 0) {
              $scope.errorLabelText = 'На жаль, роки  у базі даних відсутні.';
            } else {
              response.sort(compareYearsActuality);
              $scope.stydyYears = response;
              $scope.selectData.StudyYear = (
                  $scope.stydyYears[response.length - 1].name
              );
            }
            $scope.safeApply();
          })
          .catch(errorHandlerMy);
      path = 'studyForms';
      api.execute('GET', path)
          .then(function(response) {
            if (!response || response === '' || response.length === 0) {
              $scope.errorLabelText = (
                  'На жаль, форми навчання у базі даних відсутні.'
              );
            } else {
              $scope.Dc.StudyForms = response;
            }
            $scope.safeApply();
          })
          .catch(errorHandlerMy);
    }

  }

  // function getStudyForm(studyForms, studyFormName) {
  //   var studyForm = studyForms[2];
  //   studyForms.forEach(function(item) {
  //     if (item.name === studyFormName) {
  //       studyForm = item;
  //     }
  //   });
  //   return studyForm;
  // }

  function compareYearsActuality(firstYear, secondYear) {
    if (firstYear.isActual) return 1;
    return -1;
  }

  function getPermissionSubsystemFromToken() {
    var permissionArray = [];
    if (api.getToken()) {
      var sClaim = api.decodeToken(api.getToken());
      sClaim = JSON.parse(sClaim);
      if (typeof(sClaim.resp) === 'object') {
        sClaim.resp.forEach(function(item) {
          var itemJSON = JSON.parse(item);
          var subsystemId = itemJSON.Subsystem;
          var subdivisionId = itemJSON.Subdivision.Id;
          var subdivisionName = itemJSON.Subdivision.Name;
          var subdivision = new SubdivisionModel(
              subdivisionId, subdivisionName
          );

          var subsystem = new SubsystemModel(subsystemId, subdivision);

          if (!~permissionArray.indexOf(subsystem)) {
            permissionArray.push(subsystem);
          }
        });
      } else if (typeof(sClaim.resp) === 'string') {
        var responsive  = JSON.parse(sClaim.resp);

        var subsystemId = responsive.Subsystem;
        var subdivisionId = responsive.Subdivision.Id;
        var subdivisionName = responsive.Subdivision.Name;
        var subdivision = new SubdivisionModel(subdivisionId, subdivisionName);

        var subsystem = new SubsystemModel(subsystemId, subdivision);

        if (!~permissionArray.indexOf(subsystem)) {
          permissionArray.push(subsystem);
        }
      }
    }
    return permissionArray;
  }

  function getPermissionSubsystemFromTokenBySubsystemId(userId,subsystemId,callback) {
    var permissionArray = [];
    var path = 'Account/employee/responsibility/' + userId;
    api.execute('GET', path).then(function(responsibilities) {
      responsibilities.forEach(function(responsibility) {
        if (responsibility.subsystem === subsystemId) {
          permissionArray.push(
              {Subdivision:{
                Id: responsibility.subdivision.id,
                Name: responsibility.subdivision.name
              }
              });
        }
      });
      if(callback){
        callback(permissionArray);
      }
    });
    // getPermissionSubsystemFromToken().forEach(function(item) {
    //   if (item.SubsystemId === SubsystemId) {
    //
    //   }
    // });
    // // console.log(permissionArray);
    // return permissionArray;
  }

  function setSubsystems(permissionArray) {
    $scope.subsystems = permissionArray;
  }
  function getOkrNamesArrayFromProfTrains(profTrains) {
    var okrArray = [];
    profTrains.forEach(function(item) {
      var okrName = item.OkrName;
      if (!~okrArray.indexOf(okrName)) {
        okrArray.push(okrName);
      }
    });
    return okrArray;
  }

  function getBlockNameById(dcBlock, blockId) {
    var blockName = '';
    dcBlock.forEach(function(item) {
      if (item.id === blockId) {
        blockName = item.name;
      }
    });
    return blockName;
  }

  function getCycleNameById(dcCycle, cycleId) {
    var cycleName = '';
    dcCycle.forEach(function(item) {
      if (item.id === cycleId) {
        cycleName =  item.name;
      }
    });
    return cycleName;
  }

  function blockChoiceFromResponseToView(response) {
    var blocks = [];
    var blocksNames = [];
    var groupedBlocksArray = [];
    var blocksAndDisciplines = [];
    var studyGroups = [];
    var blocksForRequest = [];
    var compareSemester = 0;
    response.forEach(function(item) {
      var blockChoiceWhomId = item.Id;
      var blockId = item.block.id;
      var blockName = item.block.name;
      var course = item.course;
      var semestr = item.semestr;
      var studyGroupName = item.studyGroup.name;
      var studyGroupCount = item.countStud;
      if (compareSemester !== semestr) {
        compareSemester = semestr;
        if (blocks.length !== 0) {
          groupedBlocksArray.push(blocks);
          blocks = [];
        }
      }
      blocks.push(
          new BlockChoiceWhomModel(
              blockChoiceWhomId, blockId, blockName, course, semestr,
              studyGroupName, studyGroupCount
          )
      );
    });
    groupedBlocksArray.push(blocks);
    groupedBlocksArray.forEach(function(blocksArray) {
      blocksForRequest = [];
      studyGroups = [];
      blocks = [];
      blocksNames = [];
      var studyGroupsNames = [];
      blocksArray.forEach(function(block) {
        var tempStudyGroups = {
          name: block.StudyGroupName,
          count: block.StudyGroupCount
        };
        if (!~studyGroupsNames.indexOf(tempStudyGroups.name)) {
          studyGroupsNames.push(tempStudyGroups.name);
          studyGroups.push(tempStudyGroups);
        }
        // studyGroups.push(block.StudyGroupName);
        var tempBlock = new BlockModel(block.BlockId, block.BlockName);
        if (!~blocksNames.indexOf(block.BlockName)) {
          blocksNames.push(block.BlockName);
          blocksForRequest.push(tempBlock);
          blocks.push(tempBlock);
        }
      });
      blocksAndDisciplines.push(
          new SemestrsBlocksModel(
              blocksArray[0].Course, blocksArray[0].Semestr, studyGroups, blocks
          )
      );
    });
    return blocksAndDisciplines;
  }

  function errorHandlerMy(response, status, headers) {
    $scope.errorLabelText = api.errorHandler(response);
  }

  function getCourseBySemester(semester) {
    return  Math.round(semester / 2);
  }

  function getStudyYearCourse(studyYearPublish, course) {
    var yearArray = studyYearPublish.split('-');
    yearArray[0] = parseInt(yearArray[0], 10);
    yearArray[0] += (course - 1);

    yearArray[1] = parseInt(yearArray[1], 10);
    yearArray[1] += (course - 1);
    return '' + yearArray[0] + '-' + yearArray[1];
  }
  //из массива групп возвращает групу с нужным groupId
  function findGroupInGroups(groups, groupId) {
    var groupById = null;
    groups.forEach(function(group) {
      if (group.id === groupId) {
        groupById = group;
      }
    });
    return groupById;
  }
  // выполняем поиск Id учебной группы в группе,
  // в случае его отсутсвия возвращаем null
  function getStudyGroupIdFromGroupByCourse(group, course) {
    var studyGroupId = null;
    group.studyGroups.forEach(function(item) {
      if (item.studyCourse === course) {
        studyGroupId = item.studyGroupsId;
      }
    });
    return studyGroupId;
  }

  $scope.SumStudCount = function(groups) {
    $scope.sumStudCount = 0;
    groups.forEach(function(group) {
      $scope.sumStudCount += group.count;
    });
    // $scope.sumStudCount = 0;
    // var blocksForSemester = [];
    // blocks.forEach(function(block) {
    //   if (block.semestr === semester) {
    //     $scope.sumStudCount += block.countStud;
    //   }
    // });
  };

  $scope.OnCathedraSelect = function() {
    $scope.errorLabelText = '';
    $scope.blocks = null;
    $scope.specialities = null;
    $scope.okrNames = null;
    $scope.disciplines = null;
    $scope.safeApply();
    $scope.selectData.Okr = null;
    $scope.selectData.Direction = null;
    var cathedraId = $scope.selectData.CathedraId;
    var path = 'StudyOrganization/ProfTrains/' + cathedraId;

    api.execute('GET', path).then(function(response) {
      if (!response || response === '' || response.length === 0) {
        $scope.errorLabelText = 'На жаль, OKP у базі даних відсутні.';
      } else {
        console.log(response);
        var profTrains = [];
        response.forEach(function(item) {
          var okrName = item.okr.name;
          var profTrainTotalId = item.profTrainTotal.id;
          var specialityCode = item.specialtyCode;
          var specialityName = item.name;
          var speciality = new SpecialityModel(
              specialityCode, specialityName, profTrainTotalId
          );
          profTrains.push(new ProfTrainModel(okrName, speciality));
        });
        $scope.profTrains = profTrains;
        $scope.okrNames = getOkrNamesArrayFromProfTrains(profTrains);
      }
      $scope.safeApply();
    }, function(response, status, headers) {
      errorHandlerMy(response, status, headers);
      $scope.safeApply();
    });
  };

  $scope.OnOkrSelect = function() {
    $scope.errorLabelText = '';
    $scope.blocks = null;
    $scope.disciplines = null;
    $scope.selectData.Direction = null;
    $scope.specialities = [];
    // console.log($scope.profTrains);
    $scope.profTrains.forEach(function(profTrain) {
      if (profTrain.OkrName === $scope.selectData.Okr) {
        switch ($scope.selectData.Okr) {
          case 'Бакалавр': {
            $scope.Dc.Semesters = [1, 2, 3, 4, 5, 6, 7, 8];
            break;
          }
          case 'Магістр': {
            $scope.Dc.Semesters = [9, 10, 11, 12];
            break;
          }
          case 'Спеціаліст': {
            $scope.Dc.Semesters = [9, 10];
            break;
          }
        }
        $scope.specialities.push(profTrain.Speciality);
        // console.log(profTrain.Speciality);
      }
    });
    $scope.safeApply();
  };

  $scope.onFullSelect = function(onlyGroupUpdate) {

    $scope.errorLabelText = '';
    var path = '';
    $scope.disciplines = null;
    $scope.semestrsForView = null;
    $scope.blocksWidthDisciplines = null;
    $scope.SelectAllCB = false;
    var cathedraIdBool = $scope.selectData.CathedraId !== null;
    var directionBool = $scope.selectData.Direction !== null;
    var okrBool = $scope.selectData.Okr !== null;
    var studyFormBool = $scope.selectData.StudyForm !== null;
    var studyYearBool = $scope.selectData.StudyYear !== null;
    var mainInfoBool = cathedraIdBool && directionBool && okrBool;
    if (
        mainInfoBool &&
        studyFormBool &&
        studyYearBool &&
        $scope.section === 'specialization'
    ) {
      $scope.selectData.StudyGroup = null;
      // var blocks = [];
      // var groupedBlocksArray = [];
      // var compareSemester = 0;
      path = (
          'SelectiveDiscipline/' + $scope.selectData.StudyYear +
          '/BlockChoiceWhom/' +
          $scope.selectData.CathedraId + '/' + $scope.selectData.Direction +
          '/' + $scope.selectData.StudyForm
      );
      api.execute('GET', path)
          .then(function(response) {
            if (!response || response === '' || response.length === 0) {
              $scope.errorLabelText = 'На жаль записи у базі відсутні';
              $scope.safeApply();
            } else {
              var semestrForView = blockChoiceFromResponseToView(response);
              $scope.sumStudCountResponse = response;
              $scope.semestrsForView = semestrForView;
              $scope.safeApply();
            }
          })
          .catch(errorHandlerMy);
    } else if (
        mainInfoBool && (
            $scope.section === 'patterns' ||
            ($scope.section === 'apply' && !onlyGroupUpdate)
        )
    ) {
      $scope.selectData.StudyGroup = null;
      $scope.selectData.Patterns = [];
      $scope.safeApply();
      var patterns = [];
      $scope.patterns = null;
      path = (
          'SelectiveDiscipline/PatternBlockChoise/' +
          $scope.selectData.CathedraId + '/' + $scope.selectData.Direction
      );
      api.execute('GET', path).then(function(response) {
        if (!response || response === '' || response.length === 0) {
          $scope.errorLabelText = 'На жаль, записи у базі відсутні.';
          $scope.patterns = [];
          $scope.safeApply();
        } else if (response.name === 'ProfTrainTotalSubdivisionId') {
          $scope.errorLabelText = 'На жаль, шаблони відсутні.';
          $scope.patterns = [];
          $scope.selectData.ProfTrainTotalSubdivisionId = response.id;
          $scope.safeApply();
        } else {
          $scope.patterns = [];
          response.forEach(function(item) {
            var patternBlockChoice8Id = item.patternBlockChoice8Id;
            var rtProfTrainTotalSubdivisionId = item
                .profTrainTotalSubdivisionId;
            var blockName = item.block.name;
            var blockId = item.block.id;
            var cycleName = item.cycle.name;
            var cycleId = item.cycle.id;
            var course = item.course;
            var semester = item.semester;
            var countDiscipline = item.countDiscipline;
            var patternName = item.name;
            patterns.push(
                new PatternModel(
                    patternBlockChoice8Id, rtProfTrainTotalSubdivisionId, blockName,
                    blockId, cycleName, cycleId, course, semester, countDiscipline,
                    patternName
                )
            );
            patterns[patterns.length - 1].checked = false;
          });
          $scope.patterns = patterns;
          $scope.selectData.ProfTrainTotalSubdivisionId = patterns[0]
              .ProfTrainTotalSubdivisionId;
          $scope.safeApply();
        }
      }).catch(errorHandlerMy);
    }
    if (
        mainInfoBool &&
        studyFormBool &&
        studyYearBool &&
        $scope.section === 'apply'
    ) {
      path = (
          'SelectiveDiscipline/' + $scope.selectData.StudyYear +
          '/GroupsByYearInTake/' + $scope.selectData.CathedraId +
          '/' + $scope.selectData.Direction + '/' + $scope.selectData.StudyForm
      );
      api.execute('GET', path)
          .then(function(response) {
            if (!response || response === '' || response.length === 0) {
              $scope.errorLabelText = 'На жаль групи у базі відсутні.';
              $scope.groups = null;
              $scope.blocksChoise = null;
              $scope.selectData.StudyGroup = null;
              $scope.safeApply();
            } else {
              $scope.groups = response;
              path = 'SelectiveDiscipline/BlockChoice/';
              response.forEach(function(group, i, arr) {
                path += group.id;
                if (arr[i + 1] !== undefined) {
                  path += ',';
                }
              });
              api.execute('GET', path).then(function(response) {
                $scope.blocksChoise = response;
                // console.log($scope.blocksChoise);
                $scope.safeApply();
              }, function(response, status, headers) {
                errorHandlerMy(response, status, headers);
                $scope.safeApply();
              });
            }
          })
          .catch(errorHandlerMy);
    }
    var isStudyGroup = $scope.section === 'study-group';
    if (mainInfoBool && studyFormBool && studyYearBool && isStudyGroup) {
      $scope.groups =  null;
      path = (
          'SelectiveDiscipline/' + $scope.selectData.StudyYear +
          '/StudyGroupsByStudyYear/' + $scope.selectData.CathedraId + '/' +
          $scope.selectData.Direction + '/' + $scope.selectData.StudyForm
      );
      api.execute('GET', path).then(function(response) {
        if (!response || response === '' || response.length === 0) {
          $scope.errorLabelText = 'На жаль групи у базі відсутні.';
          $scope.blocksChoise = null;
          $scope.selectData.StudyGroup = null;
          $scope.safeApply();
        } else {
          // $scope.groups = response;
          var factSumm = 0;
          $scope.ShowDecanatCount = false;
          $scope.selectData.StudyGroup = response;
          response.forEach(function(group) {
            factSumm += group.studyGroups[0].studyGroupsCountStudFact;
          });
          if (factSumm > 0) {
            $scope.ShowDecanatCount = true;
          }
          console.log($scope.selectData.StudyGroup);
        }
      });
    }
  };

  $scope.GetAllDisciplines = function(blocks) {
    $scope.errorLabelText = '';
    blocks.forEach(function(block) {
      var path = (
          'SelectiveDiscipline/' + $scope.selectData.StudyYear +
          '/DisciplineChosen/' + block.BlockId +
          '/' + $scope.selectData.StudyForm
      );
      api.execute('GET', path).then(function(response) {
        var disciplinesBlock = [];
        var tatalMaxCountStudent = 0;
        var tatalOccupiedPercent = 0;
        var tatalSubscribed = 0;
        if (!response || response === '' || response.length === 0) {
          block.DisciplineArray = null;
          $scope.blocksWidthDisciplines = blocks;
        } else {
          response.forEach(function(item) {
            var disciplineBlockYearId = item.disciplineBlockYearId;
            var disciplineName = item.disciplineName;
            var maxCountStudent = item.maxCountStudent;
            var occupiedPercent = item.occupiedPercent;
            var stydyCourse = item.stydyCourse;
            var subscribed = item.subscribed;
            var whoReadId = item.whoReadId;
            var whoReadAbbreviation = item.subdivisionAbbreviation;
            var whoReadName = item.subdivision.name;
            var dm1 = new DisciplineModel(
                disciplineBlockYearId, disciplineName, maxCountStudent,
                occupiedPercent, stydyCourse, subscribed, whoReadId,
                whoReadAbbreviation, whoReadName
            );
            disciplinesBlock.push(dm1);
            tatalMaxCountStudent += maxCountStudent;
            tatalSubscribed += subscribed;
          });
          tatalOccupiedPercent = (
              tatalMaxCountStudent !== 0 ?
              tatalSubscribed / tatalMaxCountStudent : 1
          );
          var dm2 = new DisciplineModel(
              0, 'Разом', tatalMaxCountStudent, tatalOccupiedPercent,
              '', tatalSubscribed, '', '', ''
          );
          disciplinesBlock.push(dm2);
          block.DisciplineArray = disciplinesBlock;
          $scope.blocksWidthDisciplines = blocks;
          $scope.safeApply();
        }
      });
    });
  };

  $scope.OnDisciplineChose = function(blockId) {
    // console.log(blockId);
    var disciplines = [];
    var path = (
        'SelectiveDiscipline/' + $scope.selectData.StudyYear +
        '/DisciplineChosen/' + blockId
    );
    api.execute('GET', path).then(function(response) {
      // console.log(response);
      response.forEach(function(item) {
        var disciplineBlockYearId = item.disciplineBlockYearId;
        var disciplineName = item.disciplineName;
        var maxCountStudent = item.maxCountStudent;
        var occupiedPercent = item.occupiedPercent;
        var stydyCourse = item.stydyCourse;
        var subscribed = item.subscribed;
        var whoReadId = item.whoReadId;
        var whoReadAbbreviation = item.whoReadAbbreviation;
        var whoReadName = item.whoReadName;
        var dm3 = new DisciplineModel(
            disciplineBlockYearId, disciplineName, maxCountStudent,
            occupiedPercent, stydyCourse, subscribed, whoReadId,
            whoReadAbbreviation, whoReadName
        );
        disciplines.push(dm3);
      }).catch(errorHandlerMy);
      $scope.disciplines = disciplines;
      // console.log($scope.disciplines);
      $scope.safeApply();
    });
  };

  $scope.UpdateModalForGroup = function(groupName, isListActual, studentList) {
    if (isListActual) {
      $scope.ModalGroupInfo = {
        Name: groupName,
        StudentList: studentList
      };
    }
  };

  $scope.PatternChecked = function(pattern) {
    if (~$scope.selectData.Patterns.indexOf(pattern)) {
      $scope.selectData.Patterns.splice(
          $scope.selectData.Patterns.indexOf(pattern), 1
      );
    } else {
      $scope.selectData.Patterns.push(pattern);
    }
  };

  $scope.PatternImplement = function() {
    $scope.errorLabelText = '';
    $scope.implementReport = null;
    if ($scope.selectData.Patterns.length > 0 && $scope.groups !== null) {
      var path = '';
      var method = '';
      $scope.safeApply();
      var payload = {
        PatternBlockList: $scope.selectData.Patterns,
        GroupList: $scope.groups,
        StudyYearPublish: $scope.selectData.StudyYear
      };
      path = 'SelectiveDiscipline/BlockChoiseImplement';
      method = 'POST';
      // console.log($scope.patterns);
      api.execute(method, path, payload).then(function(resp) {
        $scope.onFullSelect();
      }).catch(errorHandlerMy);
    } else {
      if ($scope.selectData.Patterns.length === 0) {
        $scope.errorLabelText = 'Помилка! Оберіть хочаб один шаблон. ';
      }
      if ($scope.groups === null) {
        $scope.errorLabelText += (
            '| Оберіть рік вступу для якого у базі є записи про группи.'
        );
      }
      $scope.safeApply();
    }
  };

  $scope.SwitchSections = function(event) {
    $scope.section = event.target.value;
    $scope.onFullSelect();
  };

  $scope.SwitchSemester = function(value) {
    $scope.semester = value;
    // $scope.onFullSelect();
  };

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn) fn();
    } else {
      this.$apply(fn);
    }
  };

  $scope.checkAllForm = function(data) {
    // console.log(data);
    if (data === null || data === '') {
      return 'Заполніть це поле!';
    }
  };

  //save pattern
  $scope.savePattern = function(data, pattern) {
    var path = '';
    var method = '';
    var patternBlockChoice8Id = pattern.PatternBlockChoice8Id;
    var profTrainTotalSubdivisionId = $scope
        .selectData
        .ProfTrainTotalSubdivisionId;
    var blockName = getBlockNameById($scope.Dc.Blocks, data.BlockId);
    var blockId = data.BlockId;
    var cycleName = getCycleNameById($scope.Dc.Cycles, data.CycleId);
    var cycleId =  data.CycleId;
    var course = getCourseBySemester(data.Semester);
    var semester =  data.Semester;
    var countDiscipline = data.CountDiscipline;
    var patternName =  data.PatternName;
    var newPattern = new PatternModel(
        patternBlockChoice8Id, profTrainTotalSubdivisionId, blockName,
        blockId, cycleName, cycleId, course, semester, countDiscipline,
        patternName
    );
    // console.log(newPattern);
    $scope.patterns.splice($scope.patterns.indexOf(pattern), 1, newPattern);
    var payload = {
      Block: { Id: blockId },
      Cycle: { Id: cycleId },
      ProfTrainTotalSubdivisionId: profTrainTotalSubdivisionId,
      Name: patternName,
      CountDiscipline: countDiscipline,
      Course: course,
      Semester: semester,
      Id: patternBlockChoice8Id === null ? 0 : patternBlockChoice8Id,
    };
    path = 'SelectiveDiscipline/PatternBlockChoise';
    method = patternBlockChoice8Id === null ? 'POST' : 'PUT';

    // console.log(method);
    api.execute(method, path, payload)
        .then(function(resp) { $scope.onFullSelect(); })
        .catch(errorHandlerMy);
    // , function(response, status, headers) {
    //   errorHandlerMy(response, status, headers);
    //   $scope.safeApply();
    // });
  };

  // remove patterb
  $scope.removePattern = function(pattern) {
    if (confirm('Ви впевнені, що хочете видалити цей шаблон?')) {
      var payload = {
        Id: pattern.PatternBlockChoice8Id
      };
      var  path = 'SelectiveDiscipline/PatternBlockChoise';
      $scope.patterns.splice($scope.patterns.indexOf(pattern), 1);
      api.execute('DELETE', path, payload);
    }
  };

  // add patterb
  $scope.addPattern = function() {
    $scope.inserted = {
      PatternBlockChoice8Id: null,
      RtProfTrainTotalSubdivisionId: null,
      BlockName: null,
      BlockId: null,
      CycleName: null,
      CycleId: null,
      Course: null,
      Semester: null,
      CountDiscipline: null,
      PatternName: null
    };
    $scope.patterns.unshift($scope.inserted);
    $scope.safeApply();
  };

  //save block
  $scope.saveBlock = function(data, block) {
    var path = '';
    var method = '';
    $scope.safeApply();
    // console.log($scope.groups);
    // console.log(data);
    // console.log(block);
    var groupChosen = findGroupInGroups($scope.groups, data.groupId);
    var blockChoiceWhom8Id = block.id;
    var dcBlock8Id = data.blockId;
    var semester = data.semester;
    var studyYearPublish = block.studyYearPublish;
    var course = getCourseBySemester(semester);
    var cycleId = data.cycleId;
    var groupId = data.groupId;
    var studyGroupId = getStudyGroupIdFromGroupByCourse(groupChosen, course);
    var studyYearCourse = getStudyYearCourse(studyYearPublish, course);
    var countDiscipline = block.countDiscipline;
    var payload = {
      StudyYearCourse: studyYearCourse,
      CountDiscipline: countDiscipline,
      StudyYearPublish: studyYearPublish,
      Cycle: {
        Id: cycleId,
        Name: getCycleNameById($scope.Dc.Cycles, cycleId),
      },
      GroupId: groupId,
      Id: blockChoiceWhom8Id,
      StudyGroup: {
        Id: studyGroupId,
        Name: groupChosen.name,
      },
      Course: course,
      Semestr: semester,
      Block: {
        Id: dcBlock8Id,
        Name: getBlockNameById($scope.Dc.Blocks, dcBlock8Id),
      }
    };
    path = 'SelectiveDiscipline/BlockChoise';
    method = blockChoiceWhom8Id === null ? 'POST' : 'PUT';
    api.execute(method, path, payload).then(function(resp) {
      $scope.onFullSelect();
    }, function(response, status, headers) {
      errorHandlerMy(response, status, headers);
      $scope.safeApply();
    });
  };

  $scope.deleteBlock =  function(block) {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      var path = 'SelectiveDiscipline/BlockChoise';
      var method = 'DELETE';
      var payload = { Id: block.id };
      api.execute(method, path, payload)
          .then(function(resp) { $scope.onFullSelect(); })
          .catch(errorHandlerMy);
      $scope.blocksChoise.splice($scope.blocksChoise.indexOf(block), 1);
    }
  };

  $scope.saveGroupCount = function(data, studyGroupId) {
    var path = 'SelectiveDiscipline/UpdateStudyGroupCountStudFact';
    var method = 'PUT';
    var payload = {
      StudyGroup: {
        Id: studyGroupId,
      },
      CountStud: data.studyGroupsCountStud,
      StudyGroupsContractId: data.studyGroupsContract,
    };
    api.execute(method, path, payload).then(function(resp) {
      $scope.onFullSelect();
    }, function(response, status, headers) {
      errorHandlerMy(response, status, headers);
      $scope.safeApply();
    });
  };

  $scope.getYearByStartYearAndCourse = function(startYear, course) {
    var years = startYear.replace(' ', '').split('-');
    years[0] = parseInt(years[0], 10) + (course - 1);
    years[1] = parseInt(years[1], 10) + (course - 1);
    console.log(years[0] + '-' + years[1]);
    return years[0] + '-' + years[1];
  };

  $scope.SelectAllCheckboxes = function(items) {
    $scope.SelectAllCB = !$scope.SelectAllCB;
    var curStatus = $scope.SelectAllCB;
    $scope.selectData.Patterns = [];
    items.forEach(function(item) {
      item.checked = curStatus;
      if (curStatus) {
        $scope.selectData.Patterns.push(item);
      } else {
        //
      }
    });
    console.log($scope.selectData.Patterns);
  };

  // MODELS!!!
  function SubdivisionModel(
      SubdivisionId,
      Name
  ) {
    this.SubdivisionId = SubdivisionId;
    this.Name = Name;
  }

  function SubsystemModel(
      SubsystemId,
      Subdivision
  ) {
    this.SubsystemId = SubsystemId;
    this.Subdivision = Subdivision;
  }

  function SpecialityModel(
      Code,
      Name,
      ProfTrainTotalId
  ) {
    this.Code = Code;
    this.Name = Name;
    this.ProfTrainTotalId = ProfTrainTotalId;
  }

  function ProfTrainModel(
      OkrName,
      Speciality
  ) {
    this.OkrName = OkrName;
    this.Speciality = Speciality;
  }

  function BlockChoiceWhomModel(
      blockChoiceWhomId,
      blockId,
      blockName,
      course,
      semestr,
      studyGroupName,
      studyGroupCount
  ) {
    this.BlockChoiceWhomId = blockChoiceWhomId;
    this.BlockId = blockId;
    this.BlockName = blockName;
    this.Course = course;
    this.Semestr = semestr;
    this.StudyGroupName = studyGroupName;
    this.StudyGroupCount = studyGroupCount;
  }

  function DisciplineModel(
      disciplineBlockYearId,
      disciplineName,
      maxCountStudent,
      occupiedPercent,
      stydyCourse,
      subscribed,
      whoReadId,
      whoReadAbbreviation,
      whoReadName
  ) {
    this.DisciplineBlockYearId = disciplineBlockYearId;
    this.DisciplineName = disciplineName;
    this.MaxCountStudent = maxCountStudent;
    this.OccupiedPercent = occupiedPercent;
    this.StydyCourse = stydyCourse;
    this.Subscribed = subscribed;
    this.WhoReadId = whoReadId;
    this.WhoReadAbbreviation = whoReadAbbreviation;
    this.WhoReadName = whoReadName;
  }

  function SemestrsBlocksModel(
      course,
      semestr,
      groupsArray,
      blocksArray
  ) {
    this.Course = course;
    this.Semestr = semestr;
    this.Groups = groupsArray;
    this.Blocks = blocksArray;
  }

  function BlockModel(
      blockId,
      blockName,
      disciplines,
      summarize
  ) {
    this.BlockName = blockName;
    this.BlockId = blockId;
    this.DisciplineArray = disciplines;
    this.Summarize = summarize;
  }

  function CycleModel(
      cycleId,
      cycleName
  ) {
    this.CycleName = cycleName;
    this.CycleId = cycleId;
  }

  function PatternModel(
      patternBlockChoice8Id, rtProfTrainTotalSubdivisionId, blockName, blockId,
      cycleName, cycleId, course, semester, countDiscipline, patternName
  ) {
    this.PatternBlockChoice8Id = patternBlockChoice8Id;
    this.ProfTrainTotalSubdivisionId = rtProfTrainTotalSubdivisionId;
    this.Block = {
      Name: blockName,
      Id: blockId
    };
    this.Cycle = {
      Name: cycleName,
      Id: cycleId
    };
    this.Course = course;
    this.Semester = semester;
    this.CountDiscipline = countDiscipline;
    this.PatternName = patternName;
  }

}
