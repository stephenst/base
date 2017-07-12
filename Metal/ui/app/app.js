'use strict';

// Declare app level module which depends on views, and components
var stock = angular.module('stock',[]);
var pie = angular.module('pie', ['nvd3']);
var cesium = angular.module('cesium', ['nvd3']);
var widgets = angular.module('widgets', ["jqwidgets"]);
angular.module('metal', [
  'appRoutes',
  'nvd3',
  'stock',
  'pie',
  'cesium',
  'widgets',
  'ngResource'
]);


