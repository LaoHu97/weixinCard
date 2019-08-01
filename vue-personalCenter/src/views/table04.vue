<template>
  <div>
    <h4 style="text-align:center;">修改密码</h4>
    <group>
      <x-input title="原始密码" placeholder="请输入原始密码" :show-clear="false" :min='6' :max='18' v-model="password" type="password" placeholder-align="right" text-align="right"></x-input>
      <x-input title="新密码" placeholder="请输入新密码" :show-clear="false" :min='6' :max='18' v-model="mpwd" type="password" placeholder-align="right" text-align="right"></x-input>
      <x-input title="新密码" placeholder="请输入新密码" :show-clear="false" :min='6' :max='18' v-model="mpwd2" type="password" :equal-with="mpwd" placeholder-align="right" text-align="right"></x-input>
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
      password:'',
      mpwd:'',
      mpwd2:''
    }
  },
  methods: {
    submit(){
      // 显示
      this.$vux.loading.show({
       text: '正在修改...'
      })
      console.log(this.password+JSON.parse(sessionStorage.getItem('checkPw')));
      
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/person/updateMemPwd',
        data: {
          memId: JSON.parse(sessionStorage.getItem('memId')),
          password:Md5(that.password+JSON.parse(sessionStorage.getItem('checkPw'))),
          mpwd:Md5(that.mpwd+JSON.parse(sessionStorage.getItem('checkPw'))),
          mpwd2:Md5(that.mpwd2+JSON.parse(sessionStorage.getItem('checkPw')))
        }
      }).then(function(res) {
        if (res.data.code === '000000' && res.data.subCode === '000000') {
          // 隐藏
          that.$vux.loading.hide();
          // 显示
          that.$vux.toast.show({
           text: res.data.subMsg,
           type:'success'
          })
          that.password='';
          that.mpwd='';
          that.mpwd2='';
        }else {
          // 隐藏
          that.$vux.loading.hide();
          // 显示
          that.$vux.toast.show({
           text: res.data.subMsg,
           type:'cancel'
          })
        }
      });
    }
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
