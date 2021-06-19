<template>
  <div :class="className.container + ' container-invite'">
    <!-- <loading :show="loadDown==false"></loading> -->
    <div class="invite invite-wrapper">
      <flexbox :gutter="0" class="invite-header">
        <flexbox-item class="self-info">
          <img :src="userdata.headpic_url" alt>
          <p>
            <span>{{userdata.name}}</span>
            <span>{{userdata.department_name}}</span>
          </p>
        </flexbox-item>
        <flexbox-item class="total-rank">
          <p>
            <span>{{userinfo.index}}</span>
            <span>排名</span>
          </p>
        </flexbox-item>
        <flexbox-item class="level-name">
          <p>
            <span>{{userinfo.user_level_name}}</span>
            <span class="level-img">
              <template v-if="needStar">
                <img src="../imgs/star.png" alt="" v-for="(item,index) in userinfo.user_star" :key="index">
                <template v-if="userinfo.level_need_star">
                    <img src="../imgs/glaystar.png" alt="" v-for="(grayItem,grayIndex) in (userinfo.level_need_star - userinfo.user_star)" :key="grayIndex">                
                </template>
              </template>
              <!-- <img
                v-if="userinfo.user_star==1 && userinfo.level_need_star != 0"
                src="../imgs/star.png"
                alt
              >
              <img
                v-for="i in userinfo.user_star"
                :key="i"
                v-if="userinfo.user_star>1 && userinfo.level_need_star != 0"
                src="../imgs/star.png"
                alt
              >
              <img v-if="needStar==1" src="../imgs/glaystar.png" alt>
              <img v-for="i in needStar" :key="i" v-if="needStar>1" src="../imgs/glaystar.png" alt>
              <img v-if="needStar == 0 && userinfo.user_star==1" src="../imgs/star.png" alt>
              <img
                v-for="i in userinfo.user_star"
                :key="i"
                v-if="needStar == 0 && userinfo.user_star>1 && userinfo.user_star<6"
                src="../imgs/star.png"
                alt
              > -->
              <template v-if="needStar == 0 && userinfo.user_star>5">
                  <img  src="../imgs/star.png" alt>
                  <i >×{{userinfo.user_star}}</i>
              </template>
               <template v-if="needStar == 0 && userinfo.user_star<=5">
                  <img  src="../imgs/star.png" alt v-for="(item,index) in userinfo.user_star" :key="index">
              </template>
            </span>
          </p>
        </flexbox-item>
      </flexbox>
      <div
        :class="index==1?'rank-wrapper left-trigler':index==2?'rank-wrapper right-trigler':'rank-wrapper'"
      >
        <div class="navbar">
          <div @click="changeIndex(1)" :class="index==1?'active':''"><span class="left">在线列表</span></div>
          <div @click="changeIndex(2)" :class="index==2?'active':''"><span class="right">排行榜</span></div>
          <!-- <div class="search" v-if="index==1">
            <input type="text" v-model="searchWord" placeholder="请输入姓名或昵称">
            <span @click="getOnlineList()">搜索</span>
          </div> -->
        </div>
        <div class="mainer rank">
          <flexbox class="rank-list-head" :gutter="0" v-if="index==1">
            <flexbox-item :span="1/4">
              <p>姓名</p>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <p class="dept">PK胜场数</p>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <p>段位</p>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <p></p>
            </flexbox-item>
          </flexbox>
          <div class="rank-list-body" v-if="index==1 && userLineList.length>0">
            <flexbox class="user-line rank-list" :gutter="0" v-for="(item,i) in userLineList" :key="i">
              <flexbox-item class="dept-user" :span="1/4" style="text-align:left;">
                <div class="user">
                  <img :src="item.avatar==null || item.avatar==avatar?avatar:item.avatar" alt>
                  <p>
                    <span>{{item.name}}</span>
                    <span>{{item.department_name}}</span>
                  </p>
                </div>
              </flexbox-item>
              <flexbox-item class="dept-user" :span="1/4">
                <p class="dept">
                  <span>{{item.pk_win_count}}</span>
                </p>
              </flexbox-item>
              <flexbox-item class="dept-user" :span="1/4">
                <p class="dept">
                  <span>{{item.user_level_name}}</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="1/4">
                <p class="btns">
                  <span
                    v-if="!item.is_invite && item.is_busy==0"
                    class="is-invite"
                    @click="invitepk(item.user_id)"
                  >邀请PK</span>
                  <span
                    v-if="!item.is_invite && item.is_busy==1"
                    class="is-test"
                  >{{item.busy_message || '正在答题'}}</span>
                  <spinner type="dots" v-if="item.is_invite && item.is_invite==1" class="wait"></spinner>
                </p>
              </flexbox-item>
            </flexbox>
          </div>
          <div class="no-data" v-if="index==1 && userLineList.length==0">暂无在线好友</div>
          <flexbox class="rank-list-head" :gutter="0" v-if="index==2">
            <flexbox-item :span="2/13">
              <p>排名</p>
            </flexbox-item>
            <flexbox-item :span="3/13">
              <p>姓名</p>
            </flexbox-item>
            <flexbox-item :span="3/13">
              <p class="dept">PK胜场数</p>
            </flexbox-item>
            <flexbox-item :span="3/13">
              <p>段位</p>
            </flexbox-item>
            <flexbox-item :span="2/13">
              <p></p>
            </flexbox-item>
          </flexbox>
          <div class="rank-list-body" v-if="index==2">
            <div v-for="(item,key,rankIndex) in allRankList" :key="this">
              <flexbox class="rank-list" :gutter="0" v-for="(childItem,i) in item" :key="i">
                <flexbox-item :span="2/13">
                  <p class="number">
                    <img v-if="key<4" :src="key==1?first:key==2?two:key==3?third:''">
                    <span v-else>{{key}}</span>
                  </p>
                </flexbox-item>
                <flexbox-item class="dept-user" :span="3/13" style="text-align:left;">
                  <div class="user">
                    <img
                      :src="childItem.avatar==null || childItem.avatar==''?avatar:childItem.avatar"
                      alt
                    >
                    <p>
                      <span>{{childItem.name}}</span>
                      <span>{{childItem.department_name}}</span>
                    </p>
                  </div>
                </flexbox-item>
                <flexbox-item class="dept-user" :span="3/13">
                  <p class="dept">
                    <span>{{childItem.pk_win_count}}</span>
                  </p>
                </flexbox-item>
                <flexbox-item class="dept-user" :span="3/13">
                  <p class="dept">
                    <span>{{childItem.user_level_name}}</span>
                  </p>
                </flexbox-item>
                <flexbox-item class="dept-user" :span="2/13">
                  <p class="btns">
                    <span
                      class="is-invite"
                      @click="invitepk(childItem.user_id)"
                      v-if="childItem.user_id!=userdata.user_id && childItem.online==1 && !childItem.is_invite && !childItem.is_busy"
                    >邀请PK</span>
                    <spinner
                      type="dots"
                      v-if="childItem.user_id!=userdata.user_id && childItem.is_invite==1"
                      class="wait"
                    ></spinner>
                  </p>
                </flexbox-item>
              </flexbox>
            </div>
          </div>
        </div>
      </div>
      <p class="invite-btn" @click="goPage()">返回首页</p>
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
  name: "invite",
  data() {
    return {
      showError: false, //是否显示错误页面
      showIndex: 0,
      errorInfo: "", //错误提醒消息
      first: first,
      two: two,
      third: third,
      notifyNum: 0, //通知个数
      notifyTimer: null,
      index: 1,
      timer: null,
      avatar: avatar,
      needStar: 0,
      showVertify: false, //弹出验证弹层
      showShareGuide: false, //显示分享引导
      level: 2,
      showNotify: false,
      inviteUserId: 0,
      inviteUserName: "",
      className: {},
      notifyList: [
        // {
        // showNotify: false,
        // inviteUserId: 0,
        // inviteUserName: ''
        // }
      ],
      showPopup: false,
      refuseUserName: "",
      msgIndex: 0,
      refuseUserId: "",
      loadDown: false,
      userinfo: {},
      searchWord: "",
      userLineList: [],
      rankList: {
        data: {},
        mytop: 0
      },
      showWsErr: true
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
    allRankList() {
      let objList = {};
      for (let item in this.rankList.data) {
        let arr = [];
        for (let i = 0; i < this.rankList.data[item].length; i++) {
          let el = this.rankList.data[item][i];
          if (el.avatar) {
            el.avatar = el.avatar;
          } else {
            el.avatar = beAvatar(el.name, 55, "20px PingFangSC-Medium");
          }
          arr.push(el);
        }
        objList[item] = arr;
      }
      return objList;
    },
    sharedesc() {
      return this.activitydata.dingtalk_share_pk.replace(
        "[my_name]",
        this.userdata.name
      );
    }
  },
  mounted() {
    if (this.userdata.platform == "dingtalk") {
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

    this.getOnlineList();
    this.getSharemsg();
    this.getRankList();
    this.timer = setInterval(() => {
      this.getOnlineList();
    }, 3000);

    if (this.userdata.is_blockade_success != 1) {
      this.showError = true;
      this.showIndex = 4;
      this.errorInfo = "你还未完成必答，暂不能进行PK对决,快去完成必答吧";
    }
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
        this.getRankList();
      } else if (re.action == "timeoutNotify") {
        this.msgIndex = 2;
        this.showPopup = true;
        this.refuseUserName = res.name;
        this.getRankList();
      } else if (re.action == "offline") {
        this.$store.state.showOffline = true;
        this.$store.state.offlineMsg = res.message;
        this.getRankList();
      }
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getSharemsg() {
      let access_token = GetUrlParam("access_token");
      let activity_id = GetUrlParam("activity_id");
      // if (this.userdata.platform == "dingtalk") {
      let data = {
        activityId: activity_id,
        share_type: "share_pk_challenge",
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
          this.getRankList();
        } else if (re.action == "timeoutNotify") {
          this.msgIndex = 2;
          this.showPopup = true;
          this.refuseUserName = res.name;
          this.getRankList();
        } else if (re.action == "offline") {
          this.$store.state.showOffline = true;
          this.$store.state.offlineMsg = res.message;
          this.getRankList();
        }
      };
    },
    //获取在线人员列表
    getOnlineList() {
      this.$ajax
        .get(
          "/api/pk/online/users?activity_id=" +
            this.$store.state.activityId +
            "&keyword=" +
            this.searchWord +
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
          if (re.error_code == 0) {
            this.loadDown = true;
            res.online_users.forEach(item => {
              item.avatar =
                item.avatar ||
                beAvatar(item.name, 55, "20px PingFangSC-Medium");
            });
            this.userLineList = res.online_users;
            if (isNaN(res.user_self.length)) {
              this.userinfo = res.user_self;
              // console.log("res.user_self", res.user_self);
              // console.log("this.userinfo", this.userinfo);
              this.userinfo.avatar =
                this.userinfo.avatar ||
                beAvatar(this.userinfo.name, 58, "20px PingFangSC-Medium");
              if (this.userinfo.level_need_star == 0) {
                this.needStar = 0;
              } else {
                this.needStar =
                  this.userinfo.level_need_star - this.userinfo.user_star;
              }
            }
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    getRankList() {
      this.$ajax
        .get(
          "/api/top/person/pk?activity_id=" +
            this.$store.state.activityId +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          console.log(response);
          console.log("response");
          let res = response.data.data;
          if (response.data.error == 302) {
            let locationNow = window.location.href;
            window.location.href =
              response.data.redirect +
              "&redirect=" +
              encodeURIComponent(locationNow);
            return;
          }
          this.loadDown = true;
          this.rankList = res.top_all;
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    changeIndex(index) {
      if (index == 1) {
        this.index = 1;
        this.getOnlineList();
      } else if (index == 2) {
        this.index = 2;
        this.getRankList();
      }
    },
    //发起pk
    invitepk(userid) {
      this.$ajax
        .post("/api/pk/challenge", {
          invite_user_id: userid,
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        })
        .then(response => {
          console.log(response);
          this.getOnlineList();
          this.getRankList();
          if (response.data.error_code != 0) {
            if (response.data.error == 302) {
              let locationNow = window.location.href;
              window.location.href =
                response.data.redirect +
                "&redirect=" +
                encodeURIComponent(locationNow);
              return;
            }
            this.msgIndex = 3;
            this.showPopup = true;
            this.refuseUserName = response.data.message;
          }
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    goPage() {
       this.$router.replace({
        path: "/",
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
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
.container-invite {
  width: 100%;
  height: 100%;
  background: #5f359b;
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  flex-direction: column;
  /* background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover; */
}

.pink_container{
    background: #4755b2 url("../imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.purple_container {
    background: #4755b2 url("../purple_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.yellow_container {
    background: #4755b2 url("../yellow_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.red_container {
    background: #4755b2 url("../red_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.blue_container {
    background: #4755b2 url("../blue_imgs/pk_bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
}

.invite {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
}

.invite-header {
  width: 100%;
  height: 1.2rem;
  /* background: #F7564CFF; */
  padding: 0 0.4rem;
}

.pink_container .invite-header {
  background: #F7564CFF;
}

.blue_container .invite-header {
  background: #0b71e0;
}

.purple_container .invite-header {
  background: #783acd;
}

.yellow_container .invite-header {
  background: #ff9c00;
}

.red_container .invite-header {
  background: #ae1c0f;
}

.self-info,
.total-rank,
.level-name {
  height: 0.8rem;
}

.self-info img,
.self-info p {
  float: left;
}

.self-info p {
  max-width: 59%;
}

.invite-wrapper span {
  display: block;
  text-align: center;
}

.self-info img {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  margin-right: 0.1rem;
}

.self-info span:first-of-type {
  text-align: left;
  font-size: 0.28rem;
  color: #f7f1ff;
}

.self-info span:last-of-type {
  text-align: left;
  font-size: 0.18rem;
  color: #c1acde;
}

.self-info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.total-rank span:first-of-type {
  font-size: 0.46rem;
  color: #f8d445;
}

.total-rank span:last-of-type {
  font-size: 0.18rem;
  color: #FFFFFF;
}

.level-name span {
  font-size: 0.28rem;
  color: #ffffff;
  text-align: right;
}

.level-name span.level-img {
  font-size: 0;
}

.level-name img {
  width: 0.25rem;
  height: 0.25rem;
  margin-right: 0.01rem;
}

.level-name i {
  font-size: 0.24rem;
  color: #ffe81a;
}

.self-info span:first-of-type,
.total-rank span:first-of-type,
.level-name span:first-of-type {
  line-height: 0.5rem;
}

.self-info span:last-of-type,
.total-rank span:last-of-type,
.level-name span:last-of-type {
  line-height: 0.3rem;
}

.rank-wrapper {
  display: flex;
  display: -webkit-flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  position: relative;
  width: 7.1rem;
  margin: 0 auto;
  background-color: #ffffff;
  border-bottom-left-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
}

.rank-wrapper:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: -0.18rem;
}

.pink_container .rank-wrapper:before {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #E83D32FF;
}

.blue_container .rank-wrapper:before {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #1e38b3;
}

.purple_container .rank-wrapper:before {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #1f0049;
}

.yellow_container .rank-wrapper:before {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #f2884d;
}

.red_container .rank-wrapper:before {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #860a00;
}

.rank-wrapper:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 6.88rem;
}

.pink_container .rank-wrapper:after {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #E83D32FF;
}

.blue_container .rank-wrapper:after {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #1e38b3;
}

.purple_container .rank-wrapper:after {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #1f0049;
}

.yellow_container .rank-wrapper:after {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #f2884d;
}

.red_container .rank-wrapper:before {
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #860a00;
}

.navbar {
  width: 100%;
  height: 0.98rem;
  /* padding-left: 0.4rem; */
  border-bottom: 1px solid #D2D2D2FF;
  display: flex;
}

.navbar div {
  position: relative;
  /* float: left; */
  flex: 1;
  height: 0.98rem;
  line-height: 0.98rem;
  text-align: center;
  font-size: 0.24rem;
  color: #ac93d1;
  margin-right: 0.4rem;
}

.navbar div .left {
  width: 1.8rem;
  height: 0.6rem;
  line-height: 0.6rem;
  margin-top: 0.2rem;
  float: right;
  /* border: solid 1px #E83D32FF; */
  border-radius: 0.3rem;
  color: #666666FF;
}

.pink_container .navbar div .left {
  border: solid 1px #E83D32FF;
}

.blue_container .navbar div .left {
  border: solid 1px #fccb04;
}

.purple_container .navbar div .left {
  border: solid 1px #f9a646;
}

.yellow_container .navbar div .left {
  border: solid 1px #fccb04;
}

.red_container .navbar div .left {
  border: solid 1px #f7564c;
}

.navbar div .right {
  width: 1.8rem;
  height: 0.6rem;
  line-height: 0.6rem;
  margin-top: 0.2rem;
  float: left;
  /* border: solid 1px #E83D32FF; */
  border-radius: 0.3rem;
  color: #666666FF;
}

.pink_container .navbar div .right {
  border: solid 1px #E83D32FF;
}

.blue_container .navbar div .right {
  border: solid 1px #fccb04;
}

.purple_container .navbar div .right {
  border: solid 1px #f9a646;
}

.yellow_container .navbar div .right {
  border: solid 1px #fccb04;
}

.red_container .navbar div .right {
  border: solid 1px #f7564c;
}

.navbar div.active {
  color: #fff;
}

.navbar div.active span {
  color: #FFFFFF;
  background-color: #F7564CFF;
}

.pink_container .navbar div.active span {
  background-color: #E83D32FF;
}

.blue_container .navbar div.active span  {
  background-color: #fccb04;
}

.purple_container .navbar div.active span {
  background-color: #f9a646;
}

.yellow_container .navbar div.active span  {
  background-color: #fccb04;
}

.red_container .navbar div.active span  {
  background-color: #f7564c;
}

.mainer {
  width: 100%;
  height: 8.5rem;
  overflow: hidden;
}

.rank-list-body {
}

.no-data {
  height: 1.6rem;
  line-height: 1.6rem;
  font-size: 0.32rem;
  text-align: center;
  color:#666666FF;
}

.rank {
  width: 100%;
  height: 8.5rem;
}

.rank-list-body {
  width: 100%;
  height: 8.5rem;
  overflow-y: auto;
}

.navbar .search {
  float: right;
  height: 0.46rem;
  width: 2.54rem;
  margin-right: 0.29rem;
  margin-top: 0.26rem;
  background: transparent;
}

.search input {
  display: inline-block;
  float: left;
  padding: 0 0.2rem;
  font-size: 0.18rem;
  color: #8864bb;
  border: 1px solid #8864bb;
  border-right: none;
  border-top-left-radius: 0.23rem;
  border-bottom-left-radius: 0.23rem;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  width: 1.92rem;
  height: 0.46rem;
  line-height: 0.44rem;
  background: #3c196e;
}

.search input:focus {
  background: transparent;
  outline: none;
}

.search input::selection,
.search input::-moz-selection {
  background: transparent;
}

.search input::-webkit-input-placeholder {
  font-size: 0.18rem;
  color: #8864bb;
}

.search span {
  display: inline-block;
  float: left;
  width: 0.62rem;
  height: 0.46rem;
  line-height: 0.44rem;
  border: 0.01rem solid #8864bb;
  border-left: none;
  background-color: #9370c5;
  border-top-right-radius: 0.23rem;
  border-bottom-right-radius: 0.23rem;
  text-align: center;
  font-size: 0.2rem;
  color: #3c196e;
}

.user-line,
.rank-list {
  width: 6.7rem;
  height: 1.1rem;
  margin-left: 0.2rem;
  border-bottom: 1px solid #D2D2D2FF;
  padding-right: 0.2rem;
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

.yellow_container .invite-btn {
  cursor: pointer;
  width: 4.38rem;
  text-align: center;
  height: 0.88rem;
  line-height: 0.88rem;
  background-color: #f05a49;
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