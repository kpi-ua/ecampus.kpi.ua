'use strict';

angular
  .module('ecampusApp')
  .service('sharedFiltersData', function() {
		var allFiltersShared = {
        faculties: '',
        subdivisions: '',
        specialities: '',
        specializations: ''
    };

    return {
        getAllFiltersShared: function () {
        	
            return allFiltersShared;
        },
        setAllFiltersShared: function (faculties, subdivisions,
        specialities, specializations) {
            allFiltersShared.faculties = faculties;
            allFiltersShared.subdivisions = subdivisions;
            allFiltersShared.specialities = specialities;
            allFiltersShared.specializations = specializations;
        }
    };

});