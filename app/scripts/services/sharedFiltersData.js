'use strict';

angular
  .module('ecampusApp')
  .service('sharedFiltersData', function() {
		var allFiltersShared = {
        faculties: '',
        subdivisions: '',
        specialities: '',
        specializations: '',
        lastEdit: {
            id: '',
            name: ''
        }
    };

    return {
        getAllFiltersShared: function () {
        	
            return allFiltersShared;
        },
        setAllFiltersShared: function (faculties, subdivisions,
        specialities, specializations, lastEdit) {
            allFiltersShared.faculties = faculties;
            allFiltersShared.subdivisions = subdivisions;
            allFiltersShared.specialities = specialities;
            allFiltersShared.specializations = specializations;
            allFiltersShared.lastEdit.name = lastEdit.name;
            allFiltersShared.lastEdit.id = lastEdit.id;
        }
    };

});