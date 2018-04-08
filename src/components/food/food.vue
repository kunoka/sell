<template>
  <transition name="food">
    <div v-show="showFlag" class="food" ref="fooddetail">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div @click="hide" class="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="title">{{food.name}}</div>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
          </div>
          <price :food="food"></price>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div class="buy"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import price from '../subcomponents/price/price.vue'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
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
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.fooddetail, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    }
  },
  components: {
    price,
    cartcontrol
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
    .content
      padding 18px
      .title
        font-size 14px
        font-weight 700
        line-height 14px
        margin-bottom 8px
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        height 14px
        line-height 14px
        font-size 0px
        .sell-count, .rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
</style>
