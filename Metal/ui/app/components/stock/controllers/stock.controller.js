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
