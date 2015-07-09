


(function($){
    'use strict';
    angular
        .module('base', [
            'baseModule.templates'
//                    'ui.bootstrap'
        ])

        /*
        demo:
         <pagination res-total-num-key="total" res-data-key="data" page-handler-num="10" page-size="10" url="/test/fetchData?page={currentPage}&pageSize={pageSize}" datamodel="obj.data" transform-res-data-fn="transformResData">

         </pagination>
         */
        .directive('pagination',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                templateUrl:'/javascripts/baseModule/baseModule.template/directives.tpl/pagination.html',
                transclude:true,
                scope:{
                    resDataKey:'@',
                    pageHandlerNum:'@',
                    url:'@',
                    datamodel:'@',
                    transformResDataFn:'@',
                    initPage:'@',
                    resTotalNumKey:'@',
                    pageSize:'@'
                },
                controller:['$scope','$http','$element',function($scope,$http,$element){


                    var bs=$scope.bs=baseService;

                    var options=$scope.options={};
                    var isNull=function(v){
                        //var v=$scope[key];
                        return typeof(v)==='undefined'|| v.trim()===''||v===null;
                    }
                    if(isNull($scope['url'])){
                        alert('url属性是必须的');
                        return false;
                    }

                    var defaultOptions={
                        resDataKey:'',
                        pageHandlerNum:10,
                        url:'',
                        datamodel:null,
                        transformResDataFn:null,
                        initPage:'1',
                        resTotalNumKey:'',
                        pageSize:10
                    }

                    for(var k in defaultOptions){
                        var v=defaultOptions[k];
                        if(isNull($scope[k])){
                            options[k]=v;
                        }else{
                            options[k]=$scope[k];
                        }
                    }

                    $scope.currentPage=parseInt(options.initPage);
                    console.log('options is--------:',options);
                    var $pScope=bs.getTargetScopeByModel($scope,options.datamodel)


                    console.log('------------$scope.currentPage:',$scope.currentPage)
                    $scope.prev=function(){
                        $scope.currentPage-=1;
                        $scope.fetchData();
                    }
                    $scope.next=function(){
                        $scope.currentPage+=1;
                        $scope.fetchData();
                    }
                    var allowFetch=true;
                    $scope.fetchData=function(page){
                        if(!allowFetch){
                            return false;
                        }
                        $rootScope.$emit('paginationDatafetching',$scope,options,$element)
                        allowFetch=false;
                        var currentPage=page||$scope.currentPage;
                        $scope.currentPage=currentPage;
                        var url=bs.tpl({
                            left_split : "{",
                            right_split : "}",
                            tpl : options.url,
                            data : {
                                currentPage:currentPage,
                                pageSize:$scope.pageSize
                            }
                        });
                        $http.get(url)
                            .then(function(e){
                                var data= e.data;
                                console.log("sdfsdf-----------data:",data);
                                if(!isNull(options.resDataKey)){
                                    var listData=bs.getDataByModel(data,options.resDataKey);
                                    if(listData!==null){
                                        allowFetch=true;
                                        if(isNull($scope['transformResDataFn'])){
                                            bs.setDataByModel($pScope,options.datamodel,listData);
                                        }
                                        else{
                                            bs.setDataByModel($pScope,options.datamodel,$scope['transformResDataFn'](listData));
                                        }
                                        var totalCount=parseInt(bs.getDataByModel(data,options.resTotalNumKey),10);
                                        $scope.totalPage=Math.ceil(totalCount/parseInt(options.pageSize,10))
                                        calculatePageRange();
                                            $rootScope.$emit('paginationDataLoaded', e.data,$scope,options,$element);
                                    }

                                    //console.log('sfdsfsd')
                                }
                            })
                    }
                    //$('body').click(function(){
                    //    console.log($scope);
                    //})
                    function calculatePageRange(){


                        var start=$scope.currentPage-Math.floor(parseInt(options.pageHandlerNum,10)/2),
                            end=$scope.currentPage+Math.ceil(parseInt(options.pageHandlerNum,10)/2)-1;
                        if(start<1){
                            start=1;
                        }
                        console.log('总页数：',$scope.totalPage)
                        if(end>$scope.totalPage){
                            end=$scope.totalPage;
                        }
                        if(end<parseInt(options.pageHandlerNum,10)){
                            end=parseInt(options.pageHandlerNum,10);
                        }
                        var pageConfig=[];
                        for(var i=start;i<=end;i++){
                            pageConfig[i]=i;
                        }
                        $scope.pageConfig=pageConfig;
                        console.log('start and end is:',start,end);

                    }
                    $scope.fetchData();


                }],
                //templateUrl:'/javascripts/baseModule/baseModule.template/directives.tpl/pagination.html',
                //link:function($scope,$ele,attrs){
                //    $ele.find('input[type=number]').get(0).value=attrs.number;
                //    console.log('number size:',$ele.find('input[type=number]').size());
                //},
                replace:true
            }
        }])
        /*
        demo:
         <select-all-checkbox item-flag="isSelected" checkboxes="ListOfItems" is-all-selected="AllSelectedItems" is-none-selected="NoSelectedItems"></select-all-checkbox>select all
         <div ng-repeat="item in ListOfItems">
         <input type="checkbox" ng-model="item.isSelected" />{{item.desc}}

         <!--$scope.ListOfItems = [{-->
         <!--isSelected: true,-->
         <!--desc: "Donkey"-->
         <!--}, {-->
         <!--isSelected: false,-->
         <!--desc: "Horse"-->
         <!--}];-->


         </div>
         */
        .directive('selectAllCheckbox', function () {
            return {
                replace: true,
                restrict: 'E',
                scope: {
                    checkboxes: '=',
                    isAllSelected: '=isAllSelected',
                    isNoneSelected: '=isNoneSelected',
                    itemFlag:'@'//表示列表项是否处于选中状态的flag
                },
                template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
                controller: function ($scope, $element) {

                    $scope.masterChange = function () {
                        if ($scope.master) {
                            angular.forEach($scope.checkboxes, function (v, index) {
                                v[$scope.itemFlag] = true;
                            });
                        } else {
                            angular.forEach($scope.checkboxes, function (v, index) {
                                v[$scope.itemFlag] = false;
                            });
                        }
                    };

                    $scope.$watch('checkboxes', function () {
                        var allSet = true,
                            isNoneSelected = true;
                        angular.forEach($scope.checkboxes, function (v, index) {
                            if (v[$scope.itemFlag]) {
                                isNoneSelected = false;
                            } else {
                                allSet = false;
                            }
                        });

                        if ($scope.isAllSelected !== undefined) {
                            $scope.isAllSelected = allSet;
                        }
                        if ($scope.isNoneSelected !== undefined) {
                            $scope.isNoneSelected = isNoneSelected;
                        }

                        $element.prop('indeterminate', false);
                        if (allSet) {
                            $scope.master = true;
                        } else if (isNoneSelected) {
                            $scope.master = false;
                        } else {
                            $scope.master = false;
                            $element.prop('indeterminate', true);
                        }

                    }, true);
                }
            };
        })
        .directive('datePicker',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){

                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><input onfocus="WdatePicker({dateFmt:'+'\''+attrs.format+'\''+'})" ng-focus="{{ngfocus}}" ng-model="{{ngmodel}}" type="text" class="form-control"> </li>',
                        data:attrs
                    });
                    console.log('tpl is:',tpl);
                    return tpl;
                },
                link:function($scope,$ele,attrs){
                    $ele.find(':text').blur(function(){
                        baseService.setDataByModel($scope,attrs.ngmodel,$(this).val());
                        $scope.$apply();
                    })
                },
                replace:true
            }
        }])
        .directive('radioGroups',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    console.log('attrs is:',attrs);
                    var labels=attrs.labels.split(','),values=attrs.values.split(',');
                    var str='';
                    for(var i in labels){
                        str+='<span><input type="radio" value="'+values[i]+'" ng-model="'+attrs.ngmodel+'"></span><label>'+labels[i]+'</label>';
                    }
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><div>'+str+'</div> </li>',
                        data:attrs
                    });
                    return tpl;
                },
                replace:true
            }
        }])
        .directive('number',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    //console.log('attrs is:',attrs);
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><input value="{{value}}" ng-model="{{ngmodel}}" type="number" class="form-control"> </li>',
                        data:attrs
                    });

                    return tpl;
                },
                //link:function($scope,$ele,attrs){
                //    $ele.find('input[type=number]').get(0).value=attrs.number;
                //    console.log('number size:',$ele.find('input[type=number]').size());
                //},
                replace:true
            }
        }])
        .directive('debuger',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:'<div><pre style="display:block;position:fixed;left:0;top:0;white-space:normal;max-height:400px;overflow:scroll;"></pre><div></div></div>',
                replace:true,
                scope:{
                    ngobj:'@'
                },
                controller:['$scope','$element',function($scope,$element){


                    var $p=baseService.getTargetScopeByModel($scope,$scope.ngobj);
                    $element
                        .on('dblclick',function(){
                            console.log($p[$scope.ngobj]);
                        })
                    var refresh=function(){
                        $element.find('pre').first()
                            .html(JSON.stringify($p[$scope.ngobj]));
                        setTimeout(function(){
                            $element.find('div').last().css({
                                marginTop:$element.find('pre').first().outerHeight()
                            })
                        })
                    };
                    refresh();
                    $p.$watch(function(){
                        return $p[$scope.ngobj];
                    },function(nv){

                        console.log(nv);
                        refresh();
                    },true)

                }]
            }
        }])
        .directive('texter',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                   //console.log('attrs is:',attrs);
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><input ng-focus="{{ngfocus}}" ng-model="{{ngmodel}}" type="text" class="form-control"> </li>',
                        data:attrs
                    });
                    return tpl;
                },
                replace:true
                //,
                //link:function($scope,$ele,attrs){
                //    if(typeof(attrs.disabled!=='undefined')){
                //        console.log('textarea will be disabled')
                //        $ele.find('textarea').attr('disabled','disabled');
                //    }
                //    //$ele.find('textarea').get(0).value=attrs.number;
                //    //console.log('number size:',$ele.find('input[type=number]').size());
                //},
            }
        }])
        .directive('textareaer',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><textarea '+(typeof(attrs.disabled)==='undefined'?'':'disabled')+' ng-model="{{ngmodel}}" type="text" class="form-control"></textarea> </li>',
                        data:attrs
                    });
                    return tpl;
                },
                replace:true
            }
        }])
        .directive('upload',['$rootScope','$templateCache',function($rootScope,$templateCache){


            return {
                restrict:'EA',
                template:$templateCache.get('directives.tpl/upload.html'),
                scope:{
                    multi:'@',
                    url:'@',
                    type:'@',
                    ext:'@',
                    maxsize:'@',
                    width:'@',
                    height:'@',
                    btntext:'@',
                    key:'@',
                    srcmodel:'@',
                    srckey:'@',
                    auto:'@',
                    responseDataReader:'@'
                },
                transclude:true,
                replace:true,
                controller:['$scope','baseService','$rootScope','$element',function($scope,baseService,$rootScop,$element){
                    var bs=$scope.bs=baseService;

                    var $file=$element.find(':file').first();
                    if(typeof($rootScope.uploaderIndex)==='undefined'){
                        $rootScope.uploaderIndex=0;
                    }
                    $rootScope.uploaderIndex=$rootScope.uploaderIndex+1;
                    var uploaderIndex=$scope.uploaderIndex=$rootScope.uploaderIndex;//当前directive的实例的索引

                    var options={};
                    var isNull=function(v){
                        //var v=$scope[key];
                        return typeof(v)==='undefined'|| v.trim()===''||v===null;
                    }
                    if(isNull($scope['url'])){
                        alert('url属性是必须的');
                        return false;
                    }
                    var defaultOptions={
                        multi:'1',
                        ext:'*',
                        maxsize:'1gb',
                        type:'*',
                        width:'*',
                        height:'*',
                        key:'file',
                        srcmodel:'',
                        srckey:'',
                        auto:'0',
                        responseDataReader:''
                    }
                    for(var k in defaultOptions){
                        var v=defaultOptions[k];
                        if(isNull($scope[k])){
                            options[k]=v;
                        }else{
                            options[k]=$scope[k];
                        }
                    }
                    $scope.multi='1';
                    $scope.options=options;
                    console.log('options is:',options);

                    console.log('scopeeeeeeee is:',$scope);
                    //console.log('parent scope',$scope.$parent);
                    //$scope.$parent.CONFIG.UNPRIZE_PIC='1';

                    var isUploadImg=$scope.isUploadImg=['img','image'].indexOf(options.type.toLowerCase())!==-1;
                    var isUploadExcel=$scope.type.toLowerCase()==='excel';

                    function initUploaderStatus(){
                        $scope.percent=0;
                        $scope.isUploading=false;
                        $scope.imgSrcs=[];
                        $scope.uploadedFileNames=[];
                        $scope.tmpImgSrcs=[];//待上传的图片的src
                    }
                    initUploaderStatus();
                    $scope.file=$file.get(0);

                    //初始化文件域的多选状态
                    var init=function(){
                        var nv=options.multi;
                        console.log('nv is:',nv);

                        if(isUploadImg){
                            $file.attr('accept','image/*');
                        }
                        if(options.multi==='1'){
                            console.log('$file is:',$file);
                            $file.attr('multiple','multiple');
                        }else{
                            $file.removeAttr('multiple');
                        }
                    }



                    init();
                    $scope.multiY=function(e,index){
                        //var $file=$(e.target).closest('.dbx-uploader').find(':file').first();
                        $file.attr('multiple','multiple');
                        if(index===uploaderIndex){
                            $scope.multi='1';
                        }

                    }
                    $scope.multiN=function(e,index){
                        //var $file=$(e.target).closest('.dbx-uploader').find(':file').first();
                        $file.removeAttr('multiple');
                        if(index===uploaderIndex){
                            $scope.multi='0';
                        }

                    }
                    $file.on('change',function(){
                        var files=$file.get(0).files,len=files.length;
                        if(len===0){
                            return false;
                        }
                        console.log('files is:',files);
                        //检查扩展名
                        if(options.ext!=='*'){
                            var exts=options.ext.split(',');
                            for(var i=0;i<len;i++){
                                var file=files[i];
                                var ext=file.name.split('.').reverse()[0];
                                if(exts.indexOf(ext)===-1){
                                    var str='所选择的文件中包含扩展名非法的文件，文件扩展名必须为'+$scope.ext;
                                    alert(str);
                                    $rootScope.$emit('selectedFileExtInvalid',str,$scope,options,$element);
                                    $file.val('');
                                    files.length=0;

                                    return false;
                                }
                            }
                        }

                        //检查大小是否合法
                        var tmpMaxSize=options.maxsize;
                        tmpMaxSize=tmpMaxSize.toLowerCase();
                        var maxsize=parseInt(tmpMaxSize,10);
                        var map={
                            gb:1024*1024*1024,
                            mb:1024*1024,
                            kb:1024,
                            b:1
                        };
                        for(var i in map){
                            if(tmpMaxSize.indexOf(i)!==-1){
                                maxsize=maxsize*(map[i]);
                                break;
                            }
                        }
                        for(var i=0;i<len;i++){
                            var file=files[i];
                            if(file.size>maxsize){
                                var str='所选择的文件中包含大小超过最大值的文件，文件大小上限为'+tmpMaxSize;
                                console.warn(str);
                                $rootScope.$emit('selectedFileSizeInvalid',str,$scope,options,$element);
                                $file.val('');
                                files.length=0;

                                return false;
                            }
                        }

                        if(options.multi!=='1'){
                            initUploaderStatus();
                            $scope.$apply();
                        }
                        //读取图片文件
                        if(isUploadImg){
                            if(options.auto==='1'){
                                $scope.beginUpload();
                                return false;
                            }


                            var renderIndex=0;
                            $scope.tmpImgSrcs=[];
                            var allowRead=true;
                            $.each(files,function(k,file){

                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload=function(e){
                                    var result=this.result;
                                    $('<img>')
                                        .attr({
                                            src:result
                                        }).load(function(){
                                            if(!allowRead){
                                                return false;
                                            }
                                            var w=this.width,h=this.height;

                                            console.log('w and h:',w,h)

                                            //检查图片的宽高
                                            var errmsg='',width=options.width,height=options.height;
                                            console.log('width and height',width,height)
                                            if(width!=='*'&&parseInt(width,10)!==w){
                                                errmsg+='选择的图片中包含宽度不合法的图片，像素必须为'+width;
                                            }
                                            if(height!=='*'&&parseInt(height,10)!==h){
                                                errmsg+='\n选择的图片中包含长度不合法的图片，像素必须为'+width;
                                            }
                                            console.log('errmsg:',errmsg,errmsg==='');
                                            if(errmsg===''){
                                                renderIndex++;
                                                $scope.tmpImgSrcs.push(result);
                                                $scope.$apply();
                                            }else{
                                                allowRead=false;
                                                $file.val('');
                                                files.length=0;
                                                $rootScope.$emit('imgSizeInvalid',errmsg,$scope,options,$element);
                                                $scope.$apply();
                                            }


                                        })
                                }
                            })
                        }else{
                            $scope.$apply();
                            if(options.auto==='1'){
                                $scope.beginUpload();
                            }

                        }

                    });





                    $scope.chooseFiles=function(e){
                        $file.click();
                        //$(e.target).closest('.dbx-uploader').find(':file').first().click();
                    }
                    $scope.beginUpload=function(e){
                        if($scope.isUploading===true){
                            return false;
                        }
                        //var $file=$(e.target).closest('.dbx-uploader').find(':file').first(),files=$file.get(0).files;
                        var files=$file.get(0).files;

                        if(files.length===0){
                            return false;
                        }
                        var formData = new FormData();
                        var len=files.length;
                        if(len===1){
                            console.log('key is:',options.key);
                            formData.append(options.key,files[0]);
                        }else if(len>1){
                            for(var i in files){
                                formData.append('file'+(i+1),files[i]);
                            }
                        }
                        $scope.isUploading=true;

                        var xhr = new XMLHttpRequest();


                        $rootScope.$emit('uploadstart',$scope,options,$element);
                        xhr.open('post', $scope.url, true);

                        xhr.upload.onprogress = function(e) {
                            if (e.lengthComputable) {
                                var percentage = parseInt((e.loaded / e.total) * 100,10);
                                $scope.percent=percentage;
                                $rootScope.$emit('uploading',$scope,options,$element)
                                $scope.$apply();
                            }
                        };

                        xhr.onerror = function(e) {
                            var str='An error occurred while submitting the form. Maybe your file is too big';
                            console.warn(str);
                            $rootScope.$emit('uploadError',$scope,options,$element);
                        };

                        var ngModelArr=options.srcmodel.split('.'),arr0=ngModelArr.length>0?(ngModelArr[0]):null;
                        xhr.onload = function(){
                            for(var i in $scope.tmpImgSrcs){
                                $scope.imgSrcs.push($scope.tmpImgSrcs[i]);

                            }
                            for(var i= 0,len=$file.get(0).files.length;i<len;i++){
                                var item=$file.get(0).files[i];
                                $scope.uploadedFileNames.push(item.name);
                            }
                            $scope.tmpImgSrcs=[];
                            $file.val('');

                            $scope.$apply();
                            var res=JSON.parse(this.responseText);
                            console.log('res is:',res);


                            if(arr0!==null){
                                var $pScope=bs.getTargetScopeByModel($scope,options.srcmodel);
                                if(isUploadImg){



                                    var resSrc=bs.getDataByModel(res,options.srckey);
                                    console.log('res src is:',resSrc);
                                    if(resSrc!==null){
                                        if((options.multi==='0')&&($pScope!==null)){


                                            bs.setDataByModel($pScope,options.srcmodel,resSrc);
                                        }
                                    }
                                }
                                else if(isUploadExcel){
                                    if(options.responseDataReader!==''){
                                        var excelReader=bs.getDataByModel($pScope,options.responseDataReader);
                                        if($pScope!==null){
                                            bs.setDataByModel($pScope,options.srcmodel,excelReader(res));
                                        }
                                        //console.log('excelReader is:',excelReader);
                                    }

                                }
                            }

                            $rootScope.$emit('uploadSuccess',res,$scope,options,$element);

                            setTimeout(function(){
                                $scope.isUploading=false;
                                $scope.percent=0;
                                $scope.$apply();
                            },1000);
                        }
                        console.log('file upload form data is:',formData);
                        xhr.send(formData);
                    }

                }]
            }
        }])
        .service('baseService',['$http','$rootScope','$q',function($http,$rootScope,$q){

            var o={

                multiHttp:function(aRequests,cb){
                    var _this=this;
                    var dataArr=[],len=aRequests.length,index=0;
                    $.each(aRequests,function(k,v){
                        $http.get(v)
                            .success(function(data){
                                console.log('v and data:',v,data);
                                dataArr[k]=data;
                                index++;
                                if(index===len){
                                    cb.apply(_this,dataArr);
                                }
                            })
                    })
                },
                log:function(){
                    console.log(arguments);
                },
                tpl : function(options) {
                    options = $.extend({
                        left_split : "{{",
                        right_split : "}}",
                        tpl : "",
                        data : null
                    }, options);
                    if (options.data == null) {
                        return options.tpl;
                    } else {
                        var reg = new RegExp(options.left_split + "(.+?)" + options.right_split, "gi");
                        var strs = options.tpl.match(reg), tpl = options.tpl;
                        for (var i = 0; i < strs.length; i++) {
                            var str = strs[i];
                            strs[i] = str.substring(options.left_split.length, str.length - (options.right_split.length));
                            tpl = tpl.replace(str, str.indexOf(".") == -1 ? (options.data[strs[i]]) : (this.getDataByModel(options.data,strs[i])));
                        }
                        return tpl;
                    }
                },
                getFormDataByMap:function(formData,map){
                    var res={};
                    for(var i in map){

                        res[map[i]]=formData[i];
                    }
                    return res;
                },
                reverseMap:function(map){
                  var res={};
                    for(var i in map){
                        res[map[i]]=i;
                    }
                    return res;
                },
                locker:function($this){
                    return {
                        isLocked:_.isUndefined($this.data('isLocked'))?false:($this.data('isLocked')),
                        lock:function(){
                            $this.data('isLocked',true);
                            $rootScope.$emit('lockButton',$this);
                        },
                        unlock:function(){
                            $this.data('isLocked',false);
                            $rootScope.$emit('unlockButton',$this);
                        }
                    }
                },
                toggleArrayElement:function(item,arr){
                    var index=arr.indexOf(item);
                    if(index===-1){
                        arr.push(item);
                    }else{
                        arr.splice(index,1);
                    }
                },
                //检测数组重复元素
                isRepeat:function(arr){

                    var hash = {};

                    for(var i in arr) {

                        if(hash[arr[i]])

                            return true;

                        hash[arr[i]] = true;

                    }

                    return false;

                },
                //冒泡排序
                bubbleSort:function(arr){
                    for(var i=0;i<arr.length;i++){
                        //内层循环，找到第i大的元素，并将其和第i个元素交换
                        for(var j=i;j<arr.length;j++){
                            if(arr[i]>arr[j]){
                                //交换两个元素的位置
                                var temp=arr[i];
                                arr[i]=arr[j];
                                arr[j]=temp;
                            }
                        }
                    }
                },
                parseUrl: function (href) {
                    var url = href || location.href;
                    var a = document.createElement('a');
                    a.href = url;
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                },
                //以下为增强数据模型的获取，修改和找寻目标scope的方法
                getDataByModel:function($scope,modelStr){
                    var arr=modelStr.split('.'),len=arr.length,result=$scope;
                    if(len===1){
                        return $scope[arr[0]];
                    }else if(len>1){
                        var isError=false;
                        for(var i in arr){
                            if(typeof(result[arr[i]])==='undefined'){
                                isError=true;
                                break;
                            }else{
                                result=result[arr[i]];
                            }
                        }
                        if(isError){
                            return null;
                        }else{
                            return result;
                        }
                    }else if(len===0){
                        return null;
                    }
                },
                setDataByModel:function($scope,modelStr,val){
                    var arr=modelStr.split('.'),len=arr.length;
                    if(len===1){
                        $scope[arr[0]]=val;
                    }else if(len>1){
                        var ns=arr,obj=$scope;
                        for(var i=0;i<len-1;i++){
                            var key=ns[i];
                            obj=obj[key];
                        }
                        obj[ns[len-1]]=val;
                    }
                },
                getTargetScopeByModel:function($currentScope,modelStr){
                    var arr=modelStr.split('.'),len=arr.length;
                    if(len===0){
                        return $currentScope;
                    }else{
                        var key=arr[0],$pScope=$currentScope;
                        var loop=function(){
                            $pScope=$pScope.$parent;
                            if($pScope===null){
                                $pScope=null;
                            }else{
                                if(typeof($pScope[key])==='undefined'){
                                    loop();
                                }
                            }

                        }
                        loop();
                        return $pScope;
                    }
                },
                isDate:function(txtDate)
                {
                    var currVal = txtDate;
                    if(currVal == '')
                        return false;

                    var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
                    var dtArray = currVal.match(rxDatePattern); // is format OK?

                    if (dtArray == null)
                        return false;

                    //Checks for mm/dd/yyyy format.
                    var dtMonth = dtArray[3];
                    var dtDay= dtArray[5];
                    var dtYear = dtArray[1];

                    if (dtMonth < 1 || dtMonth > 12)
                        return false;
                    else if (dtDay < 1 || dtDay> 31)
                        return false;
                    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
                        return false;
                    else if (dtMonth == 2)
                    {
                        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                        if (dtDay> 29 || (dtDay ==29 && !isleap))
                            return false;
                    }
                    return true;
                },
                filter:function(oFormData,aFilters){
                    var result={};
                    for(var i in oFormData){
                        if(aFilters.indexOf(i)!==-1){
                            result[i]=oFormData[i];
                        }
                    }
                    return result;
                },
                isDateTime:function(str,format){
                    var reg=null;
                    if(format==='y-m-d h:i:s'){
                        reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
                    }else if(format==='y/m/d h:i:s'){
                        reg = /^(\d+)\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
                    }else{
                        return true;
                    }
                    if(reg!==null){

                    }
                    //var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
                    var r = str.match(reg);
                    if(r==null)return false;
                    r[2]=r[2]-1;
                    var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);
                    if(d.getFullYear()!=r[1])return false;
                    if(d.getMonth()!=r[2])return false;
                    if(d.getDate()!=r[3])return false;
                    if(d.getHours()!=r[4])return false;
                    if(d.getMinutes()!=r[5])return false;
                    if(d.getSeconds()!=r[6])return false;
                    return true;
                },
                getMapByObjIndex:function(eq,obj){
                    var index=0,result={};
                    for(var i in obj){
                        if(index==eq){
                            result.k=i;
                            result.v=obj[i];
                            break;
                        }
                        index++;
                    }
                    return result;
                }
        };
            return o;
        }])

























































































        .directive('colorPicker',['$rootScope','$templateCache','baseService',function($rootScope,$templateCache,baseService){
            //console.log('$templateCache is:',$templateCache.get('directives.enhance.tpl/beautiful-radio-group.html'));
            return {
                restrict:'EA',
                template:$templateCache.get('directives.enhance.tpl/color-picker.html'),
                replace:true,
                scope:{

                },
                controller:['$scope',function($scope){

                    $scope.height='0';
                    $scope.toggleHeight=function(e){
                        var $tar=$(e.target);

                        if($scope.height==='0'){
                            $scope.height='auto';
                            $tar.next().next().next().css({
                                borderBottomWidth:'1px'
                            })
                        }else{
                            $scope.height='0';
                            $tar.next().next().next().css({
                                borderBottomWidth:'0px'
                            })
                        }
                    }
                    $scope.setColor=function(e){
                        var $tar=$(e.target),$b=$tar.parent().prev();
                        $b.css({
                            background:$tar.attr('v')
                        })
                        $b.attr({
                            v:$tar.attr('v'),
                            name:$tar.attr('name')
                        })
                        $scope.height='0';
                        $tar.prev().prev().css({
                            borderBottomWidth:'0px'
                        })
                        //$scope.$apply();
                    }
                }]
            }
        }])
        .directive('beautifulRadioGroup',['$rootScope','$templateCache','baseService',function($rootScope,$templateCache,baseService){
            return {
                restrict:'EA',
                template:$templateCache.get('directives.enhance.tpl/beautiful-radio-group.html'),
                scope:{
                    msg:'@',
                    labels:'@',
                    values:'@',
                    ngmodel:'@'
                },
                controller:['$scope','baseService','$rootScope','$element',function($scope,baseService,$rootScop,$element){
                    var bs=$scope.bs=baseService;
                    $scope.valueArr=$scope.values.split(',');
                    $scope.labelArr=$scope.labels.split(',');
                    var $pScope=bs.getTargetScopeByModel($scope,$scope.ngmodel);
                    $scope.currentValue=bs.getDataByModel($pScope,$scope.ngmodel);
                    $scope.correctValueIndex=$scope.valueArr.indexOf($scope.currentValue);
                    $scope.change=function(index){
                        //var $tar=$(e.target);
                        bs.setDataByModel($pScope,$scope.ngmodel,$scope.valueArr[index]);

                    }


                    $pScope.$watch(function(){
                        return bs.getDataByModel($pScope,$scope.ngmodel);
                    },function(nv){
                        console.log('from radio group  directive,nv is:',nv);
                        $scope.currentValue=nv;
                        $scope.correctValueIndex=$scope.valueArr.indexOf(nv);
                        console.log('$scope.correctValueIndex',$scope.correctValueIndex);
                    })

                    console.log('current value is:',$scope.currentValue);
                }],
                replace:true
            }
        }])









})(jQuery);