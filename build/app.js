'use strict';

var config = {
    appTitle: 'MAIN APP',
    locale: 'en-US'
};

angular.module('metal')
    .config(configure)
    .value('appConfig', config);

intercept.$inject = ['$timeout', '$q', '$injector'];

/**
 * @ngdoc function
 * @name intercept
 * @memberof metal.config
 * @param {Object} $timeout
 * @param {Object} $q
 * @param {Object} $injector
 * @returns {{responseError: Function}}
 */
function intercept($timeout, $q, $injector) {
    var $http;
    var $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    $timeout(function () {
        $http = $injector.get('$http');
        $state = $injector.get('$state');
    });

    return {
        /**
         * @ngdoc method
         * @name responseError
         * @memberof app.config.intercept
         * @summary
         * this is the response error being built; if it's not a 401
         *
         * @param {Object} rejection
         * @returns {*}
         */
        responseError: function (rejection) {
            var deferred = $q.defer();

            if (rejection.status !== 401) {
                return rejection;
            }

            return deferred.promise;
        }
    };
}

configure.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', 'markedProvider'];

/**
 * @ngdoc function
 * @name config
 * @memberof metal
 * @summary
 * This is the configuration of the States and Routes using UI-Router.
 *
 * @description
 * Here we are pushing our customer interceptor, and setting up the root
 * state that will be the parent state as well (with some default resolves)
 *
 * @see https://github.com/angular-ui/ui-router
 * @see {@link app.config.intercept}
 *
 * @param {Object} $stateProvider - Setting the Root State via `ui-router`
 * @param {Object} $urlRouterProvider - Used as a saftey net to redirect any goofy/mistype URL to root.
 * @param {Object} $httpProvider - Angular Provider to set the [intercept]{@link app.config.intercept}
 * @param {Object} markedProvider - Provider Service to set the highlighting functions for CODE in the markdown.
 *
 * @requires {@link metal.config.intercept}
 */
function configure($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push(intercept);

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        // No need to specify default options
        $state.go('/', {}, {reload: true});
    });

    /**
     * @ngdoc overview
     * @name states
     * @memberof metal.config
     * @summary
     *  Defines the following routes
     *  - Home - Parent view of navigation wrapper; with subview of main.content. Defaults to subview of Dashboard currently.
     *  - main.content - this is the default subview of the Layout Main area.
     *
     * @description
     * This is the ROOT state. All other states derive from this one.  This is a good place to set master resolves,
     * as they will inherit down.
     *
     * @requires $stateProvider
     *
     * @param {Object} state
     * @param {string} state.name - The State Name: 'root'
     * @param {string} state.url - The URL.  Empty to be root level.
     * @param {Object} state.data - Data Objects to pass into view.
     * @param {string} state.data.pageTitle - Used to set Current Page Titles on the browser in app.run
     * @param {Object} state.views
     * @param {Object} state.views.navigation.global - Global Nav in view `navigation.global`, controller: `NavGlobalController`
     * @param {Object} state.views.navigation.sidebar - Sidebar Primary Nav in view `navigation.sidebar`, controller: `NavSidebarController`
     * @param {Object} state.views.main.content - Main Content in view `main.content`, controller: `DashboardController`
     * @param {Object} state.views.resolve - These functions will resolve their promises before the view renders; and pass those objects into the controller.
     * @param {boolean} state.views.resolve.requiresLogin - This tells the app to fire the auth check or not.
     * @param {Array} state.views.resolve.roles - This is a String Array of the roles accepted in the app.
     *
     * @see https://github.com/angular-ui/ui-router, https://github.com/angular-ui/ui-router/wiki
     */
    $stateProvider.state({
        name: 'default',
        url: '',
        // templateUrl: 'components/charts/templates/line.html',
        // controller: 'LineController',
        views: {
            'primary.nav': {
                templateUrl: 'components/scenario/templates/scenario.html',
                controller: 'ScenarioController'
            }
        },
        resolve: {
            /**
             * @ngdoc method
             * @name initRootState
             * @memberof metal.config.states
             * @summary
             * A handy resolve to indicate all the resolves in root state are completed.
             * That way in future if there is a new root state resolve added, no need to update all the
             * child states' code to use the last resolve. All you need to do is update the injection in here.
             *
             * @description
             * NOTE: The following resolve keys MUST still be injected into the child states if you want to wait for the promises to be resolved
             * before instantiating the children. The advantage of defining at root level resolve is that we need not duplicate the resolve code.
             * Any child state that depends on user being logged in (which must be ALL) should inject the last resolve in the chain - initRootState
             * to ensure the app root state is set before child state is instantiated. This is especially needed when user directly navigates to the
             * child state url from a bookmark.
             *
             * @requires {@link app.core.logger}
             */
            initRootState: ['', function () {
                console.log('Default/Root state resolved');
            }]
        }
    });
    $stateProvider.state({
        name: 'stock',
        parent: 'default',
        url: '/stock',
        templateUrl: 'components/stock/templates/stock.template',
        controller: 'StockController'
    });
    $stateProvider.state({
        name: 'boxplot',
        url: '/boxplot',
        templateUrl: 'components/charts/templates/boxplot.html',
        controller: 'BoxPlotController'
    });
    $stateProvider.state({
        name: 'line',
        url: '/line',
        templateUrl: 'components/charts/templates/line.html',
        controller: 'LineController'
    });
    $stateProvider.state({
        name: 'pie',
        url: '/pie',
        templateUrl: 'components/charts/templates/pie.html',
        controller: 'PieController'
    });
    $stateProvider.state({
        name: 'scenario',
        url: '/scenario',
        templateUrl: 'components/scenario/templates/scenario.html',
        controller: 'ScenarioController'
    });
    $urlRouterProvider.otherwise('/');

}

'use strict';

/**
 * @ngdoc module
 * @name metal
 * @summary
 * The main Module of the METAL App.  Everything is nested from this one 'app' module.
 * @description
 * Top level components are listed here as they are added to the application.  Sub-components (such as core items) are
 * listed within those individual modules.
 *
 * @requires {@Link app.core}
 * @requires {@Link app.layout}
 * @requires {@Link app.patterns}
 */
angular.module('metal', [
    'nvd3',
    'cesium',
    'jqwidgets',
    'ngResource',
    'appRoutes',
    'openlayers-directive',
    'openlayers_dir',
    'scenario',
    'widgets',
    'stock',
    'pie',
    'line',
    'boxplot'
]).run(["$rootScope", function ($rootScope) {
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
        scene3Donly: true
//         imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
//             url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
//          })
    });
    $rootScope.server_port = '8070';
}]);



/**
 * Created by pcharasala on 6/23/2017.
 */
angular
    .module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider.state({
        name: 'default',
        url: '',
        //templateUrl: 'components/charts/templates/line.html',
        //controller: 'LineController',
            views: {
            "primary.nav": {
                templateUrl: 'components/scenario/templates/scenario.html',
                controller: 'ScenarioController'
            }
        }
    });
    $stateProvider.state({
        name: 'stock',
        parent: 'default',
        url: '/stock',
        templateUrl: 'components/stock/templates/stock.template',
        controller: 'StockController'
    });
    $stateProvider.state({
        name: 'boxplot',
        url: '/boxplot',
        templateUrl: 'components/charts/templates/boxplot.html',
        controller: 'BoxPlotController'
    });
    $stateProvider.state({
        name: 'line',
        url: '/line',
        templateUrl: 'components/charts/templates/line.html',
        controller: 'LineController'
    });
    $stateProvider.state({
        name: 'pie',
        url: '/pie',
        templateUrl: 'components/charts/templates/pie.html',
        controller: 'PieController'
    });
    $stateProvider.state({
        name: 'scenario',
        url: '/scenario',
        templateUrl: 'components/scenario/templates/scenario.html',
        controller: 'ScenarioController'
    });
    $urlRouterProvider.otherwise('/');
}]);
/**
 * Created by pcharasala on 7/12/2017.
 */
cesium.controller('CesiumController', ['$scope', function($scope) {

}]);

/**
 * Created by pcharasala on 7/3/2017.
 */

cesium
    .factory('CesiumFactory', ["$resource", function($resource) {
        return $resource(
            'http://127.0.0.1:8072/metal/mapdata/:id/',
            {},
            {
                'query': {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
            },
            {
                stripTrailingSlashes: false
            }
        );
    }]);

/**
 * Created by pcharasala on 7/17/17.
 */
boxplot.controller('BoxPlotController', ["$scope", function($scope) {
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
}]);
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
/**
 * Created by pcharasala on 7/3/2017.
 */
pie.controller('PieController', ['$scope', 'PieFactory', function($scope, PieFactory) {
  $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
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
                y: .5
            }
        ];
}]);

/**
 * Created by pcharasala on 7/17/17.
 */

/**
 * Created by pcharasala on 7/17/17.
 */

line
    .factory('LineFactory', ["$resource", function($resource) {
        return $resource(
            'http://127.0.0.1:8072/metal/time_to_failure_distributions/:id/',
            {},
            {
                'query': {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
            },
            {
                stripTrailingSlashes: false
            }
        );
    }]);
/**
 * Created by pcharasala on 7/3/2017.
 */
pie
    .factory('PieFactory', ["$resource", function($resource) {
        return $resource(
            'http://localhost:8072/metal/pie/:id/',
            {},
            {
                'query': {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
            },
            {
                stripTrailingSlashes: false
            }
        );
    }]);
/**
 * Created by pcharasala on 7/17/17.
 */
var earthradius = 3440.2769;
var sqrt3 = Math.sqrt(3);

function radians(deg) {
    return (deg * (Math.PI / 180));
};

function degLatToNm(degLat) {
    return ((Math.PI * earthradius * 2 / 360) * degLat);
};

function nmToDegLat(nm) {
    return (nm / degLatToNm(1));
};

function degLonToNm(degLon, lat) {
    var latradius = Math.cos(radians(lat)) * earthradius;
    return ((Math.PI * latradius * 2 / 360) * degLon);
};

function nmToDegLon(nm, lat) {
    return (nm / degLonToNm(1, lat));
};

function nmToLatLon(nmx, nmy) {
    var lat = nmToDegLat(nmy);
    var lon = nmToDegLon(nmx, lat);
    return [lat, lon];
};


scenario
    .controller('ScenarioController', ['$rootScope', '$scope', 'ScenarioFactory', 'LineFactory', 'CesiumFactory', 'PerspectiveFactory',
        function ($rootScope, $scope, ScenarioFactory, LineFactory, CesiumFactory, PerspectiveFactory) {


            $scope.export = function (eventData) {
                console.log("Export button clicked");
                var jsondatastr = $('#docking').jqxDocking('exportLayout');
                console.log(jsondatastr);

                $scope.perspective.jsondata = jsondatastr;
                PerspectiveFactory.update($scope.perspective, function () {
                    console.log("saved");
                });
            };

            $scope.import = function (eventData) {
                console.log("Import button clicked");
                //var jsondata = '{"panel0": {"window3":{"collapsed":false}},"floating":{"window1":{"x":"1320px","y":"55px","width":"265","height":"571","collapsed":false},"window2":{"x":"330px","y":"347px","width":"870","height":"537","collapsed":false}},"orientation": "horizontal"}';

                PerspectiveFactory.get({id: 1}, function (data) {
                    //console.log(data);
                    $scope.perspective = data;
                    $('#docking').jqxDocking('importLayout', data.jsondata);
                });
            };

            $scope.run_model = function (scenarioName) {
                ScenarioFactory.run({id: scenarioName}, function (data) {
                    console.log("model run for scenario:" + scenarioName);
                });
            };

            ScenarioFactory.query().$promise.then(function (data) {
                console.log("Scenario Controller query")
                $scope.scenarios = data;
            });

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
                ScenarioFactory.get({id: scenarioName}, function (data) {

                });

                LineFactory.get({id: scenarioName}).$promise.then(function (data) {
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
                    CesiumFactory.get({id: scenarioName}).$promise.then(function (data) {
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

        }]);


scenario
    .factory('ScenarioFactory', ["$resource", function($resource){
        return  $resource(
            'http://localhost:8072/metal/scenarios/:id/:run',
            {id: '@id', run: '@run'},
            {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json'
                    }
                },
                update: {
                    method: 'PUT' // this method issues a PUT request
                },
                run: {
                    method: 'GET',
                    params:{
                        run:'run_model'
                    },
                    headers: {
                        'Content-Type':'application/json'
                    }
                }

            },
            {
                stripTrailingSlashes: false
            }
        );

    }]);

/**
 * Created by pcharasala on 6/23/2017.
 */
stock
    .controller('StockController', ['$scope', 'StockFactory', 'PerspectiveFactory', function($scope, StockFactory, PerspectiveFactory) {

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




}]);

/**
 * Created by pcharasala on 6/23/2017.
 */
stock
    .factory('StockFactory', ["$resource", function($resource) {
        return $resource(
            'http://localhost:8072/metal/stock/:id/',
            {},
            {
                'query': {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
            },
            {
                stripTrailingSlashes: false
            }
        );
    }])
    .factory('PerspectiveFactory', ["$resource", function($resource){
        return $resource(
            'http://localhost:8072/metal/perspectives/:id/',
            {id: '@id'},
            {
                query: {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json'
                    }
                },
                update: {
                    method: 'PUT' // this method issues a PUT request
                }
            },
            {
                stripTrailingSlashes: false
            }
        );
    }]);
'use strict';

angular.module('myApp.version.interpolate-filter', [])

.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);

'use strict';

describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('interpolate filter', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });
});

'use strict';

angular.module('myApp.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

'use strict';

describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('app-version directive', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});

'use strict';

angular.module('myApp.version', [
  'myApp.version.interpolate-filter',
  'myApp.version.version-directive'
])

.value('version', '0.1');

'use strict';

describe('myApp.version module', function() {
  beforeEach(module('myApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

var missionsites =
{
  "sites" : [
    {
      "name": "Group W",
      "location": [ 38.882501, -77.227027 ]
    },
    {
      "name": "Bermuda",
      "location": [ 32.326143, -64.742977 ]
    },
{ "name": "Albany, N.Y.", "location": [ 42.6666666666667, -73.75 ] },
{ "name": "Albuquerque, N.M.", "location": [ 35.0833333333333, -106.65 ] },
{ "name": "Amarillo, Tex.", "location": [ 35.1833333333333, -101.833333333333 ] },
{ "name": "Anchorage, Alaska", "location": [ 61.2166666666667, -149.9 ] },
{ "name": "Atlanta, Ga.", "location": [ 33.75, -84.3833333333333 ] },
{ "name": "Austin, Tex.", "location": [ 30.2666666666667, -97.7333333333333 ] },
{ "name": "Baker, Ore.", "location": [ 44.7833333333333, -117.833333333333 ] },
{ "name": "Baltimore, Md.", "location": [ 39.3, -76.6333333333333 ] },
{ "name": "Bangor, Maine", "location": [ 44.8, -68.7833333333333 ] },
{ "name": "Birmingham, Ala.", "location": [ 33.5, -86.8333333333333 ] },
{ "name": "Bismarck, N.D.", "location": [ 46.8, -100.783333333333 ] },
{ "name": "Boise, Idaho", "location": [ 43.6, -116.216666666667 ] },
{ "name": "Boston, Mass.", "location": [ 42.35, -71.0833333333333 ] },
{ "name": "Buffalo, N.Y.", "location": [ 42.9166666666667, -78.8333333333333 ] },
{ "name": "Calgary, Alba., Can.", "location": [ 51.0166666666667, -114.016666666667 ] },
{ "name": "Carlsbad, N.M.", "location": [ 32.4333333333333, -104.25 ] },
{ "name": "Charleston, S.C.", "location": [ 32.7833333333333, -79.9333333333333 ] },
{ "name": "Charleston, W. Va.", "location": [ 38.35, -81.6333333333333 ] },
{ "name": "Charlotte, N.C.", "location": [ 35.2333333333333, -80.8333333333333 ] },
{ "name": "Cheyenne, Wyo.", "location": [ 41.15, -104.866666666667 ] },
{ "name": "Chicago, Ill.", "location": [ 41.8333333333333, -87.6166666666667 ] },
{ "name": "Cincinnati, Ohio", "location": [ 39.1333333333333, -84.5 ] },
{ "name": "Cleveland, Ohio", "location": [ 41.4666666666667, -81.6166666666667 ] },
{ "name": "Columbia, S.C.", "location": [ 34, -81.0333333333333 ] },
{ "name": "Columbus, Ohio", "location": [ 40, -83.0166666666667 ] },
{ "name": "Dallas, Tex.", "location": [ 32.7666666666667, -96.7666666666667 ] },
{ "name": "Denver, Colo.", "location": [ 39.75, -105 ] },
{ "name": "Des Moines, Iowa", "location": [ 41.5833333333333, -93.6166666666667 ] },
{ "name": "Detroit, Mich.", "location": [ 42.3333333333333, -83.05 ] },
{ "name": "Dubuque, Iowa", "location": [ 42.5166666666667, -90.6666666666667 ] },
{ "name": "Duluth, Minn.", "location": [ 46.8166666666667, -92.0833333333333 ] },
{ "name": "Eastport, Maine", "location": [ 44.9, -67 ] },
{ "name": "Edmonton, Alb., Can.", "location": [ 53.5666666666667, -113.466666666667 ] },
{ "name": "El Centro, Calif.", "location": [ 32.6333333333333, -115.55 ] },
{ "name": "El Paso, Tex.", "location": [ 31.7666666666667, -106.483333333333 ] },
{ "name": "Eugene, Ore.", "location": [ 44.05, -123.083333333333 ] },
{ "name": "Fargo, N.D.", "location": [ 46.8666666666667, -96.8 ] },
{ "name": "Flagstaff, Ariz.", "location": [ 35.2166666666667, -111.683333333333 ] },
{ "name": "Fort Worth, Tex.", "location": [ 32.7166666666667, -97.3166666666667 ] },
{ "name": "Fresno, Calif.", "location": [ 36.7333333333333, -119.8 ] },
{ "name": "Grand Junction, Colo.", "location": [ 39.0833333333333, -108.55 ] },
{ "name": "Grand Rapids, Mich.", "location": [ 42.9666666666667, -85.6666666666667 ] },
{ "name": "Havre, Mont.", "location": [ 48.55, -109.716666666667 ] },
{ "name": "Helena, Mont.", "location": [ 46.5833333333333, -112.033333333333 ] },
{ "name": "Honolulu, Hawaii", "location": [ 21.3, -157.833333333333 ] },
{ "name": "Hot Springs, Ark.", "location": [ 34.5166666666667, -93.05 ] },
{ "name": "Houston, Tex.", "location": [ 29.75, -95.35 ] },
{ "name": "Idaho Falls, Idaho", "location": [ 43.5, -112.016666666667 ] },
{ "name": "Indianapolis, Ind.", "location": [ 39.7666666666667, -86.1666666666667 ] },
{ "name": "Jackson, Miss.", "location": [ 32.3333333333333, -90.2 ] },
{ "name": "Jacksonville, Fla.", "location": [ 30.3666666666667, -81.6666666666667 ] },
{ "name": "Juneau, Alaska", "location": [ 58.3, -134.4 ] },
{ "name": "Kansas City, Mo.", "location": [ 39.1, -94.5833333333333 ] },
{ "name": "Key West, Fla.", "location": [ 24.55, -81.8 ] },
{ "name": "Kingston, Ont., Can.", "location": [ 44.25, -76.5 ] },
{ "name": "Klamath Falls, Ore.", "location": [ 42.1666666666667, -121.733333333333 ] },
{ "name": "Knoxville, Tenn.", "location": [ 35.95, -83.9333333333333 ] },
{ "name": "Las Vegas, Nev.", "location": [ 36.1666666666667, -115.2 ] },
{ "name": "Lewiston, Idaho", "location": [ 46.4, -117.033333333333 ] },
{ "name": "Lincoln, Neb.", "location": [ 40.8333333333333, -96.6666666666667 ] },
{ "name": "London, Ont., Can.", "location": [ 43.0333333333333, -81.5666666666667 ] },
{ "name": "Long Beach, Calif.", "location": [ 33.7666666666667, -118.183333333333 ] },
{ "name": "Los Angeles, Calif.", "location": [ 34.05, -118.25 ] },
{ "name": "Louisville, Ky.", "location": [ 38.25, -85.7666666666667 ] },
{ "name": "Manchester, N.H.", "location": [ 43, -71.5 ] },
{ "name": "Memphis, Tenn.", "location": [ 35.15, -90.05 ] },
{ "name": "Miami, Fla.", "location": [ 25.7666666666667, -80.2 ] },
{ "name": "Milwaukee, Wis.", "location": [ 43.0333333333333, -87.9166666666667 ] },
{ "name": "Minneapolis, Minn.", "location": [ 44.9833333333333, -93.2333333333333 ] },
{ "name": "Mobile, Ala.", "location": [ 30.7, -88.05 ] },
{ "name": "Montgomery, Ala.", "location": [ 32.35, -86.3 ] },
{ "name": "Montpelier, Vt.", "location": [ 44.25, -72.5333333333333 ] },
{ "name": "Montreal, Que., Can.", "location": [ 45.5, -73.5833333333333 ] },
{ "name": "Moose Jaw, Sask., Can.", "location": [ 50.6166666666667, -105.516666666667 ] },
{ "name": "Nashville, Tenn.", "location": [ 36.1666666666667, -86.7833333333333 ] },
{ "name": "Nelson, B.C., Can.", "location": [ 49.5, -117.283333333333 ] },
{ "name": "Newark, N.J.", "location": [ 40.7333333333333, -74.1666666666667 ] },
{ "name": "New Haven, Conn.", "location": [ 41.3166666666667, -72.9166666666667 ] },
{ "name": "New Orleans, La.", "location": [ 29.95, -90.0666666666667 ] },
{ "name": "New York, N.Y.", "location": [ 40.7833333333333, -73.9666666666667 ] },
{ "name": "Nome, Alaska", "location": [ 64.4166666666667, -165.5 ] },
{ "name": "Oakland, Calif.", "location": [ 37.8, -122.266666666667 ] },
{ "name": "Oklahoma City, Okla.", "location": [ 35.4333333333333, -97.4666666666667 ] },
{ "name": "Omaha, Neb.", "location": [ 41.25, -95.9333333333333 ] },
{ "name": "Ottawa, Ont., Can.", "location": [ 45.4, -75.7166666666667 ] },
{ "name": "Philadelphia, Pa.", "location": [ 39.95, -75.1666666666667 ] },
{ "name": "Phoenix, Ariz.", "location": [ 33.4833333333333, -112.066666666667 ] },
{ "name": "Pierre, S.D.", "location": [ 44.3666666666667, -100.35 ] },
{ "name": "Pittsburgh, Pa.", "location": [ 40.45, -79.95 ] },
{ "name": "Portland, Maine", "location": [ 43.6666666666667, -70.25 ] },
{ "name": "Portland, Ore.", "location": [ 45.5166666666667, -122.683333333333 ] },
{ "name": "Providence, R.I.", "location": [ 41.8333333333333, -71.4 ] },
{ "name": "Quebec, Que., Can.", "location": [ 46.8166666666667, -71.1833333333333 ] },
{ "name": "Raleigh, N.C.", "location": [ 35.7666666666667, -78.65 ] },
{ "name": "Reno, Nev.", "location": [ 39.5, -119.816666666667 ] },
{ "name": "Richfield, Utah", "location": [ 38.7666666666667, -112.083333333333 ] },
{ "name": "Richmond, Va.", "location": [ 37.55, -77.4833333333333 ] },
{ "name": "Roanoke, Va.", "location": [ 37.2833333333333, -79.95 ] },
{ "name": "Sacramento, Calif.", "location": [ 38.5833333333333, -121.5 ] },
{ "name": "St. John, N.B., Can.", "location": [ 45.3, -66.1666666666667 ] },
{ "name": "St. Louis, Mo.", "location": [ 38.5833333333333, -90.2 ] },
{ "name": "Salt Lake City, Utah", "location": [ 40.7666666666667, -111.9 ] },
{ "name": "San Antonio, Tex.", "location": [ 29.3833333333333, -98.55 ] },
{ "name": "San Diego, Calif.", "location": [ 32.7, -117.166666666667 ] },
{ "name": "San Francisco, Calif.", "location": [ 37.7833333333333, -122.433333333333 ] },
{ "name": "San Jose, Calif.", "location": [ 37.3333333333333, -121.883333333333 ] },
{ "name": "San Juan, P.R.", "location": [ 18.5, -66.1666666666667 ] },
{ "name": "Santa Fe, N.M.", "location": [ 35.6833333333333, -105.95 ] },
{ "name": "Savannah, Ga.", "location": [ 32.0833333333333, -81.0833333333333 ] },
{ "name": "Seattle, Wash.", "location": [ 47.6166666666667, -122.333333333333 ] },
{ "name": "Shreveport, La.", "location": [ 32.4666666666667, -93.7 ] },
{ "name": "Sioux Falls, S.D.", "location": [ 43.55, -96.7333333333333 ] },
{ "name": "Sitka, Alaska", "location": [ 57.1666666666667, -135.25 ] },
{ "name": "Spokane, Wash.", "location": [ 47.6666666666667, -117.433333333333 ] },
{ "name": "Springfield, Ill.", "location": [ 39.8, -89.6333333333333 ] },
{ "name": "Springfield, Mass.", "location": [ 42.1, -72.5666666666667 ] },
{ "name": "Springfield, Mo.", "location": [ 37.2166666666667, -93.2833333333333 ] },
{ "name": "Syracuse, N.Y.", "location": [ 43.0333333333333, -76.1333333333333 ] },
{ "name": "Tampa, Fla.", "location": [ 27.95, -82.45 ] },
{ "name": "Toledo, Ohio", "location": [ 41.65, -83.55 ] },
{ "name": "Toronto, Ont., Can.", "location": [ 43.6666666666667, -79.4 ] },
{ "name": "Tulsa, Okla.", "location": [ 36.15, -95.9833333333333 ] },
{ "name": "Vancouver, B.C., Can.", "location": [ 49.2166666666667, -123.1 ] },
{ "name": "Victoria, B.C., Can.", "location": [ 48.4166666666667, -123.35 ] },
{ "name": "Virginia Beach, Va.", "location": [ 36.85, -75.9666666666667 ] },
{ "name": "Washington, D.C.", "location": [ 38.8833333333333, -77.0333333333333 ] },
{ "name": "Wichita, Kan.", "location": [ 37.7166666666667, -97.2833333333333 ] },
{ "name": "Wilmington, N.C.", "location": [ 34.2333333333333, -77.95 ] },
{ "name": "Winnipeg, Man., Can.", "location": [ 49.9, -97.1166666666667 ] }
  ]
};


var riskareas =
{
  "name": "METAL Sample Threat Areas",
  "areas": [
    {
	 "id": "Virginia Eastern Shore",
	 "name": "Virginia Eastern Shore",
	 "level" : "land",
         "verteces": [
	   [ 37.964590, -75.653528 ],
	   [ 38.018704, -75.233301 ],
	   [ 37.183113, -75.821069 ],
	   [ 37.082387, -75.966638 ],
	   [ 37.323029, -76.043542 ],
	   [ 37.604257, -75.941919 ]
         ]
    },
    {
	 "id": "Submarines 1",
	 "name": "Submarines 1",
	 "level" : "medium",
         "verteces": [
	   [ 37, -75 ],
	   [ 37, -74 ],
	   [ 36, -74 ],
	   [ 36, -75 ]
         ]
    },
    {
	 "id": "Submarines 2",
	 "name": "Submarines 2",
	 "level" : "medium",
         "verteces": [
	   [ 32, -79 ],
	   [ 32, -78 ],
	   [ 31, -78 ],
	   [ 31, -79 ]
         ]
    },
    {
	 "id": "Corolla CDCM",
	 "name": "Corolla CDCM",
	 "level" : "high",
         "verteces": [
	   [ 36.373004, -75.825724 ],
	   [ 36.985360, -75.985026 ],
	   [ 36.950248, -75.584025 ],
	   [ 36.791400, -75.226043 ]
         ]
    },
    {
	 "id": "Bermuda Triangle",
	 "name": "Bermuda Triangle",
	 "level" : "low",
         "verteces": [
	   [ 32.206207, -64.902568 ],
	   [ 25.588242, -79.927416 ],
	   [ 17.721602, -65.117900 ]
         ]
    }
  ]
};

var routes =
{
  "name": "METAL Sample Routes",
  "routes": [
    {
      "name": "Baltimore to Bermuda",
      "waypoints": [
	   [ 39.259170, -76.560407 ],
	   [ 39.167157, -76.379850 ],
	   [ 38.536355, -76.434567 ],
	   [ 38.252206, -76.258786 ],
	   [ 37.371914, -76.187984 ],
	   [ 37.048173, -76.058895 ],
	   [ 32.326143, -64.742977 ]
      ]
    },
    {
      "name": "Kent Island to Group W",
      "waypoints": [
	   [ 38.985896, -76.33209 ],
	   [ 39.027540, -76.448514 ],
	   [ 38.882501, -77.227027 ]
      ]
    }
  ]
}


var metaldata =
{
  "name": "METAL Sample Scenario",
  "sites": [
    {
      "name": "Baltimore",
      "location": [
        39.259170,
        -76.560407
      ],
      "risk": {"type":"safe"},
      "needed_asset_types": [
        "port"
      ]
    },
    {
      "name": "Kent Island",
      "location": [
        38.985896,
        -76.332097
      ],
      "risk": {
        "type":"forward",
        "transition": {
          "C to U":0.3,
          "U to C":0.5
        }
      },
      "needed_asset_types": [
        "mission"
      ]
    },
    {
      "name": "Rock Hall",
      "location": [
        39.140243,
        -76.259999
      ],
      "risk": {
        "type":"forward",
        "transition": {
          "C to U":0.3,
          "U to C":0.5
        }
      },
      "needed_asset_types": [
        "mission"
      ]
    },
    {
      "name": "Betterton",
      "location": [
        39.370465,
        -76.063962
      ],
      "risk": {
        "type":"forward",
        "transition": {
          "C to U":0.3,
          "U to C":0.5
        }
      },
      "needed_asset_types": [
        "mission"
      ]
    }
  ]
}

'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);
'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});
'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);
'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view2'));

  describe('view2 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('View2Ctrl');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});