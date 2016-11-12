'use strict';

angular
.module('ecampusApp')
.directive('chosen', function(){
	var linker = function(scope,element,attr) {
		scope.$watch('allSubdivisions', function(){
			element.trigger("chosen:updated");
		})
		element.chosen();
	};

	return {
		restrict: 'A',
		link: linker
	}
})