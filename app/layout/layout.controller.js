(function () {
    'use strict';

    angular
        .module('metal.layout')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = [];

    /**
     * @ngdoc controller
     * @name metal.layout.controller
     * @memberof metal.layout
     *
     * @requires {Function} logger
     * @constructor
     */
    function LayoutController () {
        var vm = this;

        activate();

        /**
         * activate function
         *
         * @memberof metal.layout.controller
         * @returns Console output
         */
        function activate () {
            console.log('LayoutController activated');
            vm.IsCollapsed = true;
            vm.username = 'Metal User';
        }
    }
})();

