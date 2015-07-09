(function($){
    'use strict';
    angular.module('cogtu.ad')
        .controller('regController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {
                console.log('reg load')
                if(baseService.username){
                    //alert("hello")
                    $location.url(CONFIG.HOME_URL);
                }else{
                    var isRequesting=false;
                    $scope.formData={
                        advertisers_name:'',
                        advertisers_email:'',
                        advertisers_password:'',
                        re_advertisers_password:''
                    };
                    var rules={
                            advertisers_name:/^[a-zA-Z0-9.\-_$@*!]{5,15}$/,
                            advertisers_email:/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                            advertisers_password:/^[a-zA-Z]\w{5,15}$/,
                            re_advertisers_password:'advertisers_password'
                        },oIsRight={
                        advertisers_name:false,
                        advertisers_email:false,
                        advertisers_password:false,
                        re_advertisers_password:false
                    };

                    $scope.hideError=function(event){
                        $(event.target).next().hide();
                    }
                    $scope.checkFormValue=function(event){
                        var $tar=$(event.target),val=$tar.val(),key=$tar.attr('name'),rule=rules[key];
                        var isRight;
                        if(angular.isString(rule)){
                            //console.log('aaa',$scope.formData,rule,val);
                            isRight=$scope.formData[rule]===val?true:false;
                        }
                        else{
                            //console.log('bbb',$scope.formData[key],val);
                            isRight=rule.test(val);
                        }
                        oIsRight[key]=isRight;
                        if(isRight){
                            $tar.next().hide();
                        }else{
                            $tar.next().show();
                        }
                        if(key==='advertisers_password'&&$scope.formData[key]!=$scope.formData['re_advertisers_password']){
                            $tar.closest('.form-group').next().find('.reg-error').show();
                            oIsRight['re_advertisers_password']=false;
                        }
                        else{
                            $tar.closest('.form-group').next().find('.reg-error').hide();
                            oIsRight['re_advertisers_password']=true;
                        }
                        //console.log('is right:',isRight);
                        //console.log('oIsRight is:',oIsRight);
                    }
                    $scope.register=function(event){
                        if(isRequesting){
                            return false;
                        }
                        var $inputs=$(event.target).closest('form').find('input');
                        var allowReg=true;
                        var count=0;
                        for(var i in oIsRight){

                            if(oIsRight[i]===false){
                                allowReg=false;
                                $inputs.eq(count).next().show();
                            }
                            count++;
                        }
                        if(allowReg===false){
                            return false;
                        }
                        isRequesting=true;
                        $http.post(CONFIG.REG_URL,{
                            params:$scope.formData
                        })
                            .then(function(e){
                                var data= e.data;
                                console.log('data is:',data);
                                if(angular.isUndefined(data.advertisers_name)){
                                    layer.alert(data.msg);
                                }
                                else{
                                    var user=baseService.username=$scope.formData.advertisers_name;
                                    //baseService.user=data;
                                    //baseService.init();
                                    $location.url(CONFIG.HOME_URL);
                                }
                                isRequesting=false;
                            })
                    }
                }
                //console.log('home controller');
            }]);
})(jQuery);