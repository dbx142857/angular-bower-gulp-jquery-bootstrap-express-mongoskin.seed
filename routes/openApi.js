/**
 * Created by chenjie on 2015/5/13.
 */

var express      = require('express');
var app          = express();
var middleware  = require('./middleware.js')
var syslottery  = require('./syslottery.js')
var createsyslottery  = require('./syslotterycreate.js')
var orders = require("./orders.js");
var mCard = require('./wxcard.js')
var mPrize = require('./prize.js')
var mWxRedLottery = require('./wxredLottery.js')
var mCrazyLottery = require('./crazylottery.js')

var openController = require('./openController');
var mWxShare = require('./wxShare.js');
module.exports = app;

//红包js param
app.post('/hongbao/js/param', openController.getCheckUser, mWxRedLottery.midWxRedLotteryLoader(), mWxRedLottery.jsParam);

//卡券js param
app.post('/card/jssdk/param', openController.getCheckUser, mPrize.midPrizeLoader(), mCard.getCardApiTicket, mCard.generateCardJsParam)

//卡券事件
app.post('/card/event/deal', mCard.dealWxCardEvent)

//开始抽奖
app.post('/syslottery/start', syslottery.startLottery);
//抽奖开始后接收用户信息接口
app.post('/syslottery/receiveuser',openController.checkUser, syslottery.acceptUsers);
//获取某次抽奖的中奖用户列表 按奖品等级显示
app.get('/syslottery/winlist', openController.getCheckUser,  syslottery.lotteryResult);
//获取用户某次抽奖的中奖结果
app.get('/syslottery/user/result', openController.getCheckUser,  syslottery.getUserWinInfo);
//获取某次抽奖的奖品信息
app.get('/syslottery/prize/list', openController.getCheckUser,  syslottery.getLotteryPrizes);
//获取某次抽奖的奖池金额总数
app.get('/syslottery/money', openController.getCheckUser,  syslottery.getMoney);

//复制系统抽奖 传lotteryid 和 count
app.get('/syslottery/copy',createsyslottery.copyLottery)

//如果是实物奖品 需要设置收货地址
app.post('/order/update/address', openController.getCheckUser,  orders.setAddress);
//获取最近的100条订单信息
app.get('/order/get/prize', openController.getCheckUser,  orders.getSomePrize);
//获取单一用户的所有订单信息
app.get('/order/user/orders',openController.getCheckUser,orders.getOrdersByUser);



//疯狂抽奖
app.get('/crazyLottery/prize', mCrazyLottery.getLotteryPrize);
app.post('/crazyLottery/start', mCrazyLottery.startCrazyLottery);
app.post('/crazyLottery/copy', mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.copyCrazyLottery);
app.post('/crazyLottery/draw', openController.checkUser, mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.checkLotteryUserTimes, mCrazyLottery.drawCrazyLottery);
app.get('/crazyLottery/records', openController.getCheckUser, mCrazyLottery.getLotteryRecords);
