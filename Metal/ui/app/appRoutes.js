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