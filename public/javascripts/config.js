(function(){
    'use strict';
    //var COGTU_AD_CONFIG;
    jQuery.ajax({

        type:'get',
        url:'/get_config',
        async:false,
        success:function(config){
            //console.log('config is:',config);
            //COGTU_AD_CONFIG=config;
            angular
                .module('cogtu.ad')
                .constant('CONFIG',config);
        }
    })

})();