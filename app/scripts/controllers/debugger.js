'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DebuggerCtrl
 * @description
 * # DebuggerCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('DebuggerCtrl', function ($scope, $sce, Api) {

    $scope.progressBar = false;
    $scope.controllers = [];
    $scope.methods = [];
    $scope.message = '';
    $scope.methodTitle = '...';
    $scope.out = '';
    $scope.url = ""; //URL of current controller
    $scope.allMethods = [];
    $scope.selectedMethod = null;
    $scope.selectedController = null;
    $scope.httpMethod = '';
    $scope.sessionToken = '';
    $scope.login = '';
    $scope.password = '';

    function getUnique(array) {
      var u = {},
        a = [];
      for (var i = 0, l = array.length; i < l; ++i) {
        if (u.hasOwnProperty(array[i])) {
          continue;
        }
        a.push(array[i]);
        u[array[i]] = 1;
      }
      return a;
    }

    function matchAll(str, regexp) {
      var matches = [];

      str.replace(regexp, function () {
        var arr = ([]).slice.call(arguments, 0);
        var extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr[0]);
      });

      return matches.length ? matches : null;
    }

    function loadControllerList() {

      var scope = $scope;

      Api.execute('GET', 'System/Structure').then(function (data) {

        scope.allMethods = data;

        var controllers = data.map(function (o) {
          return !!o && !!o.route ? o.route.substring(0, o.route.indexOf('/')) : "unknown";
        }).filter(function (o) {
          return !!o && o != '';
        }).sort();

        scope.controllers = getUnique(controllers);

        loadMethodForCurrentController();
      });
    }

    function loadMethodForCurrentController() {
      $scope.methods = [];
      $scope.message = '';

      var controller = $scope.selectedController;

      $scope.methods = $scope.allMethods.filter(function (o) {
        return o.route.indexOf(controller) == 0;
      });

      loadSelectedMethodMetadata();
    }

    function renderFormGroup(controlId, title, controlHtml) {

      var html = '';
      html += '<div class="form-group">';
      html += '<label for="' + controlId + '" class="col-md-4 control-label">' + title + '</label>';
      html += '<div class="col-md-8">';
      html += controlHtml;
      html += '</div>';
      html += '</div>';
      return html;
    }

    function createControl(parameter) {

      var controlType = '';

      if (parameter.type === 'System.String' || parameter.type === 'String') {
        controlType = 'text';
      } else if (parameter.type === 'System.Int32' || parameter.type === 'Int32') {
        controlType = 'number';
      } else if (parameter.type === 'System.Web.HttpPostedFileBase' || parameter.type === 'HttpPostedFileBase') {
        controlType = 'file';
      } else {
        controlType = 'text';
      }

      var html = '<input class="form-control" type="' + controlType + '" name="' + parameter.name + '" id = "' + parameter.name + '" value="" placeholder="' + parameter.name + '" />';

      return renderFormGroup(parameter.name, parameter.name, html);
    }

    function render(m) {

      $scope.methodTitle = m.route;

      var html = '';

      $.each(m.parameters, function (index, parameter) {
        html += createControl(parameter);
      });

      $scope.out = $sce.trustAsHtml(html);
    }

    function getSelectedMethod() {
      var url = $scope.selectedMethod;

      return $scope.methods.filter(function (o) {
        return o.route.indexOf(url) == 0;
      })[0];
    }

    function executeRequest() {

      $scope.progressBar = true;

      var data = {};
      var form = $('#out').serializeArray(); //Serialize form

      $.each(form, function (index, e) {
        data[e.name] = e.value;
      });

      var m = getSelectedMethod();
      var url = m.route;

      var regexp = /{(.*?)\}/g; //find all 'markers': {param-name}
      var names = matchAll(url, regexp);

      if (!!names) {
        $.each(names, function (index, n) {
          var name = n.replace('{', '').replace('}', '');
          url = url.replace(n, data[name]);
          delete data[name];
        });
      }

      var scope = $scope;

      Api.execute(m.method, url, data)
        .then(function (result) {
          $scope.message = JSON.stringify(result, null, '\t');
            scope.progressBar = false;
        },
        function (result) {
          $scope.message = JSON.stringify(result, null, '\t');
          scope.progressBar = false;
        });
    }

    function loadSelectedMethodMetadata() {
      var m = getSelectedMethod();

      if (!!m) {
        $scope.httpMethod = m.method;
        $scope.message = '';

        render(getSelectedMethod());
      }
    }

    $scope.loadMethodForCurrentController = function () {
      loadMethodForCurrentController();
    };

    $scope.executeRequest = function () {
      executeRequest();
    };

    $scope.loadSelectedMethodMetadata = function () {
      loadSelectedMethodMetadata();
    };

    $scope.setEndpoint = function () {
      Api.setApiEndpoint($scope.apiEndpoint);
      $scope.controllers = [];
      $scope.methods = [];

      loadControllerList();

      alert('API endpoint successfully changed.');
    };

    $scope.viewErrorLog = function () {
      var w = window.open(Api.getApiEndpoint() + 'system/logs/errors/', '_blank');

      if (w) {
        w.focus(); //Browser has allowed it to be opened
      } else {
        alert('Please allow popups for this website'); //Browser has blocked it
      }
    };

    $scope.auth = function () {

      var scope = $scope;
      $scope.progressBar = true;

      Api.auth($scope.login, $scope.password).then(function (token) {
        $scope.sessionToken = token;

        $scope.message = '';

        if (!token) {
          $scope.message = 'Incorrect login or password.';
        }

        scope.progressBar = false;
      });
    };

    function reload() {
      loadControllerList();
      $scope.apiEndpoint = Api.getApiEndpoint();
      $scope.sessionToken = Api.getToken();

    }

    reload();

  });
