(function($){
    'use strict';
    angular.module('cogtu.ad')
        .controller('dynamicController')

        .config(['$routeProvider', '$locationProvider','CONFIG', function ($routeProvider, $locationProvider,CONFIG) {
            //var tpl=function(name){
            //    return CONFIG.MODULES[v]+'.html'
            //}
            var arr=[];
            for(var i in CONFIG.MODULES){
                arr.push(CONFIG.MODULES[i]);
            }

            var result=$routeProvider;
            for(var i in arr)
            {
                //var val=arr[i];
                var v=arr[i];
                //var v=val.toUpperCase()+'_TPL';
                //console.log('CONFIG[v].trim()',CONFIG[v].trim()==='');
                //console.log('aaa','/'+CONFIG[v])
                //if(CONFIG[v].trim()===''){
                //    $routeProvider
                //        .when('/'+v,{
                //            template:'',
                //            controller:v+ 'Controller'
                //        })
                //}
                //else{


               //if(v.indexOf('_')===-1){
                   $routeProvider
                       .when('/'+v,{
                           templateUrl:'tpl/'+v+'.html',
                           controller:v+'Controller'
                       })
               //}
               // else{
               //    $routeProvider
               //        .when('/'+v,{
               //            templateUrl:'tpl/'+v+'.html',
               //            controller:'baseController'
               //        })
               //}

                $routeProvider
                    .otherwise({
                        redirectTo: '/'+CONFIG.MODULES.HOME
                    });
                //}
            }
            //$routeProvider
            //    .when(CONFIG.HOME_URL, {
            //        templateUrl:tpl('HOME_TPL'),
            //        controller: 'homeController'
            //    })
        $locationProvider.html5Mode(true);
    }])
})(jQuery);