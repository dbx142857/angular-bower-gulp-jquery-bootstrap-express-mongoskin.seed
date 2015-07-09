/**
 * Created by chenjie on 2015/1/5.
 */

var _ = require('underscore')
var NODE_ENV = require('./env-config.js')
NODE_ENV = NODE_ENV.toString().toUpperCase()

var DEV_CONFIG = {
    "NODE_ENV": "dev",
    "domain":"http://ads-mall.dev.tvm.cn",
    "userHost":"http://mb.dev.tvm.cn",
    "yaoHost": "http://t9.dev.tvm.cn",
    "mongodb":{
        "links":"mongodb://mall_ad:mall_ad_pass@10.10.42.25:27017/mall_ad"
    },
    "redis":{
        "host":"10.10.42.25",
        "port":6379
    },
    "cache_redis":[
        {"host":"10.10.32.101", "port":6379},
    ],
    lotteryRedis: {
        host: '10.10.42.25',
        port: 6379
    },
    sysLotteryRedis: {
        host: '10.10.42.25',
        port: 6379
    },
    queueRedis: {
        host: '10.10.42.25',
        port: 6379
    }
}

var QQ_CONFIG = {
    "NODE_ENV": "qq",
    "domain":"http://ads-mall.dev.tvm.cn",
    "userHost":"http://mb.mtq.tvm.cn",
    "yaoHost": "http://yao.mtq.tvm.cn",
    "mongodb":{
        "links":"mongodb://mall_ad:mall_ad_pass@10.131.226.169:27017/mall_ad"
    },
    "redis":{
        "host":"10.105.35.129",
        "port":6379
    },
    "cache_redis":[
        {"host":"10.105.35.129", "port":6379},
    ],
    lotteryRedis: {
        host: '10.105.35.129',
        port: 6379
    },
    sysLotteryRedis: {
        host: '10.105.35.129',
        port: 6379
    },
    queueRedis: {
        host: '10.105.35.129',
        port: 6379
    }
}

var CONFIG = {
    "fileUploadDir":"/mnt/pic",
    "nginxFileDir":"/pic",
    "token":"7fda67277f",
    "tvmMallToken": "35o4zts2mwgdenkvpqrf0u",
    "port": 6003
}

if (NODE_ENV == 'QQ'){
    CONFIG = _.extend(CONFIG, QQ_CONFIG)
} else {
    CONFIG = _.extend(CONFIG, DEV_CONFIG)
}
module.exports = CONFIG