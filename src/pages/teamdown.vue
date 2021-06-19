<template>
  <div :class="className.container + ' container'">
      <div class="waitpk" v-if="teamPkInfo.pk_status == 0" >
        <div class="banner">
          <!-- <span class="rule" @click="showLay=true">活动须知</span> -->
           <img :src="activitydata.top_banner"> 
        </div>
        <div class="out-title">
          <h2>{{this.activitydata.team_pk_info.title}}</h2>
        </div>
        <div class="wait-time-box">
            <p class="wait-time-tip">倒计时</p>
            <p class="wait-time" v-html="downHtml"></p>
        </div>
      </div>
      <div class="waitpk" v-if="teamPkInfo.pk_status == 1 && teamPkInfo.role == 'player'">
        <div class="ready" v-if="isReady==false" :style="bgstyle(count_down_background)">
          <p :class="readTime" ref="countp">{{readyContent}}</p>
        </div>
        <div class="beatdown" v-else >
          <div class="top-block live-block">
            <!-- <div class="teampk-msg-box live-block" v-show="hasLiveMsg">
              <transition name="slide">
                <p class="teampk-live-msg" :key="liveMsgIndex" >{{liveMsg}}</p>
              </transition>
            </div> -->
            <vue-baberrage
              :isShow= "barrageIsShow"
              :barrageList = "barrageList"
              :loop = "barrageLoop"
              >
            </vue-baberrage>
            <div class="teampk-user-box live-block">
              <div class="user-left live-block">
                <img class="user-background" src="../imgs/teampk_user.png">
                <img class="user-img" :src="userdata.headpic_url" alt>
                <p class="teampk-user-p"><span class="user-p-one">{{userdata.name}}</span><span class="user-p-two">{{userTotalScore}}</span></p>
              </div>
              <div class="user-right live-block">
                <div class="out-rank live-block">
                  <div class="rank-list-body live-block" >
                    <flexbox class="rank-list" :gutter="0" v-for="(childItem,i) in rankList" :key="i">
                      <flexbox-item :span="2/13">
                        <p class="number">
                          <span>{{i+1}}</span>
                        </p>
                      </flexbox-item>
                      <flexbox-item class="dept-user" :span="8/13" style="text-align:left;">
                        <div class="user">
                          <p>
                            <span>{{childItem.department_name}}</span>
                          </p>
                        </div>
                      </flexbox-item>
                  
                      <flexbox-item class="dept-user" :span="3/13">
                        <p class="btns">
                          <span>{{childItem.score}}</span>
                        </p>
                      </flexbox-item>
                    </flexbox>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="countdown" v-show="this.countDownTime <= 10">
              <x-circle :percent="100-countDownTime*10" :stroke-width="10" :trail-width="10" :stroke-color="strokeColor2" trail-color="#ffffff" >
                <span :style="{color:'#000',fontSize:'16px'}" >{{this.countDownTime>0?this.countDownTime:'0'}}</span>
              </x-circle>
            </div>
      
          <!-- <transition name="bounce">
            <p v-show="showEle.number" class="detail">
              <span v-if="stepIndex!=countQues">第 {{stepIndex}}/{{countQues}} 题</span>
              <span v-else class="weight-tip">
                最后一题&nbsp;&nbsp;双倍得分
                <span>X2</span>
              </span>
            </p>
          </transition> -->
          </div>
          <div class="temapk-center">
            <div class="center-block">
              
              <transition name="bounce">
                <p v-show="showEle.title" class="detail">
                  <span
                    :class="questionInfo.question_type==2?'isRed':''"
                  >{{questionInfo.question_type==2?'【多选】':'【单选】'}}</span>
                  {{questionTitle}}
                </p>
              </transition>
            </div>
            <div class="bottom-block">
              <transition name="bounce">
                <ul class="choice" v-show="showEle.options">
                  <li @click="verify(i,$event)" v-for="(item,i) in questionOptions" :key="this">
                    <!-- <span></span> -->
                    <p>{{item}}</p>
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="waitpk" v-if="teamPkInfo.pk_status == 2" >
        <div class="out-top">
            <img v-if="activitydata.top_background_color == 'pink'" src="../imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'purple'" src="../purple_imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'yellow'" src="../yellow_imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'blue'" src="../blue_imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'red'" src="../red_imgs/teamout_top.jpg">
        </div>
        <div class="out-rank">
            <div class="rank-list-body" >
              <flexbox class="rank-list" :gutter="0" v-for="(childItem,i) in rankList" :key="i">
                <flexbox-item :span="2/13">
                  <p class="number">
                    <span>{{i+1}}</span>
                  </p>
                </flexbox-item>
                <flexbox-item class="dept-user" :span="8/13" style="text-align:left;">
                  <div class="user">
                    <p>
                      <span>{{childItem.department_name}}</span>
                    </p>
                  </div>
                </flexbox-item>
             
                <flexbox-item class="dept-user" :span="3/13">
                  <p class="btns">
                    <span>{{childItem.score}}</span>
                  </p>
                </flexbox-item>
              </flexbox>
          </div>
        </div>

        <div class="out-title" style="float: left;">
          <h2>{{this.activitydata.team_pk_info.title}}</h2>
          <h2>已结束</h2>
        </div>
        
      </div>
      <div class="invite invite-wrapper" v-if="teamPkInfo.pk_status == 1 && teamPkInfo.role == 'viewer'">
        <div class="out-top">
            <img v-if="activitydata.top_background_color == 'pink'" src="../imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'purple'" src="../purple_imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'yellow'" src="../yellow_imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'blue'" src="../blue_imgs/teamout_top.jpg">
            <img v-if="activitydata.top_background_color == 'red'" src="../red_imgs/teamout_top.jpg">
        </div>
        <div class="down-out-rank">
            <div class="rank-list-body" >
              <flexbox class="rank-list" :gutter="0" v-for="(childItem,i) in rankList" :key="i">
                <flexbox-item :span="2/13">
                  <p class="number">
                    <span>{{i+1}}</span>
                  </p>
                </flexbox-item>
                <flexbox-item class="dept-user" :span="8/13" style="text-align:left;">
                  <div class="user">
                    <p>
                      <span>{{childItem.department_name}}</span>
                    </p>
                  </div>
                </flexbox-item>
             
                <flexbox-item class="dept-user" :span="3/13">
                  <p class="btns">
                    <span>{{childItem.score}}</span>
                  </p>
                </flexbox-item>
              </flexbox>
          </div>
        </div>
        <div class="down-out-title">
          <h2>{{this.activitydata.team_pk_info.title}}</h2>
        </div>
      </div>
      <div class="out-sms-box"  v-if="teamPkInfo.pk_status == 0 || teamPkInfo.pk_status == 2 || (teamPkInfo.pk_status == 1 && teamPkInfo.role == 'viewer')" >
        <div class="out-sms-list">
          <div class="sms-list-box" id="msgbox">
            <p class="out-sms-info" v-for="(msg,i) in msgList" :key="i"><span :class="'system'+msg.msg_type">{{msg.name}}</span> {{msg.message}}</p>
          </div>
        </div>
        <div class="out-sms-text">
          <input class="sms-text" v-model.trim="liveMsg" type="text" placeholder="说点什么"><button @click="sendMsg()" class="sms-btn">发送</button>
        </div>
      </div>


      <notify
        v-for="(item,index) in notifyList"
        :key="index"
        :index="index"
        :showNotify="item.showNotify"
        :inviteUserId="item.inviteUserId"
        :inviteUserName="item.inviteUserName"
        :bottom="item.bottom"
        :counttime="item.counttime"
      ></notify>
      <popup v-if="showPopup==true" :refuseUserName="refuseUserName" :msgIndex="msgIndex"></popup>
    <!-- 引导分享弹层 -->
    <div class="shareGuide" v-show="showShareGuide" @click.prevent="showShareGuide=false">
      <div class="shareGuideImg">
        <img src="../imgs/invite.png">
      </div>
    </div>
    <notify
      v-for="(item,index) in notifyList"
      :key="index"
      :index="index"
      :showNotify="item.showNotify"
      :inviteUserId="item.inviteUserId"
      :inviteUserName="item.inviteUserName"
      :bottom="item.bottom"
      :counttime="item.counttime"
    ></notify>
    <popup v-if="showPopup==true" :refuseUserName="refuseUserName" :msgIndex="msgIndex"></popup>
    <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo"></toast>
    <teampktoast v-if="showLay==true" :teamPkInfo="teamPkInfo" :showIndex="1"></teampktoast>
    <toast v-if="$store.state.showOffline==true" :showIndex="5" :errMsg="$store.state.offlineMsg"></toast>
    <!-- <notify v-if="showNotify==true" :inviteUserId="inviteUserId" :inviteUserName="inviteUserName"></notify> -->
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Divider, Loading, Spinner } from "vux";
import waitAvatar from "@/imgs/wait.png";
import { setCookie, getCookie } from "../js/cookie.js";
import { XCircle } from "vux";
import { GetUrlParam, beAvatar } from "../js/util.js";
import { Base64 } from "js-base64";
import { setTimeout } from "timers";
import { vueBaberrage } from 'vue-baberrage';
import { MESSAGE_TYPE } from 'vue-baberrage';
import toast from "@/component/toast";
import teampktoast from "@/component/teamPkToast";
import popup from "@/component/popup";
import notify from "@/component/notify";
let url = "",
  title = "",
  desc = "";
export default {
  name: "teamdown",
  data() {
    return {
      timer: null,
      teamPkInfo:{
        pk_status : 1
      },
      team_pk_id: 0,
      className: {},
      isReady:false,
      isChoose: false, //是否已经选择
      showCountDown: false, //显示倒计时
      userTotalScore:0, // 用户获取分数
      readyContent: "wait",
      timeTick: null,
      timeLive: null,
      showLay: false, //是否显示弹层
      hasLiveMsg: false, // 是否显示公告
      showEle: {
        //元素显示
        title: false,
        options: false,
        number: false
      },
      questionOptions: {
        A: "16",
        B: "17",
        C: "18",
        D: "19",
        E : "20"
      }, //问题选择
      questionTitle: "", //问题题目
      stepIndex: 1, //题号
      countQues: 5, //总题目数量
      readTime:"ready-time1",
      teamPKtimer:null,
      rankList:[],
      animate:false,
      liveMsgList:[],
      msgList:[],
      liveMsg:null,
      teamOut: false,
      liveMsgIndex:0,
      countDownTime: 'start', //倒计时
      totalTime: 10,
      showError: false, //是否显示错误页面
      showPopup: false,
      showShareGuide: false,
      strokeColor2: "#ff857e",
      notifyList: [
        // {
        // showNotify: false,
        // inviteUserId: 0,
        // inviteUserName: ''
        // }
      ],
      initData: {
        //客户端传给服务端
        channel: "",
        action: "",
        data: {}
      },
      downHtml:"",
      msg: 'Hello vue-baberrage',
      barrageIsShow: true,
      currentId : 0,
      barrageLoop: false,
      barrageList: []
    };
  },
  components: {
    Flexbox,
    FlexboxItem,
    XCircle,
    toast,
    teampktoast,
    notify,
    vueBaberrage
  },
  computed: {
    websocket() {
      return this.$store.state.websocket;
    },
    userdata() {
      return this.$store.state.userdata;
    },
    activitydata() {
      return this.$store.state.activitydata;
    }
  },


  beforeMount() {
    this.count_down_background = "https://kuyi.shengws.com/countdown_bg.jpg"
    this.className.container = "pink_container"
    if(this.activitydata.top_background_color == "pink"){
      this.count_down_background = "https://kuyi.shengws.com/countdown_bg.jpg"
      this.className.container = "pink_container"
    } 

    if(this.activitydata.top_background_color == "purple"){
      this.count_down_background = "https://kuyi.shengws.com/purple/countdown_bg.jpg"
      this.className.container = "purple_container"
    }

    if(this.activitydata.top_background_color == "red"){
      this.count_down_background = "https://kuyi.shengws.com/red/countdown_bg.jpg"
      this.className.container = "red_container"
    }

    if(this.activitydata.top_background_color == "yellow"){
      this.count_down_background = "https://kuyi.shengws.com/yellow/countdown_bg.jpg"
      this.className.container = "yellow_container"
    }

    if(this.activitydata.top_background_color == "blue"){
      this.count_down_background = "https://kuyi.shengws.com/blue/countdown_bg.jpg"
      this.className.container = "blue_container"
    }


    this.websocketMess();
     
    // if (this.userdata.is_blockade_success != 1) {
    //   this.showError = true;
    //   this.showIndex = 4;
    //   this.errorInfo = "你还未完成必答，暂不能进行PK对决,快去完成必答吧";
    // }
  },
  mounted() {
    if (this.userdata.is_over_online == 1) {
      this.showError = true;
      this.showIndex = 2;
      if (this.userdata.online_limit_count == 30) {
        this.errorInfo = "体验版最多允许30人同时进行答题，等会儿再来试试吧";
      } else if (this.userdata.online_limit_count == 500) {
        this.errorInfo = "专业版最多允许500人同时进行答题，等会儿再来试试吧";
      }
    }
  },
  destroyed() {

    clearInterval(this.teamPKtimer);
    clearInterval(this.timeLive);
    // this.websocketSend({
    //   channel: "teampk",
    //   action: "leave",
    //   data: {
    //     team_pk_id: this.activitydata.team_pk_info.team_pk_id
    //   }
    // });

  },
  created() {
    this.timeLive  = setInterval(() => this.scroll(), 2000);
    if (this.websocket) {
      if (this.websocket.readyState == 1) {
        this.websocketSend({
          channel: "teampk",
          action: "join",
          data: {
            activity_id: this.$store.state.activityId
          }
        });
        this.websocketSend({
          channel: "teampk",
          action: "info",
          data: {
            activity_id: this.$store.state.activityId
          }
        });
        this.websocketSend({
          channel: "teampk",
          action: "top",
          data: {
            activity_id: this.$store.state.activityId
          }
        });
      } else {
        setTimeout(() => {
          this.websocketSend({
            channel: "teampk",
            action: "join",
            data: {
              activity_id: this.$store.state.activityId
            }
          });
          this.websocketSend({
            channel: "teampk",
            action: "info",
            data: {
              activity_id: this.$store.state.activityId
            }
          });
          this.websocketSend({
            channel: "teampk",
            action: "top",
            data: {
              activity_id: this.$store.state.activityId
            }
          });
        }, 1000);
      }
    } else {
      setTimeout(() => {
        if (this.websocket.readyState == 1) {
          this.websocketSend({
            channel: "teampk",
            action: "join",
            data: {
              activity_id: this.$store.state.activityId
            }
          });
          this.websocketSend({
            channel: "teampk",
            action: "info",
            data: {
              activity_id: this.$store.state.activityId
            }
          });
          this.websocketSend({
            channel: "teampk",
            action: "top",
            data: {
              activity_id: this.$store.state.activityId
            }
          });
        } else {
          setTimeout(() => {
              this.websocketSend({
              channel: "teampk",
              action: "join",
              data: {
                activity_id: this.$store.state.activityId
              }
            });
            this.websocketSend({
              channel: "teampk",
              action: "info",
              data: {
                activity_id: this.$store.state.activityId
              }
            });
            this.websocketSend({
              channel: "teampk",
              action: "top",
              data: {
                activity_id: this.$store.state.activityId
              }
            });
          }, 1000);
        }
      }, 1000);
    }
  },
  methods: {
    sendMsg() {
      if(this.liveMsg.length > 0){
        this.websocketSend({
          channel: "teampk",
          action: "sendMessage",
          data: {
            team_pk_id: this.teamPkInfo.team_pk_id,
            message: this.liveMsg
          }
        });
        this.liveMsg = ''
      }
    },
    scroll(){
      if(this.liveMsgList.length > 0){
        this.liveMsgIndex = this.liveMsgIndex + 1
        this.hasLiveMsg = true
        this.liveMsg = this.liveMsgList[0]['message']
        this.liveMsgList.shift()
      } else{
        this.hasLiveMsg = false
      }
    },
    bgstyle(bg) {
      return {
        background: `url(${bg}) center no-repeat`,
        backgroundSize: "cover",
        backgroundOrigin: "content-box",
        backgroundColor: '#59528c'
      };
    },
    websocketSend(data) {
      try {
        this.websocket.send(JSON.stringify(data));
      } catch (error) {
        this.showError = true;
        this.showIndex = 4;
        this.errorInfo = "网络异常，请稍后退出重试！";
      }
    },
    goTeamout(){
      this.teamOut = true
      // this.$router.replace({
      //   path: "/teamout",
      //   query: {
      //     activity_id: this.$store.state.activityId,
      //     access_token: this.$store.state.access_token
      //   }
      // });
    },
    goTeamPk(){
      this.$router.replace({
        path: "/teampk",
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
    },
    //页面跳转
    goPage() {
      // window.location.href = window.location.origin + '/api?activity_id=' + this.$store.state.activityId
      this.$router.replace({
        path: "/",
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
    },
    countDown() {
      let i = 3;
      let timer;
      this.readTime="ready-time"
      this.readyContent = String(i);
      timer = setInterval(() => {
        i--;
        this.readyContent = String(i);
        if (i == 0) {
          this.readyContent = "GO";
          clearInterval(timer);
        }
      }, 1000);
    },
    //题目选择验证
    verify(index, event) {
      console.log(index,'index')
      var iTrue = 9;
      if (index == "A") {
        iTrue = 0;
      } else if (index == "B") {
        iTrue = 1;
      } else if (index == "C") {
        iTrue = 2;
      } else if (index == "D") {
        iTrue = 3;
      } else if(index == 'E') {
        iTrue = 4; 
      }
      // if (this.questionInfo.question_type == 1) {
        //单选题
        if (this.isChoose == true) {
          return;
        } else if (this.websocket.readyState == 1 && navigator.onLine == true) {
          //网络顺畅 websocket连接成功
          this.isChoose = true;
          this.initData = {
            channel: "teampk",
            action: "userAnswer",
            data: {
              step: this.questionInfo.step,
              team_pk_id: this.questionInfo.team_pk_id,
              question_id: this.questionInfo.question_id,
              user_answer: index
            }
          };
          this.websocketSend(this.initData);
          // if (this.questionInfo.correct_answer == index) {
          //   $(".choice li")
          //     .eq(iTrue)
          //     .addClass("true");
          // } else {
          //   $(".choice li")
          //     .eq(iTrue)
          //     .addClass("error");
          // }
        }
      // } else {
      //   if (this.isChoose == true) {
      //     return;
      //   } else if (this.websocket.readyState == 1 && navigator.onLine == true) {
      //     if (this.answerStr.indexOf(index) == -1) {
      //       this.answerStr.push(index);
      //     }
      //     //多选题
      //     if (this.questionInfo.correct_answer.indexOf(index) == -1) {
      //       this.isChoose = true;
      //       var str = "";
      //       this.answerStr.forEach(item => {
      //         str += item;
      //       });
      //       this.initData = {
      //         channel: "pk",
      //         action: "answer",
      //         data: {
      //           blockade_id: this.questionInfo.blockade_id,
      //           step: this.questionInfo.step,
      //           room_id: this.pkRoomInfo.room_id,
      //           question_id: this.questionInfo.question_id,
      //           user_answer: str
      //         }
      //       };
      //       this.websocketSend(this.initData);
      //       $(".choice li")
      //         .eq(iTrue)
      //         .addClass("error");
      //     } else if (this.questionInfo.correct_answer.indexOf(index) > -1) {
      //       $(".choice li")
      //         .eq(iTrue)
      //         .addClass("true");
      //       if (
      //         this.answerStr.sort().join("") ===
      //         this.questionInfo.correct_answer
      //           .split("")
      //           .sort()
      //           .join("")
      //       ) {
      //         this.isChoose = true;
      //         var str = "";
      //         this.answerStr.forEach(item => {
      //           str += item;
      //         });
      //         this.initData = {
      //           channel: "pk",
      //           action: "answer",
      //           data: {
      //             blockade_id: this.questionInfo.blockade_id,
      //             step: this.questionInfo.step,
      //             room_id: this.pkRoomInfo.room_id,
      //             question_id: this.questionInfo.question_id,
      //             user_answer: str
      //           }
      //         };
      //         this.websocketSend(this.initData);
      //       }
      //     }
      //   }
      // }
    },
  
    //websocket send方法
    
    //websocket message方法
    websocketMess() {
      this.websocket.onmessage = e => {
        let re = JSON.parse(e.data);
        let res = re.data;
        // console.log("action", re.action);
        // console.log("data", JSON.stringify(res));
        if (re.action == "end") {
          this.teamPkInfo.pk_status = 2
        }
        if (re.action == "joinReturn") {
          var joinResult = res 
          if (joinResult.error_code == 1) {
              this.websocketSend({
              channel: "teampk",
              action: "join",
              data: {
                activity_id: this.$store.state.activityId
              }
            });
          }
        }
        if (re.action == "live"){
          this.live = res
          if(this.live.msg_type == 1){
            // this.liveMsgList.push(this.live)
             this.barrageList.push({
              id: ++this.currentId,
              // avatar: "./static/avatar.jpg",
              msg: this.live.message,
              time: 10,
              type: MESSAGE_TYPE.NORMAL
            });
          }

          this.msgList.push(res)
          var container = this.$el.querySelector("#msgbox");
          // if(this.msgList.length > 20) {
          //   this.msgList.shift();
          // }
          // container.scrollTop = container.scrollHeight;
          if(this.teamPkInfo.pk_status == 0 || this.teamPkInfo.pk_status == 2 || (this.teamPkInfo.pk_status == 1 && this.teamPkInfo.role == 'viewer')){
            this.$nextTick(function(){
              document.getElementById("msgbox").scrollIntoView(false);
            });
          }
        }
        if (re.action == "question") {
          //发送题目
          this.teamPkInfo.pk_status == 1
          this.isReady = true;
          this.isChoose = false;
          this.showCountDown = false;
          this.answerStr = [];
          $(".choice li").removeClass("true");
          $(".choice li").removeClass("error");
          this.questionInfo = res;
          // this.countDownTime = this.questionInfo.count_down;
          this.totalTime = this.questionInfo.count_down;
          this.countDownTime = this.totalTime + 4;
          // this.countDownTime = 300
          // ======================
          this.timeTick = setInterval(() => {
            this.countDownTime--;
            if (this.countDownTime <= 0) {
              clearInterval(this.timeTick);
              this.showEle = {
                title: false,
                options: false
              };
              if (this.countDownTime == 0 || this.countDownTime < 0) {
                clearInterval(this.timeTick);
                if (this.isChoose == false) {
                  var userAnswer = "";
                  if (this.questionInfo.question_type == 1) {
                    userAnswer = "Z";
                  } else {
                    if (this.answerStr.length == 0) { 
                      userAnswer = "Z";
                    } else {
                      this.answerStr.forEach(item => {
                        userAnswer += item;
                      });
                    }
                  }
                  // this.websocketSend({
                  //   channel: "pk",
                  //   action: "answer",
                  //   data: {
                  //     blockade_id: this.questionInfo.blockade_id,
                  //     step: this.questionInfo.step,
                  //     room_id: this.pkRoomInfo.room_id,
                  //     question_id: this.questionInfo.question_id,
                  //     user_answer: userAnswer
                  //   }
                  // });
                }
              }
            }
          }, 1000);
          if (this.activitydata.lang.indexOf("en") > -1) {
            if (this.questionInfo.en_question_title == "") {
              this.questionTitle = this.questionInfo.question_title;
            } else {
              this.questionTitle = this.questionInfo.en_question_title;
            }
          } else if (this.activitydata.lang.indexOf("zh") > -1) {
            this.questionTitle = this.questionInfo.question_title;
          }
          // this.questionTitle = this.questionInfo.question_title;
          setTimeout(() => {
            this.showEle.number = true;
            this.showEle.title = true;
          }, 800);
          if (this.activitydata.lang.indexOf("en") > -1) {
            if (this.questionInfo.en_question_title == "") {
              this.questionOptions = this.questionInfo.question_options;
            } else {
              this.questionOptions = this.questionInfo.en_question_options;
            }
          } else if (this.activitydata.lang.indexOf("zh") > -1) {
            this.questionOptions = this.questionInfo.question_options;
          }
          console.log(this.questionOptions,'questionOptions')
          // this.questionOptions = this.questionInfo.question_options;
          setTimeout(() => {
            this.showEle.options = true;
          }, 1300);
          this.stepIndex = this.questionInfo.step;
          this.countQues = this.questionInfo.count;
          setTimeout(() => {
            this.websocketSend({
              channel: "teampk",
              action: "startAnswer",
              data: {
                team_pk_id: this.teamPkInfo.team_pk_id,
                step:this.questionInfo.step
              }
            });
          },1300)
        }
        if (re.action == "answerReturn") {
            this.isChoose = true;
            // clearInterval(this.timeTick);
            this.receiveAnswerData = res;
            var iTrue = [];
            var wIndex = 0;
            this.userTotalScore = this.receiveAnswerData.total_score;
            this.receiveAnswerData.correct_answer.split('').forEach((answerItem) => {
              let qindex = 0
              for (let quesoptions in this.questionOptions) {
                console.log(this.receiveAnswerData.user_answer)
                if(quesoptions == this.receiveAnswerData.user_answer){
                  wIndex = qindex
                  console.log(wIndex)
                }
                if(answerItem == quesoptions){
                  iTrue.push(qindex);
                }
                qindex++
              }
            })
            if (this.receiveAnswerData.is_correct == 1) {
                //正确
                iTrue.forEach((item) => {
                    $(".choice li")
                        .eq(item)
                        .addClass("true");
                })
            } else {
                $(".choice li")
                        .eq(wIndex)
                        .addClass("error");
                iTrue.forEach((item) => {
                    $(".choice li")
                        .eq(item)
                        .addClass("true");
                })
            }
        }

        if(re.action == "pkStart"){
          this.teamPkInfo.pk_status == 1
          // this.websocketSend({
          //   channel: "teampk",
          //   action: "top",
          //   data: {
          //      team_pk_id: this.teamPkInfo.team_pk_id
          //   }
          // });
          if(this.teamPkInfo.role == 'player'){
            this.countDown();
          } else {
            
          }
        }
        if(re.action == "top"){
          for (let index = 0; index < res.length; index++) {
            this.$set(this.rankList,index,res[index])
          }
        }
        if (re.action == "infoReturn"){
            console.log("result",JSON.stringify(res));
            this.teamPkInfo = res;
            this.team_pk_id = res.team_pk_id
            if(res.pk_status == 0){
              var startTime = res.start_time;
              var nowTime = parseInt(new Date().getTime()/1000);
              let i = Math.floor(startTime - nowTime);      // 开始时间距离现在有多少秒
              console.log(i)
              if(i >= 0){
                this.teamPKtimer = setInterval(() => {
                  i--;
                  var startTime = this.teamPkInfo.start_time;
                  var nowTime = parseInt(new Date().getTime()/1000);
                  var second = Math.floor(startTime - nowTime);    // 开始时间距离现在有多少秒
                  var hour = Math.floor(second / 3600);            // 整数部分代表小时；
                  second %= 3600;                                  // 余数代表 剩下的秒数；
                  var minute = Math.floor(second / 60);            // 整数部分代表分钟；
                  second %= 60;                                    // 余数代表 剩下的秒数；
                  if(hour < 10){
                    hour = '0'+hour
                  }
                  if(minute < 10){
                    minute = '0'+minute
                  }
                  if(second < 10){
                    second = '0'+second
                  }
                  this.downHtml = hour+":"+minute+":"+second
                  if (i <= 0) {
                    clearInterval(this.teamPKtimer);
                    if(this.teamPkInfo.role == 'viewer'){
                      this.teamPkInfo.pk_status = 1
                      this.goTeamout();
                    }
                    if(this.teamPkInfo.role == 'player'){
                      // this.goTeamPk();
                      this.teamPkInfo.pk_status = 1
                      this.readTime = "ready-time1"
                    }
                    this.websocketSend({
                        channel: "teampk",
                        action: "info",
                        data: {
                          activity_id: this.$store.state.activityId
                        }
                      });
                    return;
                  }
                }, 1000);
              } else {
              if(this.teamPkInfo.role == 'viewer'){
                  this.teamPkInfo.pk_status = 1
                  this.goTeamout();
                }
                if(this.teamPkInfo.role == 'player'){
                  this.teamPkInfo.pk_status = 1
                  this.websocketSend({
                    channel: "teampk",
                    action: "top",
                    data: {
                      activity_id: this.$store.state.activityId
                    }
                  });
                  // this.goTeamPk();
                }
              }
            }
            if(this.teamPkInfo.pk_status == 1){
              if(this.teamPkInfo.role == 'viewer'){
                  this.goTeamout();
                }
              if(this.teamPkInfo.role == 'player'){
                //  this.goTeamPk();
              }
            }

            if(this.teamPkInfo.pk_status == 2){
              this.websocketSend({
                channel: "teampk",
                action: "top",
                data: {
                  activity_id: this.$store.state.activityId
                }
              });
            }
        }
      };
    }
  }
};
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: #fff;
  background-size: cover;
}

.baberrage-stage-red {
  border-radius: 100px;
  background: #e68fba;
  color: #fff;
 }
 
.invite{
  width: 100%;
  height: 100%;
  /* background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: 100% 100%; */
}

.pink_container .invite{
  background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: 100% 100%;
}

.blue_container .invite{
  background: url("../blue_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: 100% 100%;
}

.purple_container .invite{
  background: url("../purple_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: 100% 100%;
}

.yellow_container .invite{
  background: url("../yellow_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: 100% 100%;
}

.red_container .invite{
  background: url("../red_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: 100% 100%;
}

.fix-notify {
  width: 100%;
  height: 100%;
}
/* .container>div {
          width: 100%;
          height: 100%;
      } */

.container .ready {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
    
.ready .ready-time {
  width: 100%;
  color: #ffe13c;
  font-size: 3.98rem;
}

.ready .ready-time1 {
  width: 100%;
  color: #ffe13c;
  font-size: 1.98rem;
}
.banner{
  width: 100%;
  height: 3.5rem;
}

.rule {
  display: inline-block;
  position: absolute;
  left: 0;
  z-index: 100;
  padding: 0.15rem 0 0.15rem;
  width: 1.5rem;
  height: 0.6rem;
  top:0.9rem;
  border-top: none;
  background: #ffc64a;
  border-bottom-right-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  text-align: center;
  line-height: 0.3rem;
  color:#fff;
}

.container .top-block {
  position: relative;
  display: flex;
  display: -webkit-flex;
  width: 100%;
  height: 4.5rem;
  justify-content: space-between;
  background-size: 100% 100%;
  position: relative;
}

.live-block{
  margin-top: 0 !important;
}

.anim{
  transition: all 0.5s;
}

.beatdown .teampk-msg-box{
    width: 100%;
    height: 0.5rem;
    background-color: #FFF2D5FF;
    margin-top: 0 !important;
    position: absolute;
    transition: all 0.5s;
    overflow: hidden;
}

.beatdown .teampk-msg-box .teampk-user-box-info{
  display: none;
  width: 100%;
  height: 100%;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.5s linear;
}

.slide-enter{
  transform: translateY(0.5rem) scale(1);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(-0.5rem) scale(1);
  opacity: 1;
}

.temapk-center{
    width: 92%;
    margin: 0 4%;
    background: #fff;
    border-radius: 0.3rem;
    min-height: 8rem;
}

.teampk-user-box{
  position: absolute;
  width: 92%;
  top:0.6rem;
  bottom: 0;
  margin: 0 4%;
  border-radius: 0.3rem;
  background-color: rgba(255, 0, 0, 0.25);
  display: flex;
}

.pink_container .teampk-user-box{
  background-color: rgba(255, 0, 0, 0.25);
}

.blue_container .teampk-user-box{
  background-color: rgba(6, 109, 115, 0.25);
}

.purple_container .teampk-user-box{
  background-color: rgba(99, 36, 188, 0.25);
}

.yellow_container .teampk-user-box{
  background-color: rgba(243, 179, 4, 0.25);
}

.red_container .teampk-user-box{
  background-color: rgba(237, 11, 11, 0.25);
}

.teampk-user-box .user-left{
  flex: 1;
  position: relative;
}

.teampk-user-box .user-left .user-background{
  position: absolute;
  width: 1.4rem;
  left: 50%;
  transform: translate(-50%,0);
}

.teampk-user-box .user-left .user-img{
  position: absolute;
  width: 1.2rem;
  left: 50%;
  transform: translate(-50%,0);
  border-radius: 0.6rem;
  top:0.38rem;
}

.teampk-user-box .user-left .teampk-user-p{
  position: absolute;
  width: 100%;
  top:1.8rem;
}

.teampk-user-box .user-left .teampk-user-p .user-p-one{
  color: #fff;
  font-size: 0.36rem;
}

.teampk-user-box .user-left .teampk-user-p .user-p-two{
  color: #FFF1A2FF;
  font-size: 0.42rem;
  padding-left:0.2rem; 
}

.teampk-user-box .user-right{
  flex: 1;
  position: relative;
}

.teampk-user-box .user-right .out-rank{
  background: none;
  height: 100%;
  padding-top:0.3rem;
  padding-bottom: 0.8rem;
}

.teampk-user-box .user-right .rank-list-body{
  height: 100%;
  overflow: hidden;
  margin: 0;
}

.teampk-user-box .user-right .rank-list{
  width: 100%;
  margin: 0;
  height: 0.55rem;
  border-bottom: 0px;
}

.teampk-user-box .user-right .rank-list .number span{
  color: #fff;
}

.teampk-user-box .user-right .rank-list .user span{
  color: #fff;
}

.teampk-user-box .user-right .rank-list .btns span{
  color: #FFF1A2FF;
}

.beatdown .teampk-msg-box p {
    padding: 0.1rem 0.2rem;
    padding-left: 0.6rem;
    background: url("../imgs/pk_msg.png") center left no-repeat ;
    background-position-x:0.2rem;
    text-align: left;
    background-size: 0.3rem 0.3rem;
    line-height: 0.3rem;
}

.container .top-block .countdown {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: #ff857e;
  position: absolute;
  left: 50%;
  transform: translate(-50%,0);
  top: 3.6rem;
}

.container .beatdown{
  width: 100%;
  height: 100%;
  background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover;
  overflow:scroll;
  -webkit-overflow-scrolling : touch;
  position:relative;
}

.pink_container .beatdown{
  background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover;
}

.purple_container .beatdown{
  background: url("../purple_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.yellow_container .beatdown{
  background: url("../yellow_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.red_container .beatdown{
  background: url("../red_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.blue_container .beatdown{
  background: url("../blue_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.container .beatdow .self-score{
  position: absolute;
  left:0;
  top:0;
}
.container .beatdow .rival-score{
  position: absolute;
  right: 0;
  top:0;
}







.container .center-block {
  display: flex;
  display: -webkit-flex;
  width: 68%;
  min-height:160px;
  justify-content: center;
  align-items: center;
  margin: 0 16%;
  line-height: 0.3rem;
  font-size: 0.34rem;
  color: #fff;
  flex-direction: column;
  border-bottom: 1px #E3E3E3FF dashed;
}




.beatdown .center-block p.detail {
  /*设置动画属性*/
  font-size: 0.34rem;
  color: #474747FF;
  line-height: 1.4;
  /* margin: 0.16rem 0; */
  text-align: left;
  min-height:1rem;
}





.beatdown .detail span {
  color: #474747FF;
}

.beatdown .detail span.isRed {
  color: #f00;
}

.container .bottom-block {
  display: flex;
  display: -webkit-flex;
  width: 100%;
  padding-bottom:0.5rem;
  /* height: 65%; */
  justify-content: space-between;
  position:relative;
  /* position:absolute; */
  /* bottom:0.7rem; */
}

.container .ready .bottom-block,
.container .result .bottom-block {
  justify-content: flex-start;
}

.beatdown .bottom-block > div {
  width: 50px;
  align-self: center;
  text-align: center;
}

.beatdown .bottom-block .self-score {
  position: absolute;
  left: 0;
  top: -2rem;
}

.beatdown .bottom-block .self-score p span{
  background:#FF7879FF;
}

.beatdown .bottom-block .rival-score p span{
  background:#2E8EF1FF;
}

.beatdown .bottom-block .rival-score {
  position: absolute;
  right: 0;
  top: -2rem;
}

.beatdown .bottom-block div > span {
  color: #b9b5ff;
  font-size: 0.34rem;
}

.beatdown .bottom-block div p {
  position: relative;
  margin: 0 auto;
  z-index: 1;
  width: 0.2rem;
  height: 6.4rem;
  background-color: #D2D2D2FF;
  border-radius: 0.14rem;
  border: solid 1px #D2D2D2FF;
}

.beatdown .bottom-block div p span {
  position: absolute;
  display: inline-block;
  left: 0;
  bottom: 0;
  width: 0.18rem;
  height: 0;
  border-radius: 0.14rem;
  z-index: 2;
  background: #fad594;
  transition: height 2s;
}

.beatdown .bottom-block .choice {
  width: 5rem;
  align-self: center;
  margin: 0 auto;
}

.beatdown .bottom-block .choice li {
  position: relative;
  width: 5rem;
  min-height: 0.96rem;
  border-radius: 0.44rem;
  background: #F2F1F6FF;
  margin: 0.3rem 0;
  text-align: center;
  line-height: 1.4;
  color: #33435e;
  font-size: 0.26rem;
  display: flex;
  align-items: center;
  padding:0.2rem 0.6rem;
}

.beatdown .bottom-block .choice li p {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem; 
  top: 50%;
  width: 3.5rem;
  transform: translate(0, -50%);
  text-align: center;
}

.beatdown .bottom-block ul li.error {
  background: url("../imgs/pk_wrong.png") center no-repeat;
  background-size: 100% 100%;
  color: #effbf5;
}

.beatdown .bottom-block ul li.true {
  background: url("../imgs/pk_sure.png") center no-repeat;
  background-size: 100% 100%;
  color: #fff;
}

.beatdown .bottom-block ul li.true span {
  display: inline-block;
  background: url("../imgs/true.png") center center no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0.33rem;
  height: 0.26rem;
  width: 0.36rem;
  right: 100%;
  margin-right: 0.2rem;
}

.beatdown .bottom-block ul li.error span {
  display: inline-block;
  background: url("../imgs/false.png") center center no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0.33rem;
  height: 0.28rem;
  width: 0.28rem;
  right: 100%;
  margin-right: 0.2rem;
}

.beatdown .bottom-img{
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
}

.beatdown .bottom-img img {
  width:100%;
}

.ready .success-tip,
.result .success-tip {
  color: #fff;
  font-size: 0.28rem;
}

.ready .success-tip span,
.result .success-tip span {
  font-size: 0.21rem;
}

.ready .center-block,
.result .center-block,
.ready .bottom-block,
.result .bottom-block,
.errorpage .center-block,
.errorpage .bottom-block {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  flex-direction: column;
  width: 68%;
}

.ready .center-block {
  padding-bottom: 0.1rem;
}

.ready .ready-self-module,
.ready .ready-rival-module {
  margin-bottom: 0.8rem;
}

.ready .ready-self-module p,
.ready .ready-rival-module p {
  width: 5.4rem;
  height: 1rem;
  line-height: 1rem;
  left: 1rem;
  text-align: center;
  font-size: 0.38rem;
  color: #64540b;
  margin: 0.2rem auto 0;
  border-radius: 0.5rem;
  background: #fff229;
}

.ready .ready-self-module p.inactive,
.ready .ready-rival-module p.inactive {
  background: #bcbcbc;
}

.ready .center-block > img,
.result .center-block > img {
  width: 5.65rem;
  height: 0.03rem;
  vertical-align: middle;
}

.ready .center-block > p,
.result .center-block > p {
  width: 100%;
  margin-bottom: 0.24rem;
}

.ready .gold-tip,
.result .gold-tip {
  /* padding: 0.24rem 0; */
  color: #e9f6ff;
  font-size: 0.4rem;
  height: 0.92rem;
  line-height: 0.92rem;
  margin-bottom: 0;
}

.result .gold-tip {
  font-size: 0;
}

.result .gold-tip i {
  font-size: 0.4rem;
}



.ready .gold-tip span,
.ready .gold-tip img,
.result .gold-tip span,
.result .gold-tip img {
  display: inline-block;
  margin-top: 0.27rem;
}
.gold-tips-number {
  color:#ffe81a;
}
.result .prize-score {
  margin-top: 0.4rem;
}

.beatdown .viewer-statu,
.result .viewer-statu {
  font-size: 0.36rem;
  letter-spacing: 1px;
  color: #fff;
}

.ready .bottom-block .waitbegin {
  display: inline-block;
  font-size: 0.42rem;
  color: #eee4ff;
}

.beatdown .viewer-btn,
.result .viewer-btn {
  background: #f9a655;
  color: #64540b;
}

.ready p img,
.result p img {
  width: 0.4rem;
  height: 0.4rem;
}

.ready p.back {
  color: #d8bfff;
  font-size: 0.28rem;
  /* margin-top: 1rem; */
}
.waitpk{
  width: 100%;
  height: 100%;
  /* background: url("../imgs/pk_bg_fail.jpg") center center no-repeat;
  background-size: cover; */
  position: relative;
}

.pink_container .waitpk{
    background: #4755b2 url("../imgs/teampk_background.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.purple_container .waitpk{
    background: #4755b2 url("../purple_imgs/teampk_background.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.yellow_container .waitpk {
    background: #4755b2 url("../yellow_imgs/teampk_background.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.red_container .waitpk {
    background: #4755b2 url("../red_imgs/teampk_background.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.blue_container .waitpk{
    background: #4755b2 url("../blue_imgs/teampk_background.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}


.waitpk img{
    width: 100%;
}

.down-out-title {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  color: #fff;
  font-size: 0.42rem;
  text-shadow:5px 2px 6px #000;
}

.waitpk .out-title {
  width: 100%;
  height: auto;
  margin: 0.1rem 0;
  /* line-height: 1rem; */
  color: #fff;
  font-size: 0.42rem;
  text-shadow:5px 2px 6px #000;
}

.waitpk .wait-time-box{
    width: 86%;
    margin: 0.2rem 7%;
    height: 2rem;
    background: #fff;
    border-radius: 0.3rem;
}

.waitpk .wait-time-box .wait-time-tip{
    padding-top:0.2rem;
    font-size: 0.4rem;
    line-height: auto;
    text-align: center;
    color: #666666FF;
}

.waitpk .wait-time-box .wait-time{
    font-size: 0.7rem;
    font-weight: 100;
    line-height: 1rem;
    text-align: center;
}

.ready-go {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../imgs/pk_bg.jpg") center center no-repeat;
  background-size: cover;
  position: relative;
}

.ready-go .ready-go-1{
  position: absolute;
  width: 2.5rem;
  height: 4rem;
  top: 2rem;
  left: 0;
}

.ready-go .ready-go-1 .ready-go-left-1{
  position: absolute;
  left: 0;
  top: 0%;
  width: 100%;
}

.ready-go .ready-go-1 .ready-go-left-2{
  position: absolute;
  width: 1.6rem;
  border-radius: 0.8rem;
  border: solid 2px #fff;
  bottom: 0.83rem;
  right: 0.15rem;
}
.ready-go .ready-go-1 .ready-go-left-3{
  position: absolute;
  color: #fff;
  bottom: 0.1rem;
  left: 0.7rem;
  font-size: 0.35rem;
}

.ready-go .ready-go-middle-1 {
  position: absolute;
  width: 3.5rem;
  top: 4.6rem;
  left: 1.7rem;
}

.ready-go .ready-go-2{
  position: absolute;
  width: 2.5rem;
  height: 4rem;
  top: 7rem;
  right: 0;
}

.out-top {
  width: 100%
}
.out-top img {
    width: 100%;
    
}

.out-rank {
    width: 100%;
    height: 4rem;
    background: #fff;
    border-radius: 0.3rem;
    float: left;
}

.rank-list-body {
    height: 3rem;
    margin: 0.5rem 0;
    overflow-y: auto;
    
}

.rank-list {
  width: 6.7rem;
  height: 0.8rem;
  margin-left: 0.2rem;
  border-bottom: 1px solid #D2D2D2FF;
  padding-right: 0.2rem;
}
 .rank-list:last-child{
    border-bottom: 0px solid rgba(7,17,27,0.1)
}

.rank-list {
  padding-right: 0;
}


.rank-list.vux-flexbox,
.rank-list-head.vux-flexbox {
  text-align: center;
}

.out-sms-box{
  position: absolute;
  bottom :0;
  left: 0;
  right: 0;
  top:7.2rem;
  /* background: #FFE6E5FF; */
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}

.pink_container .out-sms-box{
  background: #FFE6E5FF;
}

.purple_container .out-sms-box{
  background: #f1e7ff;
}

.blue_container .out-sms-box{
  background: #c5e3ff;
}

.yellow_container .out-sms-box{
  background: #fff6dd;
}

.red_container .out-sms-box{
  background: #ffe5e4;
}


.out-sms-list{
  position: absolute;
  top: 0.3rem;
  bottom: 1rem;
  left: 0;
  right: 0;
  padding: 0 0.4rem;
  overflow: hidden;
  overflow-y: scroll;
}

.out-sms-list .sms-list-box{
  position: relative;
  bottom: 0;
  min-height: 100%;
}
.out-sms-list .out-sms-info{
  width: 100%;
  min-height: 0.5rem;
  line-height: 0.4rem;
  color: #666666FF;
  font-size: 0.3rem;
  text-align: left;
  word-wrap: break-word;
}

.down-out-rank {
    width: 100%;
    height: 4rem;
    background: #fff;
    border-radius: 0.3rem;
}

.down-out-rank .rank-list-body {
    height: 3rem;
    margin: 0.5rem 0;
    overflow-y: auto;
}

.down-out-rank .rank-list {
  width: 6.7rem;
  height: 0.8rem;
  margin-left: 0.2rem;
  border-bottom: 1px solid #D2D2D2FF;
  padding-right: 0.2rem;
}
 .down-out-rank .rank-list:last-child{
    border-bottom: 0px solid rgba(7,17,27,0.1)
}

.down-out-rank .rank-list {
  padding-right: 0;
}

.down-out-rank .number {
  text-align: center;
}

.down-out-rank .number img {
  width: 0.42rem;
  height: auto;
  vertical-align: middle;
}

.down-out-rank .number span {
  font-size: 0.3rem;
  color: #ad9ec2;
}

.down-out-rank.user span,
.down-out-rank .dept span,
.down-out-rank .btns .is-invite,
.down-out-rank .btns .is-test .rank-list span {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
}

.down-out-rank .user span {
  max-width: 67%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.down-out-rank .user img,
.down-out-rank .user span {
  float: left;
  display: inline-block;
}

.down-out-rank .user img {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.1rem;
}

.down-out-rank .user span {
  font-size: 0.26rem;
  color: #666666FF;
}

.down-out-rank .dept span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.26rem;
  color: #666666FF;
}

.down-out-rank .btns .is-invite,
.down-out-rank .btns .is-test {
  float: right;
  width: 1.22rem;
  font-size: 0.24rem;
  border-radius: 0.21rem;
}

.out-sms-list .out-sms-info .system1{
  background: #FF7F79FF;
  color: #fff;
  font-size: 0.24rem;
  padding: 0.06rem 0.2rem;
  border-radius: 0.2rem;
}

.out-sms-list .out-sms-info .system2{
  background: #FFB745FF;
  color: #fff;
  font-size: 0.24rem;
  padding: 0.06rem 0.2rem;
  border-radius: 0.2rem;
}

.out-sms-list .out-sms-info .system0{
  color: #83BCF2FF;
  font-size: 0.32rem;
  padding-right: 0.2rem;
  font-weight: bold;
  float: left;
}

.out-sms-text{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1rem;
}

.out-sms-text input{
  width: 6rem;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  position: absolute;
  left: 0;
  bottom: 0;
  right: 2rem;
}

.out-sms-text button{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #67c23a;
    border: 1px solid #dcdfe6;
    color: #fff;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    height: 40px;
    font-size: 14px;
    border-radius: 4px;
    border-color: #67c23a;
    position: absolute;
    bottom: 0;
    right: 0;
}


.number {
  text-align: center;
}

.number img {
  width: 0.42rem;
  height: auto;
  vertical-align: middle;
}

.number span {
  font-size: 0.3rem;
  color: #ad9ec2;
}

.user span,
.dept span,
.btns .is-invite,
.btns .is-test .rank-list span {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
}

.user span {
  max-width: 67%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user img,
.user span {
  float: left;
  display: inline-block;
}

.user img {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.1rem;
}

.user span {
  font-size: 0.26rem;
  color: #666666FF;
}

.dept span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.26rem;
  color: #666666FF;
}

.btns .is-invite,
.btns .is-test {
  float: right;
  width: 1.22rem;
  font-size: 0.24rem;
  border-radius: 0.21rem;
}

.is-invite {
  color: #704e04;
  background-color: #f8d445;
}

.is-test {
  background-color: transparent;
  border: solid 1px #684896;
  color: #684896;
}

.wait {
  float: right;
  margin-right: 0.3rem;
}

.dept-user .btns .is-invite {
  width: 0.8rem;
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.2rem;
  margin-right: 0.2rem;
}

.rank .dept-user .user img {
  float: left;
  margin-top: 0.26rem;
}

.rank .dept-user .user p {
  float: left;
  width: 58%;
}

.rank .dept-user .user p span {
  float: none;
  text-align: left;
  max-width: 100%;
  display: block;
}

.rank .dept-user .user p span:first-of-type {
  line-height: 0.74rem;
  font-size: 0.22rem;
}

.rank .dept-user .user p span:last-of-type {
  line-height: 0.34rem;
  font-size: 0.22rem;
}

.ready-go .ready-go-2 .ready-go-right-1{
  position: absolute;
  right: 0;
  top: 0%;
  width: 100%;
}

.ready-go .ready-go-2 .ready-go-right-2{
  position: absolute;
  width: 1.6rem;
  border-radius: 0.8rem;
  border: solid 2px #fff;
  top: 0.12rem;
  left: 0.12rem;
}
.ready-go .ready-go-2 .ready-go-right-3{
  position: absolute;
  color: #fff;
  top: -0.6rem;
  left: 0.7rem;
  font-size: 0.35rem;
}


/* .ready-go > img {
  width: 1.04rem;
  height: 1.04rem;
  margin: 0 0.6rem;
  margin-top: 1.8rem;
}

.ready-go p img {
  display: inline-block;
  width: 1.54rem;
  height: 1.54rem;
  border: 0.02rem solid #e6f5ff;
  border-radius: 50%;
  margin-top: 1.8rem;
}

.ready-go p span {
  display: block;
  font-size: 0.3rem;
  color: #b3b0ff;
} */

.result .top-block {
  position: relative;
}

.result .top-block .self {
  width: 3.75rem;
}

.result .top-block .rival {
  width: 3.75rem;
}

.result .top-block .self .self-avatar,
.result .top-block .rival .rival-avatar {
  width: 1.4rem;
}

.result .top-block .rival .rival-avatar {
  margin-left:2.35rem;
}

.result .top-block .self-result {
  width: 2.5rem;
  height: 1.2rem;
  background: #EF4D45FF;
  padding-left: 0.74rem;
  border-top-right-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
}

.result .top-block .self-result.win {
  width: 4rem;
  height: 1.26rem;
  padding-left: 0.74rem;
  border-top-right-radius: 0.63rem;
  border-bottom-right-radius: 0.63rem;
}

.result .top-block .self-result.fail {
  width: 2.5rem;
  height: 1.2rem;
  padding-left: 0.74rem;
  border-top-right-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
}

.result .top-block .rival-result {
  width: 2.5rem; 
  height: 1.2rem;
  background: #0178FEFF;
  padding-right: 0.74rem;
  border-top-left-radius: 0.6rem;
  border-bottom-left-radius: 0.6rem;
  float: right;
}

.result .top-block .rival-result.win {
  width: 2.5rem;
  height: 1.2rem;
  padding-right: 0.74rem;
  border-top-left-radius: 0.6rem;
  border-bottom-left-radius: 0.6rem;
  float: right;
}

.result .top-block .rival-result.fail {
  width: 3.5rem;
  height: 1.26rem;
  padding-left: 2.05rem;
  float: right;
  border-top-left-radius: 0.63rem;
  border-bottom-left-radius: 0.63rem;
}

.result .top-block .self-result .self-name {
  font-size: 0.24rem;
  color: #c4e8ff;
  margin-top: 0;
  height: 0.42rem;
  text-align: left;
  padding: 0;
}

.result .top-block .rival-result .rival-name {
  font-size: 0.24rem;
  color: #c4e8ff;
  margin-top: 0;
  height: 0.42rem;
  padding: 0;
}

.result.viewer .top-block p.self-name {
  width: 100%;
  text-align: left;
  padding-left: 0.7rem;
  font-size: 0.24rem;
  color: #c4e8ff;
  padding-right: 0.4rem;
  margin-top: 0.1rem;
}

.result.viewer .top-block p.rival-name {
  width: 100%;
  text-align: left;
  font-size: 0.24rem;
  color: #c4e8ff;
  padding-left: 2.3rem;
  margin-top: 0.1rem;
}

.result .top-block .self-result .self-score {
  float: left;
  font-size: 0.26rem;
  color: #fff;
  line-height: 1.2rem;
}

.result .top-block .rival-result .rival-score {
  font-size: 0.26rem;
  color: #fff;
  text-align: right;
  line-height: 1.2rem;
}

.result .top-block .self-result .self-score span,
.result .top-block .rival-result .rival-score span {
  font-size: 0.46rem;
}

.result-bg {
  position: absolute;
  text-align: center;
  width: 100%;
}

.result-bg img {
  width: 2.8rem;
  height: 2.8rem;
  vertical-align: middle;
  position: absolute;
  transform: translate(-50%, 0);
  top: -2.4rem;

}

.result .bottom-block {
  width: 100%;
  height: 34%;
}

.result .bottom-block p.continue {
  width: 5.8rem;
  height: 1rem;
  line-height: 1rem;
  left: 1rem;
  text-align: center;
  font-size: 0.38rem;
  color: #64540BFF;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: #FFC64AFF;
  display: inline-block;
  margin: 0 0.3rem;
}

.result .bottom-block p.border-continue {
  background: #FFC64AFF;
  border: 0.02rem solid #FFC64AFF;
  color: #64540BFF;
}

.result .bottom-block p.end-back {
  width: 5.4rem;
  height: 1rem;
  line-height: 1rem;
  left: 1rem;
  text-align: center;
  font-size: 0.38rem;
  color: #64540b;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: #fff229;
}

.result .bottom-block .back {
  margin-top: 0.8rem;
  color: #fff;
  font-size: 0.34rem;
}

.errorpage .center-block p {
  margin: 2rem auto 4rem;
}

.errorpage .bottom-block p {
  width: 5.4rem;
  height: 1rem;
  line-height: 1rem;
  left: 1rem;
  text-align: center;
  font-size: 0.38rem;
  color: #64540b;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: #fff229;
}

.detail .weight-tip {
  color: #fff229;
  font-weight: 500;
}

.detail .weight-tip span {
  color: #fff229;
  font-weight: 500;
  font-size: 0.4rem;
}

.shareGuide {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.shareGuide .shareGuideImg {
  z-index: 200;
  opacity: 1;
  text-align: right;
}

.shareGuide .shareGuideImg img {
  max-width: 50%;
  margin-right: 1rem;
  margin-top: 0.1rem;
  height: auto;
}

.result .bottom-block .share-desc {
  margin-bottom: 0.4rem;
}

.result .bottom-block .share-desc span {
  padding: 0 0.6rem;
  display: block;
  text-align: center;
  color: #fff;
  font-size: 0.36rem;
  line-height: 0.56rem;
}
</style>
<style>
.bounce-enter-active {
  animation: bounce-in 0.4s;
}

.bounce-leave-active {
  animation: bounce-in 0.4s reverse;
}

.bouncedelay-enter-active {
  animation: bounce-in 0.4s;
}

.bouncedelay-leave-active {
  animation: bounce-in 0.4s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>