(function () {
    "use strict";

    angular
        .module("metal.cesium")
        .controller("StockController", StockController);

    StockController.$inject = ['$scope', 'StockFactory'];

    /**
     * @ngdoc controller
     * @name cesiumController
     * @memberof metal.cesium
     *
     * @requires {Function} logger
     * @constructor
     */
    function StockController($scope, StockFactory) {
        var vm = this;

        logger.info("StockController fired");
        activate();

        /**
         * activate function
         *
         * @memberof metal.cesium.cesiumController
         * @returns Console output
         */
        function activate() {
            logger.info("Activated Layout");
        }

        $scope.export = function (eventData) {
            console.log("Export button clicked");
            var jsondatastr = $('#docking').jqxDocking('exportLayout');
            console.log(jsondatastr);

            $scope.perspective.jsondata = jsondatastr;
            StockFactory.getPerspectives().update($scope.perspective, function () {
                console.log("saved");
            });
        };

        $scope.import = function (eventData) {
            console.log("Import button clicked");
            //var jsondata = '{"panel0": {"window3":{"collapsed":false}},"floating":{"window1":{"x":"1320px","y":"55px","width":"265","height":"571","collapsed":false},"window2":{"x":"330px","y":"347px","width":"870","height":"537","collapsed":false}},"orientation": "horizontal"}';

            StockFactory.getPerspectives().get({id: 1}, function (data) {
                //console.log(data);
                $scope.perspective = data;
                $('#docking').jqxDocking('importLayout', data.jsondata);
            });
        };
    }

})();



