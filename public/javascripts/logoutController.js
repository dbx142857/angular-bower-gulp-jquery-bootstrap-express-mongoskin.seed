(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('logoutController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {
                console.log('log out')
                $http.get(CONFIG.LOGOUT_URL)
                    .then(function(e){

                        //baseService.username = null;
                        $location.url(CONFIG.HOME_URL);
                        baseService.init();
                        //location.reload();
                        //location.href=location.protocol+'//'+location.host;
                    })

            }]);
})();