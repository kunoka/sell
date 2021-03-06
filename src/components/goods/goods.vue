<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" :class="{'current' : currentIndex === index}" v-bind:key="item.name" v-for="(item, index) in goods" @click="clickMenu(index, $event)">
        <span class="text border-1px">
          <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
        </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li :key="item.name" v-for="item in goods" class="food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food, $event)" v-bind:key="food.name" v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <price :food="food"></price>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart-add="ievent"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectedFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food ref="food" :food="selectedFood" @cart-add="ievent"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
import price from '../subcomponents/price/price.vue'

const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      let currentHeight = this.scrollY
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (currentHeight >= height1 && currentHeight < height2)) {
          return i
        }
      }
      return 0
    },
    selectedFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('api/goods').then((response) => {
      if (response.body.errno === ERR_OK) {
        this.goods = response.body.data
        // 保证DOM渲染后再操作DOM
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    ievent (event) {
      this._drop(event)
    },
    _drop (target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    _initScroll () {
      // 使自定义的点击事件可以执行
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      // probeType:3 监测滚动
      this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.floor(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let foodHeight = foodList[i].clientHeight
        height += foodHeight
        this.listHeight.push(height)
      }
    },
    clickMenu (index, event) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      // 滚动到对应的DOM节点
      this.foodScroll.scrollToElement(el, 300)
    },
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food._show()
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food,
    price
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display flex
    position absolute
    width 100%
    top 174px
    bottom 46px
    overflow hidden
    .menu-wrapper
      flex 0 0 auto
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        font-size 14px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          z-index 10px
          margin-top: -1px
          background #fff
          font-weight 700
          color: blue
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align: middle;
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex 1
      .title
        height 26px
        line-height 26px
        padding-left 14px
        border-left 2px solid #d9dde1
        color rgb(147, 153, 159)
        background-color #f3f5f7
        font-size 12px
      .food-item
        display flex
        margin: 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          padding-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            .count
              margin-right 12px
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
