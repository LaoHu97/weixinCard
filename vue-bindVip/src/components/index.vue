<template>
  <div>
    <h4 style="text-align:center;">绑定老会员</h4>
    <group :model="user" ref="ruleForm">
      <x-input title="姓名" placeholder="请输入姓名" :show-clear="false" v-model="user.name" is-type="china-name" placeholder-align="right" text-align="right"></x-input>
      <datetime title="生日" placeholder="请选择生日" v-model="user.birthday" :min-year="1900" :max-year="2017"></datetime>
      <x-input title="手机号" placeholder="请输入手机号" :show-clear="false" v-model="user.phone" is-type="china-mobile" placeholder-align="right" text-align="right"></x-input>
      <x-input title="邮箱" placeholder="请输入邮箱" :show-clear="false" v-model="user.email" is-type="email" placeholder-align="right" text-align="right"></x-input>
      <x-input title="会员卡号" placeholder="请输入会员卡号" :show-clear="false" v-model="user.memNum" required placeholder-align="right" text-align="right"></x-input>
    </group>
    <div style="padding:15px;">
      <x-button @click.native="submit('ruleForm')" type="primary">确认提交</x-button>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, Cell, Datetime } from 'vux'
export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    Datetime
  },
  data () {
    return {
      user:{
        name:'',
        birthday:'2015-11-12',
        phone:'',
        email:'',
        memNum:'',
      },
      id:'',
      salt:'',
      password:'',
      checkPw:''
    }
  },
  methods: {
    submit(formName){
      function GetQueryString(name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
          var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
          var context = "";
          if (r != null)
               context = r[2];
          reg = null;
          r = null;
          return context == null || context == "" || context == "undefined" ? "" : context;
      }
      var mid=GetQueryString("mid");
      var encrypt_code=GetQueryString("encrypt_code");
      var card_id=GetQueryString("card_id");
      var that = this;
      if (that.user.name&&that.user.birthday&&that.user.phone&&that.user.email&&that.user.memNum) {
        // 显示
        that.$vux.loading.show({
         text: '正在修改...'
        })
        that.$http({
          method: 'post',
          url: COURSES+'/wxcard/bindOldCard',
          data: {
            mid:mid,
            encrypt_code:encrypt_code,
            cardId:card_id,
            name:that.user.name,
            birthday:that.user.birthday,
            phone:that.user.phone,
            email:that.user.email,
            memNum:that.user.memNum
          }
        }).then(function(res) {
          let {status,message}=res.data;
          if (status==200) {
            that.$wechat.closeWindow();
            // 隐藏
            that.$vux.loading.hide();
            // 显示
            that.$vux.toast.show({
             text: message
            })
          }else {
            // 隐藏
            that.$vux.loading.hide();
            // 显示
            that.$vux.toast.show({
             text: message,
             type:'warn'
            })
          }
        });
      }else {
        // 显示
        that.$vux.toast.show({
         text: "信息填写不完整",
         type:'warn'
        })
      }
    }
  },
  mounted() {
  }
}
</script>
