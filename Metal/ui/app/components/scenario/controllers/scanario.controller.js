/**
 * Created by pcharasala on 7/17/17.
 */

scenario
    .controller('ScenarioController', ['$scope', 'ScenarioFactory', function($scope, ScenarioFactory) {

        ScenarioFactory.query().$promise.then(function(data) {
            $scope.scenarios = data;
        });
}]);
