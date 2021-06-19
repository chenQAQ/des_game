<template>
  <div class="container" :style="{'background-color':activitydata.top_background_color}">
    <div class="content">
      <p class="flaunt-banner">
        <img :src="activitydata.top_banner" alt>
      </p>
      <p class="info">
        <img :src="userdata.headpic_url" alt>
        <span>{{userdata.name}}</span>
        <span>{{userdata.department_name}}</span>
      </p>
      <p class="detail" v-if="loadDown && index==2">
        <span>PK排名</span>
        <span class="number level level-name">{{markInfo.user_level_name}}</span>
        <span class="level">
          <img
            v-if="markInfo.user_star==0 && markInfo.level_need_star==1"
            src="../imgs/glaystar.png"
            alt
          >
          <img
            v-if="markInfo.user_star==0 && markInfo.level_need_star>1"
            v-for="i in markInfo.level_need_star"
            :key="this"
            src="../imgs/glaystar.png"
            alt
          >
          <img
            v-if="markInfo.user_star==1 || markInfo.level_need_star==0"
            src="../imgs/star.png"
            alt
          >
          <img
            v-if="markInfo.user_star>1 && markInfo.level_need_star!=0"
            v-for="i in markInfo.user_star"
            :key="this"
            src="../imgs/star.png"
            alt
          >
          <i v-if="markInfo.level_need_star==0">{{markInfo.user_star}}</i>
        </span>
        <span class="number level">
          第
          <i>{{markInfo.index}}</i>名
        </span>
      </p>
      <p class="detail" v-if="loadDown && index==3">
        <span>知识币单位排名</span>
        <span class="number">
          <i>{{markInfo.index_department}}</i>名
        </span>
        <span>
          战胜了
          <i>{{markInfo.top_win_department_rate}}%</i>的同事
        </span>
      </p>
      <p class="detail" v-if="loadDown && index==4">
        <span>知识币总排名</span>
        <span class="number">
          <i>{{markInfo.index_all}}</i>名
        </span>
        <span>
          战胜了
          <i>{{markInfo.top_win_rate}}%</i>的同事
        </span>
      </p>
      <ul class="navbar">
        <li
          @click="index=2"
          :class="(activitydata.open_department_top==0 && index==2)?'no-department-rank active':(activitydata.open_department_top!=0 && index==2)?'active':(activitydata.open_department_top==0 && index!=2)?'no-department-rank':''"
        >PK排名</li>
        <li
          @click="index=4"
          :class="(activitydata.open_department_top==0 && index==4)?'no-department-rank active':(activitydata.open_department_top!=0 && index==4)?'active':(activitydata.open_department_top==0 && index!=4)?'no-department-rank':''"
        >知识币总排名</li>
        <li
          @click="index=3"
          v-if="activitydata.open_department_top!=0"
          :class="index==3?'active':''"
        >知识币单位排名</li>
      </ul>
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
import notify from "@/component/notify";
import popup from "@/component/popup";
export default {
  name: "flaunt",
  data() {
    return {
      showError: false, //是否显示错误页面
      showIndex: 0,
      errorInfo: "", //错误提醒消息
      loadDown: false,
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
      index: 2,
      markInfo: {
        //成绩详情
      }
    };
  },
  components: {
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
    }
  },
  beforeMount() {
    if (window.dd) {
      dd.postMessage({
        name: "home"
      });
    }
    this.getScoreInfo();
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
  },
  methods: {
    bgstyle(bg) {
      return {
        background: `url(${bg}) center no-repeat`,
        backgroundSize: "cover",
        backgroundOrigin: "content-box"
      };
    },
    getScoreInfo() {debugger
      this.$ajax
        .get( "/api/mark?activity_id=" + this.$store.state.activityId + "&access_token=" + this.$store.state.access_token )
        .then(response => {
          let re = response.data;
          if (re.error_code == 302) {
            let locationNow = window.location.href;
            window.location.href =
              response.data.redirect +
              "&redirect=" +
              encodeURIComponent(locationNow);
            return;
          }
          this.loadDown = true;
          if (re.error_code != 0 && re.error_code != undefined) {
            return;
          } else {
            this.markInfo = re.data;
          }
        })
        .catch(error => {debugger
          window.location.href = error.response.data.redirect;
        });
    }
  }
};
</script>
<style scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding-bottom: 0.8rem;
}

.container .content {
  width: 100%;
}

.container .content .flaunt-banner {
  width: 100%;
  margin-bottom: 0.8rem;
  text-align: center;
  padding: 0 0.2rem;
}

.container .content .flaunt-banner img {
  width: 100%;
  height: auto;
  vertical-align: middle;
  margin-top: 0.2rem;
}

.info {
  width: 100%;
  text-align: center;
  font-size: 0.28rem;
  color: #e7dcfd;
  /* margin-bottom: 0.26rem; */
}

.info img {
  width: 1.2rem;
  height: 1.2rem;
  border: 1px solid #fff;
  border-radius: 50%;
  vertical-align: middle;
  margin-bottom: 0.2rem;
}

.info span:first-of-type {
  display: block;
  font-size: 0.34rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 0.4rem;
}

.info span:last-of-type {
  display: block;
  font-size: 0.28rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 0.4rem;
  margin-top: 0.1rem;
}

.detail {
  width: 100%;
  text-align: center;
  font-size: 0.32rem;
  color: #d0bef0;
  margin-top: 0.5rem;
}

.detail span:first-of-type {
  display: inline-block;
  font-size: 0.3rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.6rem;
  width: 3.6rem;
  height: 0.8rem;
  line-height: 0.8rem;
  background: url("../imgs/flauntpk_bg.png") center center no-repeat;
  background-size: 100% 100%;
}

.detail span:last-of-type {
  display: block;
  font-size: 0.22rem;
  color: rgba(255, 255, 255, 0.4);
  height: 0.4rem;
  line-height: 0.4rem;
}

.detail span:last-of-type i {
  font-size: 0.32rem;
  color: #dfd972;
}

.detail .level {
  font-size: 0;
}

.detail .level i {
  font-size: 0.42rem;
  color: #e9c74c;
}

.detail span.number {
  display: block;
  font-size: 0.32rem;
  color: #dfd972;
}

.detail span.number i {
  font-size: 0.76rem;
  color: #dfd972;
}

.detail span.percent {
  font-size: 0.37rem;
  color: #dfd972;
}

.navbar {
  width: 100%;
  padding: 0 5%;
  overflow: hidden;
  margin-top: 0.6rem;
}

.navbar li {
  float: left;
  width: 32%;
  text-align: center;
  font-size: 0.22rem;
  color: rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.25);
  margin-right: 2%;
  padding: 0.16rem 0;
}

.navbar li.no-department-rank {
  width: 49%;
}

.navbar li:last-of-type {
  margin-right: 0;
}

.navbar li.active {
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid #56607e;
  background: rgba(0, 0, 0, 0.4);
}

.detail span.level-name {
  font-size: 0.78rem;
  color: #e9c74c;
}

.detail .level img {
  width: 0.4rem;
  height: 0.4rem;
  vertical-align: middle;
  margin: 0.05rem auto 0.5rem;
}
</style>