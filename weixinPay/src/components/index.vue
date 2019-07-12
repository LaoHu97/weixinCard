<template lang="html">
  <div>
    <h4 style="text-align: center;">测试商户</h4>
    <group title="请输入付款金额">
      <x-input title="金额" placeholder="0.00" :show-clear="false" placeholder-align="right" :required="true" v-model="moneyInput"></x-input>
    </group>
    <box gap="35px 10px">
      <x-button type="primary" @click.native="submit">扫一扫</x-button>
    </box>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import {
  XInput,
  Group,
  XButton,
  Cell,
  Box
} from 'vux'
export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    Box
  },
  data() {
    return {
      moneyInput: '',
      resultstring:''
    }
  },
  methods: {
    submit: function() {
      var that=this;
      if (this.moneyInput == "") {
        this.$vux.toast.show({
          text: '请输入金额',
          type: 'warn'
        })
      } else {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function(res) {
            var yourString = String(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
            var result=yourString.split(",");
            if (result[0]=='CODE_128') {
              that.resultstring=result[1]
            }else {
              that.resultstring=result[0]
            }
            that.$vux.loading.show({
             text: '正在支付...'
            })
            that.$http.post('http://test.weupay.cn/pay/cashier/scanpayTest', {
              amount: that.moneyInput,
              authCode: that.resultstring,
              type: '020'
            }).then((res) => {
              // 隐藏
              that.$vux.loading.hide()
              if (res.data.status == 200) {
                window.location.href = "http://weixin.weupay.com/pay/jsp/public.jsp";
              } else {
                that.$vux.toast.show({
                  text: '支付失败',
                  type: 'cancel'
                })
              }
            })
          }
        });
      }
    },
  },
  mounted() {
    function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null)
        context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
    }
    var mid = GetQueryString("mid");
    this.$http.post("http://test.weupay.cn/pay/cashier/getJsInitConfig", {
      mid: mid,
      sid: '1',
      eid: '2',
      url: window.location.href.split('#')[0]
    }).then((res) => {
      var that = this;
      if (res.data.status == 200) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.data.configinfo.appId, // 必填，公众号的唯一标识
          timestamp: res.data.data.configinfo.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.data.configinfo.noncestr, // 必填，生成签名的随机串
          signature: res.data.data.configinfo.configSign, // 必填，签名，见附录1
          jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {

        });
        wx.error(function() {

        });
      }
    });
  }
}
</script>

<style lang="css">
</style>
