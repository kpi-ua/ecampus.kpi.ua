'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:NppCtrl
 * @description
 * # NppCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('NppCtrl', function ($scope, $cookies, $window, Api) {
        $scope.cathedras = [];
        $scope.subdivisions = [];
        $scope.errorLabelText = "";
        $scope.tabIdForShow = -1;
        $scope.npps = [];
        $scope.chosenSubdivision = null;

        reload();

        function reload() {
            if (!!Api.getToken()) {
                var sClaim = Api.decodeToken(Api.getToken());

                if (!!sClaim) {
                    sClaim = JSON.parse(sClaim);
                }
            }

            if (!!Api.getToken()) {
                setFacultyAndInstitute();
                setSubdivisionDetails();
            }
        }

        function getParent(obj, parentTagName) {
            return (obj.tagName == parentTagName) ? obj : getParent(obj.parentNode, parentTagName);
        }

        function setRadioBtnForCathedras(responsive) {

            var subdivisionId = responsive.Subdivision.Id;
            var subdivisionName = responsive.Subdivision.Name;

            if (~subdivisionName.indexOf("Кафедра")) {
                $scope.cathedras.push({
                    cathedraId: subdivisionId,
                    cathedraName: subdivisionName
                });
            }
        }

        function setSubdivisionDetails() {

            var sClaim = Api.decodeToken(Api.getToken());
            sClaim = JSON.parse(sClaim);

            if (typeof(sClaim.resp) == "object") {
                sClaim.resp.forEach(function (itemForEach, i, arr) {
                    var itemForEachJSON = JSON.parse(itemForEach);
                    if (itemForEachJSON.Subsystem == 1) {
                        setRadioBtnForCathedras(itemForEachJSON);
                    }
                });
            } else {
                if (typeof(sClaim.resp) == "string") {
                    var responsive = JSON.parse(sClaim.resp);
                    if (responsive.Subsystem == 1) {
                        setRadioBtnForCathedras(responsive);
                    }
                }
            }
        }

        function setFacultyAndInstitute() {
            var kpiQuery = false;
            var sClaim = Api.decodeToken(Api.getToken());

            sClaim = JSON.parse(sClaim);

            if (typeof(sClaim.resp) == "object") {
                sClaim.resp.forEach(function (itemForEach, i, arr) {
                    kpiQuery = setFacultyAndInstituteLogic(itemForEach, kpiQuery);
                });
            } else {
                if (typeof(sClaim.resp) == "string") {
                    kpiQuery = setFacultyAndInstituteLogic(sClaim.resp, kpiQuery);
                }
            }

        }

        function setFacultyAndInstituteLogic(item, kpiQuery) {
            const NTUUKpiSubdivisionId = 9998;
            const InstituteTypeId = 26;
            const FacultyTypeId = 77;
            const CampusKpiSubsystemId =1;

            kpiQuery = !!kpiQuery;

            var itemForEachJSON = JSON.parse(item);

            if (itemForEachJSON.Subsystem == CampusKpiSubsystemId) {

                var subdivisionId = itemForEachJSON.Subdivision.Id;
                var subdivisionName = itemForEachJSON.Subdivision.Name;

                if (subdivisionId == NTUUKpiSubdivisionId && !kpiQuery) {
                    kpiQuery = true;
                    var pathFaculty = "Subdivision";
                    Api.execute("GET", pathFaculty).then(function (response) {
                        response.forEach(function (itemForEach) {

                            if (itemForEach.type.id == InstituteTypeId || itemForEach.type.id == FacultyTypeId) {
                                var subdivisionName = itemForEach.name;
                                var subdivisionId = itemForEach.id;

                                $scope.subdivisions.push({
                                    subdivisionId: subdivisionId,
                                    subdivisionName: subdivisionName
                                });
                            }
                        });

                    });
                }
                if (document.getElementById(subdivisionId + "") == null &&
                    (~subdivisionName.indexOf("факультет") || ~subdivisionName.indexOf("Факультет") || ~subdivisionName.indexOf("інститут") || ~subdivisionName.indexOf("Інститут"))) {
                    $scope.subdivisions.push({
                        subdivisionId: subdivisionId,
                        subdivisionName: subdivisionName
                    });
                }
            }
            return kpiQuery;
        }

        function loadCathedras() {

            $scope.npps = [];

            if (!$scope.chosenSubdivision) {
                return;
            }

            var parentId = $scope.chosenSubdivision.subdivisionId;
            var subdivisionPath = "Subdivision/" + parentId + "/children";

            Api.execute("GET", subdivisionPath).then(function (response) {
                $scope.cathedras = [];
                response.forEach(function (cathedra, i, arr) {
                    if (arr[i + 1] != undefined) {
                        $scope.cathedras.push({
                            cathedraId: cathedra.id,
                            cathedraName: cathedra.name
                        });
                    }
                });

            })
        }

        function ClearTableWithId(id , wrapperId) {
            var curTable = GetAngularDOMElement("#"+id);
            if(!!curTable)
            {
                curTable.remove()
            }
            var newTable = angular.element("<table>");
            newTable.attr("id",id);
            GetAngularDOMElement("#"+wrapperId).append(newTable);
        }

        function CreateTableRow() {
            return angular.element("<tr>");
        }

        function CreateTableHeaderCell() {
            return angular.element("<th>");
        }

        function CreateTableCell() {
            return angular.element("<td>");
        }

        function FillTableRow(colspanNumber, content, isHeader) {
            var row = CreateTableRow();
            content.forEach((cellText, i, arr)=>{
                var cell = isHeader? CreateTableHeaderCell() :CreateTableCell();
                cell.attr("colspan",colspanNumber);
                cell.text(cellText);
                row.append(cell);
            });
            return row;
        }

        function GetAngularDOMElement(query) {
            return angular.element(document.querySelector(query))   ;
        }

        //  For section npp
        $scope.checkNpp = function (chosenСathedraId) {
            $scope.errorLabelText = "";
            var cathedraId = chosenСathedraId;
            var path = "Statistic/Cathedras/" + cathedraId + "/Emplloyers/WithIndividualLoad/List";
            Api.execute("GET", path).then(function (response) {
                if (!response || response == "") {
                    $scope.errorLabelText = "На жаль, записи у базі даних відсутні.";
                } else {
                    $scope.semesters = response;

                    //for download
                    var wrapperTableForDownloadId = "wrapper-for-download";
                    var tableForDownloadId = "table-for-download";
                    ClearTableWithId(tableForDownloadId,wrapperTableForDownloadId);
                    var tableForDownload=GetAngularDOMElement("#"+tableForDownloadId);
                    response.forEach((employees, i, ar)=>{
                        if(i == 0){
                            tableForDownload.append(FillTableRow("3",["Перше півріччя (осінній семестр)"],true));
                        }else{
                            tableForDownload.append(FillTableRow("3",["Друге півріччя (весняний семестр)"],true));
                        }
                        employees.forEach((employee, iter, arr)=>{
                            tableForDownload.append(FillTableRow("3",[employee.name],false));
                            console.log(employee);
                            employee.subjects.forEach((subj, innerIter, arra)=>{
                                tableForDownload.append(FillTableRow("1",[subj.name,(subj.groupsNames).join('\n'),subj.year],false));
                            });
                        });
                    });
                }
            });
        };

        $scope.showTabById = function (id) {
            if ($scope.tabIdForShow != id) {
                $scope.tabIdForShow = id;
            } else {
                $scope.tabIdForShow = -1;
            }
        };

        $scope.$watch('chosenSubdivision', function () {
            loadCathedras();
        });

    });
