/**
 * Created by pcharasala on 7/17/17.
 */
        var earthradius=3440.2769;
        var sqrt3=Math.sqrt(3);
        function radians(deg)
        {
                return (deg * (Math.PI / 180));
        };
        function degLatToNm(degLat)
        {
                return ((Math.PI*earthradius*2 / 360) * degLat);
        };
        function nmToDegLat(nm)
        {
                return (nm / degLatToNm(1));
        };
        function degLonToNm(degLon, lat)
        {
                var latradius=Math.cos(radians(lat)) * earthradius;
                return ((Math.PI*latradius*2 / 360) * degLon);
        };
        function nmToDegLon(nm, lat)
        {
                return (nm / degLonToNm(1, lat));
        };
        function nmToLatLon(nmx, nmy) {
                var lat = nmToDegLat(nmy);
                var lon = nmToDegLon(nmx, lat);
                return [ lat, lon ];
        };


scenario
    .controller('ScenarioController', ['$rootScope', '$scope', 'ScenarioFactory', 'LineFactory','CesiumFactory','PerspectiveFactory',
        function($rootScope, $scope, ScenarioFactory, LineFactory, CesiumFactory, PerspectiveFactory) {


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

        $scope.run_model = function(scenarioName) {
            ScenarioFactory.run({id: scenarioName}, function (data) {
                console.log("model run for scenario:" + scenarioName);
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

            //$scope.run_model(scenarioName);
            //$scope.getRoutes(scenarioName);
             //$scope.data = [{ key: "Some key", values:[{"label":"77", "value":"22.0"}]}];
            ScenarioFactory.get({id:scenarioName}, function(data){
                var jsonfileData = data.json_file;
                //console.log(jsonfileData);
                var jsonData = angular.fromJson(jsonfileData);
                //console.log(jsonData);
                 $scope.selectedScenario = transform(jsonData);
                 $rootScope.viewer.entities.removeAll();
                 $scope.selectedScenario.forEach(function(e){
                     $rootScope.viewer.entities.add(e);
                 });
                 $rootScope.viewer.zoomTo($rootScope.viewer.entities);
            });
            CesiumFactory.query(function(data){
                console.log("Cesium Factory");
                 //   console.log(data);
                 $scope.selectedScenario = addroutes(data, scenarioName);
                 $scope.selectedScenario.forEach(function(e){
                     $rootScope.viewer.entities.add(e);
                 });
            });
            LineFactory.get({id:scenarioName}, function(data){
                console.log("In Line Factory");
                var chartKey  = data.key;
                    //console.log(chartKey);
                    var chartDataStr = data.data;
                    var jsonChartData = angular.fromJson(chartDataStr);
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
                var ll = nmToLatLon(site.location[0], site.location[1]);
                viewerData.push({
                  id : site.name,
                  name : site.name,
                    description : 'Location: '+site.location[0]+', '+site.location[1]+'<br>'+
                    'Risk Type: '+site.risk.type+'<br>'+
                        'Needed Asset Types: '+site.needed_asset_types,
                  position : Cesium.Cartesian3.fromDegrees(ll[1], ll[0]),
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
        var addroutes = function(routedata, scenarioName){
            var viewerData = [];
            for (var i=0; i<routedata.length; i++) {
                var route = routedata[i];
                if (route.scenario != scenarioName) {
                    continue;
                }
                var degarray = [];
                for (var j = 0; j < route.route_segments.length; j++) {
                    var seg = route.route_segments[j];
                    if (j === 0) {
                        var ll0 = nmToLatLon(seg.start_latitude, seg.start_longitude);
                        degarray.push(ll0[1]);
                        degarray.push(ll0[0]);
                    }
                    var ll1 = nmToLatLon(seg.end_latitude, seg.end_longitude);
                    degarray.push(ll1[1]);
                    degarray.push(ll1[0]);
                }
                viewerData.push({
                    id: route.name,
                    name: route.name,
                    description: 'length: ' + route.distance,
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(degarray),
                        width: 5,
                        material: new Cesium.PolylineGlowMaterialProperty({
                            glowPower: 0.2,
                            color: Cesium.Color.BLUE
                        })
                    }
                });
            }
            return viewerData;
        };

}]);
