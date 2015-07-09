var fs = require('fs');


var CONFIG = {


    //JS_PATH:'javascripts/',
    //IMG_PATH:'images/',
    //TPL_PATH:'tpl/',

    //pagesize
    PAGESIZE: 7,
    STATIC_FOLDER:'public',

    //调试模式
    DEBUG_MODE:true,

    MAX_UPLOAD_FILE_SIZE: 2,//mb为单位
    UPLOAD_FILE_DIR: './public/uploads/',
    /*
     说明：
     MODULES就是应用中所有的模块,按照应用根目录下的routes文件夹下的文件组织，系统初始化时候读取这些文件生成对应的module配置

     文件命名:模板文件名称=模块名+'.tpl'(存放在public/tpl目录下)
     controller文件命名=模块名+'Controller.js'(存放于public/javascripts目录下)
     后端路由文件命名=模块名+'.js'(存放在routes目录下)

     MODULES中的配置带有下划线的字段(例如ad_plan_list)不要求使用对应的controller而是默认使用baseController,
     但是要求必须有后端的路由文件以用于ajax数据交互;
     不带下划线的模块则必须有自己的controller文件
     */
    MODULES: {//应用所有模块列表
        //HOME:'home',//主页
        //LOGIN:'login',//登录
        //REG:'reg',//注册
        //REPORT:'report',//报表
        //AD:'ad',//广告投放设置
        //LOGOUT:'logout'//登出
        //
        //,AD_PLAN_LIST:'ad_plan_list'
    },

    //NAV_NAME: {//菜单中文名称
    //    'HOME': '主页',//主页
    //    'LOGIN': '登录',//登录
    //    'REG': '注册',//注册
    //    'REPORT': '报表',//报表
    //    'AD_PLAN_MANAGE': '广告中心',//广告投放设置
    //    'LOGOUT': '登出'//登出
    //},
    //NAV_HREF: {
    //    'REPORT': '/advertisers_overview_report'
    //}
    //,

    DISABLED_MODULES: [//将这些模块的功能关闭了
        //'REPORT'
    ]
    //,

    //REDIRECT_URLS:{//模块路由重定向声明
    //    AD:'AD_PLAN_LIST'
    //},


    //AJAX_URLS:{//所有ajax请求路径配置
    //    //GET_USER:'/get_user',
    //    //GET_ALL_ADPROJECT:'/ad_plan_list/get_all_adproject'
    //}

    //,
    //
    //BASE_URL:{//
    //    GET_USER:'/get_user'
    //},
    //AD_URL_CONFIG:{
    //    GET_ALL_ADPROJECT:'/ad/get_all_adproject'
    //}
    //HEADER_TPL:'header',
    //FOOTER_TPL:'footer',

    //HOME_TPL:'home',
    //LOGIN_TPL:'login',
    //REG_TPL:'reg',
    //REPORT_TPL:'report',
    //LOGOUT_TPL:'',
    //AD_TPL:'ad',


    //TPL_POSTFIX:'.html',

    //USER_DATA_URL:'/user_data',
    //BASE_DATA_URL:'/base_data',

    //REG_URL:'/reg',
    //LOGIN_URL:'/login',
    //LOGOUT_URL:'/logout',
    //HOME_URL:'/home',
    //REPORT_URL:'/report',
    //AD_URL:'/ad',


    //BASE_DATA_URL:'/base_data'


};
//var arr=[];
for (var i in CONFIG.NAV_NAME) {
    if (CONFIG.DISABLED_MODULES.indexOf(i) === -1) {
        CONFIG.MODULES[i] = i.toLowerCase();
    }

}
var files = fs.readdirSync('./routes');
for (var j in files) {
    if (files[j].split('.').reverse()[0] === 'js') {
        var name = files[j].split('.js')[0].toUpperCase();
        //console.log('name is:',name);
        //console.log('CONFIG.DISABLED_MODULES',CONFIG.DISABLED_MODULES.indexOf(name))
        if (typeof(CONFIG.MODULES[name] === 'undefined') && CONFIG.DISABLED_MODULES.indexOf(name) === -1) {
            //console.log('name name name is is:',name)
            CONFIG.MODULES[name] = name.toLowerCase();
        }
    }

}
//console.log('show you the config:',CONFIG);
//var arr=[];
//
//for(var i in files){
//    var name=files[i].split('.js')[0];
//    console.log('name is:',name);
//    //for(var j in CONFIG.NAV_NAME){
//    //    //if(j===)
//    //}
//
//}

for (var i in CONFIG.MODULES) {
    //if(typeof(CONFIG.MODULES))
    if (typeof(CONFIG[i + '_URL']) === 'undefined') {
        CONFIG[i + '_URL'] = '/' + CONFIG.MODULES[i];
    }
}
module.exports = CONFIG;
