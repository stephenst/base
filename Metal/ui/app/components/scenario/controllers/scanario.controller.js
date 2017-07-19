/**
 * Created by pcharasala on 7/17/17.
 */

scenario
    .controller('ScenarioController', ['$rootScope', '$scope', 'ScenarioFactory', function($rootScope, $scope, ScenarioFactory) {

        ScenarioFactory.query().$promise.then(function(data) {
            console.log("Scenario Controller query")
            $scope.scenarios = data;
        });

        $scope.getScenario = function(scenarioName){
            ScenarioFactory.get({id:scenarioName}, function(data){
                var jsonfileData = data.json_file;
                console.log(jsonfileData);
                var jsonData = angular.fromJson(jsonfileData);
                console.log(jsonData);
                 $scope.selectedScenario = transform(jsonData);
                 $scope.selectedScenario.forEach(function(e){
                     $rootScope.viewer.entities.add(e);
                 });
                 $rootScope.viewer.zoomTo($rootScope.viewer.entities);
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
