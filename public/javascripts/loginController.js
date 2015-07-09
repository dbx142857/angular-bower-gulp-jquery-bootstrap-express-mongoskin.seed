(function($){
    'use strict';
    angular.module('cogtu.ad')
        .controller('loginController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {
                console.log('baseService',baseService)
                if(baseService.username){
                    $location.url(CONFIG.HOME_URL);
                }
                else{
                    var isRequesting=false;
                    $scope.formData={};
                    $scope.submit=function(){
                        if(isRequesting){
                            return false;
                        }
                        isRequesting=true;
                        $http.post(CONFIG.LOGIN_URL,{
                            params:$scope.formData
                        })
                            .then(function(e){
                                var data= e.data;
                                console.log('data is:',data);
                                if(angular.isUndefined(data.advertisers_name)){
                                    layer.alert(data.msg);
                                }
                                else{
                                    //console.log('data is:',data);
                                    //var user=baseService.username=$scope.formData.advertisers_name;
                                    //baseService.user=data;
                                    baseService.init();
                                    $location.url(CONFIG.HOME_URL);
                                }
                                isRequesting=false;
                            })
                    }
                }
            }]);
})(jQuery);