<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <Header></Header>
    <div class="tab">
      <div class="tab-item">商品</div>
      <div class="tab-item">评论</div>
      <div class="tab-item">商家</div>
    </div>
    <div>I am content</div>
    <!--<Hello></Hello>-->
  </div>
</template>

<script>
import Header from './components/header/header.vue'

export default {
  name: 'App',
  components: {
    Header: Header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    .tab
      display:flex
      width: 100%
      height 40px
      line-height: 40px
      .tab-item
        flex: 1
        text-align: center
</style>
