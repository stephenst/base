(function () {
    "use strict";

    angular
        .module("metal.cesium")
        .controller("CesiumController", CesiumController);

    CesiumController.$inject = [];

    /**
     * @ngdoc controller
     * @name metal.cesium.cesiumController
     * @memberof app.layout
     *
     * @requires {Function} logger
     * @constructor
     */
    function CesiumController ($scope) {
        var vm = this;

        logger.info("CesiumController fired");
        activate();

        /**
         * activate function
         *
         * @memberof metal.cesium.cesiumController
         * @returns Console output
         */
        function activate () {
            logger.info("Activated Layout");
        }
    }

});

