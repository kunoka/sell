<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <Header :seller="seller"></Header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <!--路由外链-->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/header/header.vue'
const ERR_OK = 0

export default {
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.$http.get('/api/seller').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.seller = response.data
      }
    })
  },
  name: 'app',
  components: {
    Header: Header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  @import "./common/stylus/base.styl"
    .tab
      display:flex
      width: 100%
      height 40px
      line-height: 40px
      //border: 1px solid rgba(7,17,27,0.1)
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size 14px
          /*background-color: yellow*/
          color: rgb(77, 85, 93)
          &.active
            color: red
</style>
