
scenario
    .factory('ScenarioFactory', function($resource){
        return $resource(
            'http://localhost:8070/metal/scenarios/:id/',
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
