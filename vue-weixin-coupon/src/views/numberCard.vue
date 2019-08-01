<style scoped>
/* pages/cardListDetails/cardListDetails.wxss */
.card_view_top {
  height: 250px;
  background: #fff;
  border-radius: 10px;
  margin: 10px;
}
.card_view_top_top {
  height: 70px;
  background: #0081ff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.van-tag--mark {
  border-radius: 0.8em 0 0 0.8em!important;
}
.card_view_top_main {
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.card_view_top_main_avatar {
  margin-top: -50px;
}
.card_view_top_main_title {
  font-size: 16px;
  font-weight: bolder;
}
.cell_value {
  color: #f44;
}
.dialog_stepper{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border: 1px solid #999;
}
.dialog_img{
  width: 200px;
  height: 200px;
  margin: 0 auto;
  padding: 20px;
}
.dialog_img image {
  width: 100%;
  height: 100%;
}
.detail_card{
  padding: 10px;
  background: #fff;
}
.code_text{
  text-align: center;
  margin-bottom: 10px;
}
</style>

<template>
  <div>
    <div class="card_view_top">
      <div class="card_view_top_top">
        <van-tag size="large" custom-class="tag_custom" mark>转赠</van-tag>
      </div>
      <div class="card_view_top_main">
        <van-image
          width="80"
          height="80"
          round
          class="card_view_top_main_avatar"
          :src="cardDetails.avatarUrl"
        />
        <div class="card_view_top_main_title">{{cardDetails.coupon_name}}</div>
        <div class="card_view_top_main_yue">剩余：{{cardDetails.surplus_total}}次</div>
        <van-button round type="info" size="normal" @click="useCardClick">立即使用</van-button>
      </div>
    </div>
    <van-tabs color="#0081ff">
      <van-tab title="使用记录">
        <van-list
          v-model="recordLoading"
          :finished="recordFinished"
          finished-text="没有更多了"
          @load="recordOnLoad"
        >
          <van-cell v-for="(item, index) in recordList" v-bind:key="index" :title="formatterTime(item.creat_time)" :value="item.tran_type === 'ADD' ? '增加' : '消费' + item.use_total + '次'" :label="`剩余${item.surplus_total}次`" value-class="cell_value" />
        </van-list>
      </van-tab>
      <van-tab title="查看详情">
        <div class="detail_card">一天可以使用{{cardDetails.numDay}}次</div>
        <div class="detail_card">一次可以核销{{cardDetails.numWriteOff}}次</div>
      </van-tab>
    </van-tabs>
    <van-dialog
      v-model="qrCodeShow"
      @confirm="qrCodeDialogConfirm"
    >
      <div>
        <div class="dialog_stepper">
          <span>使用次数：</span>
          <van-stepper v-model="stepperValue" integer disable-input @change="onStepperChange" />
        </div>
      </div>
      <div class="dialog_img" bindtap="bindTapQrCode">
        <van-image :src="qrCodeUrl"/>
      </div>
      <div class='code_text'>Code码：{{mdCode}}</div>
    </van-dialog>
  </div>
</template>
<script>
// @ is an alias to /src
import { queryFrequencyDetail, queryFreTransList, generateQRCode } from "@/api/index";
import { parseTime, getQueryString } from "@/utils/util"

export default {
  data() {
    return {
      cardDetails: {
        avatarUrl: ''
      },

      pageNum: 1,
      recordList: [],
      recordLoading: false,
      recordFinished: false,

      qrCodeShow: false,
      stepperValue: 1,
      qrCodeUrl: '',
      mdCode: ''
    };
  },
  created() {
    this.getNumberCardDetail();
  },
  methods: {
    formatterTime(e){
      return parseTime(e)
    },
    qrCodeDialogConfirm() {
      this.pageNum = 1;
      this.recordList = []
      this.recordOnLoad()
      this.getNumberCardDetail()
    },
    onStepperChange() {
      this.getQrCode()
    },
    useCardClick() {
      this.qrCodeShow = true
      this.$nextTick(() => {
        this.stepperValue = 1
        this.getQrCode()
      })
    },
    getQrCode(){
      let para = {
        mid: getQueryString('mid'),
        openid: getQueryString('openid'),
        card_id: this.$route.query.card_id,
        code: this.$route.query.code,
        frequency: this.stepperValue
      };
      generateQRCode(para).then(res => {
      this.qrCodeUrl= `data:image/jpeg;base64,${res.data.encode}`
      this.mdCode= res.data.mdCode
      })
    },
    recordOnLoad() {
      let para = {
        mid: getQueryString('mid'),
        openid: getQueryString('openid'),
        card_id: this.$route.query.card_id,
        code: this.$route.query.code,
        pageNum: this.pageNum,
        numPerPage: 10
      };
      queryFreTransList(para).then(res => {
        this.recordList = this.recordList.concat(res.data.wdRFList);
        if (this.recordList.length === res.data.total) {
          this.recordFinished = true;
        }
        this.pageNum += 1;
        this.recordLoading = false;
      });
    },
    getNumberCardDetail() {
      let para = {
        openid: getQueryString('openid'),
        card_id: this.$route.query.card_id,
        code: this.$route.query.code
      };
      queryFrequencyDetail(para).then(res => {
        this.cardDetails = res.data.wdFreCard;
      });
    }
  }
};
</script>