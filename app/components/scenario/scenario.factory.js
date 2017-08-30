(function () {
    'use strict';

    angular
        .module('metal.scenario')
        .factory('ScenarioFactory', ScenarioFactory);

    ScenarioFactory.$inject = ['$resource'];

    /**
     * @ngdoc service
     * @name ScenarioFactory
     * @memberof metal.scenario
     */
    function ScenarioFactory ($resource) {
        var service = {
            getScenarios: getScenarios
        };

        /**
         * @name getScenarios
         * @memberof metal.scenario.ScenarioFactory
         * @summary
         *  Utility function for mapdata object REST resource
         *
         * @returns {*}
         */
        function getScenarios () {
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
        }

        return service;
    }
})();

