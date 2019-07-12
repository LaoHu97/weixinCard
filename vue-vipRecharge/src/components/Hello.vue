<template>
  <div>
    <div class="top">
      <div class="top-center">
        <img :src="logo">
        <h4>{{title}}</h4>
        <span>{{cardno}}（{{uname}}）</span>
      </div>
    </div>
    <div class="center">
      <span style="display:block;text-align: left;padding: 25px;color: #999;">请选择充值面额</span>
      <checker v-model="moneycheck" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
        <checker-item :value="key0" @on-item-click="itemClick">{{key0}}元</checker-item>&nbsp;&nbsp;&nbsp;&nbsp;
        <checker-item :value="key1" @on-item-click="itemClick">{{key1}}元</checker-item>&nbsp;&nbsp;&nbsp;&nbsp;
        <checker-item :value="key2" @on-item-click="itemClick">{{key2}}元</checker-item><br /><br />
        <checker-item :value="key3" @on-item-click="itemClick">{{key3}}元</checker-item>&nbsp;&nbsp;&nbsp;&nbsp;
        <checker-item :value="key4" @on-item-click="itemClick">{{key4}}元</checker-item>&nbsp;&nbsp;&nbsp;&nbsp;
        <x-input v-model="moneynumber" v-bind:class="{ border: isBorder }" placeholder="请输入" class="moneys-input vux-checker-item vux-tap-active demo5-item" type="tel" text-align="center" :max="5" placeholder-align="center" :show-clear="false" @on-focus="textfocus"></x-input>
      </checker>
      <div class="onepx"></div>
      <div class="chongzhi">充值{{money = moneycheck == '' ? moneynumber : moneycheck}}元</div>
      <div class="chongzhi">赠送{{moneygive == '' ? '0' : moneygive }}元</div>
      <div class="chongzhi">赠送{{jifen == '' ? '0' : jifen }}积分</div>
      <div class="chongzhi">赠送{{quan == '' ? '0' : quan }}</div>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" is-show-mask text="请输入金额" :position="position"></toast>
    <div v-transfer-dom>
      <loading v-model="loadingShow"></loading>
    </div>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="submitForm('top')">确认支付</x-button>
    </box>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Checker, CheckerItem, Divider, Group, Cell, Popup, XInput, XButton, Box, Toast,  Loading, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Checker,
    CheckerItem,
    Divider,
    Group,
    Cell,
    Popup,
    XInput,
    XButton,
    Box,
    Toast,
    Loading
  },
  data () {
    return {
      loadingShow: false,
      position: 'default',
      showPositionValue:false,
      isBorder:false,
      moneynumber: '',
      moneycheck:'',
      moneygive:'',
      jifen: '',
      quan: '',
      cardDepositList:'123',
      money:'',
      mid: '',
      eid: '',
      sid: '',
      oid: '',
      cardCode:'',
      cardId:'',
      cardOpenId:'',
      typepay: '',
      memId: '',


      adUrl:'',
      adTargetUrl:'',
      //头部显示值
      logo:'',
      cardno:'',
      uname:'',
      title:'',

      key0:'',
      key1:'',
      key2:'',
      key3:'',
      key4:'',
      value0:'',
      value1:'',
      value2:'',
      value3:'',
      value4:'',
      bonus0:'',
      bonus1:'',
      bonus2:'',
      bonus3:'',
      bonus4:'',
      couponName0:'',
      couponName1:'',
      couponName2:'',
      couponName3:'',
      couponName4:'',
    }
  },
  watch:{
    money:function (val,oldval) {
      if (val==this.key0) {
        this.moneygive = this.value0;
        this.jifen = this.bonus0
        this.quan = this.couponName0
      }else if (val==this.key1) {
        this.moneygive = this.value1;
        this.jifen = this.bonus1
        this.quan = this.couponName1
      }else if (val==this.key2) {
        this.moneygive = this.value2;
        this.jifen = this.bonus2
        this.quan = this.couponName2
      }else if (val==this.key3) {
        this.moneygive = this.value3;
        this.jifen = this.bonus3
        this.quan = this.couponName3
      }else if (val==this.key4) {
        this.moneygive = this.value4;
        this.jifen = this.bonus4
        this.quan = this.couponName4
      }else if (val=='') {
        this.moneygive = '';
        this.jifen = ''
        this.quan = ''
      }else {
        var that=this;
        that.$http({
          method: 'post',
          url: COURSES+'/pay/queryRuleByAmt',
          data: {
            "amount":val,
            'mid':this.mid,
            'cardId':this.cardId,
            'sid': String(JSON.parse(sessionStorage.getItem('sid')))
          }
        }).then(function(res) {
          if (res.data.code==='000000' && res.data.subCode ==='000000') {
            that.moneygive=res.data.data.balance;
            that.jifen=res.data.data.bonus;
            that.quan=res.data.data.couponName;
          }
        });
      }
    }
  },
  methods: {
    textfocus:function () {
      this.moneycheck="";
      this.isBorder=true;
    },
    itemClick:function () {
      this.moneynumber="";
      this.isBorder=false;
    },
    submitForm:function (position) {
      var that=this;
      that.loadingShow=true;
      var reg =/^(([1-9][0-9]*)|([0]\.[1-9]{1})|([0]\.[1-9][0-9]{1})|([0]\.[0-9][1-9]{1})|([1-9][0-9]*\.\d{0,2}))$/;
      if (reg.test(this.money)) {
        that.$http({
          method: 'post',
          url: COURSES+'/pay/getPrepayInfo',
          data: {
            'amount': String(this.money),
            'discount':String(this.moneygive),
            'mid': this.mid,
            'eid': this.eid,
            'sid': this.sid,
            'payOpenId': this.oid,
            'cardCode':this.cardCode,
            'cardId':this.cardId,
            'cardOpenId':this.cardOpenId,
            'desc': '',
            'type': '1',
            'scene':'D',
            'memId': this.memId.toString()
          }
        }).then(function(res) {
          that.loadingShow=false;
          var out_trade_no = res.data.data.out_trade_no;
          sessionStorage.setItem('out_trade_no', JSON.stringify(out_trade_no));
          var orderType = "";
          sessionStorage.setItem('orderType', JSON.stringify(orderType));
          let orderId = res.data.data.orderId
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": res.data.data.appid,
            "timeStamp": res.data.data.timeStamp,
            "nonceStr": res.data.data.nonce_str,
            "package": res.data.data.packages,
            "signType": res.data.data.sign_type,
            "paySign": res.data.data.paySign
          }, function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              that.$http({
                method: 'post',
                url: COURSES+'/pay/receiveCardAfterPay',
                data: {
                  'status': 1,
                  'orderId': orderId,
                  'memId': that.memId.toString()
                }
              }).then(res => {
                console.log(res);
                wx.addCard({
                  cardList: res.data.data.addCardListConfig, // 需要添加的卡券列表
                  success: function (res) {
                  }
                });
              })
            } else {
              that.$http({
                method: 'post',
                url: COURSES+'/pay/receiveCardAfterPay',
                data: {
                  'status': 2,
                  'orderId': orderId,
                  'memId': this.memId.toString()
                }
              }).then(res => {

              })
              that.$vux.toast.show({
                type:'warn',
                text: '支付失败'
              })
            }
          });
        });
      }else {
        that.loadingShow=false;
        that.position = position
        that.showPositionValue = true
      }
    },
  },
  mounted() {
    function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
      var entType = GetQueryString("entType");
      var mid = GetQueryString("mid");
      var eid = GetQueryString("eid");
      var sid = GetQueryString("sid");
      var cardCode = GetQueryString("cardCode");
      var cardId = GetQueryString("cardId");
      var cardOpenId = GetQueryString("cardOpenId");
      var openId=JSON.parse(sessionStorage.getItem('openId'));
      var model = GetQueryString("model");
      var openid = GetQueryString("openid");
      // var oid = '';
      // if (model == 'FT') {
      //   oid = openid;
      // } else {
      //   oid = openId;
      //   var card_Code = '';
      //   if (openId == null) {
      //     card_Code = null;
      //   } else {
      //     card_Code = '1';
      //   }
      // }
      var openCode = GetQueryString("code");
      var state = GetQueryString("state");
      this.typepay = GetQueryString("type");
      var that = this;
      that.$http({
        url: COURSES+"/pay/getJsInitConfig", 
        method: 'post', 
        data: {
          'mid': mid.toString(),
          'url': window.location.href.split("#")[0]
        }
      }).then(res => {
        let _this = this;
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.data.configSign, // 必填，签名
          jsApiList: ["addCard"] // 必填，需要使用的JS接口列表
        });
      });
      that.$http({
        method: 'post',
        url: COURSES+'/pay/getPayMemInfo',
        data: {
          'mid': mid,
          'eid': eid,
          'sid': String(JSON.parse(sessionStorage.getItem('sid'))),
          'cardCode': cardCode,
          "cardOpenId":cardOpenId,
          "cardId":cardId,
          "openCode":openCode,
          "state":state,
          'type': this.typepay,
          'scene':'D',
          'entType':entType,
          'payOpenId': openid,
          'model': model
        }
      }).then(function(res) {
        if (res.data.code === '000000' && res.data.subCode === '000000') {
          that.logo=res.data.data.logo;
          that.cardno=res.data.data.cardno;
          that.uname=res.data.data.uname;
          that.title=res.data.data.title;
          that.mid = res.data.data.mid;
          that.eid = res.data.data.eId;
          that.sid = res.data.data.storeId;
          that.oid = res.data.data.payOpenId;
          that.memId = res.data.data.memId;
          var openId=res.data.data.payOpenId;
          sessionStorage.setItem('openId', JSON.stringify(openId));
          that.cardCode=res.data.data.cardCode;
          that.cardId=res.data.data.cardId;
          that.cardOpenId=res.data.data.cardOpenId;
        }
      });
      that.$http({
        method: 'post',
        url: COURSES+'/pay/queryDepositRule',
        data: {
          'mid': mid,
          "cardId":cardId,
          "sid": String(JSON.parse(sessionStorage.getItem('sid')))
        }
      }).then(function(res) {
        if (res.data.code === '000000' && res.data.subCode === '000000') {
          that.key0=res.data.data.amount0;
          that.key1=res.data.data.amount1;
          that.key2=res.data.data.amount2;
          that.key3=res.data.data.amount3;
          that.key4=res.data.data.amount4;
          that.value0=res.data.data.balance0;
          that.value1=res.data.data.balance1;
          that.value2=res.data.data.balance2;
          that.value3=res.data.data.balance3;
          that.value4=res.data.data.balance4;
          that.bonus0=res.data.data.bonus0;
          that.bonus1=res.data.data.bonus1;
          that.bonus2=res.data.data.bonus2;
          that.bonus3=res.data.data.bonus3;
          that.bonus4=res.data.data.bonus4;
          that.couponName0=res.data.data.couponName0;
          that.couponName1=res.data.data.couponName1;
          that.couponName2=res.data.data.couponName2;
          that.couponName3=res.data.data.couponName3;
          that.couponName4=res.data.data.couponName4;
          that.moneycheck=res.data.data.amount0;
        }
      });
  }
}
</script>

<style lang="css">
.border{
  border: 1px solid #1aad19!important
}
.top{
  width: 100%;
  height: 100px;
  background-color: #1aad19;
}
.top .top-center{
  height: 50px;
  padding: 25px;
  color: #fff;
}
.top .top-center h4{
  text-align: left;
  margin: 0;
  line-height:30px;
}
.top .top-center span{
  font-size: 12px;
  display: block;
  text-align: left;
}
.top .top-center img{
  width: 50px;
  height: 50px;
  border-radius: 100%;
  float: left;
  border: 1px solid #fff;
  margin-right: 25px;
}
.demo5-item {
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}
.demo5-item-selected {
  background: #1aad19;
  border-color: #fff;
  color: #fff;
}
.weui-input{
  width: 80px!important;
  height: 40px!important;
  line-height: 40px!important;
}
.moneys-input{
  width: 80px!important;
  height: 40px!important;
  padding: 0!important;
  display: inline-block!important;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.onepx{
  height: 1px;
  background-color: #999;
  margin: 25px 25px 0 25px;
}
.chongzhi{
  color:#ff9900;
  font-weight:bold;
  text-align: left;
  padding: 10px;
  background: #fff;
}
</style>
