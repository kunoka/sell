<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart"></i>
              <div class="cart-icon" :class="{'highlight': totalCount>0}">
                <i class="icon-shopping_cart"></i>
              </div>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
          <div :key="key" v-for="(ball, key) in balls" v-show="ball.show" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <span class="title">购物车</span>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li v-bind:key="index" v-for="(food, index) in selectFoods" class="food" >
                <span class="name">{{food.name}}</span>
                <span class="price">￥{{food.price*food.count}}</span>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
export default {
  props: {
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    }
  },
  created () {
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '请结算'
      }
    },
    payClass () {
      if (this.totalPrice >= this.minPrice) {
        return 'enough'
      } else {
        return 'not-enough'
      }
    },
    listShow () {
      var scroll
      if (!this.totalCount) {
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!scroll) {
            scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter (el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.display = ''
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = `translate3d(0,0,0)`
        inner.style.transform = `translate3d(0,0,0)`
      })
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideList () {
      this.fold = true
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    }
  },
  components: {
    cartcontrol
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    height 48px
    width 100%
    .content
      display flex
      height 48px
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          background #141d27
          top -10px
          margin 0 12px
          padding 6px
          border-radius 50%
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            &.highlight
              background rgb(0, 160, 220)
            .icon-shoping_cart
              font-size 24px
              color #80858a
              line-height 44px
            .cart-icon
              position relative
              height 24px
              width 24px
              font-size 24px
              margin 0 auto
              margin-top 25%
              z-index 999
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-enter-active, &.drop-leave-active
          transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0,160,220)
            transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top  0
      width 100%
      z-index -1
      background #fff
      transform translate3d(0,-100%,0)
      &.fold-enter-active,&.fold-leave-active
        transition all 0.5s
      &.fold-enter,&.fold-leave-to
        transform translate3d(0,0,0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-1px(rgba(7,17,27,0.1))
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
          font-weight 300
        .empty
          float: right
          font-size 12px
          color rgb(0,160,220)
          font-weight 300
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            color rgb(240,20,20)
            font-weight 700
          .cartcontrol-wrapper
            position absolute
            right 0px
            bottom  6px
  .list-mask
    position fixed
    left 0
    top 0
    height 100%
    width 100%
    z-index 40
    filter blur(10px)
    background rgba(7,17,27,0.6)
    &.fade-enter-active,&.fade-leave-active
      transition: all .5s linear
    &.fade-enter,&.fade-leave-to
      opacity 0
</style>
