/**
 * Created by chenjie on 2015/4/20.
 */

var db          = require('./mongo.js');
var _           = require('underscore');
var mongoskin   = require( 'mongoskin' );
var ObjectID    = mongoskin.ObjectID;
var CryptoJS    = require("crypto-js");

var redisCache = require('../dal/redis_cache');

function dbUtils(collection){
    this.collection = collection;
    db.bind(this.collection);
};

dbUtils.ObjectID = ObjectID

dbUtils.toId = function(id){
    if (_.isArray(id)){
        var arr = []
        _.each(id, function(o){
            arr.push(new ObjectID(o))
        })
        return arr
    } else {
        return new ObjectID(id)
    }
}

dbUtils.id2Str = function(id){
    if (_.isArray(id)){
        var arr = []
        _.each(id, function(o){
            arr.push(o.toString())
        })
        return arr
    } else {
        return id.toString()
    }
}

function obj2str(obj){
    for (var k in obj) {
        if (_.isString(obj[k])){
            continue
        } else if (_.isRegExp(obj[k])){
            obj[k] = obj[k].toString()
        } else {
            obj2str(obj[k])
        }
    }
}

function deepCopy(source) {
    var result={};
    for (var key in source) {
        if (_.isObject(source[key])){
            result[key] = deepCopy(source[key])
        } else{
            result[key] = source[key];
        }
    }
    return result;
}
exports.deepCopyObj=deepCopy;

dbUtils.db = db

dbUtils.prototype = {
    //add cache in function
    insert: function (docs, callback) {
        db[this.collection].insert(docs, callback)
        redisCache.delMulti(this.collection);
    },
    save: function(doc, callback) {
        db[this.collection].save(doc, callback)
        redisCache.delMulti(this.collection);
    },
    findOne: function(spec, options, callback) {
        if (spec._id && !_id instanceof ObjectID){
            spec._id = new ObjectID(spec._id)
        }
        var collection = this.collection;
        if (_.isFunction(options)){
            callback = options
            options = {}
        }

        var specs = deepCopy(spec)
        obj2str(specs)
        var redisKey = collection + "_" + JSON.stringify(specs).split(' ').join('') + JSON.stringify(options).split(' ').join('');
        //redisKey=CryptoJS.MD5(redisKey).toString();
        redisCache.get(redisKey, function(err, o){
            if (err){
                db[collection].findOne(spec, function(err, db_result){

                    var cache = ''
                    if (!err){
                        cache = JSON.stringify(db_result)
                    }
                    callback(err, db_result)

                    if (cache){
                        redisCache.set(redisKey, cache);
                    }
                })
            } else {
                callback(null, o);
            }
        });
    },
    findById: function(_id, options, callback) {
        if (!_id instanceof ObjectID){
            _id = new ObjectID(_id)
        }
        var collection = this.collection;
        if (_.isFunction(options)){
            callback = options
            options = {}
        }
        var redisKey = _id.toString();
        //var redisKey = _id + JSON.stringify(options).split(' ').join('');
        redisCache.get(redisKey, function(err, o){
            if (err){
                db[collection].findById(_id, function(err, db_result){

                    var cache = ''
                    if (!err){
                        cache = JSON.stringify(db_result)
                    }
                    callback(err, db_result)

                    if (cache){
                        redisCache.set(redisKey, cache);
                    }
                })
            } else {
                callback(null, o);
            }
        });
    },
    find: function(spec, field, options, callback) {
        var collection = this.collection;

        if (_.isFunction(field)){
            callback = field
            field = null
            options = null
        } else if (_.isFunction(options)){
            callback = options
            options = null
        }

        var specs = deepCopy(spec)
        obj2str(specs)
        var redisKey = JSON.stringify(specs).split(' ').join('') + JSON.stringify(field).split(' ').join('') + JSON.stringify(options).split(' ').join('');
        //redisKey=CryptoJS.MD5(redisKey).toString();
        redisCache.getMulti(collection, redisKey, function(err, o){
            if (err){
                db[collection].findItems(spec, field, options, function(err, db_result){
                    var cache = ''
                    if (!err){
                        cache = JSON.stringify(db_result)
                    }
                    callback(err, db_result)

                    if (cache){
                        redisCache.setMulti(collection, redisKey, cache);
                    }
                })
            } else {
                callback(null, o);
            }
        });
    },
    count: function(spec, callback) {
        var collection = this.collection;

        var redisKey = JSON.stringify(spec).split(' ').join('') + "_MUTIL" + "_COUNT";
        //redisKey=CryptoJS.MD5(redisKey).toString();
        redisCache.getMulti(collection, redisKey, function(err, result){
            if (err){
                db[collection].count(spec, function(err, db_result){
                    callback(err, db_result);
                    redisCache.setMulti(collection, redisKey, JSON.stringify({count: db_result}));
                })
            } else if (result && result.count >= 0){
                callback(null, result.count)
            } else {
                callback(null, 0)
            }
        })

    },
    update: function(spec, update_spec, options, callback) {
        if (_.isFunction(options)){
            callback = options
            options = null
        }

        db[this.collection].update(spec, update_spec, options, callback);

        var redisKey = this.collection + "*";
        redisCache.delMulti(redisKey);
    },
    updateById: function(_id, update_spec, options, callback) {
        if (!_id instanceof ObjectID){
            _id = new ObjectID(_id)
        }
        if (_.isFunction(options)){
            callback = options
            options = null
        }
        db[this.collection].updateById(_id, update_spec, options, callback)

        redisCache.del(_id.toString())
        redisCache.delMulti(this.collection);
    },
    findAndModify: function(spec, sort, update_spec, options, callback) {
        if (_.isFunction(options)){
            callback = options
            options = null
        }
        db[this.collection].findAndModify(spec, sort, update_spec, options, callback)

        var redisKey = this.collection + "*";
        redisCache.delMulti(redisKey);
    },
    removeById:function(_id, callback){
        if (!_id instanceof ObjectID){
            _id = new ObjectID(_id)
        }
        var collectionName = this.collection
        db[collectionName].findById(_id,function(err, db_result){
            if(err) {
                return callback(err);
            }
            if(db_result){
                db_result.collectionName = collectionName
                db.collection('rubbish').save(db_result,function(err, result){
                    if(err){
                        return callback(err);
                    }
                    db[collectionName].removeById(_id,function(err,doc){
                        callback(err, doc);
                        redisCache.delMulti(collectionName);
                    })
                });
            }else{
                return callback("not find by id "+_id);
            }

        });


        //

    }
}

module.exports = dbUtils