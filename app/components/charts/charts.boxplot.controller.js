(function () {
    "use strict";

    angular
        .module("metal.cesium")
        .controller("BoxPlotController", BoxPlotController);

    BoxPlotController.$inject = [];

    /**
     * @ngdoc controller
     * @name metal.cesium.BoxPlotController
     * @memberof app.layout
     *
     * @constructor
     */
    function BoxPlotController ($scope) {
        var vm = this;

        logger.info("CesiumController fired");
        activate();

        /**
         * activate function
         *
         * @memberof metal.cesium.BoxPlotController
         * @returns Console output
         */
        function activate () {
            console.log("Activated BoxPlotController");

            $scope.options = {
                chart: {
                    type: 'boxPlotChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 40
                    },
                    color:['darkblue', 'darkorange', 'green', 'darkred', 'darkviolet'],
                    x: function(d){return d.label;},
                    // y: function(d){return d.values.Q3;},
                    maxBoxWidth: 75,
                    yDomain: [0, 500]
                }
            };

            $scope.data = [
                {
                    label: "Sample A",
                    values: {
                        Q1: 180,
                        Q2: 200,
                        Q3: 250,
                        whisker_low: 115,
                        whisker_high: 400,
                        outliers: [50, 100, 425]
                    }
                },
                {
                    label: "Sample B",
                    values: {
                        Q1: 300,
                        Q2: 350,
                        Q3: 400,
                        whisker_low: 225,
                        whisker_high: 425,
                        outliers: [175, 450, 480]
                    }
                },
                {
                    label: "Sample C",
                    values: {
                        Q1: 100,
                        Q2: 200,
                        Q3: 300,
                        whisker_low: 25,
                        whisker_high: 400,
                        outliers: [450, 475]
                    }
                },
                {
                    label: "Sample D",
                    values: {
                        Q1: 75,
                        Q2: 100,
                        Q3: 125,
                        whisker_low: 50,
                        whisker_high: 300,
                        outliers: [450]
                    }
                },
                {
                    label: "Sample E",
                    values: {
                        Q1: 325,
                        Q2: 400,
                        Q3: 425,
                        whisker_low: 225,
                        whisker_high: 475,
                        outliers: [50, 100, 200]
                    }
                }
            ];
        }
    }

});
