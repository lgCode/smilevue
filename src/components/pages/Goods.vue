<template>
  <div>
    <div class="navbar-div">
      <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="topimage-div">
      <img :src="goodsInfo.IMAGE1" width="100%" alt="">
    </div>
    <div class="goods-name"> {{goodsInfo.NAME}} </div>
    <div class="goods-price"> 价格：￥{{goodsInfo.PRESENT_PRICE | moneyFilter}} 元</div>
    <div>
      <van-tabs sticky swipeable>
        <van-tab title='商品详情'>
          <div v-html="goodsInfo.DETAIL" class="detail"></div>
        </van-tab>
        <van-tab title='评论'>
          评论
        </van-tab>
      </van-tabs>
    </div>

    <div class="goods-bottom">
      <div>
        <van-button size="large" type="primary" @click="addGoodsToCart">加入购物车</van-button>
      </div>
      <div>
        <van-button size="large" type="danger">直接购买</van-button>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import url from '@/serviceAPI.config.js';
  import {
    Toast
  } from 'vant';
  import {
    toMoney
  } from '@/filter/moneyFilter.js';
  export default {
    data() {
      return {
        goodsId: '',
        goodsInfo: {}, //商品详细信息
      }
    },
    methods: {
      //获取商品信息
      getInfo() {
        axios({
            url: url.getDetailGoodsInfo,
            method: 'post',
            data: {
              goodsId: this.goodsId
            }
          })
          .then(res => {
            if (res.data.code === 200 && res.data.message) {
              this.goodsInfo = res.data.message;
            } else {
              Toast('服务器错误，数据获取失败!');
            }
            // console.log(this.goodsInfo);
          })
          .catch(err => {
            console.log(err);
          })
      },
      onClickLeft() {
        this.$router.go(-1);
      },
      //加入购物车
      addGoodsToCart(){
        //取出购物车中的商品
        // localStorage.removeItem('cartInfo');
        let cartInfo = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : [];
        //判断购物车内是否已经有这个商品
        //如果没有返回undeifnd，如果有返回第一个查找到的数据
        let isHaveGoods = cartInfo.find(cart => cart.goodsId == this.goodsId);
        // console.log(isHaveGoods);
        if(!isHaveGoods) {
           //没有商品直接添加到数组中
          //重新组成添加到购物车的信息
          let newGoodsInfo = {
            goodsId:this.goodsInfo.ID,
            name:this.goodsInfo.NAME,
            price:this.goodsInfo.PRESENT_PRICE,
            image:this.goodsInfo.IMAGE1,
            count:1
          }
          cartInfo.push(newGoodsInfo);
          localStorage.cartInfo = JSON.stringify(cartInfo);
          Toast.success('添加成功!')
        }else{
          Toast.success('已有此商品!')
        }
        this.$router.push({name:'Cart'});
      }
    },
    created() {
      this.goodsId = this.$route.query.goodsId ? this.$route.query.goodsId : this.$route.params.goodsId ;
      //   console.log(this.goodsId);
      this.getInfo();
    },
    filters: {
      moneyFilter(money) {
        return toMoney(money);
      }
    }
  }

</script>

<style scoped>
  .goods-name {
    background-color: #fff;
  }

  .goods-price {
    background-color: #fff;
  }

  .detail {
    font-size: 0px;
  }

  .goods-bottom {
    position: fixed;
    bottom: 0px;
    left: 0px;
    background-color: #FFF;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-flow: nowrap;
  }

  .goods-bottom>div {
    flex: 1;
    padding: 5px;
  }

</style>
