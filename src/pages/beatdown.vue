<template>
  <div :class="className.container + ' container'">
    <div v-show="hideHistory">
      <div class="result viewer">
        <div class="top-block no-beat"></div>
        <div class="center-block">
          <p class="viewer-statu">PK已结束！</p>
        </div>
        <div class="bottom-block">
          <p class="end-back viewer-btn" @click="goPage">返回首页（{{viewerCount}}s）</p>
        </div>
      </div>
    </div>
    <div v-show="!hideHistory && isRoomInfo">
      <div class="ready" v-if="pkStatus==1 ||(pkStatus==2 && selfInfo.userType!=3)">
        <div class="top-block">
          <div class="self animated fadeInLeft">
            <p class="self-avatar">
              <img :src="selfInfo.selfAvatar">
            </p>
            <p class="self-name">{{selfInfo.selfName}}</p>
          </div>
          <div class="rival animated fadeInRight">
            <p class="rival-avatar">
              <img :src="rivalInfo.rivalAvatar">
            </p>
            <p class="rival-name">{{rivalInfo.rivalName}}</p>
          </div>
        </div>
        <div class="center-block">
          <p class="success-tip">
            获胜奖励
            <span>（知识币）</span>
          </p>
          <img src="../imgs/line.png" alt>
          <p class="gold-tip">
            <img src="../imgs/gold.png" alt>
            &nbsp;&nbsp;{{pkRoomInfo.knowledge_money}}
          </p>
          <img src="../imgs/line.png" alt>
        </div>
        <div class="bottom-block">
          <div class="ready-self-module" v-if="selfInfo.userType=='1'">
            <p @click="invite()" v-if="this.pkStatus == 1">邀请好友</p>
            <p @click="startGame()" :class="pkStatus==1?'inactive':''">开始游戏</p>
          </div>
          <div class="ready-rival-module" v-if="selfInfo.userType=='0' || selfInfo.userType=='2'">
            <p @click="joinGame()" v-if="pkStatus==1" :class="pkStatus==2?'inactive':''">加入对战</p>
            <span class="waitbegin" v-if="pkStatus==2">正在等待房主开启游戏</span>
          </div>
          <p class="back" @click="goPage">返回首页 ></p>
        </div>
      </div>
      <div class="ready-go" v-if="(pkStatus==3 && showPK==true && selfInfo.userType=='1') || (pkStatus==3 && showPK==true && selfInfo.userType=='2')" >
        <p class="ready-go-1">
          <img v-if="activitydata.top_background_color == 'pink'" class="ready-go-left-1" src="../imgs/pk_left.png">
          <img v-if="activitydata.top_background_color == 'purple'" class="ready-go-left-1" src="../purple_imgs/pk_left.png">
          <img v-if="activitydata.top_background_color == 'blue'" class="ready-go-left-1" src="../blue_imgs/pk_left.png">
          <img v-if="activitydata.top_background_color == 'yellow'" class="ready-go-left-1" src="../yellow_imgs/pk_left.png">
          <img v-if="activitydata.top_background_color == 'red'" class="ready-go-left-1" src="../red_imgs/pk_left.png">
          <img class="ready-go-left-2" :src="selfInfo.selfAvatar">
          <span class="ready-go-left-3">{{selfInfo.selfName}}</span>
        </p>
        <img class="ready-go-middle-1" src="../imgs/pk_middle.png" alt>
        <p class="ready-go-2">
          <img v-if="activitydata.top_background_color == 'pink'" class="ready-go-right-1" src="../imgs/pk_right.png">
          <img v-if="activitydata.top_background_color == 'purple'" class="ready-go-right-1" src="../purple_imgs/pk_right.png">
          <img v-if="activitydata.top_background_color == 'blue'" class="ready-go-right-1" src="../blue_imgs/pk_right.png">
          <img v-if="activitydata.top_background_color == 'yellow'" class="ready-go-right-1" src="../yellow_imgs/pk_right.png">
          <img v-if="activitydata.top_background_color == 'red'" class="ready-go-right-1" src="../red_imgs/pk_right.png">
          <img class="ready-go-right-2" :src="rivalInfo.rivalAvatar">
          <span class="ready-go-right-3">{{rivalInfo.rivalName}}</span>
        </p>
      </div>
      <div
        class="beatdown"
        v-if="(pkStatus==3 && showPK==false && selfInfo.userType=='1') || (pkStatus==3 && showPK==false && selfInfo.userType=='2')"
      >
        <div class="top-block">
          <div class="self animated fadeInLeft">
            <p class="self-avatar">
              <span class="self-name">{{selfInfo.selfName}}</span>
              <img :src="selfInfo.selfAvatar">
            </p>
            
          </div>
          <div class="countdown" v-show="this.countDownTime <= 10">
            <x-circle
              :percent="100-countDownTime*10"
              :stroke-width="10"
              :trail-width="10"
              :stroke-color="strokeColor2"
              trail-color="#ffd2bf"
            >
              <span
                :style="{color:'#000',fontSize:'16px'}"
              >{{this.countDownTime>0?this.countDownTime:'0'}}</span>
            </x-circle>
          </div>
          <div class="rival animated fadeInRight">
            <p class="rival-avatar">
              <img :src="rivalInfo.rivalAvatar">
              <span class="rival-name">{{rivalInfo.rivalName}}</span>
            </p>
            
          </div>
          <transition name="bounce">
            <p v-show="showEle.number" class="detail">
              <span v-if="stepIndex!=countQues">第 {{stepIndex}}/{{countQues}} 题</span>
              <span v-else class="weight-tip">
                最后一题&nbsp;&nbsp;双倍得分
                <span>X2</span>
              </span>
            </p>
          </transition>
        </div>
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
          <div class="self-score">
            <span>{{selfInfo.selfScore}}</span>
            <p>
              <span></span>
            </p>
          </div>
          <transition name="bounce">
            <ul class="choice" v-show="showEle.options">
              <li @click="verify(i,$event)" v-for="(item,i) in questionOptions" :key="this">
                <!-- <span></span> -->
                <p>{{item}}</p>
              </li>
            </ul>
          </transition>
          <div class="rival-score">
            <span>{{rivalInfo.rivalScore}}</span>
            <p>
              <span></span>
            </p>
          </div>
        </div>
        <div class="bottom-img">
          <img v-if="activitydata.top_background_color == 'pink'" src="../imgs/pk_bottom.png">
          <img v-if="activitydata.top_background_color == 'purple'" src="../purple_imgs/pk_bottom.png">
          <img v-if="activitydata.top_background_color == 'yellow'" src="../yellow_imgs/pk_bottom.png">
          <img v-if="activitydata.top_background_color == 'blue'" src="../blue_imgs/pk_bottom.png">
          <img v-if="activitydata.top_background_color == 'red'" src="../red_imgs/pk_bottom.png">
        </div>
      </div>
      <div
        class="result viewer"
        v-if="(pkStatus==3 && selfInfo.userType==3) || (pkStatus==2 && selfInfo.userType==3)"
      >
        <div class="top-block no-beat">
          <div class="self animated fadeInLeft">
            <p class="self-avatar">
              <img :src="selfInfo.selfAvatar">
            </p>
            <p class="self-name">{{selfInfo.selfName}}</p>
          </div>
          <div class="rival animated fadeInRight">
            <p class="rival-avatar">
              <img :src="rivalInfo.rivalAvatar">
            </p>
            <p class="rival-name">{{rivalInfo.rivalName}}</p>
          </div>
        </div>
        <div class="center-block">
          <p class="viewer-statu">对战进行中！</p>
        </div>
        <div class="bottom-block">
          <p class="end-back viewer-btn" @click="goPage">返回首页（{{viewerCount}}s）</p>
        </div>
      </div>
      <div
        class="result"
        v-if="(pkStatus==0 && selfInfo.userType=='1') || (pkStatus==0 && selfInfo.userType=='2')"
      >
        <div :class="userdata.user_id == pkRoomInfo.win_user_id?'top-block':'top-block no-beat'">
          <div class="self animated fadeInLeft">
            <p class="self-avatar">
              <img :src="selfInfo.selfAvatar">
              <span class="self-name">{{selfInfo.selfName}}</span>
            </p>
            <div
              :class="pkRoomInfo.win_user_id==0?'self-result':pkRoomInfo.sponsor_user_id==pkRoomInfo.win_user_id?'self-result win':pkRoomInfo.challenger_user_id==pkRoomInfo.win_user_id?'self-result fail':''"
            >
              <!-- <p class="self-name">{{selfInfo.selfName}}</p> -->
              <p class="self-score">
                <span>{{selfInfo.selfScore}}</span>分
              </p>
            </div>
          </div>
          <div class="rival animated fadeInRight">
            <p class="rival-avatar">
              <img :src="rivalInfo.rivalAvatar">
              <span class="rival-name">{{rivalInfo.rivalName}}</span>
            </p>
            <div
              :class="pkRoomInfo.win_user_id==0?'rival-result':pkRoomInfo.sponsor_user_id==pkRoomInfo.win_user_id?'rival-result fail':pkRoomInfo.challenger_user_id==pkRoomInfo.win_user_id?'rival-result win':''"
            >
              <!-- <p class="rival-name">{{rivalInfo.rivalName}}</p> -->
              <p class="rival-score">
                <span>{{rivalInfo.rivalScore}}</span>分
              </p>
            </div>
          </div>
          <div class="result-bg">
            <img
              v-if="userdata.user_id == pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0"
              src="../imgs/beat.jpg"
              alt
            >
            <img
              v-if="userdata.user_id != pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0"
              src="../imgs/fail.png"
              alt
            >
            <img v-if="pkRoomInfo.win_user_id==0" src="../imgs/equal.png" alt>
          </div>
        </div>
        <div class="center-block">
          <p class="success-tip">{{pkLevelInfo.name}}</p>
          <img src="../imgs/line.png" alt>
          <p class="gold-tip">
            <template v-if="pkLevelInfo.standard">
              <img v-for="i in pkLevelInfo.number" :key="i" src="../imgs/star.png" />
              <img v-for="i in pkLevelInfo.needNum" :key="i" src="../imgs/glaystar.png" />
            </template>
            <template v-if="!pkLevelInfo.standard">
              <img src="../imgs/star.png" />
              <i class="gold-tips-number">×{{pkLevelInfo.number || 0}}</i>
            </template>
          </p>
          <img src="../imgs/line.png" alt>
          <p
            class="prize-score"
            v-if="pkResultInfo.knowledge_money!=0 && userdata.user_id == pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0"
          >知识币+{{pkResultInfo.actual_knowledge_money}}</p>
          <p
            class="prize-score"
            v-if="pkResultInfo.knowledge_money!=0 && userdata.user_id != pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0"
          >知识币-{{pkResultInfo.actual_knowledge_money}}</p>
        </div>
        <div class="bottom-block">
          <!-- <p class="share-desc" v-if="userdata.user_id == pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0">
              <span>恭喜亲战胜对手，你就是学霸本霸</span>
            </p>
            <p class="share-desc" v-if="userdata.user_id != pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0">
              <span>对方比你略胜一筹，别气馁，再次发起新一轮的挑战吧！</span>
            </p>
            <p class="share-desc" v-if="pkRoomInfo.win_user_id==0">
              <span>两位亲在本轮对决中实力相当啊，再战一轮吧！</span>
          </p>-->
          <div>
            <!-- <p
              class="continue"
              @click="invite()"
              v-if="userdata.user_id == pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0"
            >分享胜利战报</p>
            <p
              class="continue border-continue"
              @click="invite()"
              v-if="userdata.user_id != pkRoomInfo.win_user_id || pkRoomInfo.win_user_id==0"
            >分享战报</p> -->
            <p
              class="continue"
              @click="goPK"
              v-if="userdata.user_id != pkRoomInfo.win_user_id || pkRoomInfo.win_user_id==0"
            >继续挑战</p>
            <p
              class="continue border-continue"
              @click="goPK"
              v-if="userdata.user_id == pkRoomInfo.win_user_id && pkRoomInfo.win_user_id!=0"
            >继续挑战</p>
          </div>
          <p class="back" @click="goPage">返回首页 ></p>
        </div>
      </div>
      <div class="result viewer-result" v-if="pkStatus==0 && selfInfo.userType=='3'">
        <div class="top-block no-beat">
          <div class="self animated fadeInLeft">
            <p class="self-avatar">
              <img :src="selfInfo.selfAvatar">
            </p>
            <div
              :class="pkRoomInfo.win_user_id==0?'self-result':pkRoomInfo.sponsor_user_id==pkRoomInfo.win_user_id?'self-result win':pkRoomInfo.challenger_user_id==pkRoomInfo.win_user_id?'self-result fail':''"
            >
              <p class="self-name">{{selfInfo.selfName}}</p>
              <p class="self-score">
                <span>{{selfInfo.selfScore}}</span>分
              </p>
            </div>
          </div>
          <div class="rival animated fadeInRight">
            <p class="rival-avatar">
              <img :src="rivalInfo.rivalAvatar">
            </p>
            <div
              :class="pkRoomInfo.win_user_id==0?'rival-result':pkRoomInfo.sponsor_user_id==pkRoomInfo.win_user_id?'rival-result fail':pkRoomInfo.challenger_user_id==pkRoomInfo.win_user_id?'rival-result win':''"
            >
              <p class="rival-name">{{rivalInfo.rivalName}}</p>
              <p class="rival-score">
                <span>{{rivalInfo.rivalScore}}</span>分
              </p>
            </div>
          </div>
        </div>
        <div class="center-block">
          <p class="viewer-statu">对战已结束！</p>
        </div>
        <div class="bottom-block">
          <p class="end-back viewer-btn" @click="goPage">返回首页（{{viewerCount}}s）</p>
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
    </div>
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
    <toast v-if="$store.state.showOffline==true" :showIndex="5" :errMsg="$store.state.offlineMsg"></toast>
    <!-- <notify v-if="showNotify==true" :inviteUserId="inviteUserId" :inviteUserName="inviteUserName"></notify> -->
  </div>
</template>

<script>
import waitAvatar from "@/imgs/wait.png";
import { setCookie, getCookie } from "../js/cookie.js";
import { XCircle } from "vux";
import { GetUrlParam, beAvatar } from "../js/util.js";
import { Base64 } from "js-base64";
import { setTimeout } from "timers";
import toast from "@/component/toast";
import popup from "@/component/popup";
import notify from "@/component/notify";
let url = "",
  title = "",
  desc = "";
export default {
  name: "beatdown",
  data() {
    return {
      timer: null,
      className: {},
      aniObj: "", //动画对象
      aniNum: 0, //加减星星数
      showVertify: false, //弹出验证弹层
      hideHistory: false,
      isRoomInfo: false,
      shareDesc: "",
      viewerCount: "", //倒计时
      initData: {
        //客户端传给服务端
        channel: "",
        action: "",
        data: {}
      },
      selfInfo: {
        //自己信息
        selfName: "",
        selfAvatar: "",
        selfScore: 0,
        selfId: "",
        userType: "1", //0旁观者/挑战者   1房主  2挑战者  3旁观者
        dept: ""
      },
      rivalInfo: {
        //对方信息
        rivalName: "等待加入...",
        rivalAvatar: waitAvatar,
        rivalScore: 0,
        rivalId: "",
        dept: ""
      },
      notCompleteData: {
        //未完成房间信息
        room_id: 1
      },
      timeTick: null,
      countDownTime: 0,
      isChoose: false, //是否已经选择
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
      strokeColor2: "#c65528",
      pkStatus: 1, //pk状态
      pkLevelInfo: {}, //pk结束等级信息
      createRoomReturnInfo: {
        //创建房间返回信息
      },
      pkRoomInfo: {
        //PK房间信息
      },
      questionInfo: {
        //问题信息
      },
      questionInfoPage: {
        //问题信息
      },
      answerReturnInfo: {
        //答题信息
      },
      answerInfo: {
        //答案信息
      },
      pkResultInfo: {
        //PK结果信息
      },
      showError: false, //是否显示错误页面
      showIndex: 0,
      errorInfo: "", //错误提醒消息
      showPK: false, //开始游戏是否开始答题
      pkresult: 1, //pk结果
      showEle: {
        //元素显示
        title: false,
        options: false,
        number: false
      },
      showCountDown: false, //显示倒计时
      showShareGuide: false, //显示分享引导
      showNotify: false,
      notifyList: [
        // {
        // showNotify: false,
        // inviteUserId: 0,
        // inviteUserName: ''
        // }
      ],
      inviteUserId: 0,
      inviteUserName: "",
      showPopup: false,
      refuseUserName: "",
      msgIndex: 0,
      answerStr: [] //多选题选项数组
    };
  },
  components: {
    XCircle,
    toast,
    notify
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
    },
    roomid() {
      return this.pkRoomInfo.room_id;
    }
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

    if (this.$route.query.start_sign) {
      this.showPK = true;
    }
    this.getRoomInfo();
    try {
      if (this.userdata.platform == "yst") {
        if (window.dd) {
          dd.postMessage({
            name: "pk",
            desc: this.activitydata.dingtalk_share_pk.replace(
              "[my_name]",
              this.userdata.name
            ),
            roomid: this.roomid
          });
          dd.onMessage = e => {};
        }
      }
    } catch (error) {}
    if (this.websocket) {
      if (this.websocket.readyState == 1) {
        this.websocketMess();
      } else {
        setTimeout(() => {
          this.websocketMess();
        }, 1000);
      }
    } else {
      setTimeout(() => {
        if (this.websocket.readyState == 1) {
          this.websocketMess();
        } else {
          setTimeout(() => {
            this.websocketMess();
          }, 1000);
        }
      }, 1000);
    }

    if (this.userdata.is_blockade_success != 1) {
      this.showError = true;
      this.showIndex = 4;
      this.errorInfo = "你还未完成必答，暂不能进行PK对决,快去完成必答吧";
    }
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
    clearInterval(this.timer);
    this.websocketSend({
      channel: "pk",
      action: "leave",
      data: {
        room_id: this.pkRoomInfo.room_id
      }
    });
  },
  methods: {
    getSharemsg() {
      let access_token = GetUrlParam("access_token");
      let activity_id = GetUrlParam("activity_id");
      // if (this.userdata.platform == "dingtalk") {
      let data = {
        activityId: activity_id,
        share_type: "share_pk",
        room_id: this.$route.query.room_id || 0,
        access_token: access_token
      };
      if (window.dd) {
        dd.postMessage(data);

        dd.onMessage = e => {
          console.log(e);
        };
      }
    },
    getRoomInfo() {
      this.$ajax
        .get(
          "/api/pk/room/info?activity_id=" +
            this.$store.state.activityId +
            "&room_id=" +
            this.$route.query.room_id +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          let re = response.data;
          let res = re.data;
          if (re.error_code != 0 && re.error_code != undefined) {
            if (re.error_code == 302) {
              let locationNow = window.location.href;
              window.location.href =
                re.redirect + "&redirect=" + encodeURIComponent(locationNow);
              return;
            }
            this.hideHistory = true;
            this.countDown();
            return;
          }
          if (res) {
            //服务器返回房间信息
            this.pkRoomInfo = res;
            this.isRoomInfo = true;
            //双方姓名，头像显示
            this.selfInfo.selfName = this.pkRoomInfo.sponsor_name;
            this.selfInfo.selfAvatar =
              this.pkRoomInfo.sponsor_headpic_url ||
              beAvatar(
                this.pkRoomInfo.sponsor_name,
                58,
                "20px PingFangSC-Medium"
              );
            if (this.pkRoomInfo.challenger_user_id != 0) {
              this.rivalInfo.rivalName = this.pkRoomInfo.challenger_name;
              this.rivalInfo.rivalAvatar =
                this.pkRoomInfo.challenger_headpic_url ||
                beAvatar(
                  this.pkRoomInfo.challenger_name,
                  58,
                  "20px PingFangSC-Medium"
                );
            } else {
              this.rivalInfo.rivalName = "等待加入...";
              this.rivalInfo.rivalAvatar =
                this.pkRoomInfo.challenger_headpic_url ||
                beAvatar("等待", 58, "20px PingFangSC-Medium");
            }
            this.pkStatus = this.pkRoomInfo.status;
            //错误消息
            if (re.error_code != 0 && re.error_code != undefined) {
              this.errorInfo = re.message;
              this.showError = true;
              this.showIndex = 2;
            }
            if (re.error_code == 0) {
              if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
                url =
                  window.location.origin +
                  "/api/pk/room/" +
                  this.$route.query.room_id +
                  "?activity_id=" +
                  this.$store.state.activityId;
                title = this.activitydata.share_pk_title;
                desc = this.activitydata.share_pk_desc;
              } else {
                url =
                  window.location.origin +
                  "/api?activity_id=" +
                  this.$store.state.activityId;
                title = this.activitydata.share_home_title;
                desc = this.activitydata.share_home_desc;
              }
            }
            //活动过期
            if (this.pkStatus == 4) {
              this.errorInfo = "PK已过期";
              this.showError = true;
              this.showIndex = 2;
            }

            if (this.pkStatus == 1) {
              //等待对方应战

              //根据房间信息中的用户id判断当前用户所属角色
              if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
                //房间创建者
                this.selfInfo.userType = "1";
              } else {
                //挑战者
                this.selfInfo.userType = "0";
              }
            }

            if (this.pkStatus == 2) {
              //等待房主开启游戏

              //根据房间信息中的用户id判断当前用户所属角色
              if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
                //房间创建者
                this.selfInfo.userType = "1";
              } else if (
                this.userdata.user_id == this.pkRoomInfo.challenger_user_id
              ) {
                //挑战者
                this.selfInfo.userType = "2";
              } else {
                this.selfInfo.userType = "3";
                this.countDown();
              }
            }

            if (this.pkStatus == 3) {
              //pk进行中
              //根据房间信息中的用户id判断当前用户所属角色
              if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
                //房间创建者
                this.selfInfo.userType = "1";
              } else if (
                this.userdata.user_id == this.pkRoomInfo.challenger_user_id
              ) {
                //挑战者
                this.selfInfo.userType = "2";
              } else {
                this.selfInfo.userType = "3";
                this.countDown();
              }
            }

            if (this.pkStatus == 0) {
              //pk结束
              this.getSharemsg();

              this.pkResultInfo.actual_knowledge_money = this.pkRoomInfo.knowledge_money;
              this.pkResultInfo.knowledge_money = this.pkRoomInfo.knowledge_money;
              // this.getShareDesc();
              this.selfInfo.selfScore = this.pkRoomInfo.sponsor_score;
              this.rivalInfo.rivalScore = this.pkRoomInfo.challenger_score;
              //根据房间信息中的用户id判断当前用户所属角色
              if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
                //房间创建者
                this.selfInfo.userType = "1";
                if (this.pkRoomInfo.win_user_id == 0) {
                  this.pkresult = 2; //平局
                } else if (
                  this.userdata.user_id == this.pkRoomInfo.win_user_id
                ) {
                  this.pkresult = 1; //胜利
                } else {
                  this.pkresult = 3; //失败
                }
                this.pkLevelInfo.name = res.sponsor_user_level_name_now;
                this.pkLevelInfo.nameago = res.sponsor_user_level_name_ago;
                this.pkLevelInfo.number = Number(res.sponsor_user_star_now);
                this.pkLevelInfo.standard = Number(res.sponsor_level_need_star);
                if (this.pkLevelInfo.standard == 0) {
                  this.pkLevelInfo.needNum = 0;
                } else {
                  this.pkLevelInfo.needNum =
                    this.pkLevelInfo.standard - this.pkLevelInfo.number;
                }
              } else if (
                this.userdata.user_id == this.pkRoomInfo.challenger_user_id
              ) {
                //挑战者
                this.selfInfo.userType = "2";
                if (this.pkRoomInfo.win_user_id == 0) {
                  this.pkresult = 2; //平局
                } else if (
                  this.userdata.user_id == this.pkRoomInfo.win_user_id
                ) {
                  this.pkresult = 1; //胜利
                } else {
                  this.pkresult = 3; //失败
                }
                this.pkLevelInfo.name = res.challenger_user_level_name_now;
                this.pkLevelInfo.nameago = res.challenger_user_level_name_ago;
                this.pkLevelInfo.number = Number(res.challenger_user_star_now);
                this.pkLevelInfo.standard = Number(res.challenger_level_need_star);
                if (this.pkLevelInfo.standard == 0) {
                  this.pkLevelInfo.needNum = 0;
                } else {
                  this.pkLevelInfo.needNum =
                    this.pkLevelInfo.standard - this.pkLevelInfo.number;
                }
              } else {
                this.selfInfo.userType = "3";
                this.countDown();
              }
            }
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    //倒计时
    countDown() {
      let i = 3;
      this.viewerCount = String(i);
      this.timer = setInterval(() => {
        i--;
        this.viewerCount = String(i);
        if (i == 0) {
          clearInterval(this.timer);
          this.goPage();
          return;
        }
      }, 1000);
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
    goPK() {
      // window.location.href = window.location.origin + '/api?activity_id=' + this.$store.state.activityId
      this.$router.replace({
        path: "/invite",
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
    },
    //websocket send方法
    websocketSend(data) {
      try {
        this.websocket.send(JSON.stringify(data));
      } catch (error) {
        this.showError = true;
        this.showIndex = 4;
        this.errorInfo = "网络异常，请稍后退出重试！";
      }
    },
    //websocket message方法
    websocketMess() {
      this.websocket.onmessage = e => {
        let re = JSON.parse(e.data);
        let res = re.data;
        console.log("action", re.action);
        console.log("data", JSON.stringify(res));
        if (re.action == "pkResult") {
          console.log("result", JSON.stringify(res));
          this.getRoomInfo();
          this.pkResultInfo = res;
          if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
            //房间创建者
            this.selfInfo.userType = "1";
            this.pkLevelInfo.name = res.sponsor_user_level_name_now;
            this.pkLevelInfo.nameago = res.sponsor_user_level_name_ago;
            this.pkLevelInfo.number = Number(res.sponsor_user_star_now);
            this.pkLevelInfo.standard = Number(res.sponsor_level_need_star);
            if (this.pkLevelInfo.standard == 0) {
              this.pkLevelInfo.needNum = 0;
            } else {
              this.pkLevelInfo.needNum = this.pkLevelInfo.standard - this.pkLevelInfo.number;
            }
          } else if (this.userdata.user_id == this.pkRoomInfo.challenger_user_id) {
            //挑战者
            this.selfInfo.userType = "2";
            this.pkLevelInfo.name = res.challenger_user_level_name_now;
            this.pkLevelInfo.nameago = res.challenger_user_level_name_ago;
            this.pkLevelInfo.number = Number(res.challenger_user_star_now);
            this.pkLevelInfo.standard = Number(res.challenger_level_need_star);
            if (this.pkLevelInfo.standard == 0) {
              this.pkLevelInfo.needNum = 0;
              this.aniObj = "word";
            } else {
              this.pkLevelInfo.needNum = this.pkLevelInfo.standard - this.pkLevelInfo.number;
              if (res.challenger_user_level_ago == res.challenger_user_level_now) {
                this.aniObj = "star";
                this.aniNum = res.challenger_user_star_now - res.challenger_user_star_ago;
              } else if (res.challenger_user_level_ago < res.challenger_user_level_now) {
                this.aniObj = "title";
              }
            }
          }
          // this.getShareDesc();
        }
        if (re.action == "startNotify") {
          //pk开始信息和通知
          this.selfInfo.selfScore = 0;
          this.rivalInfo.rivalScore = 0;
          this.$router.push({
            path: "/beatdown",
            query: {
              room_id: res.room_id,
              activity_id: this.$store.state.activityId,
              start_sign: true,
              access_token: this.$store.state.access_token
            }
          });
        }
        if (re.action == "inviteNotify") {
          this.notifyList.unshift({
            showNotify: true,
            inviteUserId: res.sponsor_user_id,
            inviteUserName: res.name,
            counttime: 10
          });
          if (this.notifyList.length > 3) {
            this.notifyList.splice(3, this.notifyList.length - 3);
          }
          this.notifyList.forEach((item, index) => {
            item.bottom = 1.9 + index * 2.1;
          });
        }
        if (re.action == "refuseNotify") {
          this.msgIndex = 1;
          this.showPopup = true;
          this.refuseUserName = res.name;
        }
        if (re.action == "timeoutNotify") {
          this.msgIndex = 2;
          this.showPopup = true;
          this.refuseUserName = res.name;
        }
        if (re.action == "offline") {
          this.$store.state.showOffline = true;
          this.$store.state.offlineMsg = res.message;
        }
        if (re.action == "online") {
          this.$store.state.showOffline = false;
          this.$store.state.offlineMsg = "";
        }
        if (res) {
          if (res.room_id != this.$route.query.room_id) {
            return;
          }
        }
        if (re.action == "roomInfoReturn") {
          this.getRoomInfo();
          if (re.error_code != 0 && re.error_code != undefined) {
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          }
        }
        if (re.action == "accedeReturn") {
          //挑战者接受邀请后返回信息
          if (re.error_code != 0 && re.error_code != undefined) {
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          }
        }
        if (re.action == "accedeNotify") {
          this.getRoomInfo();
          if (re.error_code != 0 && re.error_code != undefined) {
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
            return;
          }
          //通知创建者挑战者信息
          this.initData = {
            channel: "pk",
            action: "startGame",
            data: {
              room_id: this.pkRoomInfo.room_id
            }
          };
        }
        if (re.action == "startReturn") {
          //游戏启动结果
          if (re.error_code != 0 && re.error_code != undefined) {
            //服务器返回失败
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          }
        }
        if (re.action == "startNotify") {
          //pk开始信息和通知
          if (re.error_code != 0 && re.error_code != undefined) {
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          } else {
            this.pkStatus = res.status;
            this.showPK = true;
            this.getRoomInfo();
          }
        }
        if (re.action == "question") {
          if (re.error_code != 0 && re.error_code != undefined) {
            console.log(re.error_code);
            //服务器返回失败
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          }
          //发送题目
          this.isChoose = false;
          this.showPK = false;
          this.showCountDown = false;
          this.answerStr = [];
          $(".choice li").removeClass("true");
          $(".choice li").removeClass("error");
          this.questionInfo = res;
          this.countDownTime = this.questionInfo.count_down;
          this.countDownTime = 10
          // ======================
          this.timeTick = setInterval(() => {
            this.countDownTime--;
            if (this.countDownTime <= 0) {
              clearInterval(this.timeTick);
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
                  this.websocketSend({
                    channel: "pk",
                    action: "answer",
                    data: {
                      blockade_id: this.questionInfo.blockade_id,
                      step: this.questionInfo.step,
                      room_id: this.pkRoomInfo.room_id,
                      question_id: this.questionInfo.question_id,
                      user_answer: userAnswer
                    }
                  });
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
        }
        if (re.action == "answerReturn") {
          if (re.error_code != 0 && re.error_code != undefined) {
            //服务器返回失败
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          }
          //答案信息
          this.answerReturnInfo = res;
          var iSelf = 9;
          if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
            this.selfInfo.selfScore = this.answerReturnInfo.score_total;
            $(".self-score p span").animate(
              {
                height:
                  (this.selfInfo.selfScore * 4.4) /
                    (this.countQues * 200 + 200) +
                  "rem"
              },
              100
            );
          } else if (
            this.userdata.user_id == this.pkRoomInfo.challenger_user_id
          ) {
            this.rivalInfo.rivalScore = this.answerReturnInfo.score_total;
            $(".rival-score p span").animate(
              {
                height:
                  (this.rivalInfo.rivalScore * 4.4) /
                    (this.countQues * 200 + 200) +
                  "rem"
              },
              100
            );
          }
        }
        if (re.action == "answerResult") {
          if (re.error_code != 0 && re.error_code != undefined) {
            //服务器返回失败
            this.errorInfo = re.message;
            this.showError = true;
            this.showIndex = 2;
          }
          //初始化，清除计时器，关闭错误页面
          clearInterval(this.timeTick);
          //答案信息
          this.answerInfo = res;
          var selfAnswer = {},
            rivalAnswer = {};
          if (
            this.userdata.user_id == this.answerInfo.answers[0].answer_user_id
          ) {
            selfAnswer = this.answerInfo.answers[0];
            rivalAnswer = this.answerInfo.answers[1];
          } else {
            selfAnswer = this.answerInfo.answers[1];
            rivalAnswer = this.answerInfo.answers[0];
          }
          if (this.userdata.user_id == this.pkRoomInfo.sponsor_user_id) {
            if (
              this.userdata.user_id == this.answerInfo.answers[0].answer_user_id
            ) {
              this.selfInfo.selfScore = this.answerInfo.answers[0].score_total;
              this.rivalInfo.rivalScore = this.answerInfo.answers[1].score_total;
            } else if (
              this.userdata.user_id == this.answerInfo.answers[1].answer_user_id
            ) {
              this.selfInfo.selfScore = this.answerInfo.answers[1].score_total;
              this.rivalInfo.rivalScore = this.answerInfo.answers[0].score_total;
            }
            $(".self-score p span").animate(
              {
                height:
                  (this.selfInfo.selfScore * 4.4) /
                    (this.countQues * 200 + 200) +
                  "rem"
              },
              100
            );
            $(".rival-score p span").animate(
              {
                height:
                  (this.rivalInfo.rivalScore * 4.4) /
                    (this.countQues * 200 + 200) +
                  "rem"
              },
              100
            );
          } else if (
            this.userdata.user_id == this.pkRoomInfo.challenger_user_id
          ) {
            if (
              this.userdata.user_id == this.answerInfo.answers[0].answer_user_id
            ) {
              this.rivalInfo.rivalScore = this.answerInfo.answers[0].score_total;
              this.selfInfo.selfScore = this.answerInfo.answers[1].score_total;
            } else if (
              this.userdata.user_id == this.answerInfo.answers[1].answer_user_id
            ) {
              this.rivalInfo.rivalScore = this.answerInfo.answers[1].score_total;
              this.selfInfo.selfScore = this.answerInfo.answers[0].score_total;
            }
            $(".rival-score p span").animate(
              {
                height:
                  (this.rivalInfo.rivalScore * 4.4) /
                    (this.countQues * 200 + 200) +
                  "rem"
              },
              100
            );
            $(".self-score p span").animate(
              {
                height:
                  (this.selfInfo.selfScore * 4.4) /
                    (this.countQues * 200 + 200) +
                  "rem"
              },
              100
            );
          }

          var iTrue = [],
            iRival = [];
          this.questionInfo.correct_answer.split("").forEach(answerItem => {
            if (answerItem == "A") {
              iTrue.push(0);
            } else if (answerItem == "B") {
              iTrue.push(1);
            } else if (answerItem == "C") {
              iTrue.push(2);
            } else if (answerItem == "D") {
              iTrue.push(3);
            }
            else if(answerItem == "E") {
              iTrue.push(4);
            }
          });
          rivalAnswer.user_answer.split("").forEach(item => {
            if (this.questionInfo.correct_answer.indexOf(item) == -1) {
              if (item == "A") {
                iRival.push(0);
              } else if (item == "B") {
                iRival.push(1);
              } else if (item == "C") {
                iRival.push(2);
              } else if (item == "D") {
                iRival.push(3);
              }
              // else if(item == 'E') {
              //   iRival.push(4);
              // }
            }
          });
          iTrue.forEach(item => {
            $(".choice li")
              .eq(item)
              .addClass("true");
          });
          iRival.forEach(item => {
            $(".choice li")
              .eq(item)
              .addClass("error");
          });
          $(".choice li")
            .eq(iTrue)
            .addClass("true");

          setTimeout(() => {
            this.showEle = {
              title: false,
              options: false,
              number: false
            };
          }, 400);
        }
      };
    },
    getShareDesc() {
      this.$ajax
        .get(
          "/api/pk/share/result?activity_id=" +
            this.$store.state.activityId +
            "&room_id=" +
            this.pkRoomInfo.room_id +
            "&user_id=" +
            this.userdata.user_id +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          let re = response.data;
          let res = re.data.message;
          if (re.error_code == 302) {
            let locationNow = window.location.href;
            window.location.href =
              re.redirect + "&redirect=" + encodeURIComponent(locationNow);
            return;
          }
          if (re.error_code == 0) {
            try {
              if (this.userdata.platform == "dingtalk") {
                if (window.dd) {
                  dd.postMessage({
                    name: "pk",
                    desc: res,
                    roomid: this.roomid
                  });
                  dd.onMessage = e => {};
                }
              }
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    //加入游戏
    joinGame() {
      if (this.userdata.user_id == 0) {
        this.showVertify = true;
        return;
      }
      this.websocket.send(
        JSON.stringify({
          channel: "pk",
          action: "accede",
          data: {
            room_id: this.pkRoomInfo.room_id
          }
        })
      );
    },
    //开始游戏
    startGame() {
      this.websocket.send(
        JSON.stringify({
          channel: "pk",
          action: "startGame",
          data: {
            room_id: this.pkRoomInfo.room_id
          }
        })
      );
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
      if (this.questionInfo.question_type == 1) {
        //单选题
        if (this.isChoose == true) {
          return;
        } else if (this.websocket.readyState == 1 && navigator.onLine == true) {
          //网络顺畅 websocket连接成功
          this.isChoose = true;
          this.initData = {
            channel: "pk",
            action: "answer",
            data: {
              blockade_id: this.questionInfo.blockade_id,
              step: this.questionInfo.step,
              room_id: this.pkRoomInfo.room_id,
              question_id: this.questionInfo.question_id,
              user_answer: index
            }
          };
          this.websocketSend(this.initData);
          if (this.questionInfo.correct_answer == index) {
            $(".choice li")
              .eq(iTrue)
              .addClass("true");
          } else {
            $(".choice li")
              .eq(iTrue)
              .addClass("error");
          }
        }
      } else {
        if (this.isChoose == true) {
          return;
        } else if (this.websocket.readyState == 1 && navigator.onLine == true) {
          if (this.answerStr.indexOf(index) == -1) {
            this.answerStr.push(index);
          }
          //多选题
          if (this.questionInfo.correct_answer.indexOf(index) == -1) {
            this.isChoose = true;
            var str = "";
            this.answerStr.forEach(item => {
              str += item;
            });
            this.initData = {
              channel: "pk",
              action: "answer",
              data: {
                blockade_id: this.questionInfo.blockade_id,
                step: this.questionInfo.step,
                room_id: this.pkRoomInfo.room_id,
                question_id: this.questionInfo.question_id,
                user_answer: str
              }
            };
            this.websocketSend(this.initData);
            $(".choice li")
              .eq(iTrue)
              .addClass("error");
          } else if (this.questionInfo.correct_answer.indexOf(index) > -1) {
            $(".choice li")
              .eq(iTrue)
              .addClass("true");
            if (
              this.answerStr.sort().join("") ===
              this.questionInfo.correct_answer
                .split("")
                .sort()
                .join("")
            ) {
              this.isChoose = true;
              var str = "";
              this.answerStr.forEach(item => {
                str += item;
              });
              this.initData = {
                channel: "pk",
                action: "answer",
                data: {
                  blockade_id: this.questionInfo.blockade_id,
                  step: this.questionInfo.step,
                  room_id: this.pkRoomInfo.room_id,
                  question_id: this.questionInfo.question_id,
                  user_answer: str
                }
              };
              this.websocketSend(this.initData);
            }
          }
        }
      }
    },
    //邀请挑战
    invite() {
      this.showShareGuide = true;
      setTimeout(() => {
        this.showShareGuide = false;
      }, 2000);
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

.vux-circle{
  width:1.6rem !important;
  height:1.6rem !important;
}

.fix-notify {
  width: 100%;
  height: 100%;
}
/* .container>div {
          width: 100%;
          height: 100%;
      } */

.container .ready,
.container .result {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
  /* background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover; */
}

.pink_container .result {
    background: #4755b2 url("../imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.purple_container .result {
    background: #4755b2 url("../purple_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.yellow_container  .result {
    background: #4755b2 url("../yellow_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.red_container .result  {
    background: #4755b2 url("../red_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.blue_container .result {
    background: #4755b2 url("../blue_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}


.container .beatdown{
   width: 100%;
  height: 100%;
  overflow:scroll;
  -webkit-overflow-scrolling : touch;
  position:relative;
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
.container .top-block {
  position: relative;
  display: flex;
  display: -webkit-flex;
  width: 100%;
  height: 3.5rem;
  justify-content: space-between;
  /* background: url("../imgs/pk_block.jpg") center center no-repeat;
  background-size: 100% 100%; */
  position: relative;
}

.pink_container .top-block {
  background: url("../imgs/pk_block.jpg") center center no-repeat;
  background-size: 100% 100%;
}

.blue_container .top-block {
  background: url("../blue_imgs/pk_block.jpg") center center no-repeat;
  background-size: 100% 100%;
}

.purple_container .top-block {
  background: url("../purple_imgs/pk_block.jpg") center center no-repeat;
  background-size: 100% 100%;
}

.yellow_container .top-block {
  background: url("../yellow_imgs/pk_block.jpg") center center no-repeat;
  background-size: 100% 100%;
}

.red_container .top-block {
  background: url("../red_imgs/pk_block.jpg") center center no-repeat;
  background-size: 100% 100%;
}

.result .top-block {
  background: url("../imgs/lipao.png") center 10% no-repeat;
  background-size: contain;
  height: 4.12rem;
  margin-top: 2.3rem;
}

.result .top-block.no-beat,
.beatdown.viewer .top-block,
.beatdown.viewer-result .top-block {
  background: none;
  height: 4.12rem;
  margin-top:2.3rem;
}

.container .top-block > div {
  margin-top: 0.66rem;
}

.container .top-block .self,
.container .top-block .rival {
  width: 2.8rem;
}

.container .top-block .countdown {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: #fff;
  margin: 26px auto;
}

.container .top-block p.self-avatar {
  /* background: #EF4D45FF; */
  border-top-right-radius: 0.7rem;
  border-bottom-right-radius: 0.7rem;
  width: 100%;
  height: 1.2rem;
  padding-top: 0.05rem;
  padding-right: 0.08rem;
  text-align: right;
  position: relative;
}

.pink_container .top-block p.self-avatar {
  background: #EF4D45FF;
}

.blue_container .top-block p.self-avatar {
  background: #399dff;
}

.purple_container .top-block p.self-avatar {
  background: #4156cb;
}

.yellow_container .top-block p.self-avatar {
  background: #f05a49;
}

.red_container .top-block p.self-avatar {
  background: #fac23b;
}

.container .top-block p.rival-avatar {
  background: #0178FEFF;
  border-top-left-radius: 0.7rem;
  border-bottom-left-radius: 0.7rem;
  width: 100%;
  height: 1.2rem;
  padding-top: 0.05rem;
  padding-left: 0.08rem;
  text-align: left;
  position: relative;
}

.pink_container .top-block p.rival-avatar{
  background: #0178FEFF;
}

.blue_container .top-block p.rival-avatar{
  background: #fca838;
}

.purple_container .top-block p.rival-avatar{
  background: #c77c45;
}

.yellow_container .top-block p.rival-avatar{
  background: #23a8d3;
}

.red_container .top-block p.rival-avatar{
  background: #0278fe;
}

.container .top-block .self-avatar img,
.container .top-block .rival-avatar img {
  width: 1.08rem;
  height: 1.08rem;
  border-radius: 50%;
  border: solid 2px #fff;
}

.beatdown .top-block .self-name {
  width: 100%;
  text-align: left;
  font-size: 0.34rem;
  color: #fff;
  padding-right: 0.2rem;
  margin-top: 0.1rem;
  position: absolute;
  left: 0.15rem;
  top: 0.23rem;
}

.beatdown .top-block .rival-name {
  width: 100%;
  text-align: right;
  font-size: 0.34rem;
  color: #fff;
  padding-left: 0.2rem;
  margin-top: 0.1rem;
  position: absolute;
  right: 0.15rem;
  top: 0.23rem;
}

.result .top-block .self-name {
  width: 100%;
  text-align: left;
  font-size: 0.34rem;
  color: #fff;
  padding-right: 0.2rem;
  margin-top: 0.1rem;
  position: absolute;
  left: 1.6rem;
  top: 0.23rem;
}

.result .top-block .rival-name {
  width: 100%;
  text-align: right;
  font-size: 0.34rem;
  color: #fff;
  padding-left: 0.2rem;
  margin-top: 0.1rem;
  position: absolute;
  right: 1.6rem;
  top: 0.23rem;
}

.container .center-block {
  display: flex;
  display: -webkit-flex;
  width: 68%;
  min-height:120px;
  justify-content: center;
  align-items: center;
  margin: 0 16%;
  line-height: 0.3rem;
  font-size: 0.34rem;
  color: #fff;
  flex-direction: column;
  border-bottom: 1px #E3E3E3FF dashed;
}

.container .result .center-block{
  border-bottom:0px;
}

.beatdown .top-block .type {
  position: absolute;
  bottom: -0.4rem;
  left: 2.5rem;
  width: 2.5rem;
  height: 0.8rem;
  line-height: 0.8rem;
  background: url("../imgs/question_number.png") center center no-repeat;
  background-size: 100% 100%;
  font-size: 0.36rem;
  color: #ffe1d5;
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

.beatdown .top-block p.detail {
  /*设置动画属性*/
  font-size: 0.34rem;
  color: #ffffff;
  text-align: center;
  height: 0.6rem;
  width: 2.8rem;
  position: absolute;
  display: block;
  bottom: 0.15rem;
  line-height: 0.6rem;
  left: 2.3rem;
}

.beatdown .top-block .detail span {
  color: #fff;
  font-size: 0.3rem;
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

.ready-go {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: url("../imgs/pk_bg.jpg") center center no-repeat;
  background-size: cover; */
  position: relative;
}


.pink_container .ready-go {
    background: #4755b2 url("../imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.purple_container .ready-go {
    background: #4755b2 url("../purple_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.yellow_container  .ready-go {
    background: #4755b2 url("../yellow_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.red_container .ready-go {
    background: #4755b2 url("../red_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.blue_container .ready-go {
    background: #4755b2 url("../blue_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
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
  /* background: #EF4D45FF; */
  padding-left: 0.74rem;
  border-top-right-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
}

.pink_container .result .top-block .self-result {
  background: #EF4D45FF;
}

.blue_container .result .top-block .self-result {
  background: #399dff;
}

.purple_container .result .top-block .self-result {
  background: #4156cb;
}

.yellow_container .result .top-block .self-result {
  background: #f05a49;
}

.red_container .result .top-block .self-result {
  background: #fac23b;
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
  /* background: #0178FEFF; */
  padding-right: 0.74rem;
  border-top-left-radius: 0.6rem;
  border-bottom-left-radius: 0.6rem;
  float: right;
}

.pink_container .result .top-block .rival-result{
  background: #0178FEFF;
}

.blue_container .result .top-block .rival-result{
  background: #fca838;
}

.purple_container .result .top-block .rival-result{
  background: #c77c45;
}

.yellow_container .result .top-block .rival-result{
  background: #23a8d3;
}

.red_container .result .top-block .rival-result{
  background: #0278fe;
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