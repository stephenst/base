/**
 * Created by pcharasala on 7/3/2017.
 */

cesium
    .factory('CesiumFactory', function($resource) {
        return $resource(
            'http://127.0.0.1:8072/metal/mapdata/:id/',
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
