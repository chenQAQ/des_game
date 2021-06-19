<!--主页页面-->
<template>
  <div class="container-home" :style="{'background-color':skin_top_background_color}">
    <div class="message" v-if="activitydata.scroll_message.length>0">
      <swiper
        auto
        height="35px"
        direction="vertical"
        :interval="2000"
        class="text-scroll"
        :show-dots="false"

      >
        <swiper-item v-for="(item,i) in activitydata.scroll_message" :key="i">
          <p class="mess">{{item}}</p>
        </swiper-item>
      </swiper>
    </div>
    <div :class="className.header">
      <div :class="className.banner">
        <span :class="className.rule" @click="showLay=true">活动须知</span>
        <img :src="activitydata.top_banner" alt>
      </div>
      <div style="padding:0 0.2rem;">
        <div :class="className.selfinfo">
          <div class="selfinfo-left">
            <img :src="userdata.headpic_url" alt>
            <p v-if="userdata.user_id>0">
              <span :class="userdata.user_id==0 || userdata.department_name==''?'no-depart':''" >{{userdata.name}}</span>
              <span class="department" v-if="userdata.user_id!=0 && userdata.department_name!=''" >{{userdata.department_name}}</span>
            <p v-else class="no-bind">
              <span>{{userdata.nickname}}</span>
              <span v-if="userdata.is_not_in_list==0">未绑定</span>
            </p>
          </div>
          <div class="selfinfo-right">
            <p v-if="userdata.user_id!=0 && userdata.is_blockade_success==1" class="level">
              <span class="checkpoint-name">{{checkpointName}}</span>
            </p>
            <p :class="userdata.user_id==0 || userdata.is_blockade_success!=1?'no-level':''" style="float:right;">
              <!-- <img  src="../imgs/gold.png" alt=""> -->
              <span class="other" v-if="userdata.user_id!=0">知识币：{{userdata.knowledge_money}}</span>
              <span class="detail" v-if="activitydata.is_open_prize!=0" @click="goPage(3)"></span>
            </p>
            <p v-if="userdata.user_id==0 && activitydata.is_temp_stop!=1 && userdata.is_not_in_list==0" @click="showVertify=true" class="bind" style="float:left;margin-top:0.2rem;">点击绑定</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mainer">
      <div class="mainer-left">
        <div
          :class="String(activitydata.activity_enable)=='false' || userdata.user_id==0 || String(userdata.user_enable)=='false' || userdata.is_blockade_success==1? className.must +' over':className.must"
          @click="goPage(1)"
        >
          <!-- <p class="title">必答</p> -->
        </div>
        <div
          :class="String(activitydata.activity_enable)=='false' || userdata.user_id==0 || String(userdata.user_enable)=='false' || userdata.is_blockade_success!=1?className.mission+' over':className.mission"
          @click="goPage(2)"
        >
          <!-- <p class="title">闯关</p> -->
        </div>
      </div>
      <div class="mainer-right">
        <div
          :class="String(activitydata.activity_enable)=='false' || userdata.user_id==0 || String(userdata.user_enable)=='false' ||  activitydata.is_teampk_limit==1 || activitydata.team_pk_info.type == 3? className.beatdown + ' over':className.beatdown"
          @click="goPage(5)" 
        >
          <!-- <p class="title">PK</p> -->
        </div>
        <div
          :class="String(activitydata.activity_enable)=='false' || userdata.user_id==0 || String(userdata.user_enable)=='false' || activitydata.is_rank_limit==1? className.rank + ' over':className.rank"
          @click="goPage(4)"
        >
          <!-- <p class="title">排行榜</p> -->
        </div>
      </div>
      <div  :class="String(activitydata.activity_enable)=='false' || userdata.user_id==0 || String(userdata.user_enable)=='false' || userdata.is_blockade_success!=1 || activitydata.is_pk_limit==1? className.teampk + ' over':className.teampk"
         @click="toBeatdown()">

      </div>
    </div>
    <!-- <div class="all" @click="more()" v-if="$store.state.activityId==1671">
      <p class="title">我也要创建一个答题活动</p>
    </div>-->
    <div :class="className.footer">
      <p @click="clickFooter">{{activitydata.sponsor_corp}}</p>
      <!-- <p @click="clickFooter">技术支持：{{activitydata.app_support}}</p> -->
    </div>
    <toast v-if="showLay==true" :showIndex="1"></toast>
    <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo"></toast>
    <toast v-if="$store.state.showOffline==true" :showIndex="5" :errMsg="$store.state.offlineMsg"></toast>
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
    <login v-show="showVertify"></login>
  </div>
</template>
<script>
import { Picker, Alert, Swiper, SwiperItem } from "vux";
import toast from "@/component/toast";
import notify from "@/component/notify";
import popup from "@/component/popup";
import login from "@/component/login";
import { GetUrlParam, convertImgToBase64, beAvatar } from "../js/util.js";
import avatar from "../imgs/avatar.jpg";
export default {
  name: "home",
  data() {
    return {
      avatar: avatar,
      showNotify: false,
      inviteUserId: 0,
      notifyList: [
        // {
        // showNotify: false,
        // inviteUserId: 0,
        // inviteUserName: ''
        // }
      ],
      inviteUserName: "",
      className:{},
      showPopup: false,
      skin_top_background_color: "#242f55",
      refuseUserName: "",
      msgIndex: 0,
      loadDown: false, //是否加载完全
      isFirst: true, //是否第一次进入
      showChoose: false, //pk知识币选择
      showLay: false, //是否显示弹层
      title: "",
      content: "",
      index: 1, //知识币选择
      showError: false,
      showIndex: 0,
      errorInfo: "",
      showTrick: 0,
      showVertify: false, //弹出验证
      checkpointName: ""
    };
  },
  components: {
    Picker,
    Alert,
    toast,
    notify,
    popup,
    Swiper,
    login,
    SwiperItem
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
    // sharedesc() {
    //   return this.activitydata.dingtalk_share_home.replace(
    //     "[my_name]",
    //     this.userdata.name
    //   );
    // }
  },

  mounted() {
    this.getSharemsg();
    console.log(this.userdata)
    // }
  },
  beforeMount() {
    this.getActivityInfo();
    // 设置动态样式
    
    this.skin_top_background_color = "#FFE2E4"
    this.className.header = "header"
    this.className.banner = "banner"
    this.className.rule = "rule"
    this.className.selfinfo = "selfinfo"
    this.className.must = "must"
    this.className.mission = "mission"
    this.className.beatdown = "beatdown"
    this.className.rank = "rank"
    this.className.teampk = "teampk"
    this.className.footer = "footer"
    if(this.activitydata.top_background_color == "pink"){
      this.skin_top_background_color = "#FFE2E4"
      this.className.header = "header"
      this.className.banner = "banner"
      this.className.rule = "rule"
      this.className.selfinfo = "selfinfo"
      this.className.must = "must"
      this.className.mission = "mission"
      this.className.beatdown = "beatdown"
      this.className.rank = "rank"
      this.className.teampk = "teampk"
      this.className.footer = "footer"
    } 

    if(this.activitydata.top_background_color == "purple"){
      this.skin_top_background_color = "#2b0663"
      this.className.header = "header"
      this.className.banner = "banner"
      this.className.rule = "yellow_rule"
      this.className.selfinfo = "purple_selfinfo"
      this.className.must = "purple_must"
      this.className.mission = "purple_mission"
      this.className.beatdown = "purple_beatdown"
      this.className.rank = "purple_rank"
      this.className.teampk = "purple_teampk"
      this.className.footer = "purple_footer"
    }

    if(this.activitydata.top_background_color == "red"){
      this.skin_top_background_color = "#942511"
      this.className.header = "header"
      this.className.banner = "banner"
      this.className.rule = "red_rule"
      this.className.selfinfo = "red_selfinfo"
      this.className.must = "red_must"
      this.className.mission = "red_mission"
      this.className.beatdown = "red_beatdown"
      this.className.rank = "red_rank"
      this.className.teampk = "red_teampk"
      this.className.footer = "footer"
    }

    if(this.activitydata.top_background_color == "yellow"){
      this.skin_top_background_color = "#ffda44"
      this.className.header = "header"
      this.className.banner = "banner"
      this.className.rule = "yellow_rule"
      this.className.selfinfo = "yellow_selfinfo"
      this.className.must = "yellow_must"
      this.className.mission = "yellow_mission"
      this.className.beatdown = "yellow_beatdown"
      this.className.rank = "yellow_rank"
      this.className.teampk = "yellow_teampk"
      this.className.footer = "yellow_footer"
    }

    if(this.activitydata.top_background_color == "blue"){
      this.skin_top_background_color = "#3757e8"
      this.className.header = "header"
      this.className.banner = "banner"
      this.className.rule = "blue_rule"
      this.className.selfinfo = "blue_selfinfo"
      this.className.must = "blue_must"
      this.className.mission = "blue_mission"
      this.className.beatdown = "blue_beatdown"
      this.className.rank = "blue_rank"
      this.className.teampk = "blue_teampk"
      this.className.footer = "blue_footer"
    }
    

    if ( this.activitydata.activity_enable == true && this.userdata.user_enable == true && this.userdata.user_id > 0 ) {
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
        } else if (re.action == "online") {
          this.$store.state.showOffline = false;
          this.$store.state.offlineMsg = "";
        }
      };
    }
  },
  methods: {
    getSharemsg() {
      let access_token = GetUrlParam("access_token");
      let activity_id = GetUrlParam("activity_id");
      // if (this.userdata.platform == "dingtalk") {
      let data = {
        activityId: activity_id,
        share_type: "share_home",
        room_id: 0,
        access_token: access_token
      };
      //获取dd webview 的消息
      if (window.dd) {
        dd.postMessage(data);
        dd.onMessage = e => {
          console.log(e);
        };
      }
    },
    //获取活动基本信息
    getActivityInfo() {
      this.$ajax
        .get(
          "/api/base/info?activity_id=" +
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
          } else if (re.error_code == 0) {
            console.log(res);
            if (res.regulation) {
              res.regulation = res.regulation.replace(/(\r\n)|(\n)/g, "<br>");
            }
            this.$store.commit("setState", {
              // 保存用户状态
              activitydata: res
            });

            if (this.activitydata.prompt_message != "") {
              this.showError = true;
              this.showIndex = 3;
              this.errorInfo = this.activitydata.prompt_message;
            }
            this.getUserInfo();
          } else {
            this.showError = true;
            this.showIndex = 2;
            this.errorInfo = re.message;
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    //获取用户信息
    getUserInfo() {
      this.$ajax
        .get( "/api/user/info?activity_id=" + this.$store.state.activityId + "&access_token=" +  this.$store.state.access_token )
        .then(response => {
          let re = response.data;
          let res = re.data;
          if (re.error_code == 302) {
            let locationNow = window.location.href;
            window.location.href = re.redirect + "&redirect=" + encodeURIComponent(locationNow);
            return;
          }
          if (re.error_code == 0) {
            this.$store.commit("setState", {
              // 保存用户状态
              userdata: res
            });
            if (res.headpic_url == "") {
              res.headpic_url = beAvatar(
                res.name,
                58,
                "20px PingFangSC-Medium"
              );
            }
            if (res.platform == "dingtalk") {
              if (window.dd) {
                dd.postMessage({
                  name: "home",
                  desc: this.sharedesc
                });
                dd.onMessage = e => {};
              }
            }
            if (res.user_level) {
              this.checkpointName = this.activitydata.level_star_config[
                this.userdata.user_level
              ].name;
            }
            if (res.is_over_online == 1) {
              this.showError = true;
              this.showIndex = 2;
              if (res.online_limit_count == 30) {
                this.errorInfo =
                  "体验版最多允许30人同时进行答题，等会儿再来试试吧";
              } else if (res.online_limit_count == 500) {
                this.errorInfo =
                  "专业版最多允许500人同时进行答题，等会儿再来试试吧";
              }
            }
            if (res.prompt_message != "") {
              this.showError = true;
              this.showIndex = 3;
              this.errorInfo = res.prompt_message;
            }
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    clickFooter() {
      window.vConsole.showSwitch();
      this.showTrick += 1;
      if (this.showTrick == 6) {
        vConsole.show();
        this.showTrick = 0;
      }
    },
    goPage(index) {
      if (
        this.activitydata.activity_enable == false ||
        this.userdata.user_enable == false
      ) {
        return;
      } else {
        if (index == 4) {
          if (this.activitydata.is_rank_limit == 1) {
            return;
          } else {
            this.$router.push({
              path: "/rank",
              query: {
                activity_id: this.$store.state.activityId,
                access_token: this.$store.state.access_token
              }
            });
          }
        } else {
          if (index == 1) {
            if (this.userdata.is_blockade_success == 1 || this.userdata.is_blockade_success == undefined) {
              return;
            } else {
              this.$router.push({
                // path: "/answer",
                path: "/blockade",
                query: {
                  tp: "QA",
                  activity_id: this.$store.state.activityId,
                  access_token: this.$store.state.access_token
                }
              });
            }
            
          } else if (index == 2) {
            if (this.userdata.is_blockade_success != 1) {
              return;
            }

             if (this.activitydata.must_blockade.length == 1) {
              this.$router.push({
                path: "/answer",
                query: {
                  tp: "QA",
                  activity_id: this.$store.state.activityId,
                  access_token: this.$store.state.access_token
                }
              });
            } else {
               this.$router.push({
                path: "/checkpoint",
                query: {
                  activity_id: this.$store.state.activityId,
                  access_token: this.$store.state.access_token
                }
              });
            }
          } else if (index == 3) {
            if (this.activitydata.is_lottery_limit == 1) {
              return;
            } else {
              this.$router.push({
                path: "/lottery",
                query: {
                  activity_id: this.$store.state.activityId,
                  access_token: this.$store.state.access_token
                }
              });
            }
          }else if(index == 5) {
              this.$router.push({
                path: "/teamdown",
                query: {
                  activity_id: this.$store.state.activityId,
                  access_token: this.$store.state.access_token
                }
              });
            
          }

        }
      }
    },
    toBeatdown() {
      if (
        this.userdata.is_blockade_success != 1 ||
        this.activitydata.is_pk_limit == 1 ||
        this.activitydata.activity_enable == false ||
        this.userdata.user_enable == false
      ) {
        return;
      } else {
        this.$router.push({
          path: "invite",
          query: {
            activity_id: this.$store.state.activityId,
            access_token: this.$store.state.access_token
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.container-home {
  display: flex;
  display: -webkit-flex;
  flex: 1;
  width: 100%;
  min-height: 100%;
  height: auto;
  flex-direction: column;
  background-size: cover;
  color: #fff;
}

.header {
  width: 100%;
  /* padding: 0 0.2rem; */
}

.message {
  width: 100%;
  background: #fefcec;
}

.mess {
  font-size: 0.22rem;
  line-height: 0.7rem;
  letter-spacing: 0px;
  color: #ff7c49;
  text-align: left;
  padding-left: 0.26rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.banner {
  position: relative;
  width: 100%;
  font-size: 0.26rem;
}

.banner img {
  /* margin-top: 0.8rem; */
  width: 100%;
  height: auto;
  vertical-align: middle;
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
  background: #F16360;
  border-bottom-right-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  text-align: center;
  line-height: 0.3rem;
}

.yellow_rule {
  display: inline-block;
  position: absolute;
  left: 0;
  z-index: 100;
  padding: 0.15rem 0 0.15rem;
  width: 1.5rem;
  height: 0.6rem;
  top:0.5rem;
  border-top: none;
  background: #FF9800;
  border-bottom-right-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  text-align: center;
  line-height: 0.3rem;
}

.red_rule {
  display: inline-block;
  position: absolute;
  left: 0;
  z-index: 100;
  padding: 0.15rem 0 0.15rem;
  width: 1.5rem;
  height: 0.6rem;
  top:0.5rem;
  border-top: none;
  background: #FF9800;
  border-bottom-right-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  text-align: center;
  line-height: 0.3rem;
}

.blue_rule {
  display: inline-block;
  position: absolute;
  left: 0;
  z-index: 100;
  padding: 0.15rem 0 0.15rem;
  width: 1.5rem;
  height: 0.6rem;
  top:0.5rem;
  border-top: none;
  background: #03a9f4;
  border-bottom-right-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  text-align: center;
  line-height: 0.3rem;
}


.selfinfo {
  width: 100%;
  background: #CE312E;
  border-radius: 0.15rem;
  height: 1.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  /* margin-top: 0.27rem; */
}

.yellow_selfinfo {
  width: 100%;
  background: #593c34;
  border-radius: 0.15rem;
  height: 1.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  /* margin-top: 0.27rem; */
}

.purple_selfinfo {
  width: 100%;
  background: #491bb2;
  border-radius: 0.15rem;
  height: 1.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  /* margin-top: 0.27rem; */
}

.red_selfinfo {
  width: 100%;
  background: #860a0a;
  border-radius: 0.15rem;
  height: 1.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  /* margin-top: 0.27rem; */
}

.blue_selfinfo {
  width: 100%;
  background: #ffd147;
  border-radius: 0.15rem;
  height: 1.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  /* margin-top: 0.27rem; */
}

.selfinfo-left {
  float: left;
  width: 45%;
  margin-top: 0.07rem;
}

.selfinfo-left img,
.selfinfo-left p {
  float: left;
  display: inline-block;
}

.selfinfo-left img {
  width: 0.86rem;
  height: 0.86rem;
  border-radius: 50%;
  border: 1px solid #fff;
  margin-right: 0.14rem;
  vertical-align: middle;
}

.selfinfo-left p {
  width: 62%;
  height: 0.58rem;
  line-height: 1;
  margin-top: 0.18rem;
}

.selfinfo-left p span {
  display: block;
  color:#FFFFFFFF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.selfinfo-left p span:first-of-type {
  font-size: 0.24rem;
  color: #FFFFFFFF;
}

.blue_selfinfo .selfinfo-left p span:first-of-type {
  font-size: 0.24rem;
  color: #c16e17;
}

.selfinfo-left p span:first-of-type.no-depart {
  height: 0.58rem;
  line-height: 0.58rem;
}

.department {
  font-size: 0.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.08rem;
  line-height: 0.24rem;
}

.selfinfo-right {
  float: right;
  padding: 0.08rem 0;
  max-width: 54%;
}
/* .selfinfo-right img {
        width: 0.4rem;
        height: 0.4rem;
        margin-top: 0.02rem;
    } */
/* .selfinfo-right img,.selfinfo-right span {
        display: inline-block;
        float: left;
        margin-right: 0.1rem;
        line-height: 0.45rem;
    } */

.selfinfo-right p:last-of-type {
  height: 0.46rem;
}

.level {
  text-align: right;
  margin-bottom: 0.1rem;
  height: 0.28rem;
}

.checkpoint-name {
  font-size: 0.27rem;
  letter-spacing: 1px;
  color: #fdcd07;
  height: 0.28rem;
  line-height: 0.28rem;
  display: block;
}

.blue_selfinfo .checkpoint-name {
  font-size: 0.27rem;
  letter-spacing: 1px;
  color: #c16e17;
  height: 0.28rem;
  line-height: 0.28rem;
  display: block;
}

.no-level {
  margin-top: 0.19rem;
}

.other {
  float: left;
  display: block;
  font-size: 0.22rem;
  color: #FFFFFFFF;
  line-height: 0.46rem;
  margin-right: 0.15rem;
}

.blue_selfinfo .other {
  float: left;
  display: block;
  font-size: 0.22rem;
  color: #c16e17;
  line-height: 0.46rem;
  margin-right: 0.15rem;
}
/* .split {
        height: 0.5rem;
        line-height: 0.4rem;
        color: #485580;
    } */

.detail {
  display: block;
  float: left;
  background: url("../imgs/gift.png")  center no-repeat;
  background-size: 100% 100%;

  padding-left: 0.32rem;
  border-radius: 0.3rem;
  margin-right: 0;
  width: 1.6rem;
  height: 0.6rem;
  /* border: solid 0.02rem #7a89bb; */
  font-size: 0.24rem;
  line-height: 0.44rem;
  color: #cbd1e8;
}

.selfinfo-right .bind {
  padding-right: 0.5rem;
  text-align: right;
  font-size: 0.28rem;
}

.mainer {
  margin: 0.15rem auto;
  width: 7.11rem;
  overflow: hidden;
}

.mainer-left,
.mainer-right {
  float: left;
}

.mainer-left {
  margin-right: 0.2rem;
}

.mainer-left > div.over,
.mainer-right > div.over,
div.over {
  opacity: 0.25;
}

.must {
  position: relative;
  width: 4rem;
  height: 2.08rem;
  background: url("../imgs/must_bg.png") center no-repeat;
  background-size: cover;
  padding: 0.28rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.yellow_must{
  position: relative;
  width: 4rem;
  height: 2.08rem;
  background: url("../yellow_imgs/must_bg.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.28rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.purple_must{
  position: relative;
  width: 4rem;
  height: 2.08rem;
  background: url("../purple_imgs/must_bg.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.28rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.red_must{
  position: relative;
  width: 4rem;
  height: 2.08rem;
  background: url("../red_imgs/must_bg.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.28rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.blue_must{
  position: relative;
  width: 4rem;
  height: 2.08rem;
  background: url("../blue_imgs/must_bg.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.28rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.mission {
  position: relative;
  width: 4rem;
  height: 3.32rem;
  background: url("../imgs/answer.png") center no-repeat;
  background-size: cover;
  padding: 0.28rem 0 0;
  border-radius: 0.1rem;
}

.yellow_mission {
  position: relative;
  width: 4rem;
  height: 3.32rem;
  background: url("../yellow_imgs/answer.png") center no-repeat;
  background-size: 100%;
  padding: 0.28rem 0 0;
  border-radius: 0.1rem;
}

.purple_mission {
  position: relative;
  width: 4rem;
  height: 3.32rem;
  background: url("../purple_imgs/answer.png") center no-repeat;
  background-size: 100%;
  padding: 0.28rem 0 0;
  border-radius: 0.1rem;
}

.red_mission {
  position: relative;
  width: 4rem;
  height: 3.32rem;
  background: url("../red_imgs/answer.png") center no-repeat;
  background-size: 100%;
  padding: 0.28rem 0 0;
  border-radius: 0.1rem;
}

.blue_mission {
  position: relative;
  width: 4rem;
  height: 3.32rem;
  background: url("../blue_imgs/answer.png") center no-repeat;
  background-size: 100%;
  padding: 0.28rem 0 0;
  border-radius: 0.1rem;
}

.must .title,
.mission .title,
.beatdown .title {
  text-align: left;
  padding-left: 0.35rem;
  font-size: 0.58rem;
  color: #ffffff;
}

.beatdown .title {
  font-size: 0.75rem;
}

.must .number,
.mission .number,
.beatdown .number {
  text-align: left;
  padding-left: 0.38rem;
  font-size: 0.32rem;
  color: #ffeed9;
}

.beatdown {
  position: relative;
  width: 2.9rem;
  height: 4.2rem;
  background: url("../imgs/teampk.png") center no-repeat;
  background-size: cover;
  padding: 0.2rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.yellow_beatdown {
  position: relative;
  width: 2.9rem;
  height: 4.2rem;
  background: url("../yellow_imgs/teampk.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.2rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.purple_beatdown {
  position: relative;
  width: 2.9rem;
  height: 4.2rem;
  background: url("../purple_imgs/teampk.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.2rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.red_beatdown {
  position: relative;
  width: 2.9rem;
  height: 4.2rem;
  background: url("../red_imgs/teampk.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.2rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.blue_beatdown {
  position: relative;
  width: 2.9rem;
  height: 4.2rem;
  background: url("../blue_imgs/teampk.png") center no-repeat;
  background-size: 100% 100%;
  padding: 0.2rem 0 0;
  margin-bottom: 0.18rem;
  border-radius: 0.1rem;
}

.rank {
  position: relative;
  width: 2.9rem;
  height: 1.2rem;
  line-height: 1.1rem;
  background: url("../imgs/rank.png") center no-repeat;
  background-size: cover;
  border-radius: 0.1rem;
}

.yellow_rank {
  position: relative;
  width: 2.9rem;
  height: 1.2rem;
  line-height: 1.1rem;
  background: url("../yellow_imgs/rank.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
}

.purple_rank {
  position: relative;
  width: 2.9rem;
  height: 1.2rem;
  line-height: 1.1rem;
  background: url("../purple_imgs/rank.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
}

.red_rank {
  position: relative;
  width: 2.9rem;
  height: 1.2rem;
  line-height: 1.1rem;
  background: url("../red_imgs/rank.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
}

.blue_rank {
  position: relative;
  width: 2.9rem;
  height: 1.2rem;
  line-height: 1.1rem;
  background: url("../blue_imgs/rank.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
}


.teampk {
  float: left;
  position: relative;
  width: 100%;
  height: 1.6rem;
  line-height: 1.1rem;
  background: url("../imgs/battle.png") center no-repeat;
  background-size: cover;
  border-radius: 0.1rem;
  margin-top: 0.2rem;
}

.yellow_teampk {
  float: left;
  position: relative;
  width: 100%;
  height: 1.6rem;
  line-height: 1.1rem;
  background: url("../yellow_imgs/battle.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
  margin-top: 0.2rem;
}

.purple_teampk {
  float: left;
  position: relative;
  width: 100%;
  height: 1.6rem;
  line-height: 1.1rem;
  background: url("../purple_imgs/battle.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
  margin-top: 0.2rem;
}

.red_teampk {
  float: left;
  position: relative;
  width: 100%;
  height: 1.6rem;
  line-height: 1.1rem;
  background: url("../red_imgs/battle.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
  margin-top: 0.2rem;
}

.blue_teampk {
  float: left;
  position: relative;
  width: 100%;
  height: 1.6rem;
  line-height: 1.1rem;
  background: url("../blue_imgs/battle.png") center no-repeat;
  background-size: 100% 100%;
  border-radius: 0.1rem;
  margin-top: 0.2rem;
}

.rank .title {
  font-size: 0.46rem;
  color: #ffffff;
  text-align: left;
  padding-left: 0.3rem;
}

.all {
  margin: 0 auto;
  width: 7.1rem;
  height: 1rem;
  color: #fff;
  line-height: 1rem;
  text-align: center;
  font-size: 0.3rem;
  background: -moz-linear-gradient(left, #0294be 0%, #03b1b7 100%);
  background: -webkit-linear-gradient(left, #0294be 0%, #03b1b7 100%);
  background: -o-linear-gradient(right, #0294be 0%, #03b1b7 100%);
  background: -ms-linear-gradient(right, #0294be 0%, #03b1b7 100%);
  background: linear-gradient(to right, #0294be 0%, #03b1b7 100%);
  /* background: url("../imgs/other.png") 0 0 no-repeat; */
  background-size: 100% 100%;
  padding: 0 22%;
}

.all.over {
  opacity: 0.25;
}

.footer {
  margin: 0.3rem auto 0.2rem;
  width: 100%;
  text-align: center;
  color: #F94341FF;
  font-size: 0.22rem;
}

.yellow_footer {
  margin: 0.3rem auto 0.2rem;
  width: 100%;
  text-align: center;
  color: #815219;
  font-size: 0.22rem;
}

.purple_footer {
  margin: 0.3rem auto 0.2rem;
  width: 100%;
  text-align: center;
  color: #8e85a5;
  font-size: 0.22rem;
}

.blue_footer {
  margin: 0.3rem auto 0.2rem;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 0.22rem;
}

.footer p {
  line-height: 0.36rem;
}
</style>