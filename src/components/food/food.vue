<template>
  <transition name="food">
    <div v-show="showFlag" class="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div @click="hide" class="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="name">{{food.name}}</div>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    _show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.food-enter-active,&.food-leave-active
      transition all 0.2s linear
      transform translate3d(0,0,0)
    &.food-enter,&.food-leave-to
      transform translate3d(100%,0,0)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      /* padding-top是根据width计算的 */
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
    .back
      position absolute
      top 10px
      left 0
      .icon-arrow_lift
        display block
        font-size 20px
        padding 10px
        color #fff
</style>
