(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name metal
     * @summary
     * The main Module of the METAL App.  Everything is nested from this one 'app' module.
     * @description
     * Top level components are listed here as they are added to the application.  Sub-components (such as core items) are
     * listed within those individual modules.
     *
     * @requires {@Link app.core}
     * @requires {@Link app.layout}
     * @requires {@Link app.patterns}
     */
    angular.module('metal', [
        'nvd3',
        'jqwidgets',
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'metal.layout',
        'metal.cesium',
        'metal.charts',
        'metal.scenario',
        'metal.stock'
    ]);
})();
