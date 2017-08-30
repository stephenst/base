// jshint ignore: start
(function () {
    'use strict';

    angular
        .module("metal.scenario")
        .controller("ScenarioController", ScenarioController);

    ScenarioController.$inject = ['$rootScope', '$scope', 'ScenarioFactory', 'ChartsFactory', 'CesiumFactory', 'StockFactory'];

    /**
     * @ngdoc controller
     * @name ScenarioController
     * @memberof metal.scenario
     *
     * @constructor
     */
    function ScenarioController($rootScope, $scope, ScenarioFactory, ChartsFactory, CesiumFactory, StockFactory) {
        var vm = this;
        activate();

        /**
         * activate function
         *
         * @memberof metal.cesium.cesiumController
         * @returns Console output
         */
        function activate() {
            console.log("Activated Layout");
            $rootScope.viewer = new Cesium.Viewer('cesiumContainer', {
                animation: false,
                timeline: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: true,
                sceneMode: Cesium.SceneMode.SCENE2D,
                selectionIndicator: true,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
                scene3Donly: false
                // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                //    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                // })
            });
            $rootScope.server_port = '8070';

            // Create jqxDocking
            // $("#docking").jqxDocking({width: 250, theme: 'classic'});
            // $("#importBtn").click();
        }

        $rootScope.$on('loadScenario', function (event, name) {
            console.log('caught the $emit of ', name);
            $scope.getScenario(name);
        });

        var earthradius = 3440.2769;
        var sqrt3 = Math.sqrt(3);

        function radians(deg) {
            return (deg * (Math.PI / 180));
        }

        function degLatToNm(degLat) {
            return ((Math.PI * earthradius * 2 / 360) * degLat);
        }

        function nmToDegLat(nm) {
            return (nm / degLatToNm(1));
        }

        function degLonToNm(degLon, lat) {
            var latradius = Math.cos(radians(lat)) * earthradius;
            return ((Math.PI * latradius * 2 / 360) * degLon);
        }

        function nmToDegLon(nm, lat) {
            return (nm / degLonToNm(1, lat));
        }

        function nmToLatLon(nmx, nmy) {
            var lat = nmToDegLat(nmy);
            var lon = nmToDegLon(nmx, lat);
            return [lat, lon];
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

        $scope.run_model = function (scenarioName) {
            ScenarioFactory.getScenarios().run({id: scenarioName}, function (data) {
                console.log("model run for scenario:" + scenarioName);
            });
        };

        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
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

        $scope.getScenario = function (scenarioName) {

            //$scope.run_model(scenarioName);
            //$scope.getRoutes(scenarioName);
            //$scope.data = [{ key: "Some key", values:[{"label":"77", "value":"22.0"}]}];
            ScenarioFactory.getScenarios().get({id: scenarioName}, function (data) {

            });

            ChartsFactory.getTimeToFailure().get({id: scenarioName}).$promise.then(function (data) {
                console.log("In Line Factory");
                var chartKey = data.key;
                //console.log(chartKey);
                var chartDataStr = data.data;
                var jsonChartData = angular.fromJson(chartDataStr);
                $scope.data = [
                    {
                        key: chartKey,
                        values: jsonChartData
                    }
                ];
            }).then(function () {
                CesiumFactory.getMapData().get({id: scenarioName}).$promise.then(function (data) {
                    console.log("Cesium Factory");
                    // clear the existing map
                    $rootScope.viewer.entities.removeAll();
                    // create entities from the map data
                    $scope.selectedScenario = createCesiumMapEntities(data);
                    // add entities to the map
                    $scope.selectedScenario.forEach(function (e) {
                        $rootScope.viewer.entities.add(e);
                    });
                    // zoom into entity location
                    $rootScope.viewer.zoomTo($rootScope.viewer.entities);
                });
            });

        };

        var createCesiumMapEntities = function (data) {
            var viewerData = [];
            // add sites
            data.sites.forEach(function (e) {
                var site = e;
                var ll = nmToLatLon(site.latitude, site.longitude);
                var assetresourcetable = 'none';
                var ares;
                if (e.asset.asset_resources.length > 0) {
                    assetresourcetable = '<br><table><tr><td>Resource</td><td>Congested Consumption</td><td>Uncongested Consumption</td></tr>';
                    for (var ar = 0; ar < e.asset.asset_resources.length; ar++) {
                        ares = e.asset.asset_resources[ar];
                        assetresourcetable = assetresourcetable + '<tr><td>' + ares.resource.name + '</td><td>' + ares.contested_consumption + '</td><td>' + ares.uncontested_consumption + '</td></tr>';
                    }
                    assetresourcetable = assetresourcetable + '</table>';
                }
                viewerData.push({
                    id: site.name,
                    name: site.name,
                    description: 'Location: ' + site.latitude + ', ' + site.longitude + '<br>' +
                    'Asset Type: ' + site.asset.name + '<br>Asset Resources: ' + assetresourcetable,
                    position: Cesium.Cartesian3.fromDegrees(ll[1], ll[0]),
                    point: {
                        pixelSize: 6,
                        color: Cesium.Color.fromCssColorString(site.asset.htmlcolor),
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2
                    },
                    label: {
                        text: site.name,
                        font: '14pt monospace',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -9)
                    }
                });
            });
            // add threat areas
            var riskareas = data.risk_areas;
            for (var i = 0; i < riskareas.length; i++) {
                var area = riskareas[i];
                var degarray = [];
                for (var j = 0; j < area.risk_area_verteces.length; j++) {
                    var vertex = area.risk_area_verteces[j];
                    var ll = nmToLatLon(vertex.latitude, vertex.longitude);
                    degarray.push(ll[1]);
                    degarray.push(ll[0]);
                }
                var rcolor = Cesium.Color.fromCssColorString(area.risktype.htmlcolor);
                viewerData.push({
                    id: area.name,
                    name: area.name,
                    description: 'Risk Type: ' + area.risktype.name,
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray(degarray),
                        material: rcolor.withAlpha(0.5),
                        fill: true,
                        height: 0,
                        outline: true,
                        outlineColor: rcolor,
                        outlineWidth: 5
                    }
                });
            }
            // add routes
            var routedata = data.routes;
            for (var i = 0; i < routedata.length; i++) {
                var route = routedata[i];
                if (route.asset_route_assignments.length === 0) {
                    // no assignments to this route
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
                var asset_assignments = '<table>';
                asset_assignments = asset_assignments + '<tr><td>Asset</td><td>Quantity</td>';
                for (var r = 0; r < data.resources.length; r++) {
                    asset_assignments = asset_assignments + '<td>' + data.resources[r].name + '</td>';
                }
                asset_assignments = asset_assignments + '</tr>';
                var ares;
                for (var j = 0; j < route.asset_route_assignments.length; j++) {
                    var assetinv = route.asset_route_assignments[j];
                    var asset = assetinv.asset;
                    asset_assignments = asset_assignments + '<tr><td>' + asset.name + '</td><td>' + assetinv.count + '</td>';
                    for (var r = 0; r < data.resources.length; r++) {
                        var res = data.resources[r];
                        var found = false;
                        for (var ar = 0; ar < asset.asset_resources.length; ar++) {
                            ares = asset.asset_resources[ar];
                            if (ares.resource.id === res.id) {
                                asset_assignments = asset_assignments + '<td>' + ares.transport_capacity + '</td>';
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            asset_assignments = asset_assignments + '<td>0</td>';
                        }
                    }
                    asset_assignments = asset_assignments + '</tr>';
                }
                asset_assignments = asset_assignments + '</table>';
                viewerData.push({
                    id: route.name,
                    name: route.name,
                    description: 'length: ' + route.distance + '<br>Asset Assignments:<br>' + asset_assignments,
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

    }

})();
// jshint ignore: end

