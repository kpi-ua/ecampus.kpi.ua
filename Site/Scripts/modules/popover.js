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
         * Attach popover events
         *
         * @return {void}
         * @private
         */
         _attachEvents = function () {
             $(_u.toCssData(_cssData)).each(function () {
                 var trigger = $(this),
                     popover = trigger.data(_cssData);
                 trigger.popover(_options[popover]);
             });
         },

        /**
         * Initialize this module
         *
         * @function initialize
         * @public
         */
         initialize = function () {
             _attachEvents();
         };

    return Core.register("Popover", {
        initialize: initialize
    });
}(Core || {}, window, _u, jQuery));