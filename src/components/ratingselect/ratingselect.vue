<template>
  <div class="ratingselect border-1px">
    <div class="rating-type">
      <span @click="select(2, $event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0, $event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1, $event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch" @click="toggleSwitch">
      <span class="icon-check_circle" :class="{'on': onlyContent}"></span><span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0
const NEGATIVE = 1

export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    initialSelectType: {
      type: Number
    },
    initialOnlyContent: {
      type: Boolean
    },
    desc: {
      type: Object,
      default () {
        return {
          positive: '满意',
          negative: '不满意',
          all: '全部'
        }
      }
    }
  },
  data () {
    return {
      selectType: this.initialSelectType,
      onlyContent: this.initialOnlyContent
    }
  },
  computed: {
    positives () {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE
      })
    },
    negative () {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type, event) {
      this.selectType = type
      this.$emit('ratngselect.select', type)
    },
    toggleSwitch (event) {
      this.onlyContent = !this.onlyContent
    }
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        line-height 16px
        border-radius 1px
        font-size 12px
        color rgb(77,85,93)
        margin-right 8px
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background rgb(0,160,220,0)
        &.negative
          background rgba(77,85,93,0.2)
          &.active
            background rgb(77,85,93)

    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      .icon-check_circle
        display inline-block
        vertical-align top
        font-size 24px
        margin-right 4px
        &.on
          color #00c850
      .text
        display inline-block
        font-size 12px
        vertical-align top
</style>
