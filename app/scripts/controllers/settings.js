'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('SettingsCtrl', handler);

function handler() {
  this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}
