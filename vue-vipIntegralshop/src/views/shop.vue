<template>
  <div>
    <div>
      <div style="padding: 15px;background-color:#ff9900">
        <h1 style="color:#fff;text-align: center;"><i class="fa fa-database" style="font-size: 12px;"></i> {{bouns}}</h1>
          <button-tab>
            <button-tab-item @on-item-click="recordClick()">积分明细</button-tab-item>
            <button-tab-item @on-item-click="earnClick()">如何赚积分</button-tab-item>
          </button-tab>
      </div>
      <div style="height:44px;">
        <sticky :check-sticky-support="false" v-bind:class="{ vuxfixed: vuxFixed}">
          <tab :line-width="1">
            <tab-item selected  @on-item-click="onItemClick">综合</tab-item>
            <tab-item  @on-item-click="onItemClick1" v-if='sort1'>价格<i class="fa fa-sort"></i></tab-item>
            <tab-item  @on-item-click="onItemClick2" v-if='sort2'>价格<i class="fa fa-sort"></i></tab-item>
          </tab>
        </sticky>
      </div>
    </div>
    <div>
      <grid :cols="2">
        <div class="hacker-news-list">
          <grid-item v-for="item in list" v-bind:key="item.id" class="grid-center" @click.native="shopClick(item.id)" style="height:229px;">
            <div>
              <img :src="item.small_url" alt="商品图" width="100%" height="167.5px">
            </div>
            <span>{{item.name}}</span>
            <div><i class="fa fa-database fa-fw"></i><span>{{item.nprice}}</span></div>
          </grid-item>
          <infinite-loading @infinite="onInfinite" ref="infiniteLoading" spinner="spiral" v-if="infiniteLoading">
            <span slot="no-results">
              敬请期待 :(
            </span>
            <span slot="no-more">
              没有商品了 :(
            </span>
          </infinite-loading>
          <div v-else>
            <divider>页面错误</divider>
          </div>
        </div>
      </grid>
    </div>
    <!-- <div class="up"  @click="updown()" v-if="Tops">
      <i class="fa fa-hand-o-up"></i>
    </div> -->
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
import { ButtonTab, ButtonTabItem, Divider, XHeader, Actionsheet, TransferDom, Tab, TabItem, Sticky, Grid, GridItem, GroupTitle} from 'vux'
export default {
  components: {
    XHeader,
    Actionsheet,
    TransferDom,
    ButtonTab,
    ButtonTabItem,
    Divider,
    Tab,
    TabItem,
    Sticky,
    Grid,
    GridItem,
    GroupTitle,
    InfiniteLoading,
  },
  data () {
    return {
      list: [],
      scroll: '',
      Tops:false,
      sort1:true,
      sort2:false,
      bouns:'',
      vuxFixed:false,
      infiniteLoading:false
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
    var entType=GetQueryString("entType");
    if (entType==0) {
      // var encrypt_code=GetQueryString("encrypt_code");
      var mid=GetQueryString("mid");
      var card_id=GetQueryString("card_id");
      var openid=GetQueryString("openid");
      var encrypt_code=JSON.parse(sessionStorage.getItem('cardCode'));
      var card_Code='';
      if (encrypt_code==null) {
        encrypt_code=GetQueryString("encrypt_code");
        card_Code=null;
      }else {
        card_Code='1';
      }
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/queryShopMem',
        data: {
          'mid': mid,
          'cardId': card_id,
          'cardCode':encrypt_code,
          'cardOpenId':openid,
          'entType':'0',
          "isInitCode":card_Code
        }
      }).then(function(res) {
        if (res.data.code=='000000') {
          that.bouns=res.data.data.bouns;
          var card_id=res.data.data.card_id;
          var openId=res.data.data.cardOpenId;
          var cardCode=res.data.data.cardCode;
          var mid=res.data.data.mid;
          sessionStorage.setItem('card_id', JSON.stringify(card_id));
          sessionStorage.setItem('openId', JSON.stringify(openId));
          sessionStorage.setItem('mid', JSON.stringify(mid));
          sessionStorage.setItem('cardCode', JSON.stringify(cardCode));
          that.infiniteLoading=true;
        }
      });
    }else if (entType==1) {
      var mid = GetQueryString("mid");
      var code = GetQueryString("code");
      var open_Id=sessionStorage.getItem('openId');
      if (open_Id=="undefined") {
        open_Id="";
      }
      var that = this;
      that.$http({
        method: 'post',
        url: COURSES+'/queryShopMem',
        data: {
          'mid': mid,
          'openCode': code,
          'entType':'1',
          'cardOpenId':JSON.parse(open_Id)
        }
      }).then(function(res) {
        console.log(res);
        
        if (res.data.code === '000000') {
          that.bouns=res.data.data.bouns;
          var card_id=res.data.data.card_id;
          var openId=res.data.data.cardOpenId;
          var cardCode=res.data.data.cardCode;
          var mid=res.data.data.mid;
          sessionStorage.setItem('card_id', JSON.stringify(card_id));
          sessionStorage.setItem('openId', JSON.stringify(openId));
          sessionStorage.setItem('mid', JSON.stringify(mid));
          sessionStorage.setItem('cardCode', JSON.stringify(cardCode));
          that.infiniteLoading=true;
        }else {

        }
      });
    }
},
  methods: {
    //综合和价格
    onItemClick () {
      this.list = [];
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    onItemClick1(){
      this.sort1=false;
      this.sort2=true;
      this.list = [];
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    onItemClick2(){
      this.sort2=false;
      this.sort1=true;
      this.list = [];
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    //点击商品列表
    shopClick:function (id) {
      sessionStorage.setItem('id', JSON.stringify(id));
      this.$router.push({
        path: '/details',
      });
    },
    //兑换记录
    recordClick () {
      this.$router.push({
        path: '/record'
      });
    },
    //点击如何赚积分
    earnClick(){
      let bouns=this.bouns;
      sessionStorage.setItem('bouns', JSON.stringify(bouns));
      this.$router.push({
        path: '/earn'
      });
    },
    //点击返回顶部
    updown:function () {
      document.documentElement.scrollTop=0;
      document.body.scrollTop=0;
    },
    //获取当前滚动条位置
    down:function () {
      this.scroll =document.documentElement.scrollTop || document.body.scrollTop;
      if (this.scroll>20) {
        this.Tops=true
      }else {
        this.Tops=false
      }
      if (this.scroll>139) {
        this.vuxFixed=true
      }else {
        this.vuxFixed=false
      }
    },
    onInfinite() {
      var sorts;
      if (this.sort1==true) {
        sorts="2";
      }else{
        sorts="1"
      }
      var mid=JSON.parse(sessionStorage.getItem('mid'));
      this.$http.post(COURSES+"/queryProductToPhone", {
          mid:mid,
          pagNum: this.list.length / 10 + 1,
          numPerPage:'10',
          sort:sorts
      }).then((res) => {
        setTimeout(() => {
          if (res.data.data.productList.length) {
            this.list = this.list.concat(res.data.data.productList);
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            if (this.list.length == res.data.data.total) {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            }
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        },300);
      });
    },
  },
  mounted() {
    window.addEventListener('scroll', this.down);
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
