/**
 * @namespace Core
 */
var Core = (function () {
    "use strict";

    /**
     * Register a new module to the Core object
     *
     * @param  {string} name   Name of the module.
     * @param  {Object} module The actual module.
     * @return {Object}        The updated Core.
     * @public
     */
    var register = function (name, module) {
        if (!this[name]) {
            this[name] = module;
        }

        return this;
    };

    return {
        register: register
    };
}());