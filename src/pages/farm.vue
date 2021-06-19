<template>
  <div>
    <div class="farm-bj">
      <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo" :resetPath="path"></toast>
      <div class="my-plant">
          <img>
      </div>
      <div class="water" @click="water()">
        <img src="../imgs/water.png">
        <p>{{this.my_water}}g</p>
      </div>
      <div class="my-progress">
        <img src="../imgs/progress.png">
        <img src="../imgs/prize.png">
        <div class="progress-load"></div>
      </div>
      <div class="farm-click" :style="{'transform':showClick?'translateY(0)':'translateY(9rem)'}">
        <div class="hide-click" @click="showClick=false">
          <img src="../imgs/layout.png">
        </div>
          <div  class="click-box" >
            <div class="subject-item" v-for="(item,value) in lists" :keys="value">
              <div>
                <strong>{{item.title}}</strong>
                <span>共{{item.number}}题,可获得{{item.water}}g水滴</span>
              </div>
              <div>
                <img src="../imgs/go-click.png">
              </div>
              <div style="float: none;clear: both"></div>
            </div>
          </div>
      </div>
      <div class="show-click" @click="showClick=true">
        <img src="../imgs/farm_click.png" >
      </div>

    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import {Swiper,SwiperItem} from 'vux';
  import toast from '@/component/toast';
  export default {
    name: "farm",
    data(){
      return {
        showClick:false,
        lists:[],
        showError:false,
        showIndex:-1,
        errorInfo:'',
        showConf:false,
        progress_width:0,
        progress_load:0,
        my_water:0,
        path:"/"
      }
    },
    components:{
      Swiper,
      SwiperItem,
      toast
    },
    computed:{
      userdata(){
        return this.$store.state.userdata;
      }
    },
    created(){
      if(!this.userdata.my_plant || !this.userdata.my_plant.plant_name){
        this.$router.push({
          path: "/choose",
          query: {
            activity_id: this.$store.state.activityId,
            access_token: this.$store.state.access_token
          }
        })
      }
      if(this.userdata.my_plant.progress==100){
        this.showIndex=4;
        this.errorInfo='你已经完成这次活动，期待下一次活动吧';
        this.showError=true;
      }
    },
    mounted(){
      if(this.userdata.my_plant && this.userdata.my_plant.plant_name){
        this.init()
      }
      window.addEventListener("beforeunload ",this.leave());
      window.addEventListener("pagehide ",this.leave());
    },
    beforeDestroy(){
      this.$store.commit('updateStatePlant',{
        progress:this.progress_load,
        water:this.my_water
      });
      this.$ajax.post('/api/farm/leave',{
        progress:this.progress_load,
        water:this.my_water,
        activity_id: this.$store.state.activityId,
        access_token: this.$store.state.access_token
      })
    },
    methods:{
      init(){
        $(".my-plant img").attr("src",this.userdata.my_plant.plant_img);
        this.progress_width=parseInt($(".progress-load").css("backgroundPosition"));
        this.progress_load=this.userdata.my_plant.progress;
        this.my_water=this.userdata.my_plant.water;
        console.log(this.userdata);
        $(".progress-load").css("width",this.progress_width*this.progress_load/100);
        this.$ajax.get("/api/farm/getSubject").then((res)=>{
              this.lists=res.data
        })
      },
      water(){
          if(this.my_water<10){
            this.showIndex=2;
            this.errorInfo='剩余水滴不足，完成答题获得水滴吧';
            this.showError=true;
            return ;
          }
          this.progress_load=this.progress_load+1;
          this.my_water=this.my_water-10;
          if(this.progress_load==100) {
            this.$ajax.post("/api/farm/success",{
              prize:this.userdata.my_plant.prize_name,
              activity_id: this.$store.state.activityId,
              access_token: this.$store.state.access_token
            });
            this.showIndex=4;
            this.errorInfo='恭喜你完成所有答题，请耐心等待奖品的到来哦~';
            this.showError=true;
            return ;
          }
          let animation=$("<div class='animation-all'>" +
            "<div class=\"animation-watering\"></div>" +
            "<div class=\"animation-water\" style=\"animation-delay:2s;right:3.8rem\"></div>" +
            "<div class=\"animation-water\" style=\"animation-delay:2.4s;right:3.3rem\"></div>" +
            "<div class=\"animation-water\" style=\"animation-delay:2.8s;right:2.8rem\"></div>" +
            "<div class=\"animation-water\" style=\"animation-delay:3.2s;right:3.3rem\"></div>" +
            "<div class=\"animation-water\" style=\"animation-delay:3.6s;right:3.8rem\"></div>" +
            "</div>");
          $(".farm-bj").append(animation);
          setTimeout(()=>{
            $(".progress-load").css("width",this.progress_width*this.progress_load/100);
          },3000);
          setTimeout(()=>{
            $(animation).remove();
          },5000);
      },
      leave(){
        this.$ajax.post('/api/farm/leave',{
          progress:this.progress_load,
          water:this.my_water,
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        })
      }

    }
  }
</script>

<style>

  .farm-bj{
    width: 100vw;
    height: 100vh;
    background: url("../imgs/farm_bj.jpg") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top:0;
    left: 0;
    overflow: hidden;
  }
  .water{
    position: fixed;
    top:1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    right:10px;
    z-index: 20;
  }
  .water>img{
    width: 1.5rem;
  }
  .water>p{
    margin-top:-0.5rem;
    color: #fff;
    font-size: 0.3rem;
  }
  .my-plant{
    position: absolute;
    top:4.6rem;
    left: 1.1rem;
  }
  .my-plant>img{
    width: 4.5rem;
  }
  .my-progress{
    position: relative;
    top:9.5rem;
    width: 5rem;
    left: calc(50% - 2.5rem);
  }
  .my-progress img:nth-child(1){
    width: 5rem;
    height: 1rem;
  }
  .my-progress img:nth-child(2){
    position: absolute;
    right: -0.5rem;
    top:0.1rem;
    width: 0.75rem;
    z-index: 2;
    animation-name: can-prize;
    animation-duration:4s;
    animation-iteration-count: infinite;
    transition-duration: .1s;
    animation-delay: 2s;
  }
  @keyframes can-prize {
    0% {
      transform: scale(1) rotate(0);
      transform: scale(1) rotate(0);
    }
    90%{
      transform: scale(1) rotate(0deg);
    }
    93%{
      transform: scale(1.1) rotate(20deg);
    }
    96%{
      transform: scale(1.1) rotate(-20deg);
    }
    100% {
      transform: scale(1) rotate(0);
    }
  }
  .progress-load{
    background: url("../imgs/progress_load.png");
    background-size: 4.6rem 0.5rem;
    width: 0rem;
    position: absolute;
    left: 0.2rem;
    top:0.24rem;
    height: 0.5rem;
    z-index: 1;
    background-position: 4.6rem 0.5rem;
    transition-duration: .5s;
  }
  .show-click{
    position: absolute;
    width: 100vw;
    bottom: 1rem;
    z-index: 0;
  }
  .show-click>img{
    width: 3rem;
  }
  .farm-click{
    z-index:2;
    position: absolute;
    width: 100vw;
    height: 9rem;
    bottom: 0;
    background:url("../imgs/choose-bj.png");
    background-size: 100% 100%;
    transition-duration: .6s;
  }
  .hide-click{
    position: absolute;
    top:0.2rem;
    right: 0;
  }
  .hide-click img{
    width: 1rem;
  }
  .click-box{
    width: 90%;
    height: 7.5rem;
    margin-left: 5%;
    margin-top: 1.5rem;
    overflow: scroll;
  }
  .subject-item {
    width: 100%;
    height: 1.6rem;
    background: white;
    margin:0.4rem 0;
    border-radius: 0.15rem;
    padding: 0 0.2rem;
  }
  .subject-item div:nth-child(1){
    width: calc(100% - 1.8rem);
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    text-align: left;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .subject-item div:nth-child(1) strong{
    font-size: 0.4rem;
    color: #ad732d;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .subject-item div:nth-child(1) span{
    font-size: 0.25rem;
  }
  .subject-item div:nth-child(2){
    width: 1.8rem;
    height: 100%;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .subject-item div:nth-child(2) img {
    width: 1.8rem;
  }
  .animation-watering{
    position: absolute;
    height: 1.4rem;
    width: 1.4rem;
    background: url("../imgs/watering.png");
    background-size: 100% 100%;
    animation-name:watering;
    animation-duration:4s;
    animation-iteration-count:1;
    animation-timing-function:ease-out;
    opacity: 0;
    top:1.5rem;
    transition-duration: .5s;
    right:10px;
  }
  @keyframes watering{
    from {opacity:0.4;transform: translate(0,0)}
    25%   {
      opacity: 1;
      transform: translate(-2.2rem,1.7rem) rotate(-45deg);
    }
    50%{
      opacity: 1;
      transform: translate(-2.2rem,1.7rem) rotate(-45deg);
      transform-origin: 2rem 2rem;
    }
    60%{
      opacity: 1;
      transform: translate(-1.9rem,1.7rem) rotate(-45deg);
      transform-origin: 2rem 2rem;
    }
    75%{
      opacity: 1;
      transform: translate(-1.3rem,1.7rem) rotate(-45deg);
      transform-origin: 2rem 2rem;
    }
    90%{
      opacity: 1;
      transform: translate(-2.4rem,1.7rem) rotate(-45deg);
      transform-origin: 2rem 2rem;
    }
    100%{
      opacity: 0;
      transform: translate(-2rem,1.3rem) rotate(0deg);
      transform-origin: 2rem 2rem;
    }
  }
  .animation-water{
    position: absolute;
    height: 0.8rem;
    width: 0.8rem;
    background: url("../imgs/move_water.png");
    background-size: 100% 100%;
    animation-name:water;
    animation-duration:1s;
    animation-iteration-count:1;
    animation-timing-function:ease-out;
    opacity: 0;
    animation-fill-mode:backwards;
    top:5rem;
    transition-duration: .3s;
  }
  @keyframes water{
    0% {opacity:0;transform: translateY(0)}
    100%   {opacity:1;transform: translateY(3rem)}
  }

</style>