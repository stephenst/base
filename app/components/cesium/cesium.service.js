(function () {
    'use strict';

    angular
        .module("metal.cesium")
        .factory("CesiumFactory", CesiumFactory);

    CesiumFactory.$inject = [];

    /**
     * @ngdoc service
     * @name factory
     * @memberof metal.cesium
     */
    function CesiumFactory ($resource) {
        var service = {
            getMapData: getMapData
        };

        /**
         * @name getMapData
         * @memberof metal.cesium.factory
         * @summary
         *  Utility function for mapdata object REST resource
         *
         * @returns {*}
         */
        function getMapData () {
            return $resource(
                'http://127.0.0.1:8072/metal/mapdata/:id/',
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
});
