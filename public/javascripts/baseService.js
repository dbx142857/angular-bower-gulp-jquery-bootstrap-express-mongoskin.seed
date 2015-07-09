(function($){
    'use strict';
    angular
        .module('cogtu.ad')
        .factory('baseService', baseService);

    baseService.$inject=['$http','$route','$rootScope','$location','CONFIG']
    function baseService($http,$route,$rootScope,$location,CONFIG) {
//console.log('route is:',$route);
        var o=window.aaa={
            username: null,
            user:null,
            //isChangingRoute:false,
            //loadedUrl:[],
            //nav:null,
            remain:null,//现金余额
            v_remain:null,//虚拟账户余额
            total_balance:null,
            urlParams:jQuery.parseUrl(),
            init:function(){

                o.username=null;
                o.user=null;
                o.remain=null;
                o.v_remain=null;

                //o.nav = {
                //    alwaysShow: [
                //        //{
                //        //    name: '首页',
                //        //    href: '/',
                //        //    alwaysShow: true
                //        //}
                //    ],
                //    notLoginShow: [
                //        //{
                //        //    name: '登录',
                //        //    href: CONFIG.LOGIN_URL,
                //        //    hideWhenLogined: true
                //        //}, {
                //        //    name: '注册',
                //        //    href: CONFIG.REG_URL,
                //        //    hideWhenLogined: true
                //        //}
                //    ],
                //    loginedShow: [
                //        //{
                //        //    name: '报表',
                //        //    href: CONFIG.REPORT_URL
                //        //}
                //        //,{
                //        //    name: '广告设置',
                //        //    href: CONFIG.AD_URL
                //        //}
                //        //,
                //        //{
                //        //    name: '账户中心',
                //        //    href: CONFIG.ACCOUNT_URL
                //        //}
                //        //, {
                //        //    name: '工具箱',
                //        //    items: [
                //        //        {
                //        //            name: '报表',
                //        //            href: CONFIG.REPORT_URL
                //        //        }, {
                //        //            name: '广告设置',
                //        //            href: CONFIG.AD_URL
                //        //        }
                //        //    ]
                //        //}
                //        //, {
                //        //    name: '登出',
                //        //    href: CONFIG.LOGOUT_URL
                //        //}
                //    ]
                //}
                //var setNav=function(str,item){
                //    //console.log('item is:',item)
                //    var href;
                //    if(typeof(CONFIG.NAV_HREF[item.toUpperCase()])!=='undefined'){
                //        //if(CONFIG.NAV_HREF[item.toUpperCase()].indexOf('http://')===-1)
                //        href=CONFIG.NAV_HREF[item.toUpperCase()];
                //    }else{
                //        href='/'+item;
                //    }
                //    //var href=item;
                //    //if(typeof(CONFIG.REDIRECT_URLS[href.toUpperCase()])!=='undefined'){
                //    //    href=CONFIG.REDIRECT_URLS[href.toUpperCase()];
                //    //}
                //    o.nav[str].push({
                //        hideWhenLogined:true,
                //        name:CONFIG.NAV_NAME[item.toUpperCase()],
                //        href:href
                //    })
                //}
                //for(var i in CONFIG.MODULES){
                //    var item=CONFIG.MODULES[i];
                //    if([CONFIG.HOME_URL].indexOf('/'+item)!==-1){
                //        setNav('alwaysShow',item);
                //        //o.nav.alwaysShow.push({
                //        //    hideWhenLogined:true,
                //        //    name:item,
                //        //    href:'/'+item
                //        //})
                //    }
                //    else{
                //        if([CONFIG.LOGIN_URL,CONFIG.REG_URL].indexOf('/'+item)!==-1){
                //            setNav('notLoginShow',item);
                //            //o.nav.notLoginShow.push({
                //            //    hideWhenLogined:true,
                //            //    name:item,
                //            //    href:'/'+item
                //            //})
                //        }
                //        else{
                //            //console.log('item is:',item)
                //            if(typeof(CONFIG.NAV_NAME[i])!=='undefined'){
                //                setNav('loginedShow',item);
                //            }
                //            //o.nav.loginedShow.push({
                //            //    hideWhenLogined:true,
                //            //    name:item,
                //            //    href:'/'+item
                //            //})
                //        }
                //    }
                //
                //}
                //
                //
                //
                //
                ////if (o.username === null) {
                //console.log('config is:',CONFIG)


                jQuery.ajax({
                    url:'/get_user',
                    async:false,
                    success:function(res){
                        var e = res.result;
                        console.log('e is:',e);
                        if ((_.isObject(e))&&(e.advertisers_name)) {
                            console.log("sdfsdfsdf")
                            o.username = e.advertisers_name;
                            o.user=e;

                            o.remain=(o.user.total_recharge-o.user.total_cost)/1000000;
                            o.v_remain=(o.user.total_v_recharge-o.user.total_v_cost)/1000000;
                            o.total_balance=((o.user.total_recharge-o.user.total_cost)+(o.user.total_v_recharge-o.user.total_v_cost))/1000000;



                        }
                        else {
                            //o.init();
                            //var arr = [];
                            //for (var i in o.nav.notLoginShow) {
                            //    var href = o.nav.notLoginShow[i].href;
                            //    //arr.push(href.substring(1,href.length));
                            //    arr.push(href);
                            //}
                            //console.log('url,',$location.url())
                            //console.log('arr.indexOf($location.url())',arr.indexOf($location.url()))
                            if (['/home','/reg','/login'].indexOf($location.url()) === -1) {
                                $location.url(CONFIG.HOME_URL);
                            }
                        }

                        //o.$baseScope.$apply();

                    }
                })
                //$http.get('/get_user')
                //    .then(function (res) {
                //
                //
                //        //console.log('location url',$location.url());
                //    })
                //}
            },
            insert:function(options,cb,cbError){
                options= $.extend({
                    tableName:'null',
                    set:{}
                },options);
                console.log('update options is:',options);
                $http.post('/insert',{
                    params:options
                })
                    .then(function(e){
                        //console.log('this is the e:', e.data)
                        var data= e.data;
                        if(data.status==='OK'){
                            if(typeof(cb)!=='undefined'){
                                cb(data.result);
                            }

                        }else{
                            layer.alert(data.msg);
                            if(typeof(cbError)!=='undefined'){
                                cbError(e);
                            }
                        }


                    })
            },
            update:function(options,cb,cbError){
                options= $.extend({
                    tableName:'null',
                    where:'',
                    k:'',
                    v:''
                },options);
                console.log('update options is:',options);
                $http.post('/update',{
                    params:options
                })
                    .then(function(e){
                        //console.log('this is the e:', e.data)
                        var data= e.data;
                        if(data.status==='OK'){
                            cb(data.result);
                        }else{
                            layer.alert(data.msg);
                            if(typeof(cbError)!=='undefined'){
                                cbError(e);
                            }
                        }

                    })
            },
            query:function(options,cb,cbError){
                options= $.extend({
                    select:'*',
                    tableName:'null',
                    where:'',
                    join:'',
                    on:'',
                    groupBy:''
                },options);
                console.log('options is:',options);

                $http.post('/query',{
                    params:options
                })
                    .then(function(e){
                        //console.log('this is the e:', e.data)
                        var data= e.data;
                        if(data.status==='OK'){
                            cb(data.result);
                        }else{
                            layer.alert(data.msg);
                            if(typeof(cbError)!=='undefined'){
                                cbError(e);
                            }
                        }

                    })
            },
            del:function(options,cb,cbError){
                options= $.extend({
                    tableName:'null',
                    where:''
                },options);
                console.log('delete options is:',options);

                $http.post('/del',{
                    params:options
                })
                    .then(function(e){
                        //console.log('this is the e:', e.data)
                        var data= e.data;
                        if(data.status==='OK'){
                            cb(data.result);
                        }else{
                            layer.alert(data.msg);
                            if(typeof(cbError)!=='undefined'){
                                cbError(e);
                            }
                        }

                    })
            },
            count:function(options,cb,cbError){
                options= $.extend({
                    tableName:'null',
                    where:''
                },options);
                console.log('count options is:',options);

                $http.post('/count',{
                    params:options
                })
                    .then(function(e){
                        //console.log('this is the e:', e.data)
                        var data= e.data;
                        if(data.status==='OK'){
                            cb(data.result[0]['count(*)']);
                        }else{
                            layer.alert(data.msg);
                            if(typeof(cbError)!=='undefined'){
                                cbError(e);
                            }
                        }

                    })
            }
            //,
            //validateFormBeforeSubmit:function(formData,obj){
            //
            //    var err='';
            //    for(var i in obj){
            //        if(angular.isString(formData[i])&&formData[i].trim()===''){
            //            err+=obj[i]+'不能为空<br>';
            //        }else if(formData[i]===''||formData[i]===null){
            //            err+=obj[i]+'不能为空<br>';
            //        }
            //    }
            //    console.log('err is:',err);
            //    layer.alert(err);
            //    return err===''?true:false;
            //}
        };

        $rootScope.$on('$routeChangeStart', function() {
            o.isChangingRoute=true;
        });

        $rootScope.$on('$routeChangeSuccess', function() {
            o.urlParams=jQuery.parseUrl();
            o.isChangingRoute=false;



        });
        return o;
    }
})(jQuery);