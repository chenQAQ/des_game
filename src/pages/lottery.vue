<template>
  <div :class="showPrize==true?className.container + ' noscroll container-lottery': className.container + ' container-lottery'" :style="{'background-color':skin_top_background_color}" >
    <loading :show="loadDown==false" :text="text"></loading>
    <div v-if="loadDown">
      <div class="brand">
        <img src="../imgs/goldprize.png" alt>
        <p>
          <span>我的知识币:</span>&nbsp;
          <span>{{userdata.knowledge_money}}</span>
        </p>
      </div>
      <div class="wrapper">
        <div class="navbar">
          <p @click="index=1" :class="index==1?'active':''">任务</p>
          <p @click="index=2" :class="index==2?'active':''">我的奖品</p>
        </div>
        <div class="mainer">
          <div class="task" v-if="index==1 && lotteryInfo.length>0">
            <ul>
              <li v-for="(item,index) in lotteryInfo" :key="index">
                <img :src="item.lottery_icon" alt>
                <p>
                  <span>{{item.lottery_name}}</span>
                  <span v-html="item.need_message"></span>
                </p>
                <p
                  @click="open(item.lottery_level,index)"
                  :class="status[index]==1?'readydo':status[index]==2?'open':'down'"
                >{{status[index]==1?'去完成':status[index]==2?'开启':'已开启'}}</p>
              </li>
            </ul>
            <div class="rule">
              <img :src="activitydata.prize_banner" alt>
            </div>
            <p class="gohome" @click="goPage('/')">返回首页 ></p>
          </div>
          <div v-if="index==1 && lotteryInfo.length==0">
            <div class="no-prize" v-if="prizesInfo.length==0 || haveNonePrize==true">
              <p>
                <span>暂无抽奖</span>
              </p>
              <p @click="goPage('/')">去玩游戏</p>
            </div>
          </div>
          <div v-if="index==2">
            <div class="no-prize" v-if="prizesInfo.length==0 || haveNonePrize==true">
              <p>
                <span>暂无奖品</span>
              </p>
              <p @click="goPage('/')">去玩游戏</p>
            </div>
            <ul :class="prizesInfo.length==0?'prize no':'prize'">
              <li
                class="prizeslist"
                v-if="prizesInfo.length>0 && item.prize_id!=0"
                v-for="item in prizesInfo"
                :key="this"
              >
                <p :style="bgstyle(item.prize_image_url)"></p>
                <p>
                  <span>{{item.prize_name}}</span>
                  <span>通过 {{item.lottery_name}} 抽取</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="show-prize" v-if="showPrize==true">
        <div :class="prize.prize_id==0?'noprize prize-wrapper':'prize-wrapper'">
          <p v-if="prize.prize_id!=0">
            <img :src="prize.prize_image_url" alt>
          </p>
          <p class="prize-name" v-if="prize.prize_id!=0">{{prize.prize_name}}</p>
          <p class="prize-name" v-if="prize.prize_id==0">没有中奖！</p>
          <p class="confirm-btn" @click="showPrize=false">确&nbsp;定</p>
        </div>
      </div>
      <toast v-if="showErr==true" :showIndex="3" :errMsg="errMess"></toast>
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
  </div>
</template>
<script>
import { GetUrlParam, beAvatar } from "../js/util.js";
import { Loading } from "vux";
import notify from "@/component/notify";
import popup from "@/component/popup";
export default {
  name: "lottery",
  data() {
    return {
      showError: false, //是否显示错误页面
      showIndex: 0,
      errorInfo: "", //错误提醒消息
      loadDown: false,
      index: 1,
      text: "loading",
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
      score: 200,
      className: {},
      skin_top_background_color: "#242f55",
      lotteryInfo: [],
      status: [], //金银铜宝箱状态 1去完成 2去开启 3已开启
      prizesInfo: [],
      prize: {},
      showPrize: false,
      haveNonePrize: true,
      showErr: false,
      errMess: ""
    };
  },
  components: {
    Loading,
    notify,
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
    sharedesc() {
      return this.activitydata.dingtalk_share_home.replace(
        "[my_name]",
        this.userdata.name
      );
    }
  },
  beforeMount() {
    this.skin_top_background_color = "#FFE2E4"
    this.className.container = "pink_container"
    if(this.activitydata.top_background_color == "pink"){
      this.skin_top_background_color = "#FFE2E4"
      this.className.container = "pink_container"
    }
    if(this.activitydata.top_background_color == "purple"){
      this.skin_top_background_color = "#2b0663"
      this.className.container = "purple_container"
    }
    if(this.activitydata.top_background_color == "red"){
      this.skin_top_background_color = "#942511"
      this.className.container = "red_container"
    }
    if(this.activitydata.top_background_color == "yellow"){
      this.skin_top_background_color = "#ffda44"
      this.className.container = "yellow_container"
    }
    if(this.activitydata.top_background_color == "blue"){
      this.skin_top_background_color = "#3757e8"
      this.className.container = "blue_container"
    }

    this.getDetails();
    this.getUserInfo();
    if (this.userdata.platform == "dingtalk") {
      if (window.dd) {
        dd.postMessage({
          name: "home",
          desc: this.sharedesc
        });
        dd.onMessage = e => {};
      }
    }
    if (this.activitydata.is_open_prize == 0) {
      window.location.href =
        window.location.origin +
        "/api?activity_id=" +
        this.$store.state.activityId +
        "&access_token" +
        this.$store.state.access_token;
    }

    this.websocket.onmessage = e => {
      let re = JSON.parse(e.data);
      let res = re.data;
      if (re.action == "startNotify") {
        //pk开始信息和通知
        this.$router.push({
          path: "/beatdown",
          query: {
            room_id: res.room_id,
            activity_id: this.$store.state.activityId,
            start_sign: true
          }
        });
      } else if (re.action == "inviteNotify") {
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
      } else if (re.action == "refuseNotify") {
        this.msgIndex = 1;
        this.showPopup = true;
        this.refuseUserName = res.name;
      } else if (re.action == "timeoutNotify") {
        this.msgIndex = 2;
        this.showPopup = true;
        this.refuseUserName = res.name;
      } else if (re.action == "offline") {
        this.$store.state.showOffline = true;
        this.$store.state.offlineMsg = res.message;
      }
    };
  },
  methods: {
    bgstyle(bg) {
      return {
        background: `url(${bg}) center no-repeat`,
        backgroundSize: "contain",
        backgroundOrigin: "content-box"
      };
    },
    //获取用户信息
    getUserInfo() {
      this.$ajax
        .get(
          "/api/user/info?activity_id=" +
            this.$store.state.activityId +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          console.log(response,'response')
          let re = response.data;
          let res = re.data;
          if (re.error_code == 302) {
            let locationNow = window.location.href;
            window.location.href =
              re.redirect + "&redirect=" + encodeURIComponent(locationNow);
            return;
          }
          if (re.error_code == 0) {
            if (res.user_id == 0 || res.headpic_url == "") {
              res.headpic_url = beAvatar(
                res.name,
                58,
                "20px PingFangSC-Medium"
              );
            }
            this.$store.commit("setState", {
              // 保存用户状态
              userdata: res
            });
          }
        })
        .catch(error => {
          console.log(error ,'error')
          window.location.href = error.response.data.redirect;
        });
    },
    goPage(page) {
      this.$router.replace({
        path: page,
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
    },
    change(index) {
      if (index == 1) {
        this.index = 1;
      } else {
        this.index = 2;
      }
      this.getDetails();
    },
    getDetails() {
      this.$ajax
        .get(
          "/api/lottery?activity_id=" +
            this.$store.state.activityId +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          let re = response.data;
          let res = re.data;
          if (re.error_code == 302) {
            let locationNow = window.location.href;
            window.location.href =
              re.redirect + "&redirect=" + encodeURIComponent(locationNow);
            return;
          }
          if (re.error_code == 406) {
            this.showErr = true;
            this.errMess = re.message;
            return;
          }
          this.loadDown = true;
          this.lotteryInfo = res.lottery;
          this.prizesInfo = res.prize;
          for (var i = 0; i < this.lotteryInfo.length; i++) {
            if (this.lotteryInfo[i].has_chance == false) {
              if (this.lotteryInfo[i].is_lottery == true) {
                this.status[i] = 3;
              } else {
                this.status[i] = 1;
              }
            } else {
              this.status[i] = 2;
            }
          }
          for (var i = 0; i < this.prizesInfo.length; i++) {
            if (this.prizesInfo[i].prize_id != 0) {
              this.haveNonePrize = false;
              return;
            }
            this.haveNonePrize = true;
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    open(level, index) {
      if (this.status[index] == 1) {
        this.goPage("/");
      } else if (this.status[index] == 2) {
        this.extract(level);
      } else if (this.status[index] == 3) {
        return;
      }
    },
    extract(index) {
      this.$ajax
        .get(
          "/api/lottery/" +
            index +
            "?activity_id=" +
            this.$store.state.activityId +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          if (response.data.error == 302) {
            let locationNow = window.location.href;
            window.location.href =
              response.data.redirect +
              "&redirect=" +
              encodeURIComponent(locationNow);
            return;
          }
          this.prize = response.data.data;
          this.getDetails();
          this.showPrize = true;
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    }
  }
};
</script>
<style scoped>
.container-lottery {
  width: 100%;
  min-height: 100%;
  background: #433a65;
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  flex-direction: column;
  /* background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover; */
}

.pink_container {
  background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover;
}

.purple_container {
  background: url("../purple_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.bule_container {
  background: url("../blue_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.yellow_container {
  background: url("../yellow_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.red_container  {
  background: url("../red_imgs/pk_bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.container.noscroll {
  position: fixed;
  overflow: hidden;
}

.brand {
  position: relative;
  width: 100%;
  height: 4.23rem;
  background: url("../imgs/lipao.png") center center no-repeat;
  background-size: 68% 80%;
  text-align: center;
  padding-top: 3.3rem;
}

.brand img {
  position: absolute;
  top: -0.8rem;
  left: 2.33rem;
  width: 2.84rem;
  height: auto;
}

.brand span:first-of-type {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.28rem;
}

.brand span:last-of-type {
  font-size: 0.42rem;
  color: #fff600;
}

.wrapper {
  width: 100%;
}

.wrapper .navbar {
  height: 0.88rem;
  width: 4.38rem;
  margin: 0 auto;
  border-radius: 0.44rem;
  border: solid 0.02rem #FFFFFFFF;
  padding: 0.02rem 0.04rem;
}

.wrapper .navbar p {
  height: 0.8rem;
  width: 50%;
  float: left;
  font-size: 0.36rem;
  text-align: center;
  line-height: 0.8rem;
  color: #FFFFFFFF;
}

.wrapper .navbar p.active {
  background: #FF5C5CFF;
  color: #FFFFFFFF;
}

.pink_container .wrapper .navbar p.active {
  background: #FF5C5CFF;
  color: #FFFFFFFF;
}

.blue_container .wrapper .navbar p.active {
  background: #4b9cf7;
  color: #FFFFFFFF;
}

.purple_container .wrapper .navbar p.active {
  background: #8c45ed;
  color: #FFFFFFFF;
}

.yellow_container .wrapper .navbar p.active {
  background: #ff9000;
  color: #FFFFFFFF;
}

.red_container .wrapper .navbar p.active {
  background: #ff5c5d;
  color: #FFFFFFFF;
}

.wrapper .navbar p:first-of-type {
  border-radius: 0.38rem 0 0 0.38rem;
}

.wrapper .navbar p:last-of-type {
  border-radius: 0 0.38rem 0.38rem 0;
}

.mainer {
  width: 100%;
  padding-bottom: 0.4rem;
}

.mainer .task ul {
  width: 6.88rem;
  margin: 0 auto;
}

.mainer .task ul li {
  margin-top: 0.4rem;
  width: 100%;
  height: 1.5rem;
  overflow: hidden;
  background: #F7564CFF;
  padding: 0.1rem 0.2rem;
  border-radius: 0.08rem;
}

.pink_container .mainer .task ul li {
  background: #F7564CFF;
}

.purple_container .mainer .task ul li {
  background: #6a1cd4;
}

.blue_container .mainer .task ul li {
  background: #0b71e0;
}

.yellow_container .mainer .task ul li {
  background: #fffece;
}

.red_container .mainer .task ul li {
  background: #f7564c;
}

.mainer .task li img {
  display: inline-block;
  float: left;
  width: 1.14rem;
  height: auto;
  margin-right: 0.2rem;
}

.mainer .task li p:first-of-type {
  float: left;
  width: 50%;
  padding-top: 0.06rem;
}

.mainer .task li p:first-of-type span {
  text-align: left;
  display: inline-block;
  width: 100%;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.42rem;
}

.mainer .task li p:first-of-type span:last-of-type {
  font-size: 0.24rem;
  color: #FFFFFF;
}

.mainer .task li p:first-of-type span:last-of-type font {
  color: #f2c640;
}

.mainer .task li p:last-of-type {
  float: right;
  width: 1.32rem;
  height: 0.66rem;
  line-height: 0.66rem;
  text-align: center;
  color: #feede3;
  margin-right: 0.2rem;
  margin-top: 0.32rem;
  font-size: 0.26rem;
}

.mainer .task li p:last-of-type.open {
  background: url("../imgs/open.png") 0 0 no-repeat;
  background-size: 100% 100%;
}

.mainer .task li p:last-of-type.down {
  background: url("../imgs/down.png") 0 0 no-repeat;
  background-size: 100% 100%;
}

.mainer .task li p:last-of-type.readydo {
  background: url("../imgs/readydo.png") 0 0 no-repeat;
  background-size: 100% 100%;
}

.mainer .rule {
  width: 7.2rem;
  margin: 0.4rem auto 0;
  /* background: #fff; */
}

.mainer .rule .title {
  width: 100%;
  text-align: center;
  font-size: 0.36rem;
  color: #c38446;
  height: 1rem;
  line-height: 1rem;
}

.mainer .rule .list {
  width: 32%;
  float: left;
  text-align: center;
}

.mainer .rule .list div {
  height: 1.6rem;
  width: 80%;
  margin: 0 auto;
  text-align: center;
}

.mainer .rule .list div:first-of-type {
  width: 40%;
}

.mainer .rule .list p:first-of-type {
  margin-top: 0.3rem;
  color: #685541;
  font-size: 0.32rem;
}

.mainer .rule .list p:last-of-type {
  color: #ac9884;
  font-size: 0.22rem;
}

.mainer .rule > img {
  width: 100%;
  height: auto;
  vertical-align: middle;
}

.prize {
  width: 100%;
  padding-left: 0.4rem;
  padding-right: 0.2rem;
}

.prize li {
  margin-top: 0.3rem;
  overflow: hidden;
  background-color: #382e5e;
  border-radius: 0.1rem;
  height: 1.2rem;
}

.prize .prizeslist p {
  float: left;
  width: 4.5rem;
}

.prize li p:first-of-type {
  width: 1.8rem;
  height: 100%;
  text-align: center;
  vertical-align: middle;
  padding: 0.2rem;
}

.prize li p > div {
  height: 100%;
}

.prize li p:last-of-type span {
  display: inline-block;
  width: 100%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prize li p:last-of-type span:first-of-type {
  font-size: 0.36rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0.06rem;
}

.prize li p:last-of-type span:last-of-type {
  font-size: 0.28rem;
  color: rgba(255, 255, 255, 0.5);
}

.prize li img {
  height: auto;
  vertical-align: middle;
  margin: 0 0.2rem;
  max-width: 1.4rem;
  max-height: 1rem;
  width: auto;
}

.prize.no {
  padding: 0;
  width: 100%;
}

.show-prize {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.prize-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  opacity: 1;
  width: 5.9rem;
  /* height: 6.6rem; */
  background: url("../imgs/getprize.png") 0 0 no-repeat;
  background-size: 100% auto;
  /* border-radius: 0.18rem; */
  padding-top: 3rem;
}

.prize-wrapper.noprize {
  background: url("../imgs/noprize.png") 0 0 no-repeat;
  background-size: 100% auto;
}

.prize-wrapper img {
  height: 2rem;
  width: auto;
  max-width: 100%;
}

.prize-wrapper p.prize-name {
  line-height: 1.5rem;
  max-height: 2rem;
  margin: 0.2rem auto;
  padding: 0 0.5rem;
  text-align: center;
  font-size: 0.4rem;
  color: #a39264;
}

.prize-wrapper .confirm-btn {
  width: 100%;
  height: 0.88rem;
  position: absolute;
  /* bottom: -0.65rem; */
  left: 0;
  background-color: #f9b600;
  line-height: 0.88rem;
  font-size: 0.42rem;
  color: #fff9e9;
  text-align: center;
  border-bottom-left-radius: 0.18rem;
  border-bottom-right-radius: 0.18rem;
}

.noprize .confirm-btn {
  /* bottom: 0.35rem; */
  top: 100%;
}

.no-prize p img {
  width: 2.4rem;
  height: auto;
}

.no-prize p span {
  display: inline-block;
  width: 100%;
  font-size: 0.52rem;
  color: #FFFFFFFF;
}

.gohome {
  width: 100%;
  color: #FFFFFF;
  font-size: 0.24rem;
  padding-top: 0.5rem;
}
/* .no-prize p:last-of-type {
        margin: .4rem auto;
        width: 1.36rem;
        height: 0.4rem;
        line-height: .38rem;
        border-radius: 0.2rem;
        border: solid 0.01rem #f5d039;
        font-size: 0.24rem;
        color: #f5d039;
    } */

.no-prize {
  padding: 0.3rem;
}

.no-prize p:first-of-type {
  width: 100%;
  font-size: 0.48rem;
  color: #c7c2db;
  text-align: center;
  margin: 0.3rem 0;
}

.no-prize p:last-of-type {
  margin: 0 auto;
  text-align: center;
  color: #f5d039;
  border: 1px solid #f5d039;
  width: 2.8rem;
  height: 0.8rem;
  line-height: 0.78rem;
  border-radius: 0.48rem;
  font-size: 0.3rem;
}
</style>