/**
 * Created by pcharasala on 6/23/2017.
 */
stock
    .controller('StockController', ['$scope', 'StockFactory', 'PerspectiveFactory', function($scope, StockFactory, PerspectiveFactory) {

        StockFactory.query().$promise.then(function(data) {
            $scope.stocks = data;
        });

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

        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e',  //color - optional: choose your own line color.
                    strokeWidth: 2,
                    classed: 'dashed'
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };


}])

.controller('BoxPlotController', function($scope) {
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
});
