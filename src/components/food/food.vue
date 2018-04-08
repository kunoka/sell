<template>
  <transition name="food">
    <div v-show="showFlag" class="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
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
    &.food-enter-active,.food-leave-active
      transition all 0.2s linear
      transform translate3d(0,0,0)
    &.food-enter,&.food-leave-to
      transform translate3d(100%,0,0)
</style>
