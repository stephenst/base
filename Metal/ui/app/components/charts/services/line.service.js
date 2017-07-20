/**
 * Created by pcharasala on 7/17/17.
 */

line
    .factory('LineFactory', function($resource) {
        return $resource(
            'http://127.0.0.1:8070/metal/time_to_failure_distributions/:id/',
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