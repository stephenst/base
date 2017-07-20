
scenario
    .factory('ScenarioFactory', function($resource){
        return  $resource(
            'http://localhost:8070/metal/scenarios/:id/:run',
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

    });
