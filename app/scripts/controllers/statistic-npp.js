'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:NppCtrl
 * @description
 * # NppCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('NppCtrl', function($scope, $cookies, $window, Api) {
        $scope.cathedras=[];
        $scope.subdivisions=[];

        reload();

        $scope.chosenSelectChange = function (){
            var parentId = $scope.chosenCathedraId;
            var subdivisionPath = "Subdivision/" + parentId + "/children";
            $scope.preloader = true;
            Campus.execute("GET", subdivisionPath).then(function(response) {
                $scope.cathedras = [];
                response.forEach(function(itemForEach, i, arr) {
                    if (arr[i + 1] != undefined) {
                        var cathedraId = itemForEach.id;
                        var cathedraName = itemForEach.name;
                        $scope.cathedras.push({
                            cathedraId : cathedraId,
                            cathedraName :cathedraName
                        });
                    }
                });
                $scope.preloader = false;
                renderPage();
            })
        };

        function reload() {

            if (!!Campus.getToken()) {
                var sClaim = decodeToken(Campus.getToken());

                if (!!sClaim) {
                    sClaim = JSON.parse(sClaim);
                }
            }

            $('#1, #2').on('click', '.panel-heading', function(event) {

                var panelId = this.parentNode.id;
                $("#" + panelId + " .table").toggleClass("hidden");                
                $("#" + panelId + " .panelHeadingHover").toggleClass("active");
            });


            $('#1, #2').on('click', 'table', function() {});

            if (!!Campus.getToken()) {
                setFacultyAndInstitute();
                setSubdivisionDetails();
                $scope.preloader=false;
            }
        }

        function decodeToken(accessTokenIn) {

            if (!accessTokenIn || accessTokenIn == 'null') {
                return null;
            }

            var a = accessTokenIn.split(".");
            var uHeader = b64utoutf8(a[0]);
            var uClaim = b64utoutf8(a[1]);

            var pHeader = KJUR.jws.JWS.readSafeJSONString(uHeader);
            var pClaim = KJUR.jws.JWS.readSafeJSONString(uClaim);

            var sHeader = JSON.stringify(pHeader, null, "  ");
            var sClaim = JSON.stringify(pClaim, null, "  ");

            return sClaim;
        }

        function getParent(obj, parentTagName) {
            return (obj.tagName == parentTagName) ? obj : getParent(obj.parentNode, parentTagName);
        }

        function setRadioBtnForCathedras(responsive) {
            var subdivisionId = responsive.Subdivision.SubdivisionId;
            var subdivisionName = responsive.Subdivision.Name;
            if (~subdivisionName.indexOf("Кафедра")) {
                $scope.cathedras.push({
                    cathedraId : subdivisionId,
                    cathedraName :subdivisionName
                });
            }
        }

        function setSubdivisionDetails() {
            //debugger;
            var user = Api.getCurrentUser();
            var sClaim = decodeToken(Campus.getToken());
            sClaim = JSON.parse(sClaim);
            if (typeof(sClaim.resp) == "object") {
                sClaim.resp.forEach(function(itemForEach, i, arr) {
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
            var sClaim = decodeToken(Campus.getToken());
            sClaim = JSON.parse(sClaim);
            if (typeof(sClaim.resp) == "object") {
                sClaim.resp.forEach(function(itemForEach, i, arr) {
                    kpiQuery = setFacultyAndInstituteLogic(itemForEach, kpiQuery);
                });
            } else {
                if (typeof(sClaim.resp) == "string") {
                    kpiQuery = setFacultyAndInstituteLogic(sClaim.resp, kpiQuery);
                }
            }

        }

        function setFacultyAndInstituteLogic(item, kpiQuery) {
            var itemForEachJSON = JSON.parse(item);
            if (itemForEachJSON.Subsystem == 1) {
                var subdivisionId = itemForEachJSON.Subdivision.SubdivisionId;
                var subdivisionName = itemForEachJSON.Subdivision.Name;
                if (subdivisionId == 9998 && !kpiQuery) {
                    kpiQuery = true;
                    var pathFaculty = "Subdivision";
                    Campus.execute("GET", pathFaculty).then(function(response) {
                        response.forEach(function(itemForEach, i, arr) {
                            if (itemForEach.typeId == 26 || itemForEach.typeId == 77) {
                                var subdivisionName = itemForEach.name;
                                var subdivisionId = itemForEach.subdivisionId;
                                $scope.subdivisions.push({
                                    subdivisionId : subdivisionId,
                                    subdivisionName :subdivisionName
                                });
                            }
                        });
                        renderPage();
                        var config = {
                            '.chosen-select': {},
                            '.chosen-select-deselect': { allow_single_deselect: true },
                            '.chosen-select-no-single': { disable_search_threshold: 10 },
                            '.chosen-select-no-results': { no_results_text: 'Співпадінь не знайдено...' },
                            '.chosen-select-width': { width: "95%" }
                        };
                        for (var selector in config) {
                            $(selector).chosen(config[selector]);
                        }
                    });
                }
                if (document.getElementById(subdivisionId + "") == null &&
                    (~subdivisionName.indexOf("факультет") || ~subdivisionName.indexOf("Факультет") ||
                        ~subdivisionName.indexOf("інститут") || ~subdivisionName.indexOf("Інститут"))) {
                    $scope.subdivisions.push({
                        subdivisionId : subdivisionId,
                        subdivisionName :subdivisionName
                    });
                }

            }
            return kpiQuery;
            renderPage();
        }
        function renderPage () {
            $scope.$apply ();
        }
    });