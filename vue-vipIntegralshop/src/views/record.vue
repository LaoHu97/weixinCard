<template lang="html">
  <div>
    <div style="height:44px;">
      <sticky :check-sticky-support="false">
        <tab :line-width="1">
          <tab-item selected  @on-item-click="onItemClick">收入</tab-item>
          <tab-item  @on-item-click="onItemClick">支出</tab-item>
        </tab>
      </sticky>
    </div>
    <div class="list">
      <ul style="margin:0;">
        <li v-for="item in list">
          <span>{{item.comments}}</span>
          <div>{{item.bouns}}</div>
          <p>{{trans_date_format(item.trans_date)}}</p>
        </li>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="spiral">
          <span slot="no-results">
            暂无积分明细 :(
          </span>
          <span slot="no-more">
            没有明细了 :(
          </span>
        </infinite-loading>
      </ul>
    </div>
  </div>
</template>

<script>
import util from '../assets/js/util.js'
import InfiniteLoading from 'vue-infinite-loading';
import { Tab, TabItem, Sticky, FormPreview } from 'vux'
export default {
  components: {
   Tab,
   TabItem,
   Sticky,
   FormPreview,
   InfiniteLoading,
 },
 data () {
    return {
      list: [],
      type:0
    }
  },
 methods: {
  trans_date_format(date){
    return util.formatDate.format(new Date(date), 'yyyy-MM-dd')
  },
  onItemClick (index) {
    this.type=index;
    this.list = [];
    this.$nextTick(() => {
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
    });
  },
  onInfinite() {
    var trans_type;
    if (this.type==0) {
      trans_type="OUT"
    }else if (this.type==1) {
      trans_type="IN"
    }
    this.$http.post(COURSES+"/queryBounsItems", {
        card_id:JSON.parse(sessionStorage.getItem('card_id')),
        openId:JSON.parse(sessionStorage.getItem('openId')),
        pagNum: this.list.length / 10 + 1,
        numPerPage:'10',
        trans_type:trans_type,
        mid:JSON.parse(sessionStorage.getItem('mid'))
    }).then((res) => {
      setTimeout(() => {
        if (res.data.data.bounstList.length) {
          this.list = this.list.concat(res.data.data.bounstList);
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

}
}
</script>

<style lang="css">
.list ul{
  list-style: none;
  padding: 0;
}
.list ul li{
  height: 65px;
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
　margin: 0;
  text-align:left;
}
.list ul li span{
  display: inline-block;
  padding: 15px 0 0 15px;
}
.list ul li p{
  margin: 0;
  font-size: 12px;
  padding: 10px 0 0 15px;
  color: #999;
}
.list ul li div{
  display: inline-block;
  float: right;
  line-height: 65px;
  padding-right: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #ff9900;
}
</style>
