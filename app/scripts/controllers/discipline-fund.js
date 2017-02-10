'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplineFundCtrl
 * @description
 * # DisciplineFundCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('DisciplineFundCtrl', handler);

function handler() {
  this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}
