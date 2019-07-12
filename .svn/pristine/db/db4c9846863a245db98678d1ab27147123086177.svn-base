<template>
  <div id="app">
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style media="screen">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body,p{
    margin: 0;
  }
  a{
    text-decoration: none;
    color: #999;
  }
  .weui-grid__icon{
    text-align: center;
  }
  .slide-fade-enter-active {
    transition: all .8s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }
</style>
