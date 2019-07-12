<template>
  <div>
    <h4 style="text-align:center;">修改密码</h4>
    <group>
      <x-input title="原始密码" placeholder="请输入原始密码" :show-clear="false" :min='6' :max='6' v-model="oldPassword" type="password" placeholder-align="right" text-align="right"></x-input>
      <x-input title="新密码" placeholder="请输入新密码" :show-clear="false" :min='6' :max='6' v-model="newPassword01" type="password" placeholder-align="right" text-align="right"></x-input>
      <x-input title="新密码" placeholder="请输入新密码" :show-clear="false" :min='6' :max='6' v-model="newPassword02" type="password" :equal-with="newPassword01" placeholder-align="right" text-align="right"></x-input>
    </group>
    <div style="padding:15px;">
      <x-button @click.native="submit" type="primary">确认修改</x-button>
    </div>
  </div>
</template>
<script>
import Md5 from 'md5'
import { XInput, Group, XButton, Cell } from 'vux'
export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell
  },
  data () {
    return {
      oldPassword:'',
      newPassword01:'',
      newPassword02:'',
      id:'',
      salt:'',
      password:'',
      checkPw:''
    }
  },
  created: function () {
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
    var openId=GetQueryString("openId");
    var card_id=GetQueryString("card_id");
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/wxmember/queryUpdatePwd',
        data: {
          mid:mid,
          cardCode:encrypt_code,
          cardId:card_id,
          cardOpenId:openId
        }
      }).then(function(res) {
        that.id=res.data.data.member.id;
        that.salt=res.data.data.member.salt;
        that.password=res.data.data.member.password;
        that.checkPw=res.data.data.checkPw;
      });
},
  methods: {
    submit(){
      // 显示
      this.$vux.loading.show({
       text: '正在修改...'
      })
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/wxmember/updateMemPwd',
        data: {
          id:String(that.id),
          salt:that.salt,
          password:that.password,
          oldPwd:Md5(that.oldPassword+that.checkPw),
          mpwd:Md5(that.newPassword01+that.checkPw),
          mpwd2:Md5(that.newPassword02+that.checkPw)
        }
      }).then(function(res) {
        let {status,message}=res.data;
        if (status==200) {
          // 隐藏
          that.$vux.loading.hide();
          // 显示
          that.$vux.toast.show({
           text: message
          })
          that.oldPassword='';
          that.newPassword01='';
          that.newPassword02='';
        }else {
          // 隐藏
          that.$vux.loading.hide();
          // 显示
          that.$vux.toast.show({
           text: message,
           type:'cancel'
          })
        }
      });
    }
  },
  mounted() {
  }
}
</script>
<style media="screen">
.vuxfixed{
  width: 100%;
  position: fixed;
  top: 0;
}
.grid-center {
  display: block;
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 10px 10px 0 10px!important;
}
.grid-center div{
  font-weight: bold;
  color: #ff9900;
  font-size: 18px;
  line-height: 25px;
}
.grid-center div i{
  font-size: 12px;
}
.up{
  width: 35px;
  height: 35px;
  border: 1px solid #999;
  border-radius: 100%;
  position: fixed;
  bottom: 25px;
  right: 25px;
}
.up i{
  line-height: 35px;
  color: #999;
}
</style>
