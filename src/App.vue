<template>
  <div id="app">
    <Music></Music>
    <loading :show="loadDown==false" :text="text"></loading>
    <div class="err" v-if="loadDown==true && showErr">
      <p>{{errMess}}</p>
    </div>
    <router-view v-if="loadDown==true && showErr==false"></router-view>
    <div v-transfer-dom>
      <popup v-model="showWsErr" position="top" :show-mask="false">
        <div class="wsErrMsg">{{wsErrMsg}}</div>
      </popup>
    </div>
    
    <toast v-if="showLay==true" :showIndex="1"></toast>
  </div>
</template>

<script>
import { Loading, Alert, Popup } from "vux";
import toast from "@/component/toast";
import avatar from "../src/imgs/avatar.jpg";
import { beAvatar } from "./js/util.js";
import { setCookie, getCookie } from "./js/cookie.js";
import Music from "@/pages/music";
let url = "",
  title = "",
  desc = "";
export default {
  name: "App",
  data() {
    return {
      showLay: false,
      loadDown: false,
      showErr: false,
      showWsErr: false,
      wsErrMsg: "",
      errMess: "", //错误提醒
      userInfo: {},
      text: "正在加载",
      avatar: avatar
    };
  },
  computed: {
    websocket() {
      return this.$store.state.websocket;
    }
  },
  components: {
    Loading,
    Alert,
    Popup,
    toast,
    Music
  },
  created() {
    this.$store.state.activityId = this.$route.query.activity_id;
    console.log(this.$route.query.activity_id)
    this.getActivityInfo();
    this.getRem(750, 100);
  },
  methods: {
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
              window.location.href = res.redirect
          } else if (re.error_code == 0) {
            if (
              res.regulation_required == 1 && !window.localStorage.getItem( "isReadReg_" + this.$store.state.activityId ) ) {
              this.showLay = true;
            } else if (
              res.regulation_required == 1 &&
              window.localStorage.getItem(
                "isReadReg_" + this.$store.state.activityId
              ) == true
            ) {
              this.showLay = false;
            }
            if (res.regulation) {
              res.regulation = res.regulation.replace(/(\r\n)|(\n)/g, "<br>");
            }
            this.$store.commit("setState", {
              // 保存用户状态
              activitydata: res
            });
            document.title = res.title;
            this.getUserInfo();
          } else {
            this.loadDown = true;
            this.showErr = true;
            this.errMess = re.msg;
          }
        })
        .catch(error => {
          // window.location.href = error.response.data.redirect;
        });
    },
    //获取用户信息
    getUserInfo() {
      this.$ajax
        .get(
          "/api/user/info?activity_id=" +
            this.$route.query.activity_id +
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
          } else if (re.error_code == 0) {
            this.loadDown = true;
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
            if (
              this.$store.state.activitydata.activity_enable == true &&
              res.user_enable == true &&
              this.$store.state.userdata.user_id > 0
            ) {
              this.$store.state.websocket = new ReconnectingWebSocket(
                this.$store.state.activitydata.ws_server
              );
              this.$store.state.websocket.timeoutInterval = 3000;
              setInterval(() => {
                if (navigator.onLine == false) {
                  this.showWsErr = true;
                  this.wsErrMsg = "网络已断开，请检查网络后重新打开页面";
                } else if (
                  navigator.onLine == true &&
                  this.websocket.readyState == 1
                ) {
                  this.showWsErr = false;
                }
                this.websocket.send("1");
              }, 3000);
            }
          } else {
            this.loadDown = true;
            this.showErr = true;
            this.errMess = re.msg;
            return;
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    getRem(pwidth, prem) {
      var html = document.getElementsByTagName("html")[0];
      var oWidth =
        document.body.clientWidth || document.documentElement.clientWidth;
        html.style.fontSize = (oWidth / pwidth) * prem + "px";
    }
  }
};
</script>

<style>
@import "./css/reset.css";
#app {
  font-family: PingFangSC-Medium, "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.err {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.err p {
  width: 70%;
  height: 3rem;
  line-height: 3rem;
  margin: 3.4rem auto;
  background: #fff;
  font-size: 0.2rem;
  color: #999999;
  text-align: center;
  border-radius: 10px;
}

.wsErrMsg {
  background-color: #ff0000;
  color: #fff;
  text-align: center;
  padding: 15px;
}
</style>
<style lang="less">
@import "~vux/src/styles/reset.less";
</style>