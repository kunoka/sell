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
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <price :food="food"></price>
          <div class="cartcontrol-wrapper" v-show="food.count">
            <cartcontrol :food="food" @cart-add="ievent"></cartcontrol>
          </div>
          <div @click="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @ratingselect="ratingselect" @togglecontent="togglecontent" :initial-select-type="selectType" :desc="desc" :initial-only-content="onlyContent" :ratings="food.ratings"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" class="rating-item" v-bind:key="rating.username" v-for="rating in food.ratings">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>
                {{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import BScroll from 'better-scroll'
import price from '../subcomponents/price/price.vue'
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {formatDate} from '../../common/js/date'
const ALL = 2
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'

      }
    }
  },
  methods: {
    ievent (event) {
      console.log('--------')
      console.log(event)
      this._drop(event)
    },
    _drop (target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$parent.$refs.shopcart.drop(target)
      })
    },
    _show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
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
    },
    addFirst (event) {
      console.log('click')
      console.log(event)
      if (!event._constructed) {
        return
      }
      this.$emit('cart-add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      }
      return type === this.selectType
    },
    ratingselect (type) {
      console.log('type', type)
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    togglecontent (toggle) {
      this.onlyContent = toggle
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  components: {
    price,
    cartcontrol,
    ratingselect,
    split
  },
  filters: {
    formatDate: function (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
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
      position relative
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
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        padding 0 12px
        border-radius 12px
        height 24px
        line-height 24px
        color #fff
        background rgb(0,160,220)
        z-index 10
        font-size 10px
        box-sizing border-box
    .info
      padding 18px
      .title
        line-height 14px
        font-size 14px
        margin-bottom 6px
        color rgb(7,17,27)
      .text
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
        line-height 24px
    .rating
      padding-top 18px
      .title
        line-height 14px
        font-size 14px
        margin-left 18px
        color rgb(7,17,27)
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position absolute
          right 0
          top 16px
          line-height 12px
          font-size 0
          .name
            display inline-block
            margin-right 6px
            vertical-align top
            font-size 10px
            color rgb(147,153,159)
          .avatar
            border-radius 50%
        .time
          margin-bottom 6px
          font-size 10px
          color rgb(147,153,159)
          line-height 12px
        .text
          font-size 12px
          line-height 16px
          color rgb(7,17,27)
          .icon-thumb_up, .icon-thumb_down
            margin-right 4px
            line-height 16px
            font-size 12px
          .icon-thumb_up
            color rgb(0,160,220)
          .icon-thumb_down
            color rgb(147,153,159)
            line-height 24px
      .no-rating
        padding 16px 0
        font-size 12px
</style>
