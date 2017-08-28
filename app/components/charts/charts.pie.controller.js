(function () {
    "use strict";

    angular
        .module("metal.charts")
        .controller("PieController", PieController);

    PieController.$inject = ["$scope", "PieFactory"];

    /**
     * @ngdoc controller
     * @name PieController
     * @memberof metal.charts
     *
     * @constructor
     */
    function PieController ($scope, PieFactory) {
        var vm = this;

        console.log("LineController fired");
        activate();

        /**
         * activate function
         *
         * @memberof metal.charts.LineController
         * @returns Console output
         */
        function activate () {
            console.log("Activated LineController");
            $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    x: function (d) {
                        return d.key;
                    },
                    y: function (d) {
                        return d.y;
                    },
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 100,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

            $scope.data = [
                {
                    key: "One",
                    y: 5
                },
                {
                    key: "Two",
                    y: 2
                },
                {
                    key: "Three",
                    y: 9
                },
                {
                    key: "Four",
                    y: 7
                },
                {
                    key: "Five",
                    y: 4
                },
                {
                    key: "Six",
                    y: 3
                },
                {
                    key: "Seven",
                    y: 0.5
                }
            ];
        }
    }

})();
