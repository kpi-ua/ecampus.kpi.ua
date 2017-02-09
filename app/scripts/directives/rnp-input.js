angular.module('ecampusApp')
    .directive('rnpInput',function (Api) {
        return{
            link: function ($scope, element, attrs) {
                var useId =Api.getCurrentUser().id;

                var chainResponsibility= [
                    'StudyYear','Department','Okr','Specialization','StudyForm','XmlCodes'
                ];

                onInit();

                function onInit() {
                    SetStudyYears(true);
                }

                function SetStudyYears(isInit) {
                    var path = "studyYears";

                    Api.execute("GET", path).then(function(response) {
                        const selectName = "StudyYear";
                        var StudyYearsWatcher = $scope.$watch($scope.options.StudyYears, OnStudyYearsSet());
                        if (!response || response == "") {
                            $scope.errorLabelText="На жаль, дані відсутні.";
                            resetSelectDataOptionsAndModel(selectName);
                        } else {
                            $scope.options.StudyYears = response;
                            OnStudyYearsSet(isInit);
                        }
                    });
                }

                function OnStudyYearsSet(isInit,chainObject) {
                    // const initStudyYearIndex = 0;
                    const initStudyYearIndex = 5;
                    const selectName = "StudyYear";
                    if($scope.options.StudyYears[initStudyYearIndex] != undefined && isInit){
                        var StudyYear = $scope.options.StudyYears[initStudyYearIndex];
                        $scope.selectData.studyYearId = StudyYear.id;
                        $scope.model.studyYearName = StudyYear.name;
                        SetDepartments(useId, $scope.selectData.studyYearId,isInit);
                    }else if(chainObject!= undefined) {
                        if (chainObject.selectName == selectName) {
                            $scope.selectData.studyYearId = chainObject.chosenObj.id;
                            SetDepartments(useId, $scope.selectData.studyYearId,true);
                        }else{
                            OnDepartmentSet(false,chainObject);
                        }
                    }
                }

                function SetDepartments(userId, studyYear,isInit) {
                    const selectName = "Department";
                    var path = "Rnp/"+userId+"/Subdivision/"+studyYear;
                    Api.execute("GET", path).then(function(response) {
                        if (!response || response == "") {
                            $scope.errorLabelText="На жаль, дані відсутні";
                            resetSelectDataOptionsAndModel(selectName);
                        } else {
                            $scope.options.Departments = response;
                            OnDepartmentSet(isInit);
                        }
                    });
                }

                function OnDepartmentSet(isInit,chainObject){
                    const initDepartmentsIndex = 0;
                    const selectName = "Department";
                    if($scope.options.Departments[initDepartmentsIndex] !=undefined && isInit) {
                        var curDepartment = $scope.options.Departments[initDepartmentsIndex];
                        $scope.selectData.departmentId = curDepartment.id;
                        $scope.selectData.departmentMark = curDepartment.mark;
                        $scope.model.departmentItem = curDepartment;
                        SetOkr(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                            $scope.selectData.departmentMark, isInit);
                    }else if(chainObject!= undefined) {
                        if (chainObject.selectName == selectName) {
                            $scope.selectData.departmentId = chainObject.chosenObj.id;
                            $scope.selectData.departmentMark = chainObject.chosenObj.mark;
                            SetOkr(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                                $scope.selectData.departmentMark, true);
                        }else{
                            OnOkrSet(false,chainObject);
                        }
                    }
                }
                
                function SetOkr(useId,studyYearId,chosenSubdivisionId,chosenSubdivisionMark,isInit) {
                    const selectName = "Okr";
                    var path = "Rnp/"+useId+"/Okr/"+studyYearId+"/"+chosenSubdivisionId+"/"+chosenSubdivisionMark;
                    Api.execute("GET", path).then(function(response) {
                        if (!response || response == "") {
                            $scope.errorLabelText="На жаль, дані відсутні";
                            resetSelectDataOptionsAndModel(selectName);
                        } else {
                            $scope.options.Okrs = response;
                            OnOkrSet(isInit);
                        }
                    });
                }

                function OnOkrSet(isInit,chainObject){
                    const initOkrIndex = 0;
                    const selectName = "Okr";
                    if($scope.options.Okrs[initOkrIndex] !=undefined && isInit) {
                        var curOkr = $scope.options.Okrs[initOkrIndex];
                        $scope.selectData.okrId = curOkr.id;
                        $scope.model.okrName = curOkr.name;
                        // console.log($scope.model.okrName);
                        SetSpecializations(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                            $scope.selectData.departmentMark,$scope.selectData.okrId, isInit);
                    }else if(chainObject!= undefined) {
                        if (chainObject.selectName == selectName) {
                            $scope.selectData.okrId = chainObject.chosenObj.id;
                            SetSpecializations(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                                $scope.selectData.departmentMark,$scope.selectData.okrId, true);
                        }else{
                            OnSpecializationsSet(false,chainObject);
                        }
                    }
                }

                function SetSpecializations(useId,studyYearId,chosenSubdivisionId,chosenSubdivisionMark,okrId,isInit) {
                    const selectName = "Specialization";
                    var path = "Rnp/"+useId+"/Specialization/"+studyYearId+"/"+chosenSubdivisionId+"/"+chosenSubdivisionMark+"/"+okrId;
                    Api.execute("GET", path).then(function(response) {
                        if (!response || response == "") {
                            $scope.errorLabelText="На жаль, дані відсутні";
                            resetSelectDataOptionsAndModel(selectName);
                        } else {
                            $scope.options.Specializations = response;
                            OnSpecializationsSet(isInit);
                        }
                    });
                 }

                function OnSpecializationsSet(isInit,chainObject){
                    const initSpecializationsIndex = 0;
                    const selectName = "Specialization";
                    if($scope.options.Specializations[initSpecializationsIndex] !=undefined && isInit) {
                        var curSpecialization = $scope.options.Specializations[initSpecializationsIndex];
                        $scope.selectData.specializationId = curSpecialization.id;
                        $scope.model.specializationCodeName = curSpecialization.code+"  "+curSpecialization.name;
                        SetStudyForms(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                            $scope.selectData.departmentMark,$scope.selectData.specializationId, isInit);
                    }else if(chainObject!= undefined) {
                        if (chainObject.selectName == selectName) {
                            $scope.selectData.specializationId = chainObject.chosenObj.id;
                            SetStudyForms(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                                $scope.selectData.departmentMark,$scope.selectData.specializationId, true);
                        }else{
                            OnStudyFormsSet(false,chainObject);
                        }
                    }
                }

                function SetStudyForms(useId,studyYearId,chosenSubdivisionId,chosenSubdivisionMark,specializationId,isInit) {
                    const selectName = "StudyForm";
                    var path = "Rnp/" + useId + "/StudyForm/" + studyYearId + "/" + chosenSubdivisionId +
                        "/" + chosenSubdivisionMark + "/" + specializationId;
                    Api.execute("GET", path).then(function (response) {
                        if (!response || response == "") {
                            $scope.errorLabelText = "На жаль, дані відсутні";
                            resetSelectDataOptionsAndModel(selectName);
                        } else {
                            $scope.options.StudyForms = response;
                            OnStudyFormsSet(isInit);
                        }
                    });
                }

                function OnStudyFormsSet(isInit,chainObject){
                    const initStudyFormsIndex = 0;
                    const selectName = "StudyForm";
                    if($scope.options.StudyForms[initStudyFormsIndex] !=undefined && isInit) {
                        var curStudyForm = $scope.options.StudyForms[initStudyFormsIndex];
                        $scope.selectData.studyFormId = curStudyForm.id;
                        $scope.model.studyFormName = curStudyForm.name;

                        SetXmlCodes(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                            $scope.selectData.departmentMark,$scope.selectData.specializationId,$scope.selectData.studyFormId, isInit);
                    }else if(chainObject!= undefined) {
                        if (chainObject.selectName == selectName) {
                            $scope.selectData.studyFormId = chainObject.chosenObj.id;
                            SetXmlCodes(useId, $scope.selectData.studyYearId,$scope.selectData.departmentId,
                                $scope.selectData.departmentMark,$scope.selectData.specializationId,$scope.selectData.studyFormId, true);
                        }else{
                            OnXmlCodesSet(false,chainObject);
                        }
                    }
                }

                function SetXmlCodes(useId,studyYearId,chosenSubdivisionId,chosenSubdivisionMark,specializationId, studyFormId,isInit) {
                    const selectName = "XmlCodes";
                    var path = "Rnp/"+useId+"/XMLCode/"+studyYearId+"/"+chosenSubdivisionId+
                        "/"+chosenSubdivisionMark+"/"+specializationId+"/"+studyFormId;
                    Api.execute("GET", path).then(function(response) {
                        if (!response || response == "") {
                            $scope.errorLabelText="На жаль, дані відсутні";
                            resetSelectDataOptionsAndModel(selectName);
                        } else {
                            $scope.options.XmlCodes = response;
                            OnXmlCodesSet(isInit);
                        }
                    });
                 }

                function OnXmlCodesSet(isInit){
                    const initXmlCodesIndex = 0;
                    const selectName = "XmlCodes";
                    if($scope.options.XmlCodes[initXmlCodesIndex] !=undefined && isInit) {
                        var curXmlCodes= $scope.options.XmlCodes[initXmlCodesIndex];
                        $scope.selectData.xmlCodeId = curXmlCodes.id;
                        $scope.model.xmlCode = curXmlCodes.name;

                        $scope.$emit("rnpIdSelect", {
                            userAccountId: useId,
                            chosenDepartmentId: $scope.selectData.departmentId,
                            chosenDepartmentMark: $scope.selectData.departmentMark,
                            rnpId: curXmlCodes.id
                        });
                    }else if(chainObject!= undefined) {
                        if (chainObject.selectName == selectName) {
                            $scope.selectData.xmlCodeId = chainObject.chosenObj.id;
                            $scope.$emit("rnpIdSelect", {
                                userAccountId: useId,
                                chosenDepartmentId: $scope.selectData.departmentId,
                                chosenDepartmentMark: $scope.selectData.departmentMark,
                                rnpId: curXmlCodes.id
                            });
                        }else{

                        }
                    }
                }

                function GetItemByName(items, name) {
                    var item;
                    items.forEach(function (curItem, i, arr) {
                        if(curItem.name == name){
                            item = curItem;

                        }
                    });
                    return item;
                }

                function resetSelectDataOptionsAndModel(selectName) {
                    $scope.StudyGroups= null;
                    $scope.RnpRows= null;
                    switch (chainResponsibility.indexOf(selectName)){
                        case 0 :{
                            $scope.options.StudyYears=[];
                            $scope.selectData.studyYear=null;
                            $scope.model.studyYearName=null;

                        }
                        case 1 :{
                            $scope.options.Departments=[];
                            $scope.selectData.departmentId=null;
                            $scope.selectData.departmentMark=null;
                            $scope.model.departmentItem=null;
                        }
                        case 2 :{
                            $scope.options.Okrs=[];
                            $scope.selectData.okrId=null;
                            $scope.model.okrName=null;

                        }
                        case 3 :{
                            $scope.options.Specializations=[];
                            $scope.selectData.specializationId=null;
                            $scope.model.specializationCodeName=null;

                        }
                        case 4 :{
                            $scope.options.StudyForms=[];
                            $scope.selectData.studyFormId=null;
                            $scope.model.studyFormName=null;

                        }
                        case 5 :{
                            $scope.options.XmlCodes=[];
                            $scope.selectData.xmlCodeId=null;
                            $scope.model.xmlCode=null;
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                }

                $scope.onChange = function (selectedItem,selectName,items) {
                    $scope.errorLabelText="";
                    var chosenObj;
                    if(typeof selectedItem != 'object'){
                        chosenObj = GetItemByName(items, selectedItem);
                    }else{
                        chosenObj= selectedItem;
                    }
                    var chainObject={
                        selectName:selectName,
                        chosenObj:chosenObj
                    };
                    // console.log(chainObject);
                    OnStudyYearsSet(false,chainObject);
                }

            },
            templateUrl: 'views/directives/rnp-input.html',
            restrict : 'EA',

        }
    });