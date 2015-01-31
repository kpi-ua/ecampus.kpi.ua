; (function (window, undefined) {
    "use strict";

    var _u = {};

    _u.KEYS = {
        "ESC": 27
    };

    /**
     * Empty function to use for callbacks etc. instead of having
     * to make numerous empty functions yourself. Should save some
     * memory.
     */
    _u.noop = function () { };

    /**
     * Run a function only once in a while
     * From: http://davidwalsh.name/javascript-debounce-function
     *
     * @param  {Function} func      Function to run at given interval
     * @param  {Number}   delay     Wait time before executing in ms
     * @param  {Bool}     execAsap  Run immediately?
     * @return {Function}           The original function
     */
    _u.debounce = function (func, delay, execAsap) {
        var timeout;

        return function () {
            var context = this,
                args = arguments;

            window.clearTimeout(timeout);

            timeout = window.setTimeout(function () {
                timeout = null;

                if (!execAsap) {
                    func.apply(context, args);
                }
            }, delay || 150);

            if (execAsap && !timeout) {
                func.apply(context, args);
            }
        };
    };

    /**
     * A foreach method that can be used for NodeLists as well as Arrays
     * From: http://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
     *
     * @param  {Array|NodeList} list     The list to loop through
     * @param  {Function}       callback Function to run on Array item
     * @param  {Object}         scope    Scope where the list item is bound to
     * @return {void}
     */
    _u.forEach = function (list, callback, scope) {
        var i;

        for (i = 0; i < list.length; i += 1) {
            callback.call(scope, list[i], i);
        }
    };

    /**
     * Helper functions / wrappers
     */
    _u.toCssClass = function (selector) {
        return "." + selector;
    };

    _u.toCssId = function (selector) {
        return "#" + selector;
    };

    _u.toCssData = function (selector) {
        return "[data-" + selector + "]";
    };

    _u.toInt = function (value) {
        return parseInt(value, 10);
    };

    // Export utils to window
    window._u = _u;

}(this));