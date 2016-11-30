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
        };

        $scope.sortType     = 'Course'; // значение сортировки по умолчанию
        $scope.sortReverse  = false;  // обратная сортировка

        $scope.sortTypeBlock     = 'MaxCountStudent'; // значение сортировки по умолчанию
        $scope.sortReverseBlock  = false;  // обратная сортировка

        $scope.section = "specialization";
        $scope.semester = "";
        $scope.blockIdShow =0;
        /// Написать запросы на DcCycle и DcBlock
        // Логику для Courses и
        $scope.Dc ={
            Cycles      : [
                new CycleModel(1,"Цикл гуманітарної та соціально-економічної підготовки"),
                new CycleModel(2,"Цикл математичної природничо-наукової підготовки"),
                new CycleModel(3,"Цикл професійної та практичної підготовки"),
                new CycleModel(4,"Гуманітарна складова"),
                new CycleModel(5,"Професійна складова")
            ],
            Blocks      : [
                new BlockModel(1,"Екологічні навчальні дисципліни"),
                new BlockModel(2,"Мовні навчальні дисципліни"),
                new BlockModel(3,"Історичні навчальні дисципліни"),
                new BlockModel(4,"Філософські навчальні дисципліни"),
                new BlockModel(5,"Психологічні навчальні дисципліни"),
                new BlockModel(6,"Педагогічні навчальні дисципліни"),
                new BlockModel(7,"Правові навчальні дисципліни"),
                new BlockModel(8,"Додаткові навчальні дисципліни вільного вибору"),
                new BlockModel(9,"Навчальні дисципліни зі сталого розвитку"),
                new BlockModel(10,"Навчальні дисципліни з менеджменту і маркетингу"),
                new BlockModel(11,"Перший блок дисциплін"),
                new BlockModel(12,"Другий  блок дисциплін")
            ],
            Courses     : [1,2,3,4],
            Semesters   : [1,2,3,4,5,6,7,8]
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

                // console.log(getPermissionSubsystemFromToken());
                // console.log();
                // console.log(sClaim);
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
                        var subdivisionId = itemForEachJSON.Subdivision.SubdivisionId;
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
                        var subdivisionId = responsive.Subdivision.SubdivisionId;
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
                if(item.BlockId == blockId){
                    blockName =  item.BlockName;
                }
            });
            return blockName;
        }

        function GetCycleNameById(dcCycle, cycleId) {
            var cycleName ="";
            dcCycle.forEach(function (item,iter,arr) {
                if(item.CycleId == cycleId){
                    cycleName =  item.CycleName;
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
                var blockChoiceWhomId = item.blockChoiceWhomId
                    , blockId = item.blockId
                    , blockName = item.blockName
                    , course = item.course
                    , semestr = item.semestr
                    , studyGroupName = item.studyGroupName;
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
            if(response.statusText == 'Unauthorized'){
                errorDetails= "Ви не авторизовані у системі. Статус: " +response.status;
                Api.logout();
            }else if(response.statusText == ''){
                errorDetails= "Перевірте інтернет з'єднання.";
            }
            $scope.errorLabelText="Помилка. "+errorDetails;
            console.log(response);
            console.log(status);
            console.log(headers);
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
                    $scope.specialities.push(profTrain.Speciality);
                }
            });
            $scope.safeApply();
        };

        $scope.OnFullSelect = function () {
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
                        $scope.safeApply();
                    } else {
                        var semestrForView  = BlockChoiceFromResponseToView(response);
                        $scope.semestrsForView = semestrForView;
                        $scope.preloader = false;
                        $scope.safeApply();
                    }
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.safeApply();
                });
            }else if(cathedraIdBool && directionBool && okrBool && ($scope.section=='patterns' || $scope.section=='apply')) {
                $scope.preloader = true;
                $scope.safeApply();
                var patterns= [];
                $scope.patterns =null;
                path = "SelectiveDiscipline/PatternBlockChoise/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
                Api.execute("GET", path).then(function(response) {
                    if (!response || response == "") {
                        $scope.errorLabelText="На жаль записи у базі відсутні.";
                        $scope.patterns = [];
                        $scope.safeApply();
                    } else {
                        response.forEach(function (item, i, arr) {
                            var patternBlockChoice8Id = item.patternBlockChoice8Id
                                , rtProfTrainTotalSubdivisionId = item.profTrainTotalSubdivisionId
                                , blockName = item.blockName
                                , blockId = item.blockId
                                , cycleName = item.cycleName
                                , cycleId = item.cycleId
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
                        $scope.safeApply();
                    } else {
                        $scope.groups = response;
                        console.log($scope.groups);
                        path = "SelectiveDiscipline/BlockChoice/";
                        response.forEach(function(group, i, arr){
                            path+=group.groupId;
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
                            $scope.safeApply();
                        });

                    }
                },function(response, status,headers){
                    ErrorHandlerMy (response, status,headers);
                    $scope.safeApply();
                });
            }
        };
        $scope.GetAllDisciplines = function (blocks) {
            $scope.errorLabelText="";
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
                        tatalOccupiedPercent = tatalSubscribed / tatalMaxCountStudent;
                        disciplinesBlock.push(new DisciplineModel(0, "Разом", tatalMaxCountStudent, tatalOccupiedPercent, "", tatalSubscribed, "", "", ""));
                        block.DisciplineArray = disciplinesBlock;
                        $scope.blocksWidthDisciplines = blocks;
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

        //save patterb
        $scope.savePattern = function(data,pattern) {
            var path ="";
            var method= "";
            var patternBlockChoice8Id = pattern.PatternBlockChoice8Id,
                profTrainTotalSubdivisionId = $scope.selectData.ProfTrainTotalSubdivisionId,
                blockName = GetBlockNameById($scope.Dc.Blocks,data.BlockId),
                blockId =  data.BlockId,
                cycleName = GetCycleNameById($scope.Dc.Cycles,data.CycleId) ,
                cycleId =  data.CycleId,
                course = data.Course,
                semester =  data.Semester,
                countDiscipline = data.CountDiscipline,
                patternName =  data.PatternName;
            var newPattern =  new PatternModel(patternBlockChoice8Id, profTrainTotalSubdivisionId,blockName, blockId, cycleName, cycleId, course, semester, countDiscipline ,patternName);
            console.log(newPattern);
            $scope.patterns.splice($scope.patterns.indexOf(pattern),1,newPattern);
            var payload = {
                BlockId: blockId,
                CycleId: cycleId,
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
            this.BlockName = blockName ;
            this.BlockId = blockId ;
            this.CycleName = cycleName ;
            this.CycleId = cycleId ;
            this.Course = course ;
            this.Semester = semester ;
            this.CountDiscipline = countDiscipline ;
            this.PatternName = patternName ;
        }

    });
