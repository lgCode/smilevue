const Router = require("koa-router");
const mongoose = require('mongoose');
const fs = require('fs');

let router = new Router();
//所有商品信息
router.get('/insertAllGoodsInfo', async (ctx) => {
  fs.readFile('./data_json/newGoods.json', 'utf8', (err, data) => {
    data = JSON.parse(data);
    let saveCount = 0;
    const Goods = mongoose.model("Goods");
    data.map((value, index) => {
      console.log(value);
      let newGoods = new Goods(value);
      newGoods.save().then(() => {
        saveCount++;
        console.log('成功' + saveCount);
      }).catch(err => {
        console.log(err);
      })
    });
  });
  ctx.body = "开始导入数据";
});
//所有商品大类
router.get("/insertAllCategory", async (ctx) => {
  fs.readFile('./data_json/category.json', 'utf8', (err, data) => {
    data = JSON.parse(data);
    let saveCount = 0;
    const Category = mongoose.model('Category');
    data.RECORDS.map((value, index) => {
      console.log(value);
      let newCategory = new Category(value); //Category模型

      newCategory.save().then(() => {
        saveCount++;
        console.log(`插入成功 ${saveCount}`);
      }).catch(err => {
        console.log('插入失败' + err);
      })
    })
  })
  ctx.body = "开始导入数据";
});
//所有商品子类
router.get("/insertAllCategorySub", async (ctx) => {
  fs.readFile('./data_json/category_sub.json', 'utf8', (err, data) => {
    data = JSON.parse(data);
    let saveCount = 0;
    const CategorySub = mongoose.model('CategorySub'); //引入模型

    data.RECORDS.map((value, index) => {
      console.log(value);
      let newCategorySub = new CategorySub(value);
      newCategorySub.save().then(() => { //插入数据库
        saveCount++;
        console.log(`插入成功:${saveCount}`);
      }).catch(err => {
        console.log(`插入失败!` + err);
      })
    })
  })
  ctx.body = "开始导入数据";
});
// ****获取商品详情信息的接口
router.post('/getDetailGoodsInfo', async (ctx) => {
  try {
    let goodsId = ctx.request.body.goodsId;
    const Goods = mongoose.model('Goods');
    let result = await Goods.findOne({
      ID: goodsId
    }).exec();
    ctx.body = {
      code: 200,
      message: result
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      message: result
    };
  }


});
// ****读取大类数据的接口
router.get('/getCategoryList',async(ctx) => {
  try{
    const Category = mongoose.model("Category");
    let result = await Category.find().exec();
    ctx.body = {
      code:200,
      message:result
    }
  }catch(err){
    ctx.body={code:500,message:err};
  }
});
// *****读取小类数据的接口
router.post('/getCategorySubList',async(ctx)=>{
    try {
      let categoryId = ctx.request.body.categoryId ;
      // let categoryId = 1 ;
      const CategorySub = mongoose.model('CategorySub');
      let result = await CategorySub.find({ MALL_CATEGORY_ID:categoryId }).exec();
      ctx.body = {code:200,message:result}
    }catch(err){
      ctx.body ={code:500,message:err};
    }
})
// ****根据类别获取商品列表
router.post('/getGoodsListByCategorySubID',async(ctx) => {
  try {
    let categorySubId = ctx.request.body.categorySubId;//子类别Id
    let page = ctx.request.body.page;//当前页数
    let num =10;//每页显示数量
    let start = (page - 1) * num;
    //  let categorySubId = '2c9f6c946016ea9b016016f79c8e0000';

     const Goods = mongoose.model('Goods');
     let result =await Goods.find({SUB_ID:categorySubId}).skip(start).limit(num).exec();//跳过start数量,limit每页显示数据
     ctx.body = {code:200,message: result};
  }catch(err) {
    ctx.body={code:500,message:err};
  }
})


module.exports = router;
