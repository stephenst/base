/**
 * Created by pcharasala on 6/23/2017.
 */
stock
    .factory('StockFactory', function($resource) {
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
    })
    .factory('PerspectiveFactory', function($resource){
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
    });