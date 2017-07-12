/**
 * Created by pcharasala on 7/3/2017.
 */
cesium
    .factory('CesiumFactory', function($resource) {
        return $resource(
            'http://localhost:8070/metal/pie/:id/',
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
    });