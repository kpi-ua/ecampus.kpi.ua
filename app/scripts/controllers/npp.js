'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:NppCtrl
 * @description
 * # NppCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('NppCtrl', function ($scope, $cookies, $window, Api) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        console.log('NppCtrl');
        //    CommonJS
        var bodyPosition;

        $(window).load(function() {



        });

        $(document).ready(function() {
            //load
            if($(".nPPBody").offset()){
                bodyPosition = $(".nPPBody").offset().top;
                $("a[href='#top']").mPageScroll2id();
            }
            if (!!Campus.getToken()) {
                var sClaim = decodeToken(Campus.getToken());

                if (!!sClaim) {
                    sClaim = JSON.parse(sClaim);
                    $(".userName").append(JSON.parse(sClaim.prof).FullName);
                }
            }

            $(".loader_inner").fadeOut();
            $(".loader").delay(400).fadeOut("slow");

            $('.login-message').click(function() {
                $('.login-message').addClass('hidden');
            })
            //

            $(".loader_inner").fadeOut();
            $(".loader").delay(400).fadeOut("slow");
            if (!!document.querySelector("#authorized") && !Campus.getToken()) {
                history.back();
            }
            if (!document.querySelector("#authorized")) {
                Campus.logout();
            }
        });

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

        function setRadioBtnForCathedras(responsive){
            var subdivisionId = responsive.Subdivision.SubdivisionId;
            var subdivisionName = responsive.Subdivision.Name;
            if (document.getElementById(subdivisionId + "") == null && ~subdivisionName.indexOf("Кафедра")) {
                $('.radioMenu .radioBtnWrapper').append('<input class="radioBtn" id="' + subdivisionId + '" name="cathedra" type="radio" value=' + subdivisionId + ' onchange="check()">' +
                    '<label for="' + subdivisionId + '" class="side-label">' + subdivisionName + '</label>');
            }
        }

        function setSubdivisionDetails() {
            var sClaim = decodeToken(Campus.getToken());
            sClaim = JSON.parse(sClaim);
            if(typeof(sClaim.resp)=="object"){
                sClaim.resp.forEach(function(itemForEach, i, arr) {
                    var itemForEachJSON = JSON.parse(itemForEach);
                    if(itemForEachJSON.Subsystem==1){
                        setRadioBtnForCathedras(itemForEachJSON);
                    }

                });
            }else{
                if(typeof(sClaim.resp)=="string"){
                    var responsive  = JSON.parse(sClaim.resp);
                    if(responsive.Subsystem==1){
                        setRadioBtnForCathedras(responsive);
                    }
                }
            }

        }

        function setFacultyAndInstitute(){
            var kpiQuery= false;
            var sClaim = decodeToken(Campus.getToken());
            sClaim = JSON.parse(sClaim);
            if(typeof(sClaim.resp)=="object"){
                sClaim.resp.forEach(function(itemForEach, i, arr) {
                    kpiQuery = setFacultyAndInstituteLogic(itemForEach,kpiQuery);
                });
            }else{
                if(typeof(sClaim.resp)=="string"){
                    kpiQuery = setFacultyAndInstituteLogic(sClaim.resp,kpiQuery);
                }
            }

        }

        function setFacultyAndInstituteLogic(item,kpiQuery){
            var itemForEachJSON = JSON.parse(item);
            if(itemForEachJSON.Subsystem==1) {
                var subdivisionId = itemForEachJSON.Subdivision.SubdivisionId;
                var subdivisionName = itemForEachJSON.Subdivision.Name;
                //console.log(subdivisionId +" -"+subdivisionName);
                if (subdivisionId == 9998 && !kpiQuery) {
                    kpiQuery = true;
                    var pathFaculty = "Subdivision";
                    Campus.execute("GET", pathFaculty).then(function (response) {
                        //console.log(response);
                        response.forEach(function (itemForEach, i, arr) {
                            if (itemForEach.typeId == 26 || itemForEach.typeId == 77) {
                                var subdivisionName = itemForEach.name;
                                var subdivisionId = itemForEach.subdivisionId;
                                $(".chosen-select").append('<option id="' + subdivisionId + '" value="' + subdivisionId + '">' + subdivisionName + '</option>');
                            }
                        });
                        var config = {
                            '.chosen-select': {},
                            '.chosen-select-deselect': {allow_single_deselect: true},
                            '.chosen-select-no-single': {disable_search_threshold: 10},
                            '.chosen-select-no-results': {no_results_text: 'Співпадінь не знайдено...'},
                            '.chosen-select-width': {width: "95%"}
                        };
                        for (var selector in config) {
                            $(selector).chosen(config[selector]);
                        }
                        $('.chosen-select').on('change', function (evt, params) {
                            var parentId = this.value;
                            var subdivisionPath = "Subdivision/" + parentId + "/children";
                            Campus.execute("GET", subdivisionPath).then(function (response) {
                                $('.radioMenu .radioBtnWrapper').empty();
                                $('.radioMenu .radioBtnWrapper').append('<label class="topLabel">Оберіть кафедру</label>');
                                response.forEach(function (itemForEach, i, arr) {
                                    if (arr[i + 1] != undefined) {
                                        var cathedraId = itemForEach.id;
                                        var cathedraName = itemForEach.name;
                                        //console.log(itemForEach);
                                        $('.radioMenu .radioBtnWrapper').append('<input class="radioBtn" id="' + cathedraId + '" name="cathedra" type="radio" value=' + cathedraId + ' onchange="check()">' +
                                            '<label for="' + cathedraId + '" class="side-label">Кафедра ' + cathedraName + '</label>');
                                    }
                                })
                            });
                        });
                        $(".loader_inner").fadeOut();
                        $(".loaderQuery").delay(400).fadeOut("slow");
                    });
                }
                if (document.getElementById(subdivisionId + "") == null &&
                    (~subdivisionName.indexOf("факультет") || ~subdivisionName.indexOf("Факультет")
                    || ~subdivisionName.indexOf("інститут") || ~subdivisionName.indexOf("Інститут"))) {
                    $(".chosen-select").append('<option id="' + subdivisionId + '" value="' + subdivisionId + '">' + subdivisionName + '</option>');
                }
            }
            return kpiQuery;
        }

        $("#loginBtn").click(function() {
            $(".loader_inner").fadeIn();
            $(".loader").fadeIn("slow");
            var login = $("#main_content_placeholder_login").val();
            var password = $("#main_content_placeholder_password").val();
            Campus.auth(login, password).then(function(token) {
                if (!token) {
                    $('.login-message').removeClass('hidden');
                } else {
                    $(".loader_inner").fadeOut();
                    $(".loader").delay(400).fadeOut("slow");
                    $(location).attr('href', 'initAdmin.html');
                }
            });
            $(".loader_inner").fadeOut();
            $(".loader").fadeOut("slow");


        });

        $(window).scroll(function(){
            if($(window).scrollTop()>100){
                $(".scroll-to-top-Btn").fadeIn(300);
            } else {
                $(".scroll-to-top-Btn").fadeOut(300);
            }
            if(bodyPosition && $(window).scrollTop()>bodyPosition){
                $(".nPPBody").removeClass('container');
            } else {
                $(".nPPBody").addClass('container');
            }
        });
        //    ---
    //    For section npp
        $(document).ready(function() {
            bodyPosition = $(".nPPBody").offset().top+$(".topMenu").offset().top;
            $('#1, #2').on('click', '.panel-heading', function(event) {
                event.preventDefault();
                var panelId = this.parentNode.id;
                $("#" + panelId + " .table").toggleClass("hidden");
                //$("#" + panelId + " .zkmContent").toggleClass("hidden");
                $("#" + panelId + " .panelHeadingHover").toggleClass("active");
            });

            $('#1, #2').on('click', 'table', function() {});

            $(".loader_inner").fadeOut();
            $(".loaderQuery").delay(400).fadeOut("slow");

            if (!!Campus.getToken()) {
                setFacultyAndInstitute();
                setSubdivisionDetails();
            } else {
                $(location).attr('href', 'index.html');
            }
        });
    //    ---
    });
