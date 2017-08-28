(function () {
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
    ]).run(function ($rootScope) {
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
    });
})();
