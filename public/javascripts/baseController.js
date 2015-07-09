(function ($) {
    'use strict';


    angular
        .module('cogtu.ad')
        .controller('baseController', baseController);


    baseController.$inject = ['$animate', '$scope', '$http', 'CONFIG', 'baseService', '$location'];
    function baseController($animate, $scope, $http, CONFIG, baseService, $location) {

        console.log('hello world');

        $scope.location=location;
        $scope.$location = $location;
        $scope.baseService = baseService;
        $scope.baseService.$baseScope=$scope;
        $scope.CONFIG = CONFIG;

        $scope.test = 'base controller test';


        baseService.init();


        //console.log('location href:',location.href);

    }
})(jQuery);