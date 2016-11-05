'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('AdminCtrl', function($scope, $cookies, $window, Api) {
      $scope.preloader = true;
      $scope.adminsTools = [];
      var permissionArray = getPermissionArrayFromToken();
      if(permissionArray != undefined){
        var myRequest = new XMLHttpRequest();
        myRequest.open('GET',"json/DcSubsystem.json",true);
        myRequest.send(null);
        myRequest.onreadystatechange = function(){
          if(myRequest.readyState === 4 ){
            var myData = JSON.parse(myRequest.responseText);
            console.log(permissionArray);
            permissionArray.forEach(function(responsibilityItemNumber,i,arr){
              var currentSubsistem = myData[responsibilityItemNumber];
              if(currentSubsistem!= undefined && currentSubsistem.Enabled == "true"){
                $scope.adminsTools.push(new SubsistemItem(currentSubsistem.NameForWeb,currentSubsistem.PageOrUrl,currentSubsistem.Icon));
              }
            });
            $scope.preloader = false;
          }
        }
      }

      function SubsistemItem (nameForWeb,pageOrUrl,icon){
        this.nameForWeb   =   nameForWeb;
        this.pageOrUrl    =   pageOrUrl;
        this.icon         =   icon;
        this.isGlyphicon  =   ~icon.indexOf("glyphicon")?true:false;
      }

      function getPermissionArrayFromToken(){
        var permissionArray = [];
        var permissionArryCounter = 0;
        if (!!Campus.getToken()) {
          var sClaim = decodeToken(Campus.getToken());
          sClaim = JSON.parse(sClaim);
          if(typeof(sClaim.resp)=="object"){
            sClaim.resp.forEach(function(itemForEach, i, arr) {
              var itemForEachJSON = JSON.parse(itemForEach);
              if(!~permissionArray.indexOf(itemForEachJSON.Subsystem)){
                permissionArray.push(itemForEachJSON.Subsystem);
              }
            });
          }else{
            if(typeof(sClaim.resp)=="string"){
              var responsive  = JSON.parse(sClaim.resp);
              if(!~permissionArray.indexOf(responsive.Subsystem)){
                permissionArray.push(responsive.Subsystem);
              }
            }
          }
        }else {
          return undefined;
        }
        return permissionArray;
      }

      function getInitAdminItem(subsistemItem){
        var iconString =  ~subsistemItem.icon.indexOf("glyphicon")?'<span class="glyphicon '+subsistemItem.icon+' fa-3x" aria-hidden="true"></span>':
        '<i class="fa '+subsistemItem.icon+' fa-3x"></i>';
        return '' +
            '<div class="col-md-4">' +
            '<a href="'+subsistemItem.pageOrUrl+'">' +
            '<div class="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 initButtons">' +
            iconString+
            '<p>'+subsistemItem.nameForWeb+'</p>' +
            '</div>' +
            '</a>' +
            '</div>'


      }

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
    });