'use strict';

angular
    .module('ecampusApp')
    .directive('statisticSubjectProviderSection', statisticSubjectProviderSection);

statisticSubjectProviderSection.$inject = ['api'];

function statisticSubjectProviderSection(api) {
    return {
        link: link,
        templateUrl: 'views/directives/statisticSubjectProviderSection.html',
        restrict: 'EA',
        scope: {
            statData: '=',
            statHeadings:"="
        },
    };

    function link(scope, element, attr) {
        scope.section = "";
        scope.headers = ['name', 'id'];
        scope.sectionsHeaders= {
            "withManualList": "Завантажено МЗ",
            "withoutManualList": "Відсутнє МЗ",
            "withPartialList": "Частково забезпечені МЗ",
            "withoutFileList": "Відсутні файли або посилання на МЗ ",
        };
        scope.onSectionSelect = onSectionSelect;
        function onSectionSelect(value) {
            scope.section = value;
        }

    }
}