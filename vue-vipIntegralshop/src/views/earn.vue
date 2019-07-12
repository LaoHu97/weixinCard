<template lang="html">
<div class="text-center">
  <div>
    <p style="font-weight:bold">当前积分：{{bouns}}</p>
  </div>
  <div>
    <p>积分规则：<br />① 领取+激活会员卡送100积分<br />② 每消费一元获取一积分</p>
  </div>
</div>
</template>

<script>
export default {
  components: {
 },
 data () {
    return {
      bouns:''
    }

  },
 methods: {

},
mounted() {
  this.bouns=JSON.parse(sessionStorage.getItem('bouns'))
}
}
</script>

<style lang="css">
.text-center{
  text-align: left;
  margin-top: 20px;
}
.text-center div p{
  line-height: 65px;
  background-color: #efefef;
  margin-top: 15px;
}
p{
  margin: 0;
  padding-left: 15px;
}
</style>
