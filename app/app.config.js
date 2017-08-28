(function () {
    'use strict';

    var config = {
        appTitle: 'MAIN APP',
        locale: 'en-US'
    };

    angular.module('metal')
        .config(configure)
        .value('appConfig', config);

    intercept.$inject = ['$timeout', '$q', '$injector'];

    /**
     * @ngdoc function
     * @name intercept
     * @memberof metal.config
     * @param {Object} $timeout
     * @param {Object} $q
     * @param {Object} $injector
     * @returns {{responseError: Function}}
     */
    function intercept($timeout, $q, $injector) {
        var $http;
        var $state;

        // this trick must be done so that we don't receive
        // `Uncaught Error: [$injector:cdep] Circular dependency found`
        $timeout(function () {
            $http = $injector.get('$http');
            $state = $injector.get('$state');
        });

        return {
            /**
             * @ngdoc method
             * @name responseError
             * @memberof app.config.intercept
             * @summary
             * this is the response error being built; if it's not a 401
             *
             * @param {Object} rejection
             * @returns {*}
             */
            responseError: function (rejection) {
                var deferred = $q.defer();

                if (rejection.status !== 401) {
                    return rejection;
                }

                return deferred.promise;
            }
        };
    }

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', 'markedProvider'];

    /**
     * @ngdoc function
     * @name config
     * @memberof metal
     * @summary
     * This is the configuration of the States and Routes using UI-Router.
     *
     * @description
     * Here we are pushing our customer interceptor, and setting up the root
     * state that will be the parent state as well (with some default resolves)
     *
     * @see https://github.com/angular-ui/ui-router
     * @see {@link app.config.intercept}
     *
     * @param {Object} $stateProvider - Setting the Root State via `ui-router`
     * @param {Object} $urlRouterProvider - Used as a saftey net to redirect any goofy/mistype URL to root.
     * @param {Object} $httpProvider - Angular Provider to set the [intercept]{@link app.config.intercept}
     * @param {Object} markedProvider - Provider Service to set the highlighting functions for CODE in the markdown.
     *
     * @requires {@link metal.config.intercept}
     */
    function configure($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.interceptors.push(intercept);

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            // No need to specify default options
            $state.go('/', {}, {reload: true});
        });

        /**
         * @ngdoc overview
         * @name states
         * @memberof metal.config
         * @summary
         *  Defines the following routes
         *  - Home - Parent view of navigation wrapper; with subview of main.content. Defaults to subview of Dashboard currently.
         *  - main.content - this is the default subview of the Layout Main area.
         *
         * @description
         * This is the ROOT state. All other states derive from this one.  This is a good place to set master resolves,
         * as they will inherit down.
         *
         * @requires $stateProvider
         *
         * @param {Object} state
         * @param {string} state.name - The State Name: 'root'
         * @param {string} state.url - The URL.  Empty to be root level.
         * @param {Object} state.data - Data Objects to pass into view.
         * @param {string} state.data.pageTitle - Used to set Current Page Titles on the browser in app.run
         * @param {Object} state.views
         * @param {Object} state.views.navigation.global - Global Nav in view `navigation.global`, controller: `NavGlobalController`
         * @param {Object} state.views.navigation.sidebar - Sidebar Primary Nav in view `navigation.sidebar`, controller: `NavSidebarController`
         * @param {Object} state.views.main.content - Main Content in view `main.content`, controller: `DashboardController`
         * @param {Object} state.views.resolve - These functions will resolve their promises before the view renders; and pass those objects into the controller.
         * @param {boolean} state.views.resolve.requiresLogin - This tells the app to fire the auth check or not.
         * @param {Array} state.views.resolve.roles - This is a String Array of the roles accepted in the app.
         *
         * @see https://github.com/angular-ui/ui-router, https://github.com/angular-ui/ui-router/wiki
         */
        $stateProvider.state({
            name: 'default',
            url: '',
            // templateUrl: 'components/charts/templates/line.html',
            // controller: 'LineController',
            views: {
                'primary.nav': {
                    templateUrl: 'components/scenario/templates/scenario.html',
                    controller: 'ScenarioController'
                }
            },
            resolve: {
                /**
                 * @ngdoc method
                 * @name initRootState
                 * @memberof metal.config.states
                 * @summary
                 * A handy resolve to indicate all the resolves in root state are completed.
                 * That way in future if there is a new root state resolve added, no need to update all the
                 * child states' code to use the last resolve. All you need to do is update the injection in here.
                 *
                 * @description
                 * NOTE: The following resolve keys MUST still be injected into the child states if you want to wait for the promises to be resolved
                 * before instantiating the children. The advantage of defining at root level resolve is that we need not duplicate the resolve code.
                 * Any child state that depends on user being logged in (which must be ALL) should inject the last resolve in the chain - initRootState
                 * to ensure the app root state is set before child state is instantiated. This is especially needed when user directly navigates to the
                 * child state url from a bookmark.
                 *
                 * @requires {@link app.core.logger}
                 */
                initRootState: ['', function () {
                    console.log('Default/Root state resolved');
                }]
            }
        });
        $stateProvider.state({
            name: 'stock',
            parent: 'default',
            url: '/stock',
            templateUrl: 'components/stock/templates/stock.template',
            controller: 'StockController'
        });
        $stateProvider.state({
            name: 'boxplot',
            url: '/boxplot',
            templateUrl: 'components/charts/templates/boxplot.html',
            controller: 'BoxPlotController'
        });
        $stateProvider.state({
            name: 'line',
            url: '/line',
            templateUrl: 'components/charts/templates/line.html',
            controller: 'LineController'
        });
        $stateProvider.state({
            name: 'pie',
            url: '/pie',
            templateUrl: 'components/charts/templates/pie.html',
            controller: 'PieController'
        });
        $stateProvider.state({
            name: 'scenario',
            url: '/scenario',
            templateUrl: 'components/scenario/templates/scenario.html',
            controller: 'ScenarioController'
        });
        $urlRouterProvider.otherwise('/');
    }

})();
