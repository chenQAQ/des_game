import Mock from 'mockjs'
//获取拼图房间信息
//get
Mock.mock('/api/puzzle/check?guid=11101&room_id=123456',function () {
  const random=1;
  if(random){
    return {
      userdata:{
        headpic_url:'https://thirdwx.qlogo.cn/mmopen/vi_32/aicg70BU0IJicIdj1KGpPVIhllnmIC8TNJfMhX8xcTI51GJpaNXzy8Gq0drHpibBV3QsWOibkmUYicLd6TZ24bIdtwA/132',
        name:'张学友',
        guid:'11112'
      }
    }
  }else{
    return {
      code:0
    }
  }
});

//获取拼图图片信息
//get
Mock.mock('/api/puzzle/get_img',{
    "src":"/static/imgs/12.jpg",
    "random_data":[0,1,2,3,4,5,6,7,8].sort(function () {
          return 0.5 - Math.random();
        })
});

//选择树苗后，查看对应的奖品是否已经被选完,0:已经被选完,1:没有被选完
//get
Mock.mock('/api/checkPrize',1);

//如果没有被选完，则记录奖品选择人信息
//post
//prize:奖品名称
//activity_id: 活动id
//access_token: access_token
//0:未知错误记录失败,1:记录成功
Mock.mock('/api/getPrize',1);

//离开拼图房间时删除房间号
//post
//room_id:房间id
Mock.mock('/api/puzzle/leave',console.log("删除成功aaaaaaa"));

//获取树苗以及对应的奖品
Mock.mock('/api/choose/getList',[
  {name:"椰子",choose_img:"/static/imgs/coconut3_choose.png",img:"/static/imgs/coconut1.png",level:5,number:100,prize:"我的神经是的但是",prize_img:"/static/img/rank.412521a.png"},
  {name:"草莓",choose_img:"/static/imgs/strawberry3_choose.png",img:"/static/imgs/strawberry1.png",level:5,number:100,prize:"华为125G",prize_img:"/static/img/answer.5b349a7.png"},
  {name:"桃子",choose_img:"/static/imgs/peach3_choose.png",img:"/static/imgs/peach1.png",level:5,number:500,prize:"大碗大苏打的撒旦",prize_img:"/static/img/teampk.122507b.png"},
]);

//获取答题的url以及对应的水滴数
Mock.mock('/api/farm/getSubject',
  [
  {title:"技能学习",water:'61',number:'12',isOk:false},
  {title:"技能学习",water:'161',number:'22',isOk:true},
  {title:"技能学习",water:'561',number:'2',isOk:false},
  {title:"技能学习",water:'611',number:'42',isOk:true},
  {title:"技能学习",water:'621',number:'12',isOk:false},
  {title:"技能学习",water:'361',number:'22',isOk:true},
  {title:"技能学习",water:'651',number:'52',isOk:false},
]);


//离开农场时将水滴数以及当前进度条记录下来
//post
//access_token: access_token
//activity_id:活动id
//water:水滴数
//progress:当前进度
Mock.mock('/api/farm/leave',console.log("保存记录成功aaaaaaa"));

//完成所有答题
//post
//access_token: access_token
//activity_id:活动id
//prize:奖品名称
Mock.mock('/api/farm/success',console.log("牛逼"));


Mock.setup({
    timeout: '200-600'
})
