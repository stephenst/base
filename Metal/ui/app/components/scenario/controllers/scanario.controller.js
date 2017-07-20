/**
 * Created by pcharasala on 7/17/17.
 */

scenario
    .controller('ScenarioController', ['$rootScope', '$scope', 'ScenarioFactory', 'LineFactory','PerspectiveFactory',
        function($rootScope, $scope, ScenarioFactory, LineFactory, PerspectiveFactory) {

        $scope.export = function(eventData) {
            console.log("Export button clicked");
            var jsondatastr = $('#docking').jqxDocking('exportLayout');
            console.log(jsondatastr);

            $scope.perspective.jsondata = jsondatastr;
            PerspectiveFactory.update( $scope.perspective, function() {
                console.log("saved");
            });
        };

        $scope.import = function(eventData){
            console.log("Import button clicked");
            //var jsondata = '{"panel0": {"window3":{"collapsed":false}},"floating":{"window1":{"x":"1320px","y":"55px","width":"265","height":"571","collapsed":false},"window2":{"x":"330px","y":"347px","width":"870","height":"537","collapsed":false}},"orientation": "horizontal"}';

            PerspectiveFactory.get({id:1}, function(data){
                //console.log(data);
                $scope.perspective = data;
                 $('#docking').jqxDocking('importLayout', data.jsondata);
            });
        };

        ScenarioFactory.query().$promise.then(function(data) {
            console.log("Scenario Controller query")
            $scope.scenarios = data;
        });

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

        $scope.getScenario = function(scenarioName){
             //$scope.data = [{ key: "Some key", values:[{"label":"77", "value":"22.0"}]}];
            ScenarioFactory.get({id:scenarioName}, function(data){
                var jsonfileData = data.json_file;
                //console.log(jsonfileData);
                var jsonData = angular.fromJson(jsonfileData);
                //console.log(jsonData);
                 $scope.selectedScenario = transform(jsonData);
                 $scope.selectedScenario.forEach(function(e){
                     $rootScope.viewer.entities.add(e);
                 });
                 $rootScope.viewer.zoomTo($rootScope.viewer.entities);
            });

            LineFactory.get({id:scenarioName}, function(data){
                console.log("In Line Factory");
                var chartKey  = data.key;
                    //console.log(chartKey);
                    var chartDataStr = data.data;
                    var jsonChartData = angular.fromJson(chartDataStr);
                    //console.log(chartDataStr);
                    //jsonChartData.forEach(function(e){
                     //   $scope.graphdata[0].values.push(e);
                    //});
                    // $scope.graphdata = [{ key: "Some key", values:[{"label":"77", "value":"22.0"}]}];
                    //$scope.$apply();
                     $scope.data = [
                        {
                            key: chartKey,
                            values : jsonChartData
                        }
                     ];
            });
        };



        var transform = function(metaldata){
            var viewerData = [];
            metaldata.sites.forEach(function(e){
                var site = e;
                viewerData.push({
                  id : site.name,
                  name : site.name,
                    description : 'Location: '+site.location[0]+', '+site.location[1]+'<br>'+
                    'Risk Type: '+site.risk.type+'<br>'+
                        'Needed Asset Types: '+site.needed_asset_types,
                  position : Cesium.Cartesian3.fromDegrees(site.location[1], site.location[0]),
                  point : {
                    pixelSize : 5,
                    color : Cesium.Color.RED,
                    outlineColor : Cesium.Color.WHITE,
                    outlineWidth : 2
                  },
                  label : {
                    text : site.name,
                    font : '14pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 2,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(0, -9)
                  }
                });
            });
            return viewerData;
        };

}]);
