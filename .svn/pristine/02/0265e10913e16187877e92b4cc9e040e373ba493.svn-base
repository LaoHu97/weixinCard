<template lang="html">
  <div>
    <div class="title" v-bind:style="{ display: activeDisplay }">
      <i class="fa fa-info-circle icon" style="margin-left:15px;"></i> 当前地理位置不可用！
    </div>
    <div class="list_top">
      <span>请选择门店</span>
    </div>
    <div>
      <div class="list-center">
        <div v-for="item in list" class="list-center-text">
          <div class="list-center-text-left">
            <p>{{item.mname}} <span v-bind:style="{ display: activeDistance }">{{item.distance}} 千米</span></p>
            <span class="dizhi">{{item.address}}</span>
          </div>
          <div class="list-center-text-right">
            <flexbox>
              <flexbox-item style="text-align:center">
                <a @click="mapListClick(item)"><i class="fa fa-map icon"></i> 导 航</a>
                <!-- <x-button mini plain type="primary" @click.native="mapListClick(item)"><i class="fa fa-map icon"></i> 导 航</x-button> -->
              </flexbox-item>
              <div style="width:1px; height:35px; background-color:#ccc;margin-top:2px;"></div>
              <flexbox-item style="text-align:center">
                <a @click="payListClick(item)"><i class="fa fa-wechat icon"></i> 支 付</a>
                <!-- <x-button mini type="primary" @click.native="payListClick(item.id)"><i class="fa fa-wechat icon"></i> 支 付</x-button> -->
              </flexbox-item>
            </flexbox>
          </div>
        </div>
          <div v-transfer-dom class="title-list">
            <confirm v-model="show"
            title="请再次确认"
            @on-cancel="onCancel"
            @on-confirm="onConfirm">
              <p style="text-align:center;color:#333;line-height:2.5;font-size:20px;"><span style="color:#E64340;">{{transfer.mname}}</span></p>
              <p style="text-align:center;color:#333;line-height:2.5;font-size:12px;">
                <span style="color:#E64340;" v-if='transfer.distance'>{{transfer.distance}}千米</span>
                <span style="color:#E64340;" v-else>未知</span>
              </p>
              <div style="text-align:left;color:#333;font-size:12px;border-top: 1px solid #f0f0f0;line-height:2">
                <p>*请向服务员询问并确认当前门店名称</p>
                <p>*如因选择原因造成经济损失，<span style="color:#E64340">门店概不负责</span></p>
                <p>*请再三确认您当前所在门店</p>
              </div>
            </confirm>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { XButton, Flexbox, FlexboxItem, Confirm, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    Confirm
  },
  data () {
    return {
      activeDisplay:'none',
      activeDistance:'',
      list: [],
      mid:'',
      latitude:'',
      longitude:'',
      speed:'',
      accuracy:'',
      flag:'',
      show:false,
      id:'',
      transfer: {
        mname:'',
        distance:''
      }
    }
  },
  methods:{
    onCancel () {
      console.log('取消确认')
    },
    onConfirm (msg) {
      console.log('再次确认')
      let sid = this.id;
      sessionStorage.setItem('sid', JSON.stringify(sid));
      this.$router.push({
        path: '/index',
      });
    },
    mapListClick(item){
      var that = this;
      //使用微信内置地图查看位置接口
      that.$wechat.openLocation({
          latitude : parseFloat(item.latitude), // 纬度，浮点数，范围为90 ~ -90
          longitude : parseFloat(item.longitude), // 经度，浮点数，范围为180 ~ -180。
          name : item.mname, // 位置名
          address : item.address, // 地址详情说明
          scale : 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl : 'http://www.wandingkeji.cn' // 在查看位置界面底部显示的超链接,可点击跳转（测试好像不可用）
      });
    },
    payListClick(item){
      var _this = this;
      _this.id=item.id;
      _this.transfer = item
      _this.show = true;
    },
    getList(){
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/wxcard/queryStoreToPhone',
        data: {
          'mid': that.mid,
          'latitude': String(that.latitude),
          'longitude': String(that.longitude),
          'speed': String(that.speed),
          'accuracy': String(that.accuracy),
          'flag': String(that.flag)
        }
      }).then(function(res) {
        let {status,message,data}=res.data;
        if (status==200) {
          that.list=data.map.storeList;
        }
        that.$vux.loading.hide();
      });
    },
    getUser(){
      var that = this;
      that.$wechat.getLocation({
          success: function (res) {
              that.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              that.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              that.speed = res.speed; // 速度，以米/每秒计
              that.accuracy = res.accuracy; // 位置精度
              that.flag = 'Y';
              that.activeDisplay = 'none';
              that.activeDistance = 'block'
              //获取门店列表
              that.getList();
          },
          cancel: function (res) {
            that.$vux.toast.show({
             text: '用户拒绝提供地理位置'
            })
            that.activeDisplay = 'block';
            that.activeDistance = 'none'
            that.flag = 'N';
            that.getList();
          }
      });
    },
    configWx(){
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/bounsShop/loadConfig',
        data: {
          'mid': that.mid,
          'url': window.location.href.split('#')[0]
        }
      }).then(function(res) {
        let {status,message,data}=res.data;
        if (status==200) {
          that.$wechat.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: res.data.data.configinfo.appId, // 必填，公众号的唯一标识
              timestamp: res.data.data.configinfo.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.data.configinfo.noncestr, // 必填，生成签名的随机串
              signature: res.data.data.configinfo.configSign,// 必填，签名，见附录1
              jsApiList: ['getLocation' ,'openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          that.$wechat.ready(function(){
            //获取用户地理位置
            that.getUser();
          });
          that.$wechat.error(function(res){
            that.flag = 'N';
            that.activeDisplay = 'block';
            that.activeDistance = 'none';
            that.getList();
          });
        }
      });
    }
  },
  mounted() {
    function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
    this.mid = GetQueryString("mid");
    sessionStorage.setItem('mid', JSON.stringify(this.mid));
    //显示loading
    this.$vux.loading.show({
     text: '加载中'
    })
    this.configWx();
    this.getList();
  }
}
</script>

<style lang="css">
@import '~vux/src/styles/close.less';
.title-list .weui-dialog__title{
  font-size: 14px;
}
.list_top{
  height: 50px;
  line-height: 50px;
  text-align:left;
  background-color: #eee;
  padding-left: 15px;
  border-bottom: 1px solid #ccc;
  color: #999;
}
.list_top span{
  font-size: 18px;
}
.list-center .list-center-text{
  text-align: left;
  border-bottom: 1px solid #ccc;
}
.list-center .list-center-text{
  height: 100%;
  overflow: hidden;
  padding: 15px 15px 5px;
  line-height: 1.8;
}
.list-center .list-center-text p{
  margin: 0;
  display: inline;
}
.list-center .list-center-text .dizhi{
  font-size: 14px;
  color: #999;
  display: table;
}
.listButtom{
  float: right;
  margin-top: 10px;
}
.list-center-text-left{

}
.list-center-text-left p{
  font-size: 18px;
}
.list-center-text-left p span {
  float: right;
}
.list-center-text-left span{
  font-size: 16px;
}
.list-center-text-right{
  height: 35px;
  border-top: 1px solid #ccc;
  margin-top: 15px;
}
.list-center-text-right a{
  color: #1AAD19;
  display: block;
  font-size: 16px;
}
.list-center-text-right span{
  font-size: 12px;
  color: #ff9900;
}
.title{
  height: 28px;
  width: 100%;
  color: #E64340;
  font-size: 12px;
  line-height: 28px;
  text-align: left;
  background-color: #ff9900;
}
</style>
