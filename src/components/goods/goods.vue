<template>
<div class="goods">
  <div class="menu-wrapper">
    <ul>
      <li :key="item.id" v-for="item in goods">
        <span class="text">
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]">{{item.name}}</span>
        </span>
      </li>
    </ul>
  </div>
  <div class="foods-wrapper"></div>
</div>
</template>

<script type="text/ecmascript-6">
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object()
    }
  },
  data() {
    return {
      goods: []
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('api/goods').then((response) => {
      if (response.body.errno === ERR_OK) {
        this.goods = response.body.data
        console.log('this.goods')
        console.log(this.goods)
      }
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.goods
  position absolute
  display flex
  width 100%
  top 176px
  bottom 46px
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
  .foods-wrapper
    flex 1
</style>
