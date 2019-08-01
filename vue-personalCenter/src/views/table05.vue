<template>
  <div class="qrCode_view">
    <h3>付款码</h3>
    <p>结账时出示会员卡</p>
    <div class="qrCode_view_code">
      <img id="barcode" alt="条形码" />
      <img :src="qrCode" alt="二维码" width="80%" />
      <p>本支付码定时更新，请勿截屏，以免影响正常使用</p>
    </div>
  </div>
</template>
<script>
import Md5 from "md5";
import JsBarcode from "jsbarcode";
import { XButton } from "vux";
export default {
  components: {
    XButton
  },
  data() {
    return {
      qrCode: "",
      code: ""
    };
  },
  methods: {
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined"
        ? ""
        : context;
    },

    barcode(val) {
      JsBarcode("#barcode", val, {
        height: 60,
        format: "CODE128", //选择要使用的条形码类型
        text: val,
        displayValue: true, //是否在条形码下方显示文字
        textPosition: "bottom", //设置文本的垂直位置
        font: "fantasy",
        textMargin: 10,
        fontOptions: "bold"
      });
    },
    getQrCodeUrl() {
      this.$http
        .post(COURSES + "/mini/group/paymentBarcode", {
          mid: parseInt(this.GetQueryString("mid")),
          card_id: this.GetQueryString("card_id"),
          openid: this.GetQueryString("openid")
        })
        .then(res => {
          this.qrCode = `data:image/jpeg;base64,${res.data.data.encode}`;
          let mdCode = res.data.data.mdCode;
          this.barcode(mdCode)
          setTimeout(() => {
            this.getQrCodeUrl()
          }, 60000);
        });
    }
  },
  mounted() {
    this.getQrCodeUrl();
  }
};
</script>
<style media="screen">
.qrCode_view {
  width: 100%;
  height: 100vh;
  background: #1bad18;
  color: #fff;
  text-align: center;
  font-size: 16px;
}
.qrCode_view h3 {
  margin: 0;
  line-height: 2.5;
}
.qrCode_view_code {
  width: 85%;
  background: #fff;
  margin: 0 auto;
  margin-top: 30px;
  border-radius: 5px;
}
.qrCode_view_code p {
  text-align: center;
  color: #999;
  font-size: 12px;
  line-height: 2.5;
}
</style>
