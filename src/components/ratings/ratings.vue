<template>
  <div class="rating" ref="ratings">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <div class="score">{{seller.score}}</div>
          <div class="title">统合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star class="star" :size=36 :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">食物评分</span>
            <star class="star" :size=36 :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="deliver-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @ratingselect="ratingselect" @togglecontent="togglecontent" :initial-select-type="selectType"
                    :desc="desc" :initial-only-content="onlyContent" :ratings="ratings"></ratingselect>
    </div>
    <div class="rating-wrapper">
      <ul>
        <li v-show="needShow(rating.rateType, rating.text)" class="rating-item" v-bind:key="index" v-for="(rating, index) in ratings">
          <div class="avatar">
            <img width="28" height="28px" :src="rating.avatar" alt="">
          </div>
          <div class="content">
            <div class="name">{{rating.username}}</div>
            <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
              <i class="icon-thumb_up"></i>
              <span class="item" v-bind:key="index" v-for="(item, index) in rating.recommend">
                {{item}}
              </span>
            </div>
            <div class="time">{{rating.rateTime|formatDate}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
import BScroll from 'better-scroll'
import {formatDate} from '../../common/js/date'
const ALL = 2
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      selectType: ALL,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      },
      onlyContent: true,
      ratings: []
    }
  },
  created () {
    console.log('seller')
    console.log(this.seller)
    this.$http.get('api/ratings').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.ratings = response.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
    })
  },
  filters: {
    formatDate: function (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    star,
    split,
    ratingselect
  },
  methods: {
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .rating
    position: absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        width 137px
        padding 6px 0
        border-right 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          font-size 24px
          color rgb(255, 153, 0)
          line-height 28px
          margin-bottom 6px
        .title
          font-size 12px
          color rgb(7, 17, 27)
          line-height 12px
          margin-bottom 8px
        .rank
          font-size 10px
          line-height 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display: inline-block
            font-size 12px
            line-height 18px
            vertical-align top
            color rgb(7, 17, 27)
          .star
            display inline-block
            vertical-align top
            margin 0 12px
          .score
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(255, 153, 0)
        .deliver-wrapper
          font-size 0
          .title
            font-size 12px
            color rgb(7, 17, 27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        border-1px(rgba(7,17,27,0.1))
        padding 18px 0
        display flex
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            font-size 10px
            line-height 12px
            color rgb(7,17,27)
            margin-bottom 4px
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
              font-size 10px
              font-weight 200
              color rgb(147,153,159)
              line-height 12px
          .text
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
            margin-bottom 8px
          .recommend
            font-size 0
            .icon-thumb_up, .item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)
            .item
              padding 0 6px
              color rgb(147,153,159)
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              background #fff
              line-height 12px
          .time
            position absolute
            top 0px
            right 0px
            font-size 10px
            font-weight 200
            color rgb(147,153,159)
            line-height 12px
</style>
