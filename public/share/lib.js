var db=require('./database.js');
var _=require('underscore');
//var lib=require('./lib.js');

module.exports={
    log:function(str1,str2){
        console.log(str1,str2);
        //if((!_.isString(str1))||(_.isString(str2))){
        //    return;
        //}
        var fs=require('fs');
        fs.readFile('./testlog.log','utf-8',function(err,data){
            if(err){
                console.log(err);return;
            }
            var str=data+'\n\n\n'+new Date().format()+'\n'+str1+':'+str2;
            fs.writeFile('./testlog.log',str);
        })
    },
    tpl:function(tpl,data) {

        var options = {
            left_split : "{",
            right_split : "}",
            tpl : tpl,
            data : data
        };
        if (options.data == null) {
            return options.tpl;
        } else {
            var reg = new RegExp(options.left_split + "(.+?)" + options.right_split, "gi");
            var strs = options.tpl.match(reg), tpl = options.tpl;
            for (var i = 0; i < strs.length; i++) {
                var str = strs[i];
                strs[i] = str.substring(options.left_split.length, str.length - (options.right_split.length));
                tpl = tpl.replace(str, str.indexOf(".") == -1 ? (options.data[strs[i]]) : (eval("options.data." + strs[i])));
            }
            return tpl;
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
        dtMonth = dtArray[3];
        dtDay= dtArray[5];
        dtYear = dtArray[1];

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
    getRealFormDataByMap:function(formData,map){
        //console.log('this is the formData------:',formData);
        //var addedItems=[];
        var result={};
        for(var i in map){
            //console.log('i and formdata[i] and map[i]',i,formData[i],map[i]);
            //console.log('map[i]',map[i]);
            //console.log('formData[i]',formData[i])
            result[map[i]]=formData[i];
            //addedItems.push(map[i]);
        }
        //for(var i in formData){
        //
        //    if(addedItems.indexOf(i)===-1){
        //        //console.log('addedItems is:',addedItems)
        //        //console.log('i is:',i);
        //        result[i]=formData[i];
        //    }
        //}
        //console.log('result------------is:',result);
        return result;
    },
    insert:function(options,req,res,cb){



        var options= _.extend({
            tableName:'null',//表名
            set:{},//需要插入的数据集合
            additionalRules:null,//二维数组，第一维每个项目包含两个子项目，第一个为function,如果return false了就会res.send第二个声明的message
            fields_map:{}//将前端传过来的字段映射到真实的数据库中字段,且只有该map中的value有的字段才能入库
        },options);

        var fields=[];
        for(var i in options.fields_map){
            fields.push(options.fields_map[i]);
        }

        //根据map映射设置真实字段的值
        options.set=this.getRealFormDataByMap(options.set,options.fields_map);
        //加入updatetime和createtime和advertisers_id
        options.set.createtime=options.set.createtime||(new Date().format());
        options.set.updatetime=options.set.updatetime||(new Date().format());
        options.set.advertisers_id=req.session.user.advertisers_id;
        //过滤有用字段
        options.set=this.filter(options.set,fields.concat(['createtime','updatetime','advertisers_id']));

        if((!_.isUndefined(req.session))&&(!_.isUndefined(req.session.user))&&(!_.isUndefined(req.session.user.advertisers_id))===false){
            res.send({
                status:'ERROR',
                msg:'你没有登录或者没有权限操作其它用户的数据，非法入侵，小心我找警察叔叔干你哦'
            })
            return false;
        }






        var allowQueryDb=true;
        if(_.isArray(options.additionalRules)){
            for(var i in options.additionalRules){
                var item=options.additionalRules[i];
                if((_.isArray(item))&&(item.length>=2)&&(_.isFunction(item[0]))&&(_.isString(item[1]))){
                    if(item[0](options.set)===false){
                        allowQueryDb=false;
                        res.send({
                            status:'ERROR',
                            msg:item[1]
                        })
                        break;
                    }
                }
                //console.log('item is:',item);
                //console.log('item 0 result:',item[0](options.set));

            }
        }

        if(allowQueryDb===false){
            return false;
        }

        db.query("insert into "+options.tableName+" set ?",options.set,function(err,result){
            if(_.isUndefined(cb)){
                if(err){
                    res.send({
                        status:'ERROR',
                        msg:'系统繁忙，请稍后再试'
                    })
                }
                else{
                    res.send({
                        status:'OK',
                        result:result
                    })
                }
            }else{
                cb(err,result);
            }

        })
    },
    update:function(options,req,res,cb){



        var options= _.extend({
            tableName:'null',//表名
            set:{},//需要插入的数据集合
            fields:null,
            where:{},
            additionalRules:null,//二维数组，第一维每个项目包含两个子项目，第一个为function,如果return false了就会res.send第二个声明的message
            fields_map:{}//将前端传过来的字段映射到真实的数据库中字段,且只有该map中的value有的字段才能入库
        },options);

        var fields;
        if(_.isArray(options.fields)){
            fields=options.fields;
        }else{
            fields=[];
            for(var i in options.fields_map){
                fields.push(options.fields_map[i]);
            }
        }





        //根据map映射设置真实字段的值
        options.set=this.getRealFormDataByMap(options.set,options.fields_map);
        //加入updatetime和advertisers_id
        options.set.updatetime=options.set.updatetime||(new Date().format());
        options.set.advertisers_id=req.session.user.advertisers_id;
        //过滤有用字段
        options.set=this.filter(options.set,fields.concat(['updatetime','advertisers_id']));

        if((!_.isUndefined(req.session))&&(!_.isUndefined(req.session.user))&&(!_.isUndefined(req.session.user.advertisers_id))===false){
            res.send({
                status:'ERROR',
                msg:'你没有登录或者没有权限操作其它用户的数据，非法入侵，小心我找警察叔叔干你哦'
            })
            return false;
        }



        var allowQueryDb=true;
        if(_.isArray(options.additionalRules)){
            for(var i in options.additionalRules){
                var item=options.additionalRules[i];
                if((_.isArray(item))&&(item.length>=2)&&(_.isFunction(item[0]))&&(_.isString(item[1]))){
                    if(item[0](options.set)===false){
                        allowQueryDb=false;
                        res.send({
                            status:'ERROR',
                            msg:item[1]
                        })
                        break;
                    }
                }
                //console.log('item is:',item);
                //console.log('item 0 result:',item[0](options.set));

            }
        }
        if(allowQueryDb===false){
            return false;
        }

        options.where.advertisers_id=options.set.advertisers_id;
        var where=[];
        for(var i in options.where){
            where.push(i+"='"+options.where[i]+"'");
        }
        where=where.join(' and ');

        var set='';
        for(var i in options.set){
            set+=i+"='"+options.set[i]+"',";
        }
        set=set.substring(0,set.length-1);
        var sql=this.tpl("update {tableName} set {set} where {where}",{
            tableName:options.tableName,
            set:set,
            where:where
        });
        console.log('options is:',options);
        this.log('sql is:',sql);
        db.query(sql,function(err,result){
            if(_.isUndefined(cb)){
                if(err){
                    res.send({
                        status:'ERROR',
                        msg:'系统繁忙，请稍后再试'
                    })
                }
                else{
                    res.send({
                        status:'OK',
                        result:result
                    })
                }
            }else{
                cb(err,result);
            }

        })
    },
    query:function(options,req,res,cb){




        var options= _.extend({
            tableName:'null',//表名
            select:'*',
            where:{},
            join:null,
            on:true,
            groupBy:''
        },options);


        if((!_.isUndefined(req.session))&&(!_.isUndefined(req.session.user))&&(!_.isUndefined(req.session.user.advertisers_id))===false){
            res.send({
                status:'ERROR',
                msg:'你没有登录或者没有权限操作其它用户的数据，非法入侵，小心我找警察叔叔干你哦'
            })
            return false;
        }
        var fieldName;
        var sql;


        var status_condition='';



        if(options.join!==null){

            var _tableNames=options.tableName.split(' ');
            var _tableName=_tableNames.length>1?_tableNames[_tableNames.length-1]:_tableNames[0];
            var _fieldName=_tableName[0]==='ad'?'check_status':'status';


            if(['ad','adcampaign','adproject'].indexOf(_tableName)!==-1){
                options.where[_tableName+'.advertisers_id']=req.session.user.advertisers_id;
                status_condition+=" and "+_tableName+'.'+_fieldName+"!='D'";
            }



            var join=options.join.split(' ');
            var join_tableName=join.length>1?join[join.length-1]:join[0];
            var join_fieleName=join[0]==='ad'?'check_status':'status';

            if(['ad','adcampaign','adproject'].indexOf(join_tableName)!==-1){
                options.where[join_tableName+'.advertisers_id']=req.session.user.advertisers_id;
                status_condition+=" and "+join_tableName+'.'+join_fieleName+"!='D'";
            }



        }else{


            fieldName=options.tableName==='ad'?'check_status':'status';

            if(['ad','adcampaign','adproject'].indexOf(options.tableName)!==-1){
                options.where.advertisers_id=req.session.user.advertisers_id;
                status_condition=' and '+fieldName+"!='D'";
            }
        }


        var where=[];
        for(var i in options.where){
            where.push(i+"='"+options.where[i]+"'");
        }
        where=where.join(' and ');
        options.where=where+status_condition;


        if(options.join===null){
            sql=this.tpl("select {select} from {tableName}"+(options.where===''?'':' where {where}')+(options.groupBy===''?'':' group by {groupBy}'),options);
        }
        else{
            console.log('options is:',options);
            console.log('options select is:',options.select)
            //sql="select "+options.select+" from "+options.tableName+" join "+options.join+" on "+options.on+" where "+options.where+status_condition+(options.groupBy===''?'':' group by '+options.groupBy);
            sql=this.tpl("select {select} from {tableName} join {join} on {on}"+(options.where===''?'':' where {where}')+(options.groupBy===''?'':' group by {groupBy}'),options);

        }
        this.log('sql-------------- is:',sql);

        db.query(sql,function(err,result){
            if(_.isUndefined(cb)){
                if(err){

                    res.send({
                        status:'ERROR',
                        msg:'系统繁忙，请稍后再试'
                    })
                }
                else{
                    res.send({
                        status:'OK',
                        result:result
                    })
                }
            }else{
                cb(err,result);
            }

        })
    }
}