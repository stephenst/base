(function () {
    'use strict';

    angular
        .module('metal.stock')
        .factory('StockFactory', StockFactory);

    StockFactory.$inject = ['$resource'];

    /**
     * @ngdoc service
     * @name ScenarioFactory
     * @memberof metal.scenarios
     */
    function StockFactory ($resource) {
        var service = {
            getStock: getStock,
            getPerspectives: getPerspectives
        };

        /**
         * @name getScenarios
         * @memberof metal.scenarios.ScenarioFactory
         * @summary
         *  Utility function for mapdata object REST resource
         *
         * @returns {*}
         */
        function getStock () {
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
        }

        function getPerspectives () {
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
        }

        return service;
    }
})();
