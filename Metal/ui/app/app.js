'use strict';

// Declare app level module which depends on views, and components
var stock = angular.module('stock',[]);
var pie = angular.module('pie', ['nvd3']);
var line = angular.module('line', []);
var boxplot = angular.module('boxplot', []);
var cesium = angular.module('cesium', ['nvd3']);
var widgets = angular.module('widgets', ["jqwidgets"]);
var scenario = angular.module('scenario', []);
var openlayers_dir = angular.module('openlayers_dir', ['openlayers-directive']);
angular.module('metal', [
  'appRoutes',
  'nvd3',
  'stock',
  'pie',
  'line',
  'boxplot',
  'cesium',
  'widgets',
  'scenario',
  'ngResource',
    'openlayers_dir'
])
    .run(function($rootScope){
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


