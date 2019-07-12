<template>
  <div>
    <div style="text-align: center;font-size: 24px">
      <p>{{storeName}}</p>
    </div>
    <div class="center">
      <div class="keyboard">
        <!-- 自定义输入框 -->
        <div class="input-box" @touchstart.stop="focus">
          <!-- 左侧标签 -->
          <p class="label">{{label}} : </p>
          <!-- 右侧内容 -->
          <div class="content">
            <p class="input">
              <span class="currency" v-show="val">¥</span>
              {{val}}
            </p>
            <p class="placeholder" v-show="val.length === 0">
              {{placeholder}}
            </p>
            <!-- 光标 -->
            <p class="cursor" :style="{visibility: cursor ? 'visible' : 'hidden'}"></p>
          </div>
        </div>
        <!-- 自定义键盘 -->
        <keyboard :show="keyboard" @typing="typing" @complete="blur" />
      </div>
    </div>
    <box gap="20px 10%">
      <x-button type="primary" :show-loading="false" @click.native="submitForm()">确认支付</x-button>
    </box>
  </div>
</template>
<script>
  import Md5 from 'md5'
  import bestPay from '../../static/bestpay.api'
  import {
    Divider,
    Group,
    Cell,
    Popup,
    XInput,
    XButton,
    Box,
    XHeader,
    Radio,
    Loading,
    Toast,
    XDialog,
    Badge,
    TransferDomDirective as TransferDom
  } from 'vux'
  import keyboard from './keyboard'
  export default {
    name: 'KeyboardInput',
    directives: {
      TransferDom
    },
    components: {
      Divider,
      Group,
      Cell,
      Popup,
      XInput,
      XButton,
      Box,
      XHeader,
      Radio,
      Loading,
      Toast,
      XDialog,
      keyboard,
      Badge
    },
    props: {
      value: '',
      inter: {
        default: 5
      },
      decimal: {
        default: 2
      },
      label: {
        default: '消费金额'
      },
      placeholder: {
        default: '询问服务员后输入'
      }
    },
    data() {
      return {
        cursor: false,
        keyboard: false,
        /*value 在组件中的值*/
        val: '', //输入值
        vals: '', //折扣值
        discount: '', //折扣率
        discountShow: true, //是否显示打折
        aIllegal: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0..', '.'],
        cursorDuration: 600,
        bodyHeight: '',
        bodyOverflow: '',

        storeName: '',
        mid: '',
        eid: '',
        sid: '',
        oid: '',
        //下单数据
        adUrl: '',
        adTargetUrl: '',
      }
    },
    created() {
      document.addEventListener('touchstart', () => {
        this.blur();
      });
    },
    watch: {
      val: function (val, oldval) {

      }
    },
    methods: {
      /*focus*/
      focus() {
        /*显示键盘*/
        this.showKeyboard();
        /*显示光标*/
        this.showCursor();
        /*闪烁光标*/
        this.blinkCursor();
      },
      blinkCursor() {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(() => {
          this.cursor = !this.cursor;
        }, this.cursorDuration);
      },
      unblinkCursor() {
        clearInterval(this.intervalID);
      },
      /*blur*/
      blur() {
        /*隐藏光标*/
        this.hideCursor();
        /*停止光标闪烁*/
        this.unblinkCursor();
        /*隐藏键盘*/
        this.hideKeyboard();
        /*
          附加 00, 如果用户输入了一个以 . 结尾的值就点完成了,
          那么这个时候就在后面加上00
        */
        this.toCompletion();
        /*通知父组件, 老子值出来了*/
        /*
          校验用户输入的金额是不是为 0, 如果是的话, 直接重置
        */
        this.checkValue();
        this.notify();
      },
      showKeyboard() {
        this.keyboard = true;
      },
      hideKeyboard() {
        this.keyboard = false;
        this.vals = this.val * this.discount; //计算优惠金额
      },
      showCursor() {
        this.cursor = true;
      },
      hideCursor() {
        this.cursor = false;
      },
      checkValue() {
        if (parseFloat(this.val) === 0) {
          this.val = '';
        }
      },
      /*判读是否需要加0*/
      toCompletion() {
        let list = this.val.split('.');
        if (typeof list[1] === 'undefined') {
          if (this.val !== '') {
            this.val = this.val + '.';
            this.completion(this.decimal);
          }
        } else {
          if (list[1].length < this.decimal) {
            this.completion(this.decimal - list[1].length);
          }
        }
      },
      completion(len) {
        let v = '';
        for (let i = 0; i < len; i++) {
          v = v + '0';
        }
        this.val = this.val + v;
      },
      notify() {
        this.$emit('input', this.val);
      },
      del() {
        /*删除值并不会触发值的校验, 所以需要手动再触发一次*/
        this.val = this.val.slice(0, -1);
        this.notify();
      },
      /*输入*/
      typing(value) {
        /*如果是点击删除*/
        if (value === '') {
          this.del();
        }
        /*保存旧的值*/
        let oldValue = this.val;
        /*获取新的值*/
        this.val = this.val + value;
        /*检验新值, 如果没有通过检测, 恢复值*/
        if (!this.passCheck(this.val)) {
          this.val = oldValue;
          return;
        }
        /*为了让外界同步输入, 需要发送事件*/
        this.notify();
      },
      passCheck(val) {
        /*验证规则*/
        let aRules = [
          this.illegalInput,
          this.illegalValue,
          this.accuracy
        ]
        return aRules.every((item) => {
          return item(val);
        });
      },
      illegalInput(val) {
        if (this.aIllegal.indexOf(val) > -1) {
          return false;
        }
        return true;
      },
      /*非法值*/
      illegalValue(val) {
        if (parseFloat(val) != val) {
          return false;
        }
        return true;
      },
      /*验证精度*/
      accuracy(val) {

        let v = val.split('.')
        if (v[0].length > this.inter) {
          return false;
        }
        if (v[1] && (v[1].length) > this.decimal) {
          return false;
        }
        return true;
      },






      
      submitForm: function (position) {
        var that = this;
        // 显示
        that.$vux.loading.show({
          text: '加载中'
        })
        var reg =/^(([1-9][0-9]*)|([0]\.[1-9]{1})|([0]\.[1-9][0-9]{1})|([0]\.[0-9][1-9]{1})|([1-9][0-9]*\.\d{0,2}))$/;
          if (reg.test(this.val)) {
            that.$http({
              method: 'post',
              url: COURSES + '/cashier/getBsbPrepayInfo',
              data: {
                'amount': this.val.toString(),
                'mid': this.mid,
                'eid': this.eid,
                'sid': this.sid,
                'openId': this.oid,
                'payType': '010'
              }
            }).then(function (data) {
              // 隐藏
              that.$vux.loading.hide()
              if (data.data.status == 200) {
                var out_trade_no = data.data.data.out_trade_no;
                sessionStorage.setItem('out_trade_no', JSON.stringify(out_trade_no));
                var orderType = "";
                sessionStorage.setItem('orderType', JSON.stringify(orderType));
                WeixinJSBridge.invoke('getBrandWCPayRequest', {
                  "appId": data.data.data.appId,
                  "timeStamp": data.data.data.timeStamp,
                  "nonceStr": data.data.data.nonceStr,
                  "package": data.data.data.packages,
                  "signType": data.data.data.signType,
                  "paySign": data.data.data.paySign
                }, function (res) {
                  if (res.err_msg == "get_brand_wcpay_request:ok") {
                    that.$router.push({
                      path: '/commer',
                    });
                  } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    that.$vux.toast.show({
                      type: 'cancel',
                      text: '取消支付'
                    })
                  } else {
                    that.$vux.toast.show({
                      type: 'warn',
                      text: '支付失败'
                    })
                  }
                });
              } else {
                that.$vux.toast.show({
                  type: 'warn',
                  text: data.data.message
                })
              }
            });
        } else {
          // 隐藏
          that.$vux.loading.hide()
          // 显示文字
          that.$vux.toast.text('请输入金额', 'top')
        }
      },
      GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
          context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
      }
    },
    mounted() {
      this.blinkCursor(); //闪烁光标
      this.showKeyboard(); //显示键盘
      
      let openId=JSON.parse(sessionStorage.getItem('openId'));
      let card_Code = '';
      if (openId == null) {
        card_Code = null;
      } else {
        card_Code = '1';
      }
      let that = this;
      that.$http({
        method: 'post',
        url: COURSES + '/cashier/getWxOpenidByCode',
        data: {
          mid: this.GetQueryString('mid'),
          sid: this.GetQueryString('sid'),
          eid: this.GetQueryString('eid'),
          openCode: this.GetQueryString('code'),
          payOpenId: this.GetQueryString('payOpenId'),
          isInitCode: card_Code
        }
      }).then(function (res) {
        if (res.data.status == 200) {
          that.storeName = res.data.data.malias
          that.mid = res.data.data.mid;
          that.sid = res.data.data.storeId;
          that.eid = res.data.data.eId;
          that.oid = res.data.data.payOpenId;
          let openId=res.data.data.payOpenId;
          sessionStorage.setItem('openId', JSON.stringify(openId));
        }
      });
    }
  }

</script>

<style lang="css">
  .typepay p {
    margin: 0;
  }

  .vux-no-group-title {
    margin-top: 0 !important;
  }

  .keyboard {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
    user-select: none;
    font-size: 18px;
    width: 100%;
  }

  .input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 24px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 0 25px;
    background-color: #fff;
  }

  .label {
    color: #333;
  }

  .content {
    display: flex;
    font-size: 24px;
  }

  .input {
    font-size: 28px;
    color: #313131;
    height: 24px;
  }

  .cursor {
    background-color: #4788c5;
    width: 2px;
    margin-left: 2px;
  }

  .placeholder {
    color: #ccc;
    line-height: 32px;
  }

  .currency {
    color: #c1c1c1;
  }

</style>
