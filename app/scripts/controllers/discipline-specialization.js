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
            StudyYear : null
        };
        $scope.section = "specialization";
        reload();

        function reload() {
            $scope.preloader = true;
            if (!!Campus.getToken()) {
                var sClaim = decodeToken(Campus.getToken());

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

        function BlockModel(blockId, blockName ) {
            this.BlockName = blockName ;
            this.BlockId = blockId ;
        }

        function CycleModel(cycleId, cycleName) {
            this.CycleName = cycleName ;
            this.CycleId = cycleId ;
        }

        function PatternModel(patternBlockChoice8Id, rtProfTrainTotalSubdivisionId,blockName, blockId, cycleName, cycleId, course, semester, countDiscipline ,patternName) {
            this.PatternBlockChoice8Id = patternBlockChoice8Id ;
            this.RtProfTrainTotalSubdivisionId = rtProfTrainTotalSubdivisionId ;
            this.BlockName = blockName ;
            this.BlockId = blockId ;
            this.CycleName = cycleName ;
            this.CycleId = cycleId ;
            this.Course = course ;
            this.Semester = semester ;
            this.CountDiscipline = countDiscipline ;
            this.PatternName = patternName ;
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
            if (!!Campus.getToken()) {
                var sClaim = decodeToken(Campus.getToken());
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

        $scope.OnCathedraSelect = function () {
            $scope.blocks = null;
            $scope.disciplines =null;
            $scope.preloader = true;
            $scope.safeApply();
            $scope.selectData.Okr = null;
            $scope.selectData.Direction = null;
            var cathedraId = $scope.selectData.CathedraId;
            var path = "StudyOrganization/ProfTrains/"+ cathedraId;
            Campus.execute("GET", path).then(function(response) {

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
            });
        };

        $scope.OnOkrSelect = function () {
            $scope.blocks = null;
            $scope.disciplines =null;
            $scope.selectData.Direction = null;
            $scope.specialities =[];
            $scope.profTrains.forEach(function (profTrain, iterator ,arr) {
                if(profTrain.OkrName == $scope.selectData.Okr){
                    $scope.specialities.push(profTrain.Speciality);
                }
            });
        };

        $scope.OnFullSelect = function () {
            var path="";
            $scope.disciplines =null;
            var cathedraIdBool =    $scope.selectData.CathedraId != null;
            var directionBool =     $scope.selectData.Direction != null;
            var okrBool =           $scope.selectData.Okr != null;
            var studyYearBool =     $scope.selectData.StudyYear != null;
            if (cathedraIdBool && directionBool && okrBool && studyYearBool && $scope.section=='specialization'){
                $scope.preloader = true;
                var blocks= [];
                path = "SelectiveDiscipline/"+$scope.selectData.StudyYear+"/GetBlockChoiceWhom/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
                Campus.execute("GET", path).then(function(response) {
                    response.forEach(function(item, i, arr){
                        var blockChoiceWhomId = item.blockChoiceWhomId
                            ,blockId =  item.blockId
                            ,blockName =  item.blockName
                            ,course =  item.course
                            ,semestr =  item.semestr
                            ,studyGroupName =  item.studyGroupName;
                        blocks.push(new BlockChoiceWhomModel(blockChoiceWhomId,blockId,blockName,course,semestr,studyGroupName));
                    });
                    $scope.blocks = blocks;
                    $scope.preloader = false;
                    $scope.safeApply();
                });

            }else if(cathedraIdBool && directionBool && okrBool && $scope.section=='patterns') {
                $scope.preloader = true;
                var patterns= [];
                path = "SelectiveDiscipline/GetPatternBlockChoise/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
                Campus.execute("GET", path).then(function(response) {
                    response.forEach(function(item, i, arr){
                        var   patternBlockChoice8Id =  item.patternBlockChoice8Id
                            , rtProfTrainTotalSubdivisionId = item.rtProfTrainTotalSubdivisionId
                            , blockName = item.blockName
                            , blockId = item.blockId
                            , cycleName = item.cycleName
                            , cycleId = item.cycleId
                            , course = item.course
                            , semester = item.semester
                            , countDiscipline = item.countDiscipline
                            , patternName = item.patternName;
                        patterns.push(new PatternModel(patternBlockChoice8Id, rtProfTrainTotalSubdivisionId,blockName, blockId, cycleName, cycleId, course, semester, countDiscipline ,patternName));
                    });
                    $scope.patterns = patterns;
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
                    $scope.preloader = false;
                    $scope.safeApply();
                });
            }
        };

        $scope.OnDisciplineChose = function (blockId) {
            console.log(blockId);
            $scope.preloader = true;
            var disciplines= [];
            var path = "SelectiveDiscipline/"+$scope.selectData.StudyYear+"/GetDisciplineChosen/"+blockId;
            Campus.execute("GET", path).then(function(response) {
                console.log(response);
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

                });
                $scope.disciplines = disciplines;
                console.log(disciplines);
                $scope.preloader = false;
                $scope.safeApply();
            });
        };

        $scope.SwitchSections = function (event) {
            $scope.section = event.target.value;
        };

        function safeApply (fn) {
            $scope.safeApply(fn);
        }

        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn)
                    fn();
            } else {
                this.$apply(fn);
            }
        };

        //---TEST---
        $scope.users = [
            {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
            {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
            {id: 3, name: 'awesome user3', status: 2, group: null}
        ];

        $scope.statuses = [
            {value: 1, text: 'status1'},
            {value: 2, text: 'status2'},
            {value: 3, text: 'status3'},
            {value: 4, text: 'status4'}
        ];

        $scope.groups = [];
        $scope.loadGroups = function() {
            return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
                $scope.groups = data;
            });
        };

        $scope.showGroup = function(user) {
            if(user.group && $scope.groups.length) {
                var selected = $filter('filter')($scope.groups, {id: user.group});
                return selected.length ? selected[0].text : 'Not set';
            } else {
                return user.groupName || 'Not set';
            }
        };

        $scope.showStatus = function(user) {
            var selected = [];
            if(user.status) {
                selected = $filter('filter')($scope.statuses, {value: user.status});
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.checkName = function(data, id) {
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        };

        $scope.saveUser = function(data, id) {
            //$scope.user not updated yet
            angular.extend(data, {id: id});
            return $http.post('/saveUser', data);
        };

        // remove user
        $scope.removeUser = function(index) {
            $scope.users.splice(index, 1);
        };

        // add user
        $scope.addUser = function() {
            $scope.inserted = {
                id: $scope.users.length+1,
                name: '',
                status: null,
                group: null
            };
            $scope.users.push($scope.inserted);
        };
    });

// --------------- mock $http requests ----------------------
