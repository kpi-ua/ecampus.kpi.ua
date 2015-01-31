/*global Core*/
(function (Core, document, $, Modernizr) {
    "use strict";

    var module;

    // Run all modules from a single for-loop
    for (module in Core) {
        // Check if modules exist and if they have a setup method
        if (Core.hasOwnProperty(module) && Core[module].hasOwnProperty("setup")) {
            Core[module].setup();
        }
    }

    /*****************************************************************
     * GENERAL METHODS USED THROUGHOUT SITE                          *
     ****************************************************************/
    Core.Carousel.initialize();
    Core.Popover.initialize();

}(Core || {}, this.document, this.jQuery, this.Modernizr));