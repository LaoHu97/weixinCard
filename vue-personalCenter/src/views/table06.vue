<template>
  <div>
    <h4 style="text-align:center;">老会员绑定</h4>
    <group>
      <x-input title="手机号" placeholder="请输入手机号" :show-clear="false" v-model="phone" placeholder-align="right" text-align="right"></x-input>
    </group>
    <div style="padding:15px;">
      <x-button @click.native="submit" type="primary">确认绑定</x-button>
    </div>
  </div>
</template>
<script>
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
      phone: ''
    }
  },
  methods: {
    submit(){
      if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))){ 
          this.$vux.toast.show({
           text: '请输入正确的手机号',
           type:'cancel'
          })
          return false; 
      } 
      // 显示
      this.$vux.loading.show({
       text: '正在修改...'
      })
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/person/bindOldMember',
        data: {
          memId: JSON.parse(sessionStorage.getItem('memId')),
          phone: this.phone
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
        }else{
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
