/**
 * Created by pcharasala on 6/23/2017.
 */
angular
    .module('appRoutes', ["ui.router"])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state({
        name: 'stock',
        url: '/',
        templateUrl: 'components/stock/templates/stock.template',
        controller: 'StockController'
    });
    $stateProvider.state({
        name: 'pie',
        url: '/pie',
        templateUrl: 'components/charts/templates/pie.html',
        controller: 'PieController'
    });

    $urlRouterProvider.otherwise('/');
}]);