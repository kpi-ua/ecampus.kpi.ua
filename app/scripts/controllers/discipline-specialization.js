'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesSpecializationCtrl
 * @description
 * # DisciplinesSpecializationCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('DisciplinesSpecializationCtrl', function($scope, $cookies, $window, Api , $filter, $http) {
        var subsystemIdMain = 20;
        var StydyYearFrom =2013;
        var StydyYearTo =2020;
        $scope.preloader = false;
        $scope.errorLabelText ="";
        $scope.selectData ={
            CathedraId : null,
            Okr : null,
            Direction : null,
            StudyYear : null,
            RtProfTrainTotalSubdivisionId: null,
            Patterns:[]
        };

        $scope.sortType     = 'Course'; // значение сортировки по умолчанию
        $scope.sortReverse  = false;  // обратная сортировка

        $scope.sortTypeBlock     = 'MaxCountStudent'; // значение сортировки по умолчанию
        $scope.sortReverseBlock  = false;  // обратная сортировка

        $scope.section = "specialization";
        $scope.semester = "";
        $scope.blockIdShow =0;

        $scope.Dc ={
            Cycles      : [],
            Blocks      : [],
            Courses     : [],
            Semesters   : []
        };

        reload();

        function reload() {
            $scope.preloader = true;
            if (!!Api.getToken()) {
                var sClaim = Api.decodeToken(Api.getToken());

                if (!!sClaim) {
                    sClaim = JSON.parse(sClaim);
                }
                $scope.subsystems = getPermissionSubsystemFromTokenBySubsystemId(subsystemIdMain);
                if($scope.subsystems==[]){
                    $scope.errorLabelText = "Кафедры не найдены.";
                }
                var path = "blocks";
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль, актуальні  у базі даних відсутні.";
                    } else {
                        $scope.Dc.Blocks = response;
                    }
                    $scope.preloader = false;
                    $scope.safeApply();
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
                path = "cycles";
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль, актуальні  у базі даних відсутні.";
                    } else {
                        $scope.Dc.Cycles = response;
                    }
                    $scope.preloader = false;
                    $scope.safeApply();
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
            }
            $scope.stydyYears = getStudyYearsArray(StydyYearFrom,StydyYearTo);
            $scope.preloader=false;
        }

        function getStudyYearsArray(from, to) {
            var studyYears = [];
            for(var i =from;i<to;i++){
                studyYears.push(i+"-"+(i+1));
            }
            return studyYears;
        }

        function getPermissionSubsystemFromToken(){
            var permissionArray = [];
            if (!!Api.getToken()) {
                var sClaim = Api.decodeToken(Api.getToken());
                sClaim = JSON.parse(sClaim);
                if(typeof(sClaim.resp)=="object"){
                    sClaim.resp.forEach(function(itemForEach, i, arr) {
                        var itemForEachJSON = JSON.parse(itemForEach);
                        var subsystemId = itemForEachJSON.Subsystem;
                        var subdivisionId = itemForEachJSON.Subdivision.Id;
                        var subdivisionName = itemForEachJSON.Subdivision.Name;
                        var subdivision = new SubdivisionModel(subdivisionId,subdivisionName);

                        var subsystem = new SubsystemModel(subsystemId,subdivision );

                        if(!~permissionArray.indexOf(subsystem)){
                            permissionArray.push(subsystem);
                        }
                    });
                }else{
                    if(typeof(sClaim.resp)=="string"){
                        var responsive  = JSON.parse(sClaim.resp);

                        var subsystemId = responsive.Subsystem;
                        var subdivisionId = responsive.Subdivision.Id;
                        var subdivisionName = responsive.Subdivision.Name;
                        var subdivision = new SubdivisionModel(subdivisionId,subdivisionName);

                        var subsystem = new SubsystemModel(subsystemId,subdivision );

                        if(!~permissionArray.indexOf(subsystem)){
                            permissionArray.push(subsystem);
                        }
                    }
                }
            }
            return permissionArray;
        }

        function getPermissionSubsystemFromTokenBySubsystemId( SubsystemId ){
            var permissionArray = [];
            getPermissionSubsystemFromToken().forEach(function (item, i, arr) {
                if(item.SubsystemId == SubsystemId){
                    permissionArray.push(item);
                }
            });
            console.log(permissionArray);
            return permissionArray;
        }

        function getOkrNamesArrayFromProfTrains(profTrains){
            var okrArray =[];
            profTrains.forEach(function(item, i,arr){
                var okrName = item.OkrName;
                if(!~okrArray.indexOf(okrName)){
                    okrArray.push(okrName);
                }
            });
            return okrArray;
        }

        function GetBlockNameById(dcBlock, blockId) {
            var blockName = "";
            dcBlock.forEach(function (item,iter,arr) {
                if(item.id == blockId){
                    blockName =  item.name;
                }
            });
            return blockName;
        }

        function GetCycleNameById(dcCycle, cycleId) {
            var cycleName ="";
            dcCycle.forEach(function (item,iter,arr) {
                if(item.id == cycleId){
                    cycleName =  item.name;
                }
            });
            return cycleName;
        }

        function BlockChoiceFromResponseToView(response) {
            var blocks= [];
            var groupedBlocksArray =[];
            var blocksAndDisciplines=[];
            var studyGroups = [];
            var blocksForRequest=[];
            var compareSemester = 0;
            response.forEach(function (item, i, arr) {
                var blockChoiceWhomId = item.Id
                    , blockId = item.block.id
                    , blockName = item.block.name
                    , course = item.course
                    , semestr = item.semestr
                    , studyGroupName = item.studyGroup.name;
                if(compareSemester!=semestr){
                    compareSemester = semestr;
                    if(blocks.length != 0) {
                        groupedBlocksArray.push(blocks);
                        blocks = [];
                    }
                }
                blocks.push(new BlockChoiceWhomModel(blockChoiceWhomId, blockId, blockName, course, semestr, studyGroupName));
            });
            groupedBlocksArray.push(blocks);
            groupedBlocksArray.forEach(function (blocksArray,iter,arr) {
                blocksForRequest=[];
                studyGroups = [];
                blocks=[];
                blocksArray.forEach(function (block ,iterator ,arra) {
                    studyGroups.push(block.StudyGroupName);
                    var compatreBlock = new BlockModel(block.BlockId,block.BlockName);
                    if(!~blocksForRequest.indexOf(compatreBlock)) {
                        blocksForRequest.push(compatreBlock);
                        blocks.push(compatreBlock)
                    }
                });
                blocksAndDisciplines.push(new SemestrsBlocksModel(blocksArray[0].Course,blocksArray[0].Semestr,studyGroups,blocks));
            });
            return blocksAndDisciplines;
        }

        function ErrorHandlerMy (response, status,headers){
            var errorDetails ="";
            switch (response.statusText){
                case 'Unauthorized' :{
                    errorDetails= "Ви не авторизовані у системі. Статус: " +response.status;
                    Api.logout();
                    $window.location.href = '/';
                    break;
                }
                case "Internal Server Error":{
                    errorDetails= "Помилка сервера, спробуйте пізніше. Статус: " +response.status;
                    break;
                }
                default:{
                    errorDetails= "Перевірте інтернет з'єднання.";
                }
            }
            $scope.errorLabelText="Помилка. "+errorDetails;
        }

        function GetCourseBySemester(semester) {
            return  Math.round(semester/2);
        }

        function GetStudyYearCourse(studyYearPublish , course) {
            var yearArray  =studyYearPublish.split('-');
            yearArray[0]= parseInt(yearArray[0],10);
            yearArray[0]+=(course-1);

            yearArray[1]= parseInt(yearArray[1],10);
            yearArray[1]+=(course-1);
            return ""+yearArray[0]+"-"+yearArray[1];
        }
        //из массива групп возвращает групу с нужным groupId
        function FindGroupInGroups(groups, groupId) {
            var groupById = null;
            groups.forEach(function (group,i,arr) {
                if(group.id == groupId){
                    groupById = group;
                }
            });
            return groupById;
        }
        // выполняем поиск Id учебной группы в группе,  в случае его отсутсвия возвращаем null
        function GetStudyGroupIdFromGroupByCourse(group , course) {
            var studyGroupId = null;
            group.studyGroups.forEach(function (item,i,arr) {
                if(item.studyCourse == course){
                    studyGroupId = item.studyGroupsId;
                }
            });
            return studyGroupId;
        }

        $scope.OnCathedraSelect = function () {
            $scope.errorLabelText="";
            $scope.blocks = null;
            $scope.specialities = null;
            $scope.okrNames = null;
            $scope.disciplines =null;
            $scope.preloader = true;
            $scope.safeApply();
            $scope.selectData.Okr = null;
            $scope.selectData.Direction = null;
            var cathedraId = $scope.selectData.CathedraId;
            var path = "StudyOrganization/ProfTrains/"+ cathedraId;
            Api.execute("GET", path).then(function(response) {
                if (!response || response == "") {
                    $scope.errorLabelText="На жаль, OKP у базі даних відсутні.";
                } else {
                    var profTrains = [];
                    response.forEach(function(item, i, arr){

                        var okrName = item.okr.name;
                        var profTrainTotalId = item.profTrainTotal.id;
                        var specialityCode = item.specialtyCode;
                        var specialityName = item.name;
                        var speciality = new SpecialityModel(specialityCode,specialityName,profTrainTotalId);
                        profTrains.push(new ProfTrainModel(okrName,speciality));
                    });

                    $scope.profTrains = profTrains;
                    $scope.okrNames = getOkrNamesArrayFromProfTrains(profTrains);
                }
                $scope.preloader = false;
                $scope.safeApply();
            },function(response, status,headers){
                ErrorHandlerMy (response, status,headers);
                $scope.preloader = false;
                $scope.safeApply();
            });
        };

        $scope.OnOkrSelect = function () {
            $scope.errorLabelText="";
            $scope.blocks = null;
            $scope.disciplines =null;
            $scope.selectData.Direction = null;
            $scope.specialities =[];
            $scope.profTrains.forEach(function (profTrain, iterator ,arr) {
                if(profTrain.OkrName == $scope.selectData.Okr){
                    switch ($scope.selectData.Okr) {
                        case 'Бакалавр': {
                            $scope.Dc.Semesters = [1,2,3,4,5,6,7,8];
                            break;
                        }
                        case 'Магістр': {
                            $scope.Dc.Semesters = [9,10,11,12];
                            break;
                        }
                        case 'Спеціаліст': {
                            $scope.Dc.Semesters = [9,10];
                            break;
                        }

                    }
                    $scope.specialities.push(profTrain.Speciality);
                }
            });
            $scope.safeApply();
        };

        $scope.OnFullSelect = function (onlyGroupUpdate) {
            $scope.errorLabelText="";
            var path="";
            $scope.disciplines =null;
            $scope.semestrsForView = null;
            $scope.blocksWidthDisciplines = null;
            var cathedraIdBool =    $scope.selectData.CathedraId != null;
            var directionBool =     $scope.selectData.Direction != null;
            var okrBool =           $scope.selectData.Okr != null;
            var studyYearBool =     $scope.selectData.StudyYear != null;
            if (cathedraIdBool && directionBool && okrBool && studyYearBool && $scope.section=='specialization'){
                $scope.preloader = true;
                $scope.safeApply();
                var blocks= [];
                var groupedBlocksArray =[];
                var compareSemester = 0;
                path = "SelectiveDiscipline/"+$scope.selectData.StudyYear+"/BlockChoiceWhom/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль записи у базі відсутні";
                        $scope.preloader = false;
                        $scope.safeApply();
                    } else {
                        var semestrForView  = BlockChoiceFromResponseToView(response);
                        $scope.semestrsForView = semestrForView;
                        $scope.preloader = false;
                        $scope.safeApply();
                    }
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
            }else if(cathedraIdBool && directionBool && okrBool && ($scope.section=='patterns' || ($scope.section=='apply' && !onlyGroupUpdate))) {
                $scope.selectData.Patterns = [];
                $scope.preloader = true;
                $scope.safeApply();
                var patterns= [];
                $scope.patterns =null;
                path = "SelectiveDiscipline/PatternBlockChoise/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль записи у базі відсутні.";
                        $scope.patterns = [];
                        $scope.preloader = false;
                        $scope.safeApply();
                    } else {
                        response.forEach(function (item, i, arr) {
                            var patternBlockChoice8Id = item.patternBlockChoice8Id
                                , rtProfTrainTotalSubdivisionId = item.profTrainTotalSubdivisionId
                                , blockName = item.block.name
                                , blockId = item.block.id
                                , cycleName = item.cycle.name
                                , cycleId = item.cycle.id
                                , course = item.course
                                , semester = item.semester
                                , countDiscipline = item.countDiscipline
                                , patternName = item.name;
                            patterns.push(new PatternModel(patternBlockChoice8Id, rtProfTrainTotalSubdivisionId, blockName, blockId, cycleName, cycleId, course, semester, countDiscipline, patternName));
                        });
                        $scope.patterns = patterns;
                        $scope.selectData.ProfTrainTotalSubdivisionId = patterns[0].ProfTrainTotalSubdivisionId;
                        $scope.preloader = false;
                        $scope.safeApply();
                    }
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
            }
            if(cathedraIdBool && directionBool && okrBool && studyYearBool && $scope.section=='apply'){
                $scope.preloader = true;
                $scope.safeApply();
                path = "SelectiveDiscipline/"+$scope.selectData.StudyYear+"/GetGroupsByYearInTake/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль групи у базі відсутні.";
                        $scope.groups = null;
                        $scope.blocksChoise = null;
                        $scope.preloader = false;
                        $scope.safeApply();
                    } else {
                        $scope.groups = response;
                        console.log($scope.groups);
                        path = "SelectiveDiscipline/BlockChoice/";
                        response.forEach(function(group, i, arr){
                            path+=group.id;
                            if(arr[i+1]!= undefined){
                                path+=",";
                            }
                        });
                        Api.execute("GET", path).then(function(response) {
                            $scope.blocksChoise = response;
                            console.log($scope.blocksChoise);
                            // blockChoiceWhomId
                            // blockId
                            // blockName
                            // countDiscipline
                            // course
                            // cycleId
                            // cycleName
                            // groupId
                            // semestr
                            // studyGroupId
                            // studyGroupName
                            // studyYearCourse
                            $scope.preloader = false;
                            $scope.safeApply();
                        },function(response, status,headers){
                            ErrorHandlerMy (response, status,headers);
                            $scope.preloader = false;
                            $scope.safeApply();
                        });

                    }
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
            }
        };

        $scope.GetAllDisciplines = function (blocks) {
            $scope.errorLabelText="";
            $scope.preloader = true;
            blocks.forEach(function (block,iter,arr) {
                var path = "SelectiveDiscipline/"+$scope.selectData.StudyYear+"/DisciplineChosen/"+block.BlockId;
                Api.execute("GET", path).then(function(response) {
                    var disciplinesBlock =[];
                    var tatalMaxCountStudent =0;
                    var tatalOccupiedPercent =0;
                    var tatalSubscribed =0;
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль записи у базі відсутні";
                        $scope.blocksWidthDisciplines = null;
                        $scope.preloader = false;
                        $scope.safeApply();
                    }else {
                        response.forEach(function (item, i, arr) {
                            var disciplineBlockYearId = item.disciplineBlockYearId
                                , disciplineName = item.disciplineName
                                , maxCountStudent = item.maxCountStudent
                                , occupiedPercent = item.occupiedPercent
                                , stydyCourse = item.stydyCourse
                                , subscribed = item.subscribed
                                , whoReadId = item.whoReadId
                                , whoReadAbbreviation = item.whoReadAbbreviation
                                , whoReadName = item.whoReadName;
                            disciplinesBlock.push(new DisciplineModel(disciplineBlockYearId, disciplineName, maxCountStudent, occupiedPercent, stydyCourse, subscribed, whoReadId, whoReadAbbreviation, whoReadName));
                            tatalMaxCountStudent += maxCountStudent;
                            tatalSubscribed += subscribed;
                        });
                        tatalOccupiedPercent =tatalMaxCountStudent!=0? tatalSubscribed / tatalMaxCountStudent:1;
                        disciplinesBlock.push(new DisciplineModel(0, "Разом", tatalMaxCountStudent, tatalOccupiedPercent, "", tatalSubscribed, "", "", ""));
                        block.DisciplineArray = disciplinesBlock;
                        $scope.blocksWidthDisciplines = blocks;
                        $scope.preloader = false;
                        $scope.safeApply();
                    }
                });
            });
        };

        $scope.OnDisciplineChose = function (blockId) {
            // console.log(blockId);
            $scope.preloader = true;
            var disciplines= [];
            var path = "SelectiveDiscipline/"+$scope.selectData.StudyYear+"/DisciplineChosen/"+blockId;
            Api.execute("GET", path).then(function(response) {
                // console.log(response);
                response.forEach(function(item, i, arr){
                    var disciplineBlockYearId = item.disciplineBlockYearId
                        ,disciplineName = item.disciplineName
                        ,maxCountStudent = item.maxCountStudent
                        ,occupiedPercent = item.occupiedPercent
                        ,stydyCourse = item.stydyCourse
                        ,subscribed = item.subscribed
                        ,whoReadId = item.whoReadId
                        ,whoReadAbbreviation = item.whoReadAbbreviation
                        ,whoReadName = item.whoReadName;
                    disciplines.push(new DisciplineModel(disciplineBlockYearId,disciplineName,maxCountStudent,occupiedPercent,stydyCourse,subscribed, whoReadId, whoReadAbbreviation, whoReadName));

                },function(response, status,headers){
                    ErrorHandlerMy(response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
                $scope.disciplines = disciplines;
                // console.log($scope.disciplines);
                $scope.preloader = false;
                $scope.safeApply();
            });
        };

        $scope.UpdateModalForGroup = function(groupName){
            $scope.ModalGroupInfo ={
                GroupName: groupName,
            }
        };

        $scope.PatternChecked = function(pattern){
            if(~$scope.selectData.Patterns.indexOf(pattern)){
                $scope.selectData.Patterns.splice($scope.selectData.Patterns.indexOf(pattern),1);
            }else{
                $scope.selectData.Patterns.push(pattern);
            }
        };

        $scope.PatternImplement = function () {
            $scope.errorLabelText="";
            $scope.implementReport = null;
            if($scope.selectData.Patterns.length >0 && $scope.groups!=null){
                var path ="";
                var method= "";
                $scope.preloader = true;
                $scope.safeApply();
                var payload = {
                    PatternBlockList: $scope.selectData.Patterns,
                    GroupList:$scope.groups,
                    StudyYearPublish : $scope.selectData.StudyYear
                };
                path = "SelectiveDiscipline/BlockChoiseImplement";
                method = "POST";
                console.log($scope.patterns);
                Api.execute(method, path,payload).then(function (resp) {
                    $scope.OnFullSelect();
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.preloader = false;
                    $scope.safeApply();
                });
            }else{
                if($scope.selectData.Patterns.length ==0){
                    $scope.errorLabelText = "Помилка! Оберіть хочаб один шаблон. ";
                }
                if($scope.groups==null){
                    $scope.errorLabelText += "| Оберіть рік вступу для якого у базі є записи про группи.";
                }
                $scope.safeApply();
            }
        };

        $scope.SwitchSections = function (event) {
            $scope.section = event.target.value;
            $scope.OnFullSelect()
        };

        $scope.SwitchSemester = function (value) {
            $scope.semester = value;
            $scope.OnFullSelect();
        };

        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn)
                    fn();
            } else {
                this.$apply(fn);
            }
        };

        $scope.checkAllForm = function (data) {
            console.log(data);
            if(data == null || data==""){
                return "Заполніть це поле!";
            }
        };

        //save pattern
        $scope.savePattern = function(data,pattern) {
            var path ="";
            var method= "";
            var patternBlockChoice8Id = pattern.PatternBlockChoice8Id,
                profTrainTotalSubdivisionId = $scope.selectData.ProfTrainTotalSubdivisionId,
                blockName = GetBlockNameById($scope.Dc.Blocks,data.BlockId),
                blockId =  data.BlockId,
                cycleName = GetCycleNameById($scope.Dc.Cycles,data.CycleId) ,
                cycleId =  data.CycleId,
                course = GetCourseBySemester(data.Semester),
                semester =  data.Semester,
                countDiscipline = data.CountDiscipline,
                patternName =  data.PatternName;
            var newPattern =  new PatternModel(patternBlockChoice8Id, profTrainTotalSubdivisionId,blockName, blockId, cycleName, cycleId, course, semester, countDiscipline ,patternName);
            console.log(newPattern);
            $scope.patterns.splice($scope.patterns.indexOf(pattern),1,newPattern);
            var payload = {
                Block:{
                    Id:blockId,
                },
                Cycle:{
                    Id: cycleId,
                },
                ProfTrainTotalSubdivisionId: profTrainTotalSubdivisionId,
                Name: patternName,
                CountDiscipline: countDiscipline,
                Course: course,
                Semester: semester,
                Id: patternBlockChoice8Id == null?0:patternBlockChoice8Id,
            };
            path = "SelectiveDiscipline/PatternBlockChoise";
            method = patternBlockChoice8Id==null? "POST": "PUT";

            Api.execute(method, path,payload).then(function (resp) {
                $scope.OnFullSelect();
            },function(response, status,headers){
                ErrorHandlerMy (response, status,headers);
                $scope.preloader = false;
                $scope.safeApply();
            });
        };

        // remove patterb
        $scope.removePattern = function(pattern) {
            if (confirm("Ви впеврені що хочете видалити цей шаблон?"))
            {
                var payload = {
                    Id: pattern.PatternBlockChoice8Id
                };

                var  path = "SelectiveDiscipline/PatternBlockChoise";
                $scope.patterns.splice($scope.patterns.indexOf(pattern),1);
                Api.execute("DELETE", path,payload);
            }
        };

        // add patterb
        $scope.addPattern = function() {
            $scope.inserted = {
                PatternBlockChoice8Id : null,
                RtProfTrainTotalSubdivisionId : null,
                BlockName : null,
                BlockId : null,
                CycleName : null,
                CycleId : null,
                Course : null,
                Semester : null,
                CountDiscipline : null,
                PatternName : null
            };
            $scope.patterns.unshift($scope.inserted);
            $scope.safeApply();
        };

        //save pattern
        $scope.saveBlock = function(data,block) {
            var path ="";
            var method= "";
            $scope.preloader = true;
            $scope.safeApply();
            debugger;
            console.log($scope.groups);
            console.log(data);
            console.log(block);
            var groupChosen = FindGroupInGroups($scope.groups,data.groupId);
            var blockChoiceWhom8Id = block.id,
                dcBlock8Id = data.blockId,
                semester = data.semester ,
                studyYearPublish = block.studyYearPublish,
                course = GetCourseBySemester(semester),
                cycleId = data.cycleId,
                groupId = data.groupId,
                studyGroupId = GetStudyGroupIdFromGroupByCourse(groupChosen,course),
                studyYearCourse = GetStudyYearCourse(studyYearPublish,course),
                countDiscipline = block.countDiscipline;
            var payload = {
                StudyYearCourse : studyYearCourse ,
                CountDiscipline : countDiscipline ,
                StudyYearPublish : studyYearPublish ,
                Cycle : {
                    Id: cycleId ,
                    Name: GetCycleNameById($scope.Dc.Cycles, cycleId) ,

                } ,
                GroupId : groupId ,
                Id : blockChoiceWhom8Id ,
                StudyGroup : {
                    Id: studyGroupId ,
                    Name: groupChosen.name ,

                } ,
                Course : course ,
                Semestr : semester ,
                Block : {
                    Id: dcBlock8Id ,
                    Name: GetBlockNameById($scope.Dc.Blocks, dcBlock8Id) ,

                } ,
            };
            path = "SelectiveDiscipline/BlockChoise";
            method = blockChoiceWhom8Id==null? "POST": "PUT";

            Api.execute(method, path,payload).then(function (resp) {
                $scope.OnFullSelect();
            },function(response, status,headers){
                ErrorHandlerMy (response, status,headers);
                $scope.preloader = false;
                $scope.safeApply();
            });
        };

        //    MODELS!!!
        function SubdivisionModel(SubdivisionId,Name){
            this.SubdivisionId =SubdivisionId;
            this.Name =Name;
        }

        function SubsystemModel(SubsystemId, Subdivision) {
            this.SubsystemId = SubsystemId;
            this.Subdivision = Subdivision;
        }

        function SpecialityModel( Code,Name, ProfTrainTotalId) {
            this.Code = Code;
            this.Name = Name;
            this.ProfTrainTotalId = ProfTrainTotalId;

        }

        function ProfTrainModel( OkrName,Speciality) {
            this.OkrName = OkrName;
            this.Speciality = Speciality;
        }

        function BlockChoiceWhomModel(blockChoiceWhomId, blockId, blockName,course,semestr,studyGroupName) {
            this.BlockChoiceWhomId = blockChoiceWhomId;
            this.BlockId = blockId;
            this.BlockName = blockName;
            this.Course = course;
            this.Semestr = semestr;
            this.StudyGroupName = studyGroupName;

        }

        function DisciplineModel(disciplineBlockYearId, disciplineName, maxCountStudent, occupiedPercent, stydyCourse, subscribed, whoReadId, whoReadAbbreviation, whoReadName) {
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

        function SemestrsBlocksModel(course, semestr, groupsArray,blocksArray) {
            this.Course = course;
            this.Semestr = semestr;
            this.Groups = groupsArray;
            this.Blocks = blocksArray;

        }

        function BlockModel(blockId, blockName, disciplines, summarize ) {
            this.BlockName = blockName ;
            this.BlockId = blockId ;
            this.DisciplineArray= disciplines;
            this.Summarize =summarize;
        }

        function CycleModel(cycleId, cycleName) {
            this.CycleName = cycleName ;
            this.CycleId = cycleId ;
        }

        function PatternModel(patternBlockChoice8Id, rtProfTrainTotalSubdivisionId,blockName, blockId, cycleName, cycleId, course, semester, countDiscipline ,patternName) {
            this.PatternBlockChoice8Id = patternBlockChoice8Id ;
            this.ProfTrainTotalSubdivisionId = rtProfTrainTotalSubdivisionId ;
            this.Block ={
                Name : blockName,
                Id : blockId
            };
            this.Cycle={
                Name : cycleName ,
                Id : cycleId
            };
            this.Course = course ;
            this.Semester = semester ;
            this.CountDiscipline = countDiscipline ;
            this.PatternName = patternName ;
        }

    });
