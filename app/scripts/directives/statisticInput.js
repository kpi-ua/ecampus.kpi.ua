
angular
    .module('ecampusApp')
    .directive('statisticInput',statInput);

statInput.$inject = ['api'];

function statInput(api) {
    return{
        link: link,
        templateUrl: "views/directives/statisticInput.html",
        restrict: "E"
    };

    function link($scope) {
        var subdivisionWatcher;
        var NTUUKpiSubdivisionId = 9998;
        var InstituteTypeId = 26;
        var FacultyTypeId = 77;
        var CampusKpiSubsystemId = 1;

        activate();

        function activate() {
            subdivisionWatcher = $scope.$watch('chosenSubdivision', function () {
                loadCathedras();
            });
            if (api.getToken()) {
                var sClaim = JSON.parse(api.decodeToken(api.getToken()));
                if (sClaim) {
                    setFacultyAndInstitute(sClaim.id);
                }
            }

        }
        function setFacultyAndInstitute(id) {

            var kpiQuery = false;

            var path = 'Account/employee/responsibility/'+id;
            api.execute('GET', path).then(function (responsibilities) {
                responsibilities.forEach(function (responsibility) {
                    if(responsibility.subsystem == CampusKpiSubsystemId){
                        kpiQuery = setFacultyAndInstituteLogic(responsibility.subdivision, kpiQuery);
                    }
                });
            });
        }
        function setFacultyAndInstituteLogic(subdivision, kpiQuery) {
            var subdivisionId = subdivision.id;
            var subdivisionName = subdivision.name;

            if (subdivisionId == NTUUKpiSubdivisionId && !kpiQuery) {
                kpiQuery = true;
                var pathFaculty = 'Subdivision';
                api.execute('GET', pathFaculty).then(function (subdivisions) {
                    subdivisions.forEach(function (subdivision) {
                        if (subdivision.type.id == InstituteTypeId || subdivision.type.id == FacultyTypeId) {
                            $scope.subdivisions.push({
                                subdivisionId: subdivision.id,
                                subdivisionName: subdivision.name
                            });
                        }
                    });
                });
            }
            if (
                document.getElementById(subdivisionId + '') == null &&
                (
                    ~subdivisionName.indexOf('факультет') || ~subdivisionName.indexOf('Факультет') || ~subdivisionName.indexOf('інститут') || ~subdivisionName.indexOf('Інститут')
                )
            ) {
                $scope.subdivisions.push({
                    subdivisionId: subdivisionId,
                    subdivisionName: subdivisionName
                });
            }
            return kpiQuery;
        }
        function loadCathedras() {
            $scope.npps = [];
            if (!$scope.chosenSubdivision) return;

            var parentId = $scope.chosenSubdivision.subdivisionId;
            var subdivisionPath = 'Subdivision/' + parentId + '/children';

            api.execute('GET', subdivisionPath).then(function (response) {
                $scope.cathedras = [];
                response.forEach(function (cathedra, i, arr) {
                    if (arr[i + 1] !== undefined) {
                        $scope.cathedras.push({
                            cathedraId: cathedra.id,
                            cathedraName: cathedra.name
                        });
                    }
                });
            });
        }


    }

}