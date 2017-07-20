/**
 * Created by pcharasala on 7/17/17.
 */
line.controller('LineController', [ '$scope', 'LineFactory', function($scope, LineFactory) {
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
            var data = LineFactory.get({id:scenarioName}, function(data){
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
}]);