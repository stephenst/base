(function () {
    'use strict';

    angular
        .module('metal.charts')
        .factory('LineFactory', LineFactory);

    LineFactory.$inject = ['$resource'];

    /**
     * @ngdoc service
     * @name LineFactory
     * @memberof metal.cesium
     */
    function LineFactory($resource) {
        var service = {
            getTimeToFailure: getTimeToFailure
        };

        /**
         * @name getTimeToFailure
         * @memberof metal.charts.LineFactory
         * @summary
         *  Utility function for mapdata object REST resource
         *
         * @returns {*}
         */
        function getTimeToFailure() {
            return $resource(
                'http://127.0.0.1:8072/metal/time_to_failure_distributions/:id/',
                {},
                {
                    'query': {
                        method: 'GET',
                        isArray: true,
                        headers: {
                            'Content-Type': 'application/json'
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
