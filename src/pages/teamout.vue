<template>
  <div class="container-out">
    <!-- <loading :show="loadDown==false"></loading> -->
    <div class="invite invite-wrapper">
        <div class="out-top">
            <img src="../imgs/teamout_top.jpg">
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
        <div class="out-title">
          <h2>{{this.activitydata.team_pk_info.title}}</h2>
        </div>
        <div class="out-sms-box">
          <div class="out-sms-list">
            <div class="sms-list-box" id="msgbox">
             <p class="out-sms-info" v-for="(msg,i) in msgList" :key="i"><span :class="'system'+msg.msg_type">{{msg.name}}</span> {{msg.message}}</p>
            </div>
          </div>
          <div class="out-sms-text">
            <input class="sms-text" v-model.trim="liveMsg" type="text" placeholder="说点什么"><button @click="sendMsg()" class="sms-btn">发送</button>
          </div>
        </div>
   
    </div>
    <!-- 引导分享弹层 -->
    <div class="shareGuide" v-show="showShareGuide" @click.prevent="showShareGuide=false">
      <div class="shareGuideImg">
        <img src="../imgs/invite.png">
      </div>
    </div>
    <!-- <notify v-if="showNotify==true" :inviteUserId="inviteUserId" :inviteUserName="inviteUserName"></notify> -->
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
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Divider, Loading, Spinner } from "vux";
import popup from "@/component/popup";
import notify from "@/component/notify";
import avatar from "../imgs/avatar.jpg";
import first from "@/imgs/first.png";
import two from "@/imgs/second.png";
import third from "@/imgs/third.png";
import toast from "@/component/toast";
import { GetUrlParam, convertImgToBase64, beAvatar } from "../js/util.js";

export default {
  name: "teamout",
  data() {
    return {
      showError: false, //是否显示错误页面
      liveMsg:'',
      rankList:[],
      msgList:[],
      notifyList: [
        // {
        // showNotify: false,
        // inviteUserId: 0,
        // inviteUserName: ''
        // }
      ],
      showPopup:false,
      showShareGuide:false
    
    };
  },
  components: {
    Flexbox,
    FlexboxItem,
    toast,
    Divider,
    Loading,
    notify,
    Spinner,
    popup
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
  },
  mounted() {
    if (this.userdata.platform == "yst") {
      if (window.dd) {
        dd.postMessage({
          name: "invite",
          desc: this.sharedesc
        });
        dd.onMessage = e => {};
      }
    }
  },
  beforeMount() {
 
    if (this.userdata.is_blockade_success != 1) {
      this.showError = true;
      this.showIndex = 4;
      this.errorInfo = "你还未完成必答，暂不能进行PK对决,快去完成必答吧";
    }
    this.websocket.onmessage = e => {
      let re = JSON.parse(e.data);
      let res = re.data;
      if(re.action == "top"){
        this.rankList = res
      }
      if(re.action == "live"){
        this.msgList.push(res)
        var container = this.$el.querySelector("#msgbox");
        if(this.msgList.length > 20) {
           this.msgList.shift();
        }
        container.scrollTop = container.scrollHeight;
      }
      if (re.action == "startNotify") {
        //pk开始信息和通知
        this.$router.replace({
          path: "/beatdown",
          query: {
            room_id: res.room_id,
            activity_id: this.$store.state.activityId,
            start_sign: true,
            access_token: this.$store.state.access_token
          }
        });
      } 
    };
  },
  created(){
    this.websocketSend({
          channel: "teampk",
          action: "top",
          data: {
            team_pk_id: this.activitydata.team_pk_info.team_pk_id
          }
        });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    websocketSend(data) {
      try {
        this.websocket.send(JSON.stringify(data));
      } catch (error) {
        this.showError = true;
        this.showIndex = 4;
        this.errorInfo = "网络异常，请稍后退出重试！";
      }
    },
    sendMsg() {
      if(this.liveMsg.length > 0){
        this.websocketSend({
          channel: "teampk",
          action: "sendMessage",
          data: {
            team_pk_id: this.activitydata.team_pk_info.team_pk_id,
            message: this.liveMsg
          }
        });
        this.liveMsg = ''
      }
    },
    websocketMess() {
      this.websocket.onmessage = e => {
        let re = JSON.parse(e.data);
        let res = re.data;
        if (re.action == "startNotify") {
          //pk开始信息和通知
          this.$router.replace({
            path: "/beatdown",
            query: {
              room_id: res.room_id,
              activity_id: this.$store.state.activityId,
              start_sign: true,
              access_token: this.$store.state.access_token
            }
          });
        }  
      };
    }
  }
};
</script>
<style scoped>
.out-sms-box{
  position: absolute;
  bottom :0;
  left: 0;
  right: 0;
  top:7.2rem;
  background: #FFE6E5FF;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}
.out-sms-list{
  position: absolute;
  top: 0.3rem;
  bottom: 1rem;
  left: 0;
  right: 0;
  padding: 0 0.4rem;
  overflow: hidden;
}

.out-sms-list .sms-list-box{
  position: absolute;
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


.container-out {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  flex-direction: column;
  background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover;
}

.invite {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  /* justify-content: space-between; */
  flex-direction: column;
}

.invite-header {
  width: 100%;
  height: 1.2rem;
  background: #F7564CFF;
  padding: 0 0.4rem;
}

.out-top {
  height: 1.2rem;
}
.out-top img {
    width: 100%;
    
}

.out-rank {
    width: 100%;
    height: 5rem;
    background: #fff;
    border-radius: 0.3rem;
}

.rank-list-body {
    height: 4rem;
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

.level {
  overflow: hidden;
}

.level span {
  float: left;
  font-size: 0.26rem;
  color: #ffffff;
}

.level span:first-of-type {
  margin-right: 0.12rem;
}

.level img {
  width: 0.22rem;
  height: 0.22rem;
  margin-top: 0.07rem;
  margin-right: 0.01rem;
}

.level i {
  font-style: normal;
}

.invite-btn {
  cursor: pointer;
  width: 4.38rem;
  text-align: center;
  height: 0.88rem;
  line-height: 0.88rem;
  background-color: #f8d445;
  border-radius: 0.44rem;
  font-size: 0.36rem;
  color: #704e04;
  margin: 0.3rem auto;
}

.dept-user > p {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.out-title {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  color: #fff;
  font-size: 0.42rem;
  text-shadow:5px 2px 6px #000;
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

.rank-list-head {
  padding: 0 0.2rem;
  border-bottom: 1px solid #D2D2D2FF;
}

.rank-list-head .vux-flexbox-item {
  width: 100%;
  color: #666666FF;
  height: 0.8rem;
  line-height: 0.8rem;
}

.rank-list.vux-flexbox,
.rank-list-head.vux-flexbox {
  text-align: center;
}

.no-department {
  height: 1.08rem;
  line-height: 1.08rem;
}
</style>
<style>
.container .vux-spinner {
  stroke: #684896;
  fill: #684896;
}
</style>