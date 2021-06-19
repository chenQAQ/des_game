<template>
  <div :class="className.containersucess + ' container-success'">
    <flexbox orient="vertical" :gutter="0" class="vertical-flex-box">
      <flexbox-item :span="3/5" class="result_head">
        <div class="result_head_inner">
          <div class="result_head_text">
            <div class="result_head_text_limit" v-if="$route.query.isBlockade==true" >
              <h4>闯关成功</h4>
              <p>知识币 +{{$route.query.knowledge_money}}</p>
            </div>
            <div v-else>
              <h4>必答成功</h4>
              <p>知识币 +{{$route.query.knowledge_money}}</p>
            </div>
          </div>
        </div>
      </flexbox-item>
      <flexbox-item :span="2/5">
        <div class="action-btn">
          <p class="continue" @click="nextBlock()" v-if="$route.query.isBlockade==true " >继续闯关</p>
          <!-- <p class="continue" @click="nextBlock()" v-if="$route.query.isBlockade==true">继续答题</p> -->
          <!-- <p class="continue" @click="goPage()"  >返回首页</p> -->
          <p v-if="activitydata.is_open_prize==1" class="gold-value" @click="goHome()">我的知识币</p>
          <p  :class="activitydata.is_open_prize==1?'return':'return null'">
            <span @click="goPage()">返回首页&nbsp;></span>
          </p>
        </div>
      </flexbox-item>
    </flexbox>
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
import { Flexbox, FlexboxItem } from "vux";
import notify from "@/component/notify";
import popup from "@/component/popup";
import { beAvatar, GetUrlParam, convertImgToBase64 } from "../js/util.js";
export default {
  name: "success",
  data() {
    return {
      showError: false, //是否显示错误页面
      showIndex: 0,
      errorInfo: "", //错误提醒消息
      value: this.$route.query.knowledge_money,
      showNotify: false,
      inviteUserId: 0,
      inviteUserName: "",
      msgIndex: 0,
      notifyList: [
        // {
        // showNotify: false,
        // inviteUserId: 0,
        // inviteUserName: ''
        // }
      ],
      showPopup: false,
      blockade_num: 0,
      next_blockade_num: 0,
      refuseUserName: "",
      className: {},
      nextDataFlag:false
    };
  },
  components: {
    Flexbox,
    FlexboxItem,
    notify,
    popup
  },
  computed: {
    websocket() {
      return this.$store.state.websocket;
    },
    activitydata() {
      return this.$store.state.activitydata;
    },
    userdata() {
      return this.$store.state.userdata;
    },
    sharedesc() {
      return this.activitydata.dingtalk_share_home.replace(
        "[my_name]",
        this.userdata.name
      );
    }
  },
  created() {
    this.blockade_num  = this.$route.query.blockade_num;
    this.next_blockade_num = parseInt(this.blockade_num) + 1;
     this.nextDataFlag = false
    if (this.activitydata.must_blockade[this.next_blockade_num]) {
      if(new Date().getTime() >= new Date(this.activitydata.must_blockade[this.next_blockade_num].startDate).getTime()){
        this.nextDataFlag = true
      }
    }
    
    // console.log(new Date().getTime())
    // console.log(new Date(this.activitydata.must_blockade[this.next_blockade_num].startDate).getTime())
  },
  beforeMount() {
    this.className.containersucess = "pink_containerfail"
            if(this.activitydata.top_background_color == "pink"){
                this.className.containersucess = "pink_containerfail"
            } 

            if(this.activitydata.top_background_color == "purple"){
                this.className.containersucess = "purple_containerfail"
            }

            if(this.activitydata.top_background_color == "red"){
                this.className.containersucess = "red_containerfail"
            }

            if(this.activitydata.top_background_color == "yellow"){
                this.className.containersucess = "yellow_containerfail"
            }

            if(this.activitydata.top_background_color == "blue"){
                this.className.containersucess = "blue_containerfail"
            }



    this.getSharemsg();
    if (this.userdata.platform == "dingtalk") {
      if(window.dd){
        dd.postMessage({
        name: "home",
        desc: this.sharedesc
      });
      dd.onMessage = e => {};
      }
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
    getSharemsg() {
      let access_token = GetUrlParam("access_token");
      let activity_id = GetUrlParam("activity_id");
      // if (this.userdata.platform == "dingtalk") {
      let data = {
        activityId: activity_id,
        share_type: "share_pk",
        room_id: 0,
        access_token: access_token
      };
      if(window.dd){
        dd.postMessage(data);

      dd.onMessage = e => {
        console.log(e);
      };
      }
    },
    goPage(page) {
      // window.location.href = window.location.origin + '/api?activity_id=' + this.$store.state.activityId
      this.$router.replace({
        path: "/",
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
    },
    goHome() {
      if (this.activitydata.is_open_prize == 0) {
        // window.location.href = window.location.origin + '/api?activity_id=' + this.$store.state.activityId
        this.$router.replace({
          path: "/",
          query: {
            activity_id: this.$store.state.activityId,
            access_token: this.$store.state.access_token
          }
        });
      } else {
        this.$router.replace({
          path: "/lottery",
          query: {
            activity_id: this.$store.state.activityId,
            access_token: this.$store.state.access_token
          }
        });
      }
    },
    nextBlock() {
      if (this.$route.query.isBlockade == true) {
        if ( this.$route.query.blockade_num ==this.activitydata.must_blockade.length) {
          this.goPage();
        } else {
          this.$router.replace({
            path: "/answer",
            query: {
              tp: "QA",
              activity_id: this.$store.state.activityId,
              access_token: this.$store.state.access_token,
              blockade_num: this.blockade_num 
            }
          });
        }
      } else {
        this.$router.replace({
          path: "/blockade",
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
.container-success {
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.pink_containerfail{
        background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
        background-size: cover;
    }

    .yellow_containerfail{
        background: url("../yellow_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
        background-size: cover;
    }

    .red_containerfail{
        background: url("../red_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
        background-size: cover;
    }

    .purple_containerfail{
        background: url("../purple_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
        background-size: cover;
    }

    .blue_containerfail{
        background: url("../blue_imgs/pk_bg_fail.jpg") 0 0 no-repeat;
        background-size: cover;
    }

.vertical-flex-box {
  height: 100%;
}

.result_head {
  background: url(../imgs/ray.png) center no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.result_head_inner {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: url(../imgs/crown_success.png) center no-repeat;
  background-size: 6rem;
}

.result_head_text {
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 0.4rem;
  text-align: center;
}

.result_head_text .result_head_text_limit {
  margin: 0 auto;
  width: 50%;
  padding-top: 0.28rem;
}

.result_head_text h4 {
  font-size: 0.58rem;
  font-weight: normal;
}

.result_head_text p {
  font-size: 0.35rem;
}

.action-btn {
}

.action-btn p.gold-value,
.action-btn p.continue {
  width: 5.4rem;
  height: 1rem;
  margin: 0 auto 0.2rem;
  text-align: center;
  line-height: 1rem;
  border-radius: 0.5rem;
  font-size: 0.38rem;
}

.action-btn p.continue {
  background: #FFC64AFF;
  color: #64540BFF;
}

.action-btn p.gold-value {
  background: #FC584EFF;
  color: #FFFFFFFF;
}

.action-btn p.return {
  width: 100%;
  text-align: center;
  margin-top: 0.4rem;
  font-size: 0.28rem;
  color: #FFFFFFFF;
}

.action-btn p.return.null {
  margin-top: 1.6rem;
}
</style>
</style>