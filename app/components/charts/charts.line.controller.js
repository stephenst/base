(function () {
    "use strict";

    angular
        .module("metal.charts")
        .controller("LineController", LineController);

    LineController.$inject = ["$scope", "ChartsFactory"];

    /**
     * @ngdoc controller
     * @name LineController
     * @memberof metal.charts
     *
     * @constructor
     */
    function LineController ($scope, ChartsFactory) {
        var vm = this;

        logger.info("LineController fired");
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
                    type: 'discreteBarChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',.4f')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: 'X Axis'
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        axisLabelDistance: -10
                    }
                }
            };
            $scope.data = [];

            //$scope.getGraphData($scope.selectedScenarioName);
            $scope.getGraphData = function(scenarioName){
                var data = ChartsFactory.getTimeToFailure().get({id:scenarioName}, function(data){
                    var chartKey  = data.key;
                    console.log(chartKey);
                    var chartDataStr = data.data;
                    var jsonChartData = angular.fromJson(chartDataStr);
                    console.log(chartDataStr);
                    $scope.data = [
                        {
                            key: chartKey,
                            values : jsonChartData
                        }
                    ];
                });
                return data;
            };
        }
    }

})();
