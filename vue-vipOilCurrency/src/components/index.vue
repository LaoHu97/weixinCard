<template>
  <div>
    <div class="top">
      <div class="top-center">
        <div class="top-center-consumption">
          <p>
            <i class="fa fa-bullhorn fa-lg"></i> 详情请咨询服务员
          </p>
        </div>
      </div>
    </div>
    <div class="center">
      <group>
        <selector
          title="款台："
          placeholder="请选择款台"
          direction="right"
          :options="list1"
          v-model="numberOli"
          @on-change="onChange"
        ></selector>
        <x-input
          title="金额："
          placeholder="输入金额（10-9999）"
          :max="6"
          type="number"
          v-model="money"
          :show-clear="false"
          placeholder-align="left"
          text-align="left"
          :disabled="disabledMoney"
          v-bind:style="{ opacity: activeOpacity }"
        ></x-input>
      </group>
    </div>
    <div style="text-align:left;background-color: #eee;line-height:45px;padding-left:15px;">选择您的支付方式</div>
    <group style="text-align:left">
      <radio :options="radio01" v-model="formRadioWx" v-if="type=='1'">
        <template slot-scope="props" slot="each-item">
          <i v-bind:class="[props.icon]" style="color:#1AAD19;font-size:22px;"></i>
          <span>{{ props.label }}</span>
          <badge :text="discount+'折'" v-show="discountShow"></badge>
        </template>
      </radio>
      <radio :options="radio02" v-model="formRadioAli" v-else></radio>
    </group>
    <x-dialog v-model="showHideOnBlur" class="dialog-demo">
      <div @click="showHideOnBlur=false" class="title-dialog">
        <i class="fa fa-times fa-lg"></i>
      </div>
      <p>请输入会员卡支付密码</p>
      <h5 style="margin:10px;color:#ccc;">初始密码为“123456”,可前会员卡主页修改</h5>
      <div class="onepx"></div>
      <p style="font-weight:bold">
        ￥{{money}}&nbsp;
        <span
          style="color: rgb(204, 204, 204);text-decoration: line-through;font-size:12px;"
        >{{money}}</span>
      </p>
      <group>
        <x-input
          placeholder="请输入支付密码"
          placeholder-align="center"
          v-model="password"
          text-align="center"
          type="password"
        ></x-input>
      </group>
      <box gap="10px 10px">
        <x-button
          mini
          type="primary"
          @click.native="submitFormVIP('top')"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;确认支付&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</x-button>
      </box>
    </x-dialog>
    <box gap="10px 10%" style>
      <x-button type="primary" :show-loading="false" @click.native="submitForm()">确认支付</x-button>
    </box>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import Md5 from "md5";
import {
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
  Loading,
  Radio,
  XDialog,
  Badge,
  PopupPicker,
  Selector,
  TransferDomDirective as TransferDom
} from "vux";
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
    Loading,
    Radio,
    XDialog,
    Badge,
    PopupPicker,
    Selector
  },
  data() {
    return {
      value1: [],
      list1: [],
      radio01: [
        {
          icon: "fa fa-wechat",
          key: "1",
          value: "微信支付"
        },
        {
          icon: "fa fa-credit-card",
          key: "2",
          value: "会员卡支付"
        }
      ],
      radio02: [
        {
          icon: "http://weixin.weupay.com/pay/card/common/icon-03.png",
          key: "1",
          value: "支付宝支付"
        }
      ],
      vals: "", //折扣值
      discount: "", //折扣率
      discountShow: true, //是否显示打折
      formRadioWx: "1",
      formRadioAli: "1",
      oliItem: true,
      type: "",
      money: "",
      numberOli: "",
      disabledMoney: true,
      activeOpacity: "0.5",
      //下单数据
      payOpenId: "",
      eid: "",
      adUrl: "",
      adTargetUrl: "",
      //会员卡支付弹窗
      showHideOnBlur: false,
      password: "",
      orderId: "",
      pwd: "",

      isCardCoupon: false
    };
  },
  methods: {
    onChange(val) {
      if (val != "") {
        this.disabledMoney = false;
        this.activeOpacity = "1";
        this.eid = val;
      }
    },
    //获取款台列表
    getempList() {
      var that = this;
      that
        .$http({
          method: "get",
          url:
            COURSES +
            `member/store/${String(JSON.parse(sessionStorage.getItem("sid")))}`,
          data: {
            // 'mid': JSON.parse(sessionStorage.getItem('mid')),
            sid: String(JSON.parse(sessionStorage.getItem("sid")))
          }
        })
        .then(function(res) {
          if (res.data.subCode === "000000") {
            let obj = res.data.data;
            let i = [];
            obj.map(data => {
              i.push({ key: data.eid, value: data.ename });
            });
            that.list1 = i;
            that.numberOli = i[0].key;
          } else {
            that.disabledMoney = true;
            that.activeOpacity = "0.5";
            that.money = "";
          }
        });
    },
    getCoupon(orderId) {
      this.loadingShow=true;
      this.$http({
        method: "post",
        url: COURSES + "member/card/coupon",
        data: {
          orderId: orderId
        }
      }).then(res => {
        console.log(res);
        this.loadingShow = false;
        if (res.data.data.isCardCoupon) {
          wx.addCard({
            cardList: res.data.data.cardList, // 需要添加的卡券列表
            success: function(res) {}
          });
        }
      });
    },
    submitForm: function(position) {
      var that = this;
      that.vals = that.money * (that.discount / 10); //计算优惠金额
      //显示loading
      that.$vux.loading.show({
        text: "加载中"
      });
      var reg = /^(([1-9][0-9]*)|([0]\.[1-9]{1})|([0]\.[1-9][0-9]{1})|([0]\.[0-9][1-9]{1})|([1-9][0-9]*\.\d{0,2}))$/;
      if (that.type == "1" && reg.test(this.money)) {
        if (that.formRadioWx == "1") {
          that
            .$http({
              method: "post",
              url: COURSES + `member/emp/${that.numberOli}/preOrder`,
              data: {
                discount: this.GetQueryString("discount"),
                memId: this.GetQueryString("memId"),
                memberOpId: this.GetQueryString("openid"),
                memberMpOpenId: this.GetQueryString("mpopenId"),
                payMode: "WX",
                totalFee: Math.round(that.money * 100).toString(),
                paidAmount: (
                  Math.round(that.money * 100) - Math.round(that.vals * 100)
                ).toString()
              }
            })
            .then(function(res) {
              that.$vux.loading.hide();
              if (res.data.subCode == "000000") {
                var out_trade_no = res.data.data.orderId;
                sessionStorage.setItem(
                  "out_trade_no",
                  JSON.stringify('out_trade_no')
                );
                var orderType = "";
                sessionStorage.setItem("orderType", JSON.stringify(orderType));
                WeixinJSBridge.invoke(
                  "getBrandWCPayRequest",
                  {
                    appId: res.data.data.wxPreOrderCO.appId,
                    timeStamp: res.data.data.wxPreOrderCO.timeStamp,
                    nonceStr: res.data.data.wxPreOrderCO.nonceStr,
                    package: res.data.data.wxPreOrderCO.packageStr,
                    signType: res.data.data.wxPreOrderCO.signType,
                    paySign: res.data.data.wxPreOrderCO.paySign
                  },
                  function(res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                      that.$router.push({
                        path: "/commer"
                      });
                      that.getCoupon(out_trade_no) 
                    } else if (
                      res.err_msg == "get_brand_wcpay_request:cancel"
                    ) {
                      that.$vux.toast.show({
                        type: "cancel",
                        text: "取消支付"
                      });
                    } else {
                      that.$vux.toast.show({
                        type: "warn",
                        text: "支付失败"
                      });
                    }
                  }
                );
              } else {
                that.$vux.loading.hide();
                that.$vux.toast.show({
                  text: "支付失败",
                  type: "cancel"
                });
              }
            });
        } else if (that.formRadioWx == "2") {
          that
            .$http({
              method: "post",
              url: COURSES + `member/emp/${that.numberOli}/preOrder`,
              data: {
                discount: this.GetQueryString("discount"),
                memId: this.GetQueryString("memId"),
                memberOpId: this.GetQueryString("openid"),
                memberMpOpenId: this.GetQueryString("mpopenId"),
                payMode: "MEMBER",
                totalFee: Math.round(that.money * 100).toString(),
                paidAmount: (
                  Math.round(that.money * 100) - Math.round(that.vals * 100)
                ).toString()
              }
            })
            .then(function(res) {
              if (res.data.subCode == "000000") {
                that.$vux.loading.hide();
                that.showHideOnBlur = true;
                that.orderId = res.data.data.orderId;
                that.isCardCoupon = res.data.data.isCardCoupon
                that.pwd = res.data.data.memPreOrderCO.checkPwd;
                var out_trade_no = res.data.data.orderId;
                sessionStorage.setItem(
                  "out_trade_no",
                  JSON.stringify(out_trade_no)
                );
                var orderType = "m";
                sessionStorage.setItem("orderType", JSON.stringify(orderType));
              } else {
                that.$vux.loading.hide();
                that.$vux.toast.show({
                  text: res.data.subMsg,
                  type: "cancel"
                });
              }
            });
        }
      } else if (that.type == "2" && reg.test(this.money)) {
        that
          .$http({
            method: "post",
            url: COURSES + "/cashier/getPrepayInfo",
            data: {
              amount: String(this.money),
              mid: JSON.parse(sessionStorage.getItem("mid")),
              sid: JSON.parse(sessionStorage.getItem("sid")),
              oid: that.payOpenId,
              eid: String(that.eid),
              desc: "",
              type: "2",
              scene: "W"
            }
          })
          .then(function(res) {
            let { status, message } = res.data;
            if (status == 200) {
              that.$vux.loading.hide();
              window.location.href = res.data.data.qrCode;
            } else {
              that.$vux.loading.hide();
              that.$vux.toast.show({
                text: res.data.message,
                type: "cancel"
              });
            }
          });
      } else {
        that.$vux.loading.hide();
        that.$vux.toast.show({
          text: "金额不正确",
          type: "cancel"
        });
      }
    },
    submitFormVIP() {
      var that = this;
      //显示loading
      that.$vux.loading.show({
        text: "正在支付···"
      });
      that
        .$http({
          method: "post",
          url: COURSES + `member/emp/memPay`,
          data: {
            password: Md5(that.password + that.pwd),
            orderId: String(that.orderId),
            scene: "XF",
            memId: this.GetQueryString("memId")
          }
        })
        .then(function(res) {
          if (res.data.subCode == "000000") {
            that.password = "";
            // 隐藏loading
            that.$vux.loading.hide();
            that.showHideOnBlur = false;
            that.$router.push({
              path: "/commer"
            });
            that.getCoupon(String(that.orderId)) 
          } else {
            // 隐藏loading
            that.$vux.loading.hide();
            // 显示文字
            that.$vux.toast.text(res.data.subMsg, "top");
          }
        });
    },
    modifyPassword() {
      this.$router.push({
        path: "/password"
      });
    },
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  },
  mounted() {
    this.discount = this.GetQueryString("discount");
    //是否显示打折
    if (this.discount == "10") {
      this.discountShow = false;
    }
    this.type = this.GetQueryString("type");
    // var entType = GetQueryString("entType");
    // if (entType == 2) {
    //   var sid = GetQueryString("sid");
    //   sessionStorage.setItem('sid', JSON.stringify(sid));
    // }
    // var mid = GetQueryString("mid");
    // sessionStorage.setItem('mid', JSON.stringify(mid));
    // var cardCode = GetQueryString("cardCode");
    // sessionStorage.setItem('cardCode', JSON.stringify(cardCode));
    // var cardId = GetQueryString("cardId");
    // sessionStorage.setItem('cardId', JSON.stringify(cardId));
    // var cardOpenId = GetQueryString("cardOpenId");
    // sessionStorage.setItem('cardOpenId', JSON.stringify(cardOpenId));
    // sessionStorage.setItem('type', JSON.stringify(type));
    // var entType = GetQueryString("entType");
    // sessionStorage.setItem('entType', JSON.stringify(entType));
    // var openId = JSON.parse(sessionStorage.getItem('openId'));
    // var model = GetQueryString("model");
    // var openid = GetQueryString("openid");
    // var oid='';
    // if (model=='FT') {
    //   oid=openid;
    // }else {
    //   oid=openId;
    //   var card_Code='';
    //   if (openId==null) {
    //     card_Code=null;
    //   }else {
    //     card_Code='1';
    //   }
    // }
    // var openCode = GetQueryString("subCode");
    // var state = GetQueryString("state");
    // this.type = JSON.parse(sessionStorage.getItem('type'));
    // var that = this;
    // that.$http({
    //   method: 'post',
    //   url: COURSES + '/cashier/getPayMemInfo',
    //   data: {
    //     'openCode': openCode,
    //     'state': state,
    //     'mid': JSON.parse(sessionStorage.getItem('mid')),
    //     'sid': String(JSON.parse(sessionStorage.getItem('sid'))),
    //     'cardCode': JSON.parse(sessionStorage.getItem('cardCode')),
    //     "cardOpenId": JSON.parse(sessionStorage.getItem('cardOpenId')),
    //     "cardId": JSON.parse(sessionStorage.getItem('cardId')),
    //     'type': JSON.parse(sessionStorage.getItem('type')),
    //     'scene': 'W',
    //     'entType': entType,
    //     'state': '',
    //     "isInitCode": card_Code,
    //     'payOpenId':oid,
    //     'model':model
    //   }
    // }).then(function(res) {
    //   if (res.data.status == 200) {
    //     that.payOpenId = res.data.data.payOpenId;
    //     that.discount = res.data.data.discount;
    //     //是否显示打折
    //     if (that.discount=="1") {
    //       that.discountShow=false;
    //     };
    //     var openId = res.data.data.payOpenId;
    //     sessionStorage.setItem('openId', JSON.stringify(openId));
    //   }
    // });
    //获取款台列表
    this.getempList();
  }
};
</script>

<style lang="css">
.input:empty::before {
  content: attr(placeholder);
}
.onepx {
  width: 100%;
  height: 1px;
  background: #eee;
  margin: 10px 0;
}
.password-box {
  padding: 0 25px;
}
.dialog-demo p {
  text-align: center;
  font-size: 16px;
}
.dialog-demo .title-dialog {
  text-align: right;
}
.dialog-demo .title-dialog i {
  padding: 10px 10px 0 0;
}
.border {
  border: 1px solid #1aad19 !important;
}
.top {
  width: 100%;
  background-color: #eceff6;
  border-bottom: 1px solid #999;
}
.top .top-center {
  padding: 15px 25px;
}
.top-center-consumption {
  height: 28px;
  border: 1px solid #ff9900;
  color: #ff9900;
  line-height: 28px;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  padding-left: 15px;
}
.top-center p {
  margin: 0;
  font-size: 14px;
  text-align: left;
}
.top-weizhi {
  padding: 15px;
}
.center {
  margin-top: 15px;
  margin-bottom: 15px;
}
.center p span {
  color: #ff9900;
}
.weui-cells {
  margin-top: 0 !important;
}
/*css样式初始化*/
p,
ul,
li,
button {
  margin: 0;
  padding: 0;
}
body,
button,
input,
select,
textarea {
  font: 12px/1.5 \5b8b\4f53;
  font-family: 微软雅黑 !important;
}
li {
  list-style: none;
}
footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  font-size: 22px;
}
footer ul.left {
  width: 100%;
  float: left;
}
footer ul.left li {
  width: 25%;
  float: left;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  height: 52px;
  text-align: center;
  line-height: 52px;
}
footer ul.left p.last {
  width: 25%;
  float: left;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
  height: 158px;
  line-height: 158px;
  text-align: center;
  background: #eee;
}

footer ul.left p.last {
  float: right;
  position: absolute;
  bottom: -1px;
  right: -1px;
  border-right: none;
  color: #1aad19;
  font-size: 16px;
}
footer ul.left span.last {
  float: right;
  position: absolute;
  right: -1px;
  width: 25%;
  border-left: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
}
footer ul.left span.last i {
  line-height: 52px;
}

footer ul.left li:nth-of-type(1),
footer ul.left li:nth-of-type(2),
footer ul.left li:nth-of-type(3) {
  border-top: 1px solid #e0e0e0;
}

footer ul.left li:nth-of-type(3n + 1) {
  border-left: none;
}

footer ul.left li:nth-of-type(3n) {
  border-right: none;
}

footer ul.left li:nth-of-type(10) {
  background: none;
  width: 50%;
}
footer ul.left li:nth-of-type(12) {
  background: none;
}

footer ul.left li:nth-of-type(10),
footer ul.left li:nth-of-type(11),
footer ul.left li:nth-of-type(12) {
  border-bottom: 0;
}
footer ul.right li {
  width: 100%;
  float: left;
  height: 106px;
  line-height: 106px;
  text-align: center;
}

footer ul.right li:nth-of-type(2) {
  background: #3cc520;
}

footer ul.right li:nth-of-type(2) a {
  font-size: 18px;
  color: white;
  width: 50px;
  display: inline-block;
  line-height: 25px;
  margin-top: 28px;
}

footer ul.right .del {
  border-top: 1px solid #e0e0e0;
}
</style>
