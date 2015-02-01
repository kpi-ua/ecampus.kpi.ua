/**
 * @namespace Calendar
 * @memberOf  Core
 */
var Core = (function (Core, document, _u, $) {
    "use strict";

    var /**
         * Cached jQuery-wrapped document
         *
         * @type {Object}
         * @private
         */
        _document = $(document),

        /**
         * Datepicker css class
         *
         * @type {String}
         * @private
         */
         _datepicker = "datepicker",

        /**
         * Calendar css ids
         *
         * @type {Object}
         * @private
         */
         _Ids = {
             addButton: "add_button",
             archive_button: "archive_button",
             input01: "input_01",
             rightDateBtn: "right_date_button",
             leftDateBtn: "left_date_button"
         },

        /** 
         * Calendar settings
         * 
         * @type {Object}
         * @private
         */
         _parameters = {
             apiEndpointId: "ApiEndpoint",
             capmusSessionId: "CampusSessionId",
             subscribe: "notify-upcoming",
             subscribeUrl: "Pulse/CalendarPulse/Get?sessionId="
         },
        
        /** 
         * Calendar settings
         * 
         * @type {Object}
         * @private
         */
         _settings = null,

        /**
         * Get the settings for calendar
         *
         * @return {void}
         * @private
         */
         _getCalendarSettings = function () {
             _settings = {
                 apiPath: $(_u.toCssId(_parameters.apiEndpointId)).html(),
                 sessionId: $(_u.toCssId(_parameters.capmusSessionId)).val()
             }
             _settings.subscribeUrl = _settings.apiPath + _parameters.subscribeUrl + _settings.sessionId;
         },

        /**
         * Subscribe to events
         *
         * @return {void}
         * @public
         * @TODO deal with this pile of crap
         */
         _subscribe = function () {
             var $datepicker = $(_u.toCssClass(_datepicker)),
                 datepickerVal = $datepicker.val();

             $datepicker.on("change", function () {
                 $.ddate = datepickerVal;
                 $.planner.RenderTimeLabels($.ddate);
             });

             _document.on("click", _u.toCssId(_Ids.addButton), function () {
                 $.planner.AddNew(datepickerVal);
             });

             _document.on("click", _u.toCssId(_Ids.archive_button), function () {
                 var $archiveBtn = $(_u.toCssId(_Ids.archive_button)),
                     $input01 = $(_u.toCssId(_Ids.input01))
                 if ($archiveBtn.html() == "Архів") {
                     $input01.css('width', '251px');
                     $archiveBtn.html("Актуальні");
                     $.planner.RenderTimeLabels($datepicker.val(), true);
                 } else {
                     $archiveBtn.html("Архів");
                     $input01.css('width', '290px');
                     $.planner.RenderTimeLabels($datepicker.val(), false);
                 }
             });

             _document.on("click", _u.toCssId(_Ids.rightDateBtn), function () {
                 $datepicker.val($.planner.dateTimeOperations.nextDay(datepickerVal));
                 $.planner.RenderTimeLabels(datepickerVal);
                 $.ddate = datepickerVal;
             });

             _document.on("click", _u.toCssId(_Ids.leftDateBtn), function () {
                 $datepicker.val($.planner.dateTimeOperations.prevDay(datepickerVal));
                 $.planner.RenderTimeLabels(datepickerVal);
                 $.ddate = datepickerVal;
             });
         },

        /**
         * Setup this module
         *
         * @public
         */
         setup = function () {
             _getCalendarSettings();
             $.ApiPath = _settings.apiPath;
             $.SessionID = _settings.sessionId;
             $.notifications = new ServerNotifications();
             $.notifications.Subscribe(_parameters.subscribe, _settings.subscribeUrl);
             $.planner = new Planner(_settings.sessionId);
             $.ddate = $.planner.Today;
             _subscribe();
         };

    return Core.register("Calendar", {
        setup: setup
    });
}(Core || {}, document, _u, jQuery));