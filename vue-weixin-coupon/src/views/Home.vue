<style scoped>
.cards_list_view {
  margin-top: 20px;
  color: #fff;
}
.cards_list {
  border-radius: 10px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  width: 300px;
  height: 100px;
  position: relative;
  background: radial-gradient(circle at right top, transparent 10px, #0081ff 0)
      top left / 90px 51% no-repeat,
    radial-gradient(circle at right bottom, transparent 10px, #0081ff 0) bottom
      left / 90px 51% no-repeat,
    radial-gradient(circle at left top, transparent 10px, #0081ff 0) top right /
      210px 51% no-repeat,
    radial-gradient(circle at left bottom, transparent 10px, #0081ff 0) bottom
      right / 210px 51% no-repeat;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
}

.cards_list::after {
  content: "";
  height: 80px;
  border: 1px dashed #fff;
  position: absolute;
  left: 90px;
  top: 0;
  bottom: 0;
  margin: auto;
}
.card_left_view {
  width: 90px;
  text-align: center;
}
.card_left_view_num {
  font-size: 24px;
}
.card_right_view {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  width: 190px;
  align-items: center;
}
.card_right_view_text_top {
  font-size: 16px;
}
.card_right_view_text_bot {
  color: #fff;
  opacity: 0.6;
  font-size: 12px;
}
.card_right_view_text {
  width: 120px;
}
</style>

<template>
  <div>
    <van-tabs color="#0081ff">
      <van-tab title="计次卡">
        <van-list
          v-model="numberLoading"
          :finished="numberFinished"
          finished-text="没有更多了"
          @load="numberOnLoad"
        >
          <div class="cards_list_view" v-for="(item, index) in numberList" v-bind:key="index">
            <div class="cards_list">
              <div class="card_left_view">
                <span class="card_left_view_num">{{item.surplus_total}}</span>
                次
              </div>
              <div class="card_right_view">
                <div class="card_right_view_text">
                  <div class="card_right_view_text_top">{{item.card_name}}</div>
                  <div class="card_right_view_text_bot">派发于{{formatterTime(item.creat_time)}}</div>
                </div>
                <van-button
                  plain
                  round
                  type="default"
                  size="small"
                  @click="numberCardClick(item)"
                >立即使用</van-button>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="优惠券">
        <van-list
          v-model="couponLoading"
          :finished="couponFinished"
          finished-text="没有更多了"
          @load="couponOnLoad"
        >
          <div class="cards_list_view" v-for="(item, index) in couponList" v-bind:key="index">
            <div class="cards_list">
              <div class="card_left_view">
                <span class="card_left_view_num" style="font-size: 16px">{{item.title}}</span>
              </div>
              <div class="card_right_view">
                <div class="card_right_view_text">
                  <!-- <div class="card_right_view_text_top">12321321</div> -->
                  <div
                    class="card_right_view_text_bot"
                    v-if="item.date_info === '1'"
                  >{{formatterTime(item.begin_time)}}至{{formatterTime(item.end_time)}}</div>
                  <div
                    class="card_right_view_text_bot"
                    v-else
                  >自领取{{item.fixed_begin_term}}日起{{item.fixed_term}}天内有效</div>
                </div>
                <van-button
                  plain
                  round
                  type="default"
                  size="small"
                  @click="couponCardClick(item)"
                >立即使用</van-button>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  queryFreCardList,
  queryCouponList,
  getJsInitConfig
} from "@/api/index";
import { parseTime, getQueryString } from "@/utils/util";
import { wxOpenCard, wxConfig } from "@/utils/weixin-js-sdk";

export default {
  data() {
    return {
      numberList: [],
      numberPageNum: 1,
      numberLoading: false,
      numberFinished: false,

      couponList: [],
      couponPageNum: 1,
      couponLoading: false,
      couponFinished: false
    };
  },
  methods: {
    formatterTime(e) {
      return parseTime(e);
    },
    couponCardClick(e) {
      let para = new Array({ cardId: e.card_id, code: e.code });
      wxOpenCard(para)
        .then(res => {
          console.log("打開卡券成功", res);
        })
        .catch(err => {
          console.log("打開卡券失敗", err);
        });
    },
    numberCardClick(e) {
      this.$router.push({
        path: "numbercard",
        query: { card_id: e.card_id, code: e.code }
      });
    },
    couponOnLoad() {
      // 异步更新数据
      let para = {
        mid: getQueryString("mid"),
        cardId: getQueryString("card_id"),
        openid: getQueryString("openid"),
        pageNum: this.couponPageNum,
        numPerPage: 10
      };
      queryCouponList(para).then(res => {
        this.couponList = this.couponList.concat(res.data.wdrCouponList);
        if (this.couponList.length === res.data.total) {
          this.couponFinished = true;
        }
        this.couponPageNum += 1;
        this.couponLoading = false;
      });
    },
    numberOnLoad() {
      // 异步更新数据
      let para = {
        mid: getQueryString("mid"),
        openid: getQueryString("openid"),
        pageNum: this.numberPageNum,
        numPerPage: 10
      };
      queryFreCardList(para).then(res => {
        this.numberList = this.numberList.concat(res.data.wdRFList);
        if (this.numberList.length === res.data.total) {
          this.numberFinished = true;
        }
        this.numberPageNum += 1;
        this.numberLoading = false;
      });
    },
    getWeixinConfig() {
      let para = {
        mid: getQueryString("mid"),
        url: window.location.href.split("#")[0]
      };
      getJsInitConfig(para).then(res => {
        const config = {
          debug: true,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.noncestr,
          signature: res.data.configSign
        };
        wxConfig(config);
      });
    }
  },
  created() {
    this.getWeixinConfig();
    // this.numberCardClick()
  }
};
</script>
