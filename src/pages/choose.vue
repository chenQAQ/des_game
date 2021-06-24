<template>
  <div>
    <div class="choose-bj">
      <Confirm
        v-model="showConf"
        :value="showConf"
        title="是否确定"
        content="注意!确定植物之后不可以再更改"
        :hide-on-blur=true
        :theme="this.detect()"
        @on-confirm="goclick()"
      >
      </Confirm>
      <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo" :resetPath="path"></toast>
      <div class="choose-tips">
        <span>请谨慎选择，选择后不可以修改</span>
      </div>
      <swiper
      :show-dots="false"
      :duration=200
      :aspect-ratio=0.6
      @on-index-change="chooseItem"
      >
          <swiper-item  v-for="(item,index) in lists" :key="index" class="my-choose-item">
              <img :src="item.choose_img" />
              <div class="prize-des">
                <p>{{item.name}}</p>
                <div class="prize-level">
                  <span>难度:</span>
                  <div v-for="(i,j) in item.level" :key="i+j">
                    <img src="../imgs/level.png">
                  </div>
                </div>
              </div>
          </swiper-item>
      </swiper>
      <div class="my-prize">
        <img :src="show_prize.img" >
        <div class="my-des">
            <!--<img :src="show_prize.img"/>-->
            <p >{{show_prize.name}}</p>
            <span>剩余数量:{{show_prize.number}}</span>
            <div v-show="show_prize.number" @click="showConf=true">
            </div>
            <div v-show="!show_prize.number">
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import {Swiper,SwiperItem,Confirm} from 'vux';
  import toast from '@/component/toast'
  export default {
    name: "choose",
    data(){
      return {
        lists:[],
        show_prize:{
          name:"",
          img:"",
          number:"",
          choose_plant_name:"",
          choose_plant_img:""
        },
        path:'/choose',
        showError:false,
        showIndex:-1,
        errorInfo:'',
        showConf:false
      }
    },
    components:{
      Swiper,
      SwiperItem,
      Confirm,
      toast
    },
    computed:{
      userData(){
        return this.$store.state.userdata;
      }
    },
    beforeMount(){
      if(this.userData.my_plant){
        this.$router.replace({
          path:'/farm',
          query:{
            activity_id: this.$store.state.activityId,
            access_token: this.$store.state.access_token
          }
        })
      }
    },
    mounted(){
      this.initData();
    },
    methods:{
      initData(){
        this.$ajax.get('/api/choose/getList').then(res=>{
          this.lists=res.data;
          this.$nextTick(()=>{
            this.chooseItem(0);
          })
        })
      },
      detect() {
        let equipmentType = "";
        let agent = navigator.userAgent.toLowerCase();
        let android = agent.indexOf("android");
        let iphone = agent.indexOf("iphone");
        let ipad = agent.indexOf("ipad");
        if(android != -1){
          equipmentType = "android";
        }
        if(iphone != -1 || ipad != -1){
          equipmentType = "ios";
        }
        return equipmentType;
      },
      chooseItem(value){
          const _this=this;
          $(".my-choose-item").each(function (item,ele) {
            if(value==item+1){
              $(this).addClass("item-pre")
            }
            else if(value==item-1){
              $(this).addClass("item-next")
            }
            else{
              $(this).removeClass("item-pre")
              $(this).removeClass("item-next")
            }
            if(value==item){
                _this.show_prize.img=_this.lists[value].prize_img;
                _this.show_prize.name=_this.lists[value].prize;
                _this.show_prize.number=_this.lists[value].number;
                _this.show_prize.choose_plant_img=_this.lists[value].img;
                _this.show_prize.choose_plant_name=_this.lists[value].name;
            }
          })
      },
      goclick(){
        const _this=this;
        this.$ajax.get('/api/checkPrize').then(res=>{
          if(res.data){
            this.$ajax.post('/api/getPrize',{
              prize:_this.show_prize.name,
              activity_id: _this.$store.state.activityId,
              access_token: _this.$store.state.access_token
            }).then(res=>{
              if(res.data){
                let obj={};
                obj['my_plant']={
                  plant_img:_this.show_prize.choose_plant_img,
                  plant_name:_this.show_prize.choose_plant_name,
                  progress:40,
                  prize_img:_this.show_prize.img,
                  prize_name:_this.show_prize.name,
                  water:600
                };
                this.$store.commit('setUserState',obj);
                this.$router.replace({
                  path:"/farm",
                  query:{
                    activity_id: this.$store.state.activityId,
                    access_token: this.$store.state.access_token
                  }
                })
              }else{
                this.showError = true;
                this.showIndex = 6;
                this.errorInfo = '网络错误，请重新再试一遍';
              }
            }).catch(err=>{
              this.showError = true;
              this.showIndex = 6;
              this.errorInfo = "网络错误，请重新再试一遍";
            })
          }else{
            this.showError = true;
            this.showIndex = 6;
            this.errorInfo = '抱歉，您来晚了，宝贝已经被人兑换完了。。。';
          }
        }).catch(err=>{
          this.showError = true;
          this.showIndex = 6;
          this.errorInfo = "网络错误，请重新再试一遍";
        })
      }
    }
  }
</script>

<style scoped>

  .choose-bj{
    background: url("../imgs/choose_bj.jpg");
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;
  }
  .choose-bj /deep/ .vux-slider{
    bottom:5.5rem;
    position: absolute;

  }
 .choose-bj /deep/ .vux-swiper{
     width: 100vw;
   }
  .prize-des{
    position: relative;
    top:-1.5rem;
  }
  .prize-des>p{
    font-size: 0.35rem;
    color: #535353;
  }
  .prize-level{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .prize-level>span{
    font-size: 0.3rem;
    color: #535353;
  }
  .prize-level img{
    width: 0.4rem;
  }
  .choose-tips{
    position: absolute;
    width: 100%;
    font-size: 0.35rem;
    bottom:9.8rem;
    color: #f2f2f2;
  }
  .my-choose-item>img{
    height:4.2rem;
    width:3.2rem;
    position: relative;
  }
  .item-pre{
    left:50% !important;
    top: 0.6rem !important;
  }
  .item-next{
    left:-50% !important;
    top:0.6rem!important;
  }
  .my-prize{
    position: absolute;
    background: url("../imgs/click_bj.png");
    background-size:100% 100%;
    width: 7rem;
    left: calc(50% - 3.5rem);
    height: 5rem;
    bottom:0.5rem;
    display: flex;
    align-items: center;
  }
  .my-prize>img{
    width:3.2rem;
    height: 3.2rem;
    position: relative;
    top:0.15rem;
    left: 0.65rem;
    border-right: 0.3rem;
  }
  .my-des{
    position: relative;
    height: 3.2rem;
    top:0.15rem;
    width: 2.5rem;
    left: 0.85rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    word-break: break-all;
  }
  .my-des p{
    font-size: 0.34rem;
    text-align: left;
    font-family: 微软雅黑;
  }
  .my-des span{
    font-size: 0.25rem;
  }
  .my-des div:nth-child(3){
    width:2.5rem;
    height: 0.87rem;
    position: absolute;
    bottom: 0;
    background: url("../imgs/choose_click.png");
    background-size: 100% 100%;
  }
  .my-des div:nth-child(4){
    width:2.5rem;
    height: 0.87rem;
    position: absolute;
    bottom: 0;
    background: url("../imgs/choose_click_end.png");
    background-size: 100% 100%;
  }


</style>