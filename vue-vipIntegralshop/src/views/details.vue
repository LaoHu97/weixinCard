<template lang="html">
<div>
  <div class="top">
    <img :src="pic_url" alt="" width="100%">
    <span>{{name}}</span>
    <div><i class="fa fa-database fa-fw"></i>&nbsp;{{nprice}}</div>
  </div>
  <div class="px"></div>
  <div class="center">
    <span>商品介绍</span>
    <div>{{depict}}</div>
    <span>使用规则</span>
    <div>{{rule}}</div>
  </div>
  <x-button class="btns" @click.native="submit">立即兑换</x-button>
  <div v-transfer-dom>
      <alert v-model="show1" :title="CongratulationsOk"></alert>
      <alert v-model="show2" :title="CongratulationsErro"></alert>
      <loading :show="show" :text="text"></loading>
  </div>
</div>
</template>

<script>
import wx from 'weixin-js-sdk'
import {
  XButton,
  Alert,
  Loading,
  TransferDomDirective as TransferDom
} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Alert,
    Loading
  },
  data() {
    return {
      show1: false,
      show2: false,
      show: false,
      CongratulationsOk: '',
      CongratulationsErro: '',
      pic_url: '',
      name: '',
      nprice: '',
      depict: '',
      rule: '',
      text: '正在加载'
    }
  },
  methods: {
    submit: function() {
      this.$vux.loading.show({
        text: '正在加载'
      })
      this.$http.post(COURSES + "/bounsexchange", {
        card_id: JSON.parse(sessionStorage.getItem('card_id')),
        openId: JSON.parse(sessionStorage.getItem('openId')),
        mid: JSON.parse(sessionStorage.getItem('mid')),
        id: String(JSON.parse(sessionStorage.getItem('id'))),
        url: window.location.href.split('#')[0]
      }).then((res) => {
        var that = this;
        if (res.data.code === '000000') {
          var productId = res.data.data.productId;
          var shopOrderId = res.data.data.shopOrderId;
          var orderId = res.data.data.orderId;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.data.configinfo.appId, // 必填，公众号的唯一标识
            timestamp: res.data.data.configinfo.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.data.configinfo.noncestr, // 必填，生成签名的随机串
            signature: res.data.data.configinfo.configSign, // 必填，签名，见附录1
            jsApiList: ['addCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function() {
            that.$vux.loading.hide();
            if (!res.data.data.cardinfo.isWxCoupon) {
              that.CongratulationsOk = '兑换成功'
              that.show1 = true
              return 
            }
            wx.addCard({
              cardList: res.data.data.cardinfo.addCardListConfig, // 需要添加的卡券列表
              success: function(res) {
                var inSuccess = JSON.stringify(res.cardList);
                that.$http({
                  method: 'post',
                  url: COURSES + '/exchangeNotify',
                  data: {
                    isSuccess: JSON.parse(inSuccess),
                    productId: String(productId),
                    shopOrderId: String(shopOrderId),
                    orderId: String(orderId),
                    memCardId: JSON.parse(sessionStorage.getItem('card_id')),
                    memCode: JSON.parse(sessionStorage.getItem('cardCode')),
                  }
                }).then(function(res) {
                  that.CongratulationsOk = '兑换成功'
                  that.show1 = true;
                });
                that.CongratulationsOk = '兑换成功'
                that.show1 = true
              }
            });
          });
          wx.error(function(res) {
            // 隐藏
            that.$vux.loading.hide()
          });
        } else {
          // 隐藏
          that.$vux.loading.hide()
          that.CongratulationsErro = res.data.subMsg;
          that.show2 = true;
        }
      });
    },
  },
  mounted() {
    var that = this;
    that.$http({
      method: 'post',
      url: COURSES + '/queryProductDetial',
      data: {
        id: String(JSON.parse(sessionStorage.getItem('id'))),
      }
    }).then(function(res) {
      that.pic_url = res.data.data.product.pic_url;
      that.name = res.data.data.product.name;
      that.nprice = res.data.data.product.nprice;
      that.depict = res.data.data.product.depict;
      that.rule = res.data.data.product.rule;
    });
  },
}
</script>
<style lang="css">
.px{
  width: 100%;
  height: 12px;
  background-color: #eeeeee;
}
.top span{
  text-align: left;
  display: block;
  padding: 10px 25px;
}
.top div{
  text-align: left;
  padding: 0 25px 10px;
  font-size: 24px;
  color: #ff9900;
}
.top div i{
  font-size: 16px;
}
.center{
  text-align: left;
  padding:10px 0 45px;
}
.center span{
  font-weight: bolder;
  color: #333;
  border-left: 4px solid #ff9900;
  padding-left: 20px;
  margin-left: 5px;
}
.center div{
  font-size: 14px;
  padding: 15px;
}
.btns{
  border-radius: 0!important;
  color: #ff9900!important;
  position: fixed!important;
  bottom: 0;
}
.weui-btn:after{
  border-radius: 0!important;
}
</style>
