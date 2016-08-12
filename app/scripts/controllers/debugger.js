'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DebuggerCtrl
 * @description
 * # DebuggerCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('DebuggerCtrl', function($scope) {

        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.progressBar = false;
        $scope.controllers = [1, 2, 3];
        $scope.methods = [];
        $scope.message = '';
        $scope.methodTitle = '...';
        $scope.out = '';
        $scope.url = ""; //URL of current controller
        $scope.selectedMethod = null;
        $scope.selectedController = null;
        $scope.httpMethod = '';


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

            str.replace(regexp, function() {
                var arr = ([]).slice.call(arguments, 0);
                var extras = arr.splice(-2);
                arr.index = extras[0];
                arr.input = extras[1];
                matches.push(arr[0]);
            });

            return matches.length ? matches : null;
        }

        function progressBar(show) {
            $scope.progressBar = show;
        }

        function loadControllerList() {

            var scope = $scope;

            Campus.execute('GET', 'System/Structure').then(function(data) {

                scope.methods = data;

                var controllers = data.map(function(o) {
                    return !!o && !!o.route ? o.route.substring(0, o.route.indexOf('/')) : "unknown";
                }).filter(function(o) {
                    return !!o && o != '';
                }).sort();

                scope.controllers = getUnique(controllers);
                scope.$apply();

                loadMethodForCurrentController();
            });
        }

        $scope.loadMethodForCurrentController = function() {
            loadMethodForCurrentController();
        }

        function loadMethodForCurrentController() {
            $scope.methods = [];
            $scope.message = '';

            var controller = $scope.selectedController;

            $scope.methods = $scope.methods.filter(function(o) {
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
            //$("#method-title").html('<strong>' + m.route + '<strong>');

            var html = '';

            $.each(m.parameters, function(index, parameter) {
                html += createControl(parameter);
            });

            $scope.out = html;

            //$("#out").html(html);
        }

        function getSelectedMethod() {
            var url = $scope.selectedMethod;

            return $scope.methods.filter(function(o) {
                return o.route.indexOf(url) == 0;
            })[0];
        }

        function execute() {

            progressBar(true);

            var data = {};

            $.each($('#out').serializeArray(), function(index, e) { //Serialize form
                data[e.name] = e.value;
            });

            var m = getSelectedMethod();
            var url = m.route;

            var regexp = /{(.*?)\}/g; //find all 'markers': {param-name}
            var names = matchAll(url, regexp);

            if (!!names) {
                $.each(names, function(index, n) {
                    var name = n.replace('{', '').replace('}', '');
                    url = url.replace(n, data[name]);
                    delete data[name];
                });
            }

            Campus.execute(m.method, url, data)
                .done(function(result) {
                    $("#message-box").val(JSON.stringify(result, null, '\t'));
                })
                .fail(function(result) {
                    debugger;
                    $("#message-box").val(JSON.stringify(result, null, '\t'));
                })
                .always(function() {
                    progressBar(false);
                })
        }

        $scope.loadSelectedMethodMetadata = function() {
            loadSelectedMethodMetadata();
        }

        function loadSelectedMethodMetadata() {
            var m = getSelectedMethod();

            if (!!m) {
                $scope.httpMethod = m.method;
                $scope.message = '';

                render(getSelectedMethod());
            }
        }

        $scope.setEndpoint = function() {
            Campus.ApiEndpoint = $scope.apiEndpoint;

            alert('API endpoint successfully changed.');
        }

        $scope.viewErrorLog = function() {
            var w = window.open(Campus.ApiEndpoint + 'system/logs/errors/', '_blank');

            if (w) {
                w.focus(); //Browser has allowed it to be opened
            } else {
                alert('Please allow popups for this website'); //Browser has blocked it
            }

            Campus.ApiEndpoint = $("#txt-api-endpoint").val();
        };

        $scope.auth = function() {
            var login = $("#txt-login").val();
            var password = $("#txt-password").val();

            progressBar(true);

            Campus.auth(login, password).then(function(token) {

                $("#campus-session-id").val(token);
                $("#message-box").val('');

                if (!token) {
                    $("#message-box").val('Incorrect login or password.');
                }

                progressBar(false);
            });
        }

        function reload() {
            loadControllerList();
            $scope.apiEndpoint = Campus.ApiEndpoint;
        }

        reload();

    });