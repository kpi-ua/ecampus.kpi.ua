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
         * Event data triggers
         * 
         * @type {Object}
         * @private
         */
         _eventData = {
             toggle:  "popover",
             trigger: "focus"
         },

        /** 
         * Id list of the popovers
         * 
         * @type {Object}
         * @private
         */        
         _id = {
             userInfo: "js-popover-userInfo"
         },

        /** 
         * Settings of the popovers
         * 
         * @type {Object}
         * @private
         */ 
         _options = {
             userInfo: {
                 placement: "left",
                 html: true,
                 content:
                       "<div>"
                     + "<img class='portrait' src='" + _userInfo.image + "'>"
                     + new Array(_userInfo.fullName, _userInfo.position, _userInfo.degree).join(" ")
                     + "</div>"
             }
         }

        /**
         * Attach popover events
         *
         * @return {void}
         * @private
         */
         _attachEvents = function () {
             $(_u.toCssId(_id.userInfo)).popover({

             });
         },

        /**
         * Initialize this module
         *
         * @function initialize
         * @public
         */
         initialize = function () {
             $(_u.toCssClass(_eventClasses.carousel)).slick(_settings);
             _attachEvents();
         };

    return Core.register("Carousel", {
        initialize: initialize
    });
}(Core || {}, window, _u, jQuery));