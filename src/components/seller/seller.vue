<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}元</span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}元</span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}分钟</span>
            </div>
          </li>
        </ul>
        <div class="favorite">
          <span @click="toggleFavorite" class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" :key="key" v-for="(item,key) in seller.supports">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-bind:key="index" v-for="(pic,index) in seller.pics">
              <img :src="pic" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li v-bind:key="index" v-for="(info, index) in seller.infos" class="info-item">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import star from '../../components/star/star.vue'
import split from '../../components/split/split'
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from '../../common/js/store'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', true)
      })()
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    toggleFavorite () {
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.seller, {
      click: true
    })
    // setup pic-wrapper width
    if (this.seller.pics) {
      let picWidth = 120
      let margin = 6
      let newWidth = (picWidth + margin) * (this.seller.pics.length) - margin
      console.log('newWidth', newWidth)
      this.$refs.picList.style.width = newWidth + 'px'
      console.log(this.$refs.picList.style.width)
      this.$nextTick(() => {
        this.picScroll = new BScroll(this.$refs.picWrapper, {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      })
    }
  },
  components: {
    star,
    split
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      position relative
      padding 18px
      .title
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
        margin-bottom 8px
      .desc
        padding-bottom 18px
        height 18px
        border-1px(rgba(7,17,27,0.1))
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          display inline-block
          font-size 10px
          line-height 18px
          color rgb(77,85,93)
          vertical-align top
          margin-right 12px
      .remark
        display flex
        padding 18px 0 0 0
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7,17,27,0.1)
          &:last-child
            border none
          h2
            font-size  10px
            line-height 10px
            color rgb(147,153,159)
            margin-bottom 4px
          .content
            font-size 10px
            font-weight 200
            line-height 24px
            color rgb(7,17,27)
            .stress
              font-size 24px
      .favorite
        position absolute
        right 5px
        top 18px
        width 50px
        text-align center
        .icon-favorite
          display block
          font-size 24px
          line-height 24px
          color: #d4d6d9
          margin-bottom 4px
          &.active
            color rgb(240,20,20)
        .text
          display block
          font-size 10px
          line-height 10px
          color rgb(77,85,93)
    .bulletin
      padding 18px 18px 0 18px
      .title
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
        margin-bottom 8px
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          font-size 12px
          line-height 24px
          color rgb(240,20,20)
          font-weight 200
      .supports
        .support-item
          display block
          padding 16px 12px
          border-1px rgba(7,17,27,0.1)
          font-size 0
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            margin-right 4px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            width 300px
            font-size 12px
            line-height 16px
            color rgb(27,17,27)
            font-weight 200
          &:last-child
            border-none()
    .pics
      padding 18px
      .title
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
        margin-bottom 12px
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0px
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0
            img
              width 120px
              height 90px
    .info
      padding 18px 18px 0 18px
      color rgb(7,17,27)
      .title
        font-size 14px
        line-height 14px
        padding-bottom 12px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        font-size 12px
        line-height 16px
        font-weight 200
        padding 16px 12px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
</style>
