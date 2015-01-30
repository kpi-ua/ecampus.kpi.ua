/**
 * @namespace Carousel
 * @memberOf  Core
 */
var Core = (function (Core, _u, $) {
    "use strict";

    var /** 
         * Slick carousel settings
         * 
         * @type {Object}
         * @private
         */
         _settings = {
             arrows: true,
             speed: 300,
             slidesToShow: 5,
             slidesToScroll: 5,
             variableWidth: true,
             draggable: false,
             infinite: false,
             nextArrow: $(".glyphicon-chevron-left"),
             prevArrow: $(".glyphicon-chevron-right"),
             responsive: [
               {
                   breakpoint: 1024,
                   settings: {
                       slidesToShow: 3,
                       slidesToScroll: 3,
                       infinite: true,
                       dots: true
                   }
               },
               {
                   breakpoint: 600,
                   settings: {
                       slidesToShow: 2,
                       slidesToScroll: 2
                   }
               },
               {
                   breakpoint: 480,
                   settings: {
                       slidesToShow: 1,
                       slidesToScroll: 1
                   }
               }
             ]
         },

        /** 
         * Css classes of elements
         * with custom events
         * 
         * @type {Object}
         * @private
         */
         _eventClasses = {
             carousel: "js-carousel",
             calendar: "js-calendar-btn"
         },

        /**
         * Attach custom events to the carousel elements
         *
         * @return {void}
         * @private
         */
         _attachEvents = function () {
             // Calendar event
             $(_u.toCssClass(_eventClasses.calendar)).click(function () {
                 $.planner.Show($(this).data("modal"));
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
}(Core || {}, _u, jQuery));