'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesSpecializationCtrl
 * @description
 * # DisciplinesSpecializationCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('DisciplinesSpecializationCtrl', function($scope, $cookies, $window, Api) {
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
        
        function DisciplineModel(disciplineBlockYearId, disciplineName, maxCountStudent, occupiedPercent, stydyCourse, subscribed) {
            this.DisciplineBlockYearId = disciplineBlockYearId;
            this.DisciplineName = disciplineName;
            this.MaxCountStudent = maxCountStudent;
            this.OccupiedPercent = occupiedPercent;
            this.StydyCourse = stydyCourse;
            this.Subscribed = subscribed;
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
            $scope.disciplines =null;
            var cathedraIdBool =    $scope.selectData.CathedraId == null? false:true;
            var directionBool =     $scope.selectData.Direction == null? false:true;
            var okrBool =           $scope.selectData.Okr == null? false:true;
            var studyYearBool =     $scope.selectData.StudyYear == null? false:true;
            console.log($scope.selectData.CathedraId +" - "+cathedraIdBool );
            console.log($scope.selectData.Okr +" - "+ okrBool);
            console.log($scope.selectData.Direction +" - "+ directionBool);
            console.log($scope.selectData.StudyYear +" - "+studyYearBool);
            if (cathedraIdBool && directionBool && okrBool && studyYearBool){
                $scope.preloader = true;
                var blocks= [];
                var path = "Subdivision/"+$scope.selectData.StudyYear+"/GetBlockChoiceWhome/"+$scope.selectData.CathedraId+"/"+$scope.selectData.Direction;
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

            }
        };

        $scope.OnDisciplineChose = function (blockId) {
            console.log(blockId);
            $scope.preloader = true;
            var disciplines= [];
            var path = "Subdivision/"+$scope.selectData.StudyYear+"/GetDisciplineChosen/"+blockId;
            Campus.execute("GET", path).then(function(response) {
                console.log(response);
                response.forEach(function(item, i, arr){
                    var disciplineBlockYearId = item.disciplineBlockYearId
                        ,disciplineName = item.disciplineName
                        ,maxCountStudent = item.maxCountStudent
                        ,occupiedPercent = item.occupiedPercent
                        ,stydyCourse = item.stydyCourse
                        ,subscribed = item.subscribed;
                    disciplines.push(new DisciplineModel(disciplineBlockYearId,disciplineName,maxCountStudent,occupiedPercent,stydyCourse,subscribed));

                });
                $scope.disciplines = disciplines;
                $scope.preloader = false;
                $scope.safeApply();
            });
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
    });