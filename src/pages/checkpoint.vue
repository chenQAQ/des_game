<template>

  <div id="checkpoint">  
    <div :class="className.container + ' container-check'"  style="height:100%;" >
      <template v-for="(item,index) in activitydata.must_blockade" >
        <div :key="index" class="pass-list" v-if="activitydata.must_blockade.length >= 1 && ((showTypeOne && item.checktype == 1) || (!showTypeOne && item.checktype == 2))" @click="gpPage(index)">
          <span class="spanArex">{{item.must_blockade_name}}</span>
        </div>
      </template>
      
    </div> 
    <div class="check-footer" style="display:none;">
      <div class="selfinfo">
          <div class="selfinfo-left">
            <img :src="userdata.headpic_url" alt>
            <p>
              <span
                :class="userdata.user_id==0 || userdata.department_name==''?'no-depart':''"
              >{{userdata.name}}</span>
              <span
                class="department"
                v-if="userdata.user_id!=0 && userdata.department_name!=''"
              >{{userdata.department_name}}</span>
            </p>
          </div>
          <div class="selfinfo-right">
            <p :class="userdata.user_id==0 || userdata.is_blockade_success!=1?'no-level':''">
              <img  src="../imgs/gold.png" alt="">
              <span class="other" v-if="userdata.user_id!=0">知识币：{{userdata.knowledge_money}}</span>
             
            </p>
          </div>
        </div>
    </div>
  </div>

   <!-- <div class="pass">
    <div class="pass-wrap">
        <div class="pass-desc">
        <p class="title">必答关卡说明</p>
        <p class="content">1、按下列关卡排序依次进入答题，毎完成一关即可开启下一关，直至完成所有关卡后，方可开启闯关与pk模块；</p>
        <p class="content">2、每关答题数、答题时间及允许答错次数以活动创建者设置为准。</p>
      </div>
      <ul class="pass-list">
        <li v-for="(item,index) in activitydata.must_blockade" :key="index" @click="gpPage(index)">
          <div class="pass-imgicon" v-if="index == blockadeNow || index > blockadeNow">
              <img src="../imgs/pass_normal.png" alt />
              <span>{{index + 1}}</span>
          </div>
          <div class="pass-imgicon" v-if="index < blockadeNow">
            <img src="../imgs/pass_succe.png" alt/>
          </div>
          <div class="pass-content" >
            <span class="name">{{item.must_blockade_name}}</span>
          </div>
          <div class="pass-lock" v-if="index > blockadeNow">
            <img src="../imgs/pass_ lock.png" alt />
          </div>
        </li>
      </ul>
    </div>
    <img src="../imgs/cloud.png" alt="" class="cloud_bg">
  </div> -->

</template>

<script>
export default {
  data() {
    return {
      contentStyleObj:{
        height: ''
      },
      blockadeNow :0,
      className: {},
      showTypeOne: true,
      list: [
        {
          name: "aaa",
          finish: true
        },
        {
          name: "aaa"
        },
        {
          name: "aaa"
        },
        {
          name: "aaa"
        },
        {
          name: "aaa"
        },
        {
          name: "aaa"
        }
      ]
    };
  },
  mounted (){
    window.scrollTo({top:document.body.scrollHeight});
  },
  beforeMount() {
    this.className.container = "pink_container"
    if(this.activitydata.top_background_color == "pink"){
        this.className.container = "pink_container"
    } 

    if(this.activitydata.top_background_color == "purple"){
        this.className.container = "purple_container"
    }

    if(this.activitydata.top_background_color == "red"){
        this.className.container = "red_container"
    }

    if(this.activitydata.top_background_color == "yellow"){
        this.className.container = "yellow_container"
    }

    if(this.activitydata.top_background_color == "blue"){
        this.className.container = "blue_container"
    }
  },
  created() {
    var minHeight = 10.6;
    // if(this.activitydata.must_blockade.length > 6) {
    //   minHeight = parseInt(this.activitydata.must_blockade.length)*2 
    // }
    this.contentStyleObj.height=minHeight+'rem';
    console.log(this.activitydata);
    if (this.userdata.must_blockade_num == "") {
      this.blockadeNow = 0;
    } else {
      this.blockadeNow = Number(this.userdata.must_blockade_num);
    }
    if(this.blockadeNow == this.activitydata.must_blockade.length){
      this.blockadeNow = this.blockadeNow - 1
    }

    if( /^(CM)/.test(this.userdata.department_name)  && /^(10A)/.test(this.userdata.guid)) {
      this.showTypeOne = true;
    } else {
      this.showTypeOne = false;
    }

  },
  computed: {
    activitydata() {
      return this.$store.state.activitydata;
    },
    userdata() {
      return this.$store.state.userdata;
    }
  },
  methods:{
    gpPage(index) {
      // if (index <= this.blockadeNow) {
        this.$router.push({
          path: "/answer",
          query: {
            tp: "QA",
            activity_id: this.$store.state.activityId,
            token: this.$store.state.token,
            blockade_num: index
          }
        });
      // } else {
      //   return;
      // }
    }
  }
};
</script>

<style lang="less" scoped>
.container-check {
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  width: 100%;
  height: 41rem;
  flex-direction: column;
}

.pink_container{
  background: url("../imgs/bg_check.jpg") 0 0 no-repeat;
  background-size: cover;
  vertical-align: bottom;
  background-position: bottom;
  display: inline-block;
  position: relative;
}

.red_container{
  background: url("../red_imgs/bg_check.jpg") 0 0 no-repeat;
  background-size: cover;
  vertical-align: bottom;
  background-position: bottom;
}

.yellow_container{
  background: url("../yellow_imgs/bg_check.jpg") 0 0 no-repeat;
  background-size: cover;
  vertical-align: bottom;
  background-position: bottom;
}

.purple_container{
  background: url("../purple_imgs/bg_check.jpg") 0 0 no-repeat;
  background-size: cover;
  vertical-align: bottom;
  background-position: bottom;
  display: inline-block;
}

.blue_container{ 
  background: url("../blue_imgs/bg_check.jpg") 0 0 no-repeat;
  background-size: cover;
  vertical-align: bottom;
  background-position: bottom;
}

.container-check .pass-list-1{
  position: absolute;
  bottom:0.5rem;
  left: 2.5rem;
}

.container-check .pass-list-2{
  position: absolute;
  bottom:2.5rem;
  left: 2rem;
}

.container-check .pass-list-3{
  position: absolute;
  bottom:4.5rem;
  left: 2.3rem;
}

.container-check .pass-list-4{
  position: absolute;
  bottom:6.5rem;
  left: 3.3rem;
}

.container-check .pass-list-5{
  position: absolute;
  bottom:8.5rem;
  left: 3.8rem;
}

.container-check .pass-list-6{
  position: absolute;
  bottom:10.5rem;
  left: 3.3rem;
}

.container-check .pass-list-7{
  position: absolute;
  bottom:12.5rem;
  left: 1.7rem;
}

.container-check .pass-list-8{
  position: absolute;
  bottom:14.5rem;
  left: 1.3rem;
}

.container-check .pass-list-9{
  position: absolute;
  bottom:16.5rem;
  left: 2.5rem;
}

.container-check .pass-list-10{
  position: absolute;
  bottom:18.5rem;
  left: 4.1rem;
}

.container-check .pass-list-11{
  position: absolute;
  bottom:20.5rem;
  left: 5.1rem;
}

.container-check .pass-list-12{
  position: absolute;
  bottom:22.5rem;
  left: 4.7rem;
}

.container-check .pass-list-13{
  position: absolute;
  bottom:24.5rem;
  left: 2.9rem;
}

.container-check .pass-list-14{
  position: absolute;
  bottom:26.5rem;
  left: 1.8rem;
}

.container-check .pass-list-15{
  position: absolute;
  bottom:28.5rem;
  left: 1.1rem;
}

.container-check .pass-list-16{
  position: absolute;
  bottom:30.5rem;
  left: 1rem;
}

.container-check .pass-list-17{
  position: absolute;
  bottom:32.5rem;
  left: 1.4rem;
}

.container-check .pass-list-18{
  position: absolute;
  bottom:34.5rem;
  left: 2.6rem;
}

.container-check .pass-list-19{
  position: absolute;
  bottom:36.5rem;
  left: 4.1rem;
}

.container-check .pass-list-20{
  position: absolute;
  bottom:38.5rem;
  left: 3.9rem;
}
.container-check .pass-list {
    display: inline-block;
    width: 40%;
    height: 1rem;
    margin: 0 5%;
    margin-bottom:0.4rem;
    float: left;
    position: relative;
    border: solid 1px #fff;
    border-radius: 0.2rem;
}

.container-check .pass-list:nth-child(1) {
    margin-top:1rem;
}

.container-check .pass-list:nth-child(2) {
    margin-top:1rem;
}
.spanArex{
  position: absolute;
        left: .4rem;
        right: .4rem;
        top: 50%;
        transform: translate(0, -50%);
        text-align: center;
        word-break: break-all;
        text-overflow: ellipsis;
        color: #f2f2f2;
        display: -webkit-box;
        /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical;
        /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2;
        /** 显示的行数 **/
        overflow: hidden;
}

.container-check .span1{
  color: #fff;
  position: absolute;
  font-size: 0.8rem;
  top: 0;
  left: 0.4rem;
  line-height: 1.3rem;
}

.container-check .span2{
  color: #fff;
  position: absolute;
  font-size: 0.8rem;
  top: 0;
  left: 0.15rem;
  line-height: 1.3rem;
}

.container-check .span3{
    z-index: 2;
    position: absolute;
    width: 3rem;
    top: 1rem;
    left: 1.45rem;
    font-size: 0.26rem;
}

.container-check .span4 {
    z-index: 2;
    position: absolute;
    width: 3rem;
    top: 1rem;
    left: -3.25rem;
    font-size: 0.26rem;

}

.container-check  .img1{
  width: 1.3rem;
  height: 1.3rem;
}

.container-check  .img2{
  width: 3.4rem;
  position: absolute;
  top: 0.8rem;
  left: 1.3rem;
}
.container-check  .img3{
  width: 3.4rem;
  position: absolute;
  top: 0.8rem;
  left: -3.5rem;
}

.check-footer {
  width: 100%;
  height: 1.4rem;
  position: relative;
}

.check-footer .selfinfo {
  width: 100%;
  height: 1.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  /* margin-top: 0.27rem; */
}

.check-footer .selfinfo-left {
  float: left;
  width: 45%;
  margin-top: 0.07rem;
  position: relative;
}

.check-footer .selfinfo-left img,
.check-footer .selfinfo-left p {
  float: left;
  display: inline-block;
}

.check-footer .selfinfo-left img {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 3px solid #fff;
  position:absolute;
  top: -0.5rem;
  left:0.2rem;

}

.check-footer .selfinfo-left p {
  width: 92%;
  height: 0.58rem;
  line-height: 1;
  // margin-top: 0.18rem;
  padding-left: 1.8rem;
}

.check-footer .selfinfo-left p span {
  display: block;
  color:#3B3A3AFF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.check-footer .selfinfo-left p span:first-of-type {
  font-size: 0.34rem;
  color: #4E4E4EFF;
}

.check-footer .selfinfo-left p span:first-of-type.no-depart {
  height: 0.58rem;
  line-height: 0.58rem;
}

.check-footer .department {
  font-size: 0.28rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.18rem;
  line-height: 0.28rem;
}

.check-footer .selfinfo-right {
  float: right;
  padding: 0.08rem 0;
  max-width: 54%;
  padding-right: 0.5rem;
}

.check-footer .selfinfo-right img {
  width: 0.5rem;
  height: 0.5rem;
  float: left;
}
.check-footer .selfinfo-right .other{
  font-size: 0.34rem;
  margin-left: 0.1rem;
}


.pass {
  background: linear-gradient(180deg,rgba(55, 85, 179, 1) 0%, rgba(128, 83, 174, 1) 100%);
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
.pass-wrap { 
  position:absolute; 
  z-index:2;
  padding: 0.44rem 0.25rem;
  }
  .pass-desc {
    text-align: left;
    color: rgba(234, 248, 255, 1);
    padding-bottom:0.2rem;
    .title {
      font-size: 0.3rem;
      color: rgba(234, 248, 255, 1);
    }
    .content {
      margin-bottom: 0.15rem;
      font-size:0.25rem;
    }
  }
  .pass-list {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    li {
      width: 2.1rem;
      height:3rem;
      background: url("../imgs/pass-bg.png") 0 0 no-repeat;
      background-size: 100% 100%;
      padding-top: 0.2rem;
      margin-bottom: 0.25rem;
      position: relative;
      &:nth-child(2), &:nth-child(5), &:nth-child(8) {
        margin:0 0.3rem;
      }
    }
    .pass-imgicon {
        position: relative;
        margin-top:0.2rem;
      img {
        width: 100%;
      }
        span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translatex(-50%) translateY(-80%);
          line-height: 1;
          font-size: 0.3rem;
          color: rgba(161, 64, 0, 1);
        }
    }
    .pass-content {
      text-align: left;
      padding: 0 0.15rem;
      margin-top:0.1rem;
      span {
        display: block;
        line-height: 1;
      }
      .name {
        font-size: 0.25rem;
        color: rgba(104, 84, 176, 1);
        margin-bottom: 0.05rem;
        font-weight: bold;
      }
      .label {
        font-size: 0.2rem;
        color: rgba(149, 136, 194, 1);
      }
    }
    .pass-lock {
      position: absolute;
      bottom: 0;
      top: 0;
      width: 100%;
      background: url("../imgs/mask_bg.png") 0 0 no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 0.5rem;
        position:relative;
        top:0.1rem;
      }
    }
  }
  .cloud_bg{
    position:fixed;
    bottom:0px;
    width:100%;
    z-index:1;
    left:50%;
    transform: translateX(-50%);
  }
}
</style>