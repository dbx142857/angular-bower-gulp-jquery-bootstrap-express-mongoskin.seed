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

//���js param
app.post('/hongbao/js/param', openController.getCheckUser, mWxRedLottery.midWxRedLotteryLoader(), mWxRedLottery.jsParam);

//��ȯjs param
app.post('/card/jssdk/param', openController.getCheckUser, mPrize.midPrizeLoader(), mCard.getCardApiTicket, mCard.generateCardJsParam)

//��ȯ�¼�
app.post('/card/event/deal', mCard.dealWxCardEvent)

//��ʼ�齱
app.post('/syslottery/start', syslottery.startLottery);
//�齱��ʼ������û���Ϣ�ӿ�
app.post('/syslottery/receiveuser',openController.checkUser, syslottery.acceptUsers);
//��ȡĳ�γ齱���н��û��б� ����Ʒ�ȼ���ʾ
app.get('/syslottery/winlist', openController.getCheckUser,  syslottery.lotteryResult);
//��ȡ�û�ĳ�γ齱���н����
app.get('/syslottery/user/result', openController.getCheckUser,  syslottery.getUserWinInfo);
//��ȡĳ�γ齱�Ľ�Ʒ��Ϣ
app.get('/syslottery/prize/list', openController.getCheckUser,  syslottery.getLotteryPrizes);
//��ȡĳ�γ齱�Ľ��ؽ������
app.get('/syslottery/money', openController.getCheckUser,  syslottery.getMoney);

//����ϵͳ�齱 ��lotteryid �� count
app.get('/syslottery/copy',createsyslottery.copyLottery)

//�����ʵ�ｱƷ ��Ҫ�����ջ���ַ
app.post('/order/update/address', openController.getCheckUser,  orders.setAddress);
//��ȡ�����100��������Ϣ
app.get('/order/get/prize', openController.getCheckUser,  orders.getSomePrize);
//��ȡ��һ�û������ж�����Ϣ
app.get('/order/user/orders',openController.getCheckUser,orders.getOrdersByUser);



//���齱
app.get('/crazyLottery/prize', mCrazyLottery.getLotteryPrize);
app.post('/crazyLottery/start', mCrazyLottery.startCrazyLottery);
app.post('/crazyLottery/copy', mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.copyCrazyLottery);
app.post('/crazyLottery/draw', openController.checkUser, mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.checkLotteryUserTimes, mCrazyLottery.drawCrazyLottery);
app.get('/crazyLottery/records', openController.getCheckUser, mCrazyLottery.getLotteryRecords);
