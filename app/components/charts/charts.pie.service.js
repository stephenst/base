(function () {
    'use strict';

    angular
        .module('metal.cesium')
        .factory("PieFactory", PieFactory);

    PieFactory.$inject = ['$resource'];

    /**
     * @ngdoc service
     * @name LineFactory
     * @memberof metal.cesium
     */
    function PieFactory ($resource) {
        var service = {
            getPie: getPie
        };

        /**
         * @name getTimeToFailure
         * @memberof metal.cesium.LineFactory
         * @summary
         *  Utility function for mapdata object REST resource
         *
         * @returns {*}
         */
        function getPie () {
            return $resource(
                'http://localhost:8072/metal/pie/:id/',
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

        return service;
    }
})();
