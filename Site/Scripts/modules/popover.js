/**
 * @namespace Popover
 * @memberOf  Core
 */
var Core = (function (Core, window, _u, $) {
    "use strict";

    var /** 
         * User info
         * 
         * @type {Object}
         * @private
         */
         _userInfo = {
             image: window.userInfo.image,
             fullName: window.userInfo.fullName,
             position: window.userInfo.position,
             degree: window.userInfo.degree
         },

        /** 
         * Css popover data-*
         * 
         * @type {String}
         * @private
         */        
         _cssData = "popover",

        /** 
         * Settings of the popovers
         * 
         * @type {Object}
         * @private
         */ 
         _options = {
             userInfo: {
                 html: true,
                 placement: "left",
                 title: _userInfo.fullName,
                 content:
                     "<img class='portrait pull-left' src='" + _userInfo.image + "'>"
                     +  _userInfo.position + "<br>" + _userInfo.degree
             }
         },

        /**
         * Setup this module
         *
         * @public
         */
         setup = function () {
             $(_u.toCssData(_cssData)).each(function () {
                 var trigger = $(this),
                     popover = trigger.data(_cssData);
                 trigger.popover(_options[popover]);
             });
         };

    return Core.register("Popover", {
        setup: setup
    });
}(Core || {}, window, _u, jQuery));