<template>
  
  <div :class="className.container + ' container-rank'" @click.prevent="showtip=false;">
    <div class="navbar" v-if="activitydata.open_department_top==1">
      <div class="group" @click="changeIndex(1)" :class="index==1?'active':''">团队榜</div>
      <div class="person" @click="changeIndex(2)" :class="index==2?'active':''">个人榜</div>
    </div>
    <div
      :class="(activitydata.open_department_top==1 && index==1)?'rank-wrapper left-trigler':(activitydata.open_department_top==1 && index==2)?'rank-wrapper right-trigler':'rank-wrapper'"
    >
      <div class="rank-detail" v-if="loadDown &&userdata.department_id!=0">
        <p
          class="dept-name"
          v-if="index==1"
        >{{childDeptRank.my.department_name}} （{{childDeptRank.my.user_num}}人）</p>
        <div class="dept-detail dept" v-if="index==1">
          <flexbox class="deptrank-detail" :gutter="0">
            <flexbox-item :span="1/20">
              <div></div>
            </flexbox-item>
            <flexbox-item :span="9/20">
              <div class="rate">
                <div>{{childDeptRank.my.join_rate}}<span style="font-size:0.3rem;">%</span></div>
                <p style="margin-top:0.3rem;">参与率</p>
                <p>
                  第&nbsp;<span class="dspan">{{childDeptRank.my.top_score}}</span>&nbsp;名
                </p>
              </div>
            </flexbox-item>
            <flexbox-item :span="9/20">
              <div class="average">
                <div>{{childDeptRank.my.avg_knowledge_money}}</div>
                <p  style="margin-top:0.3rem;">人均知识币</p>
                <p>
                  第&nbsp;<span class="dspan">{{childDeptRank.my.top_avg_km}}</span>&nbsp;名
                </p>
              </div>
            </flexbox-item>
            <!-- <flexbox-item :span="3/10">
              <div class="average">
                <div>{{childDeptRank.my.gross_score}}知识币</div>
                <p>团队知识币</p>
                <p>
                  第
                  <span>{{childDeptRank.my.top_score}}</span>名
                </p>
              </div>
            </flexbox-item> -->
            <flexbox-item :span="1/20">
              <div></div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="self-detail dept-detail" v-if="index==2">
          <!-- <p class="flaunt" @click="goPage('/flaunt')">查看我的战绩</p> -->
          <p class="self-info">
            <span>
              <img class="avatar" :src="userdata.headpic_url">
              <i>{{selfInfo.name}}</i>
            </span>
          </p>
          <!-- <p class="self-value">获得{{selfInfo.knowledge_money}}知识币，打败了{{defeat}}%的人</p> -->
          <p class="self-value">-&nbsp;知识币&nbsp; {{selfInfo.knowledge_money}}&nbsp;-</p>
          <!-- <flexbox class="selfrank-detail">
            <flexbox-item>
              <div class="rate">
                <p>全员排名</p>
                <p>
                  第
                  <span>{{selfAllDeptRank.mytop}}</span>名
                </p>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="rate">
                <p>本队排名</p>
                <p>
                  第
                  <span>{{selfChildDeptRank.mytop}}</span>名
                </p>
              </div>
            </flexbox-item>
          </flexbox> -->
            <flexbox class="selfrank-detail">
            <flexbox-item>
              <div class="rate">
                <!-- <p>全员排名</p> -->
                <p>
                  第&nbsp;<span>{{selfAllDeptRank.mytop}}</span>&nbsp;名
                </p>
              </div>
            </flexbox-item>
            <!-- <flexbox-item>
              <div class="rate">
                <p>本队排名</p>
                <p>
                  第
                  <span>{{selfChildDeptRank.mytop}}</span>名
                </p>
              </div>
            </flexbox-item> -->
          </flexbox>
        </div>
      </div>
      <div class="mainer" v-if="loadDown">
        <div class="kind" v-if="index==2 && userdata.department_id!=0">
          <span @click="childIndex=3" :class="childIndex==3?'active':''">TOP100</span>
          <span @click="childIndex=4" :class="childIndex==4?'active':''">本队</span>
        </div>
        <flexbox :gutter="0" v-if="index==1" class="deptrank-list-head && loadDown==true">
          <flexbox-item :span="2/15">
            <p style="font-size: .2rem;">排名</p>
          </flexbox-item>
          <flexbox-item :span="4/15">
            <p style="font-size: .2rem;">团队</p>
          </flexbox-item>
          <flexbox-item :span="1/5">
            <p style="font-size: .2rem;">必答完成率</p>
          </flexbox-item>
          <flexbox-item :span="1/5">
            <p style="font-size: .2rem;">人均知识币</p>
          </flexbox-item>
          <flexbox-item :span="1/5">
            <div class="tips">
              <p style="font-size: .2rem;">团队知识币</p>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox :gutter="0" v-if="index==2" class="selfrank-list-head && loadDown==true">
          <flexbox-item :span="7/30">
            <p>排名</p>
          </flexbox-item>
          <flexbox-item :span="1/4" class="lts">
            <p>姓名</p>
          </flexbox-item>
          <flexbox-item :span="4/15">
            <p>团队</p>
          </flexbox-item>
          <flexbox-item :span="1/4">
            <p>知识币</p>
          </flexbox-item>
        </flexbox>
        <div
          :class="activitydata.open_department_top==0 && userdata.department_id==0?'rank null-depart-rank':(activitydata.open_department_top==1 && userdata.department_id==0)?'rank depart-rank':(activitydata.open_department_top==0 && userdata.department_id==1)?'rank self-depart-rank':'rank'"
          v-if="loadDown==true"
        >
          <div
            class="deptrank-list-body"
            v-if="index==1"
            v-for="(rankItem,key,rankIndex) in childDeptRankList"
            :key="this"
          >
            <flexbox :gutter="0" v-for="(item,i) in rankItem" :key="i">
              <flexbox-item :span="2/15">
                <p class="number">
                  <img v-if="key<4" :src="key==1?first:key==2?two:key==3?third:''">
                  <span v-else>{{key}}</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="4/15">
                <p>
                  <span
                    :class="item.department_name==''?'null-word':''"
                  >{{item.department_name || ' '}}</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="1/5">
                <p>
                  <span :class="item.join_count==''?'null-word':''">{{item.join_rate}}%</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="1/5">
                <p>
                  <span :class="item.join_rate==''?'null-word':''">{{item.avg_knowledge_money}}</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="1/5">
                <p>
                  <span :class="item.join_rate==''?'null-word':''">{{item.gross_score}}</span>
                </p>
              </flexbox-item>
            </flexbox>
          </div>
          <div
            v-if="index==2 && childIndex==3"
            class="selftoprank-list-body"
            v-for="(rankItem,key,rankIndex) in selfAllDeptRankList"
            :key="this"
          >
            <flexbox :gutter="0" v-for="(item,i) in rankItem" :key="i">
              <flexbox-item :span="7/30">
                <p class="number">
                  <img v-if="key<4" :src="key==1?first:key==2?two:key==3?third:''">
                  <span v-else>{{key}}</span>
                </p>
              </flexbox-item>
              <flexbox-item class="lts" :span="1/4">
                <p>
                  <span>
                    <img class="avatar" :src="item.avatar">
                    <i>{{item.name}}</i>
                  </span>
                </p>
              </flexbox-item>
              <flexbox-item :span="4/15">
                <p>
                  <span
                    :class="item.department_name==''?'null-word':''"
                  >{{item.department_name || ' '}}</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="1/4">
                <p>
                  <span
                    :class="item.knowledge_money==''?'null-word':''"
                  >{{item.knowledge_money || 0}}</span>
                </p>
              </flexbox-item>
            </flexbox>
          </div>
          <div
            v-if="index==2 && childIndex==4"
            class="selfdeptrank-list-body"
            v-for="(rankItem,key,rankIndex) in selfChildDeptRankList"
            :key="this"
          >
            <flexbox :gutter="0" v-for="(item,i) in rankItem" :key="i">
              <flexbox-item :span="7/30">
                <p class="number">
                  <img v-if="key<4" :src="key==1?first:key==2?two:key==3?third:''">
                  <span v-else>{{key}}</span>
                </p>
              </flexbox-item>
              <flexbox-item class="lts" :span="1/4">
                <p>
                  <span>
                    <img class="avatar" :src="item.avatar">
                    {{item.name}}
                  </span>
                </p>
              </flexbox-item>
              <flexbox-item :span="4/15">
                <p>
                  <span
                    :class="item.department_name==''?'null-word':''"
                  >{{item.department_name || ' '}}</span>
                </p>
              </flexbox-item>
              <flexbox-item :span="1/4">
                <p>
                  <span
                    :class="item.knowledge_money==''?'null-word':''"
                  >{{item.knowledge_money || 0}}</span>
                </p>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </div>
    <p class="invite-btn" @click="goPage('/')">返回首页</p>
    <!-- <div v-if="index==1" :class="showtip==true?'contact show':'contact hide'" @click.stop.prevent="preventHide()">
        <span @click="showTip()">
          <img src="../imgs/ques.png" alt="" >
        </span>
    </div>-->
    <!-- <div class="footer" v-if="activitydata.top_prize_open==1 && index==2 && childIndex==3">
        <p>{{activitydata.top_prize_text}}</p>
        <p>目前第{{selfAllDeptRank.prize_requirement.index ||
          ''}}名知识币数量：{{selfAllDeptRank.prize_requirement.knowledge_money}}</p>
    </div>-->
    <notify
      v-for="(item,index) in notifyList"
      :index="index"
      :showNotify="item.showNotify"
      :inviteUserId="item.inviteUserId"
      :inviteUserName="item.inviteUserName"
      :key="index"
      :bottom="item.bottom"
      :counttime="item.counttime"
    ></notify>
    <popup v-if="showPopup==true" :refuseUserName="refuseUserName" :msgIndex="msgIndex"></popup>
    <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo"></toast>
    <toast v-if="$store.state.showOffline==true" :showIndex="5" :errMsg="$store.state.offlineMsg"></toast>
  </div>
</template>
<script>
import first from "@/imgs/first.png";
import two from "@/imgs/second.png";
import third from "@/imgs/third.png";
import cup from "@/imgs/prizecup.png";
import notify from "@/component/notify";
import popup from "@/component/popup";
import { Flexbox, FlexboxItem, XCircle, Popover } from "vux";
import { beAvatar, GetUrlParam, convertImgToBase64 } from "../js/util.js";
export default {
  name: "rank",
  data() {
    return {
      showtip: false,
      showError: false, //是否显示错误页面
      showIndex: 0,
      errorInfo: "", //错误提醒消息
      first: first,
      two: two,
      third: third,
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
      className: {},
      cup: cup,
      loadDown: false, //加载完全
      index: 2, //父标签码
      childIndex: 1, //子标签码
      selfInfo: {},
      defeat: 0,
      deptRank: {
        //部门排行榜
      },
      selfAllDeptRank: {
        //top100排行榜
        data: {},
        my: {}
      },
      selfChildDeptRank: {
        //本队排行榜
        data: {},
        my: {}
      },
      childDeptRank: {
        data: {},
        my: {}
      }
    };
  },
  computed: {
    websocket() {
      return this.$store.state.websocket;
    },
    userdata() {
      return this.$store.state.userdata;
    },
    childDeptRankList() {
      let objList = {};
      for (let item in this.childDeptRank.data) {
        let arr = [];
        for (let i = 0; i < this.childDeptRank.data[item].length; i++) {
          let el = this.childDeptRank.data[item][i];
          if (el.avatar) {
            // el.avatar = el.avatar;
          } else {
            el.avatar = beAvatar(el.name, 55, "20px PingFangSC-Medium");
          }
          arr.push(el);
        }
        objList[item] = arr;
      }
      return objList;
    },
    selfAllDeptRankList() {
      let objList = {};
      for (let item in this.selfAllDeptRank.data) {
        let arr = [];
        for (let i = 0; i < this.selfAllDeptRank.data[item].length; i++) {
          let el = this.selfAllDeptRank.data[item][i];
          if (el.avatar) {
            // el.avatar = el.avatar;
          } else {
            el.avatar = beAvatar(el.name, 55, "20px PingFangSC-Medium");
          }
          arr.push(el);
        }
        objList[item] = arr;
      }
      return objList;
    },
    selfChildDeptRankList() {
      let objList = {};
      for (let item in this.selfChildDeptRank.data) {
        let arr = [];
        for (let i = 0; i < this.selfChildDeptRank.data[item].length; i++) {
          let el = this.selfChildDeptRank.data[item][i];
          if (el.avatar) {
            // el.avatar = el.avatar;
          } else {
            el.avatar = beAvatar(el.name, 55, "20px PingFangSC-Medium");
          }
          arr.push(el);
        }
        objList[item] = arr;
      }
      console.log("objList", objList);
      return objList;
    },
    activitydata() {
      return this.$store.state.activitydata;
    },
    sharedesc() {
      if (this.index == 1) {
        return this.activitydata.dingtalk_share_top_department;
      } else if (this.index == 2) {
        return this.activitydata.dingtalk_share_top_person;
      }
    }
  },
  components: {
    XCircle,
    Flexbox,
    FlexboxItem,
    notify,
    popup,
    Popover
  },
  mounted() {
    this.getSharemsg();
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


    if (this.userdata.platform == "dingtalk") {
      if (window.dd) {
        dd.postMessage({
          name: "rank",
          desc: this.activitydata.dingtalk_share_top_department
        });
        dd.onMessage = e => {};
      }
    }
    if (this.activitydata.open_department_top == 0) {
      this.index = 2;
      this.childIndex = 3;
      this.getSelfRank();
    } else {
      this.index = 1;
      this.getDeptRank();
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
        share_type: "share_top",
        room_id: 0,
        access_token: access_token
      };
      if (window.dd) {
        dd.postMessage(data);
        dd.onMessage = e => {
          console.log(e);
        };
      }
    },
    preventHide() {
      return;
    },
    showTip() {
      console.log(123);
      if (this.showtip == true) {
        this.showtip = false;
        console.log(234);
      } else {
        this.showtip = true;
        console.log(345);
      }
      console.log("isshow", this.showtip);
    },
    //页面跳转
    goPage(page) {
      this.$router.push({
        path: page,
        query: {
          activity_id: this.$store.state.activityId,
          access_token: this.$store.state.access_token
        }
      });
    },
    changeIndex(index) {
      if (index == 1) {
        this.index = 1;
        this.getDeptRank();
        if (this.userdata.platform == "dingtalk") {
          if(window.dd){
            dd.postMessage({
            name: "rank",
            desc: this.activitydata.dingtalk_share_top_department
          });
            dd.onMessage = e => {};
          }
        }
      } else {
        this.index = 2;
        this.childIndex = 3;
        this.getSelfRank();
        if (this.userdata.platform == "dingtalk") {
          if (window.dd) {
            dd.postMessage({
              name: "rank",
              desc: this.activitydata.dingtalk_share_top_person
            });
            dd.onMessage = e => {};
          }
        }
      }
    },
    //获取团队排行榜
    getDeptRank() {
      this.loadDown = false;
      this.$ajax
        .get(
          "/api/top/department/index?activity_id=" +
            this.$store.state.activityId +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
          this.loadDown = true;
          let res = response.data.data;
          if (response.data.error == 302) {
            let locationNow = window.location.href;
            window.location.href =
              response.data.redirect +
              "&redirect=" +
              encodeURIComponent(locationNow);
            return;
          }
          this.childDeptRank = res;
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    },
    //获取个人排行榜
    getSelfRank() {
      this.loadDown = false;
      this.$ajax
        .get(
          "/api/top/person/index?activity_id=" +
            this.$store.state.activityId +
            "&access_token=" +
            this.$store.state.access_token
        )
        .then(response => {
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
          this.selfAllDeptRank = res.top_all;
          if (this.userdata.department_id != 0) {
            this.selfChildDeptRank = res.top_department;
          }
          this.selfInfo = res.my;
          this.defeat = res.defeat;
        })
        .catch(error => {
          window.location.href = error.response.data.redirect;
        });
    }
  }
};
</script>
<style scoped>
.container-rank {
  position: relative;
  width: 100%;
  min-height: 100%;
  /* background: url("../imgs/pk_bg_fail.jpg") 0 0 no-repeat;
  background-size: cover; */
  overflow: hidden;
  display: flex;
  display: -webkit-flex;
  flex: 1;
  align-items: center;
  /*垂直居中*/
  justify-content: start;
  /*水平居中*/
  flex-direction: column;
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

.navbar {
  margin: 0.4rem auto 0;
  width: 94%;
  height: 0.88rem;
  /* border: 1px solid #5f359b; */
  border-radius: 0.5rem;
}

.navbar div {
  float: left;
  width: 50%;
  height: 0.88rem;
  line-height: 0.88rem;
  text-align: center;
  font-size: 0.36rem;
  /* background: #FF5C5CFF; */
  color: #fff;
}

.pink_container .navbar div {
  background: #FF5C5CFF;
  color: #fff;
}

.blue_container .navbar div {
  background: #0b71e0;
  color: #fff;
}

.yellow_container .navbar div {
  background: #d6802b;
  color: #fff;
}

.purple_container .navbar div {
  background: #5e10c8;
  color: #fff;
}

.red_container .navbar div {
  background: #ff5c5d;
  color: #fff;
}

.navbar div.active {
  color: #fff;
  /* background: #F74848FF; */
}

.pink_container .navbar div.active {
  background: #F74848FF;
  color: #fff;
}

.blue_container .navbar div.active {
  background: #4b9cf7;
  color: #fff;
}

.yellow_container .navbar div.active {
  background: #efaa29;
  color: #fff;
}

.purple_container .navbar div.active {
  background: #7b36de;
  color: #fff;
}

.red_container .navbar div.active {
  background: #f74749;
  color: #fff;
}

.navbar div:first-of-type {
  width: 49.5%;
  margin-right: 0.5%;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.navbar div:last-of-type {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.rank-wrapper {
  position: relative;
  margin: 0 auto;
  width: 94%;
  margin-bottom: 0.4rem;
  margin-top: 0.65rem;
  background: #fff;
  /* overflow-y: scroll; */
  border-radius: 0.14rem;
  min-height: 9rem;
}

.rank-wrapper.left-trigler:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: -0.42rem;
  left: 1.54rem;
  border-left: 0.3rem solid transparent;
  border-right: 0.3rem solid transparent;
  border-bottom: 0.45rem solid #fff;
}

.rank-wrapper.right-trigler:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: -0.42rem;
  right: 1.54rem;
  border-left: 0.3rem solid transparent;
  border-right: 0.3rem solid transparent;
  border-bottom: 0.45rem solid #fff;
}

.rank-wrapper.low-height {
  margin-bottom: 1.4rem;
}

.detail {
  width: 100%;
}

.mainer {
  width: 100%;
  /* height: 5rem;
          overflow-y: scroll; */
  margin-bottom: 0.5rem;
}

.mainer .kind {
  width: 100%;
  height: 0.6rem;
  line-height: 0.6rem;
  margin: 0 0 0.2rem;
}

.mainer .kind span {
  display: inline-block;
  height: 0.6rem;
  line-height: 0.6rem;
  color: #666666FF;
  font-size: 0.26rem;
}

.mainer .kind span:first-of-type {
  margin-right: 0.4rem;
}

.mainer .kind span.active {
  color: #232222FF;
  border-bottom: 0.04rem solid #232222FF;
}

.number img {
  width: 30%;
}

.rank {
  max-height: 4rem;
  overflow-y: scroll;
}

.rank.null-depart-rank {
  max-height: 9rem;
}

.rank.depart-rank {
  max-height: 7.8rem;
}

.rank.self-depart-rank {
  height: 4.6rem;
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

.rank .avatar {
  display: inline-block;
  width: 0.44rem;
  height: 0.44rem;
  vertical-align: -10%;
  margin-right: 0.05rem;
  border-radius: 50%;
}

i {
  font-style: normal;
}

.rank-detail {
  width: 100%;
  overflow: hidden;
  padding-top: 0.2rem;
}

.rank-detail .dept-name {
  width: 100%;
  text-align: center;
  font-size: 0.4rem;
  color: #666666FF;
  margin: 0.5rem 0 0.6rem;
}

.left-trigler .rank-detail {
  height: 4rem;
}
/* .dept-detail>div {
          width: 50%;
          float: left;
      } */

.dept-detail .average div,
.dept-detail .rate div {
  height: 0.4rem;
  margin: 0.1rem auto;
  font-size: 0.8rem;
  color: #FD6258FF;
  text-align: center;
  line-height: 0.4rem;
}

.dept-detail .average p,
.dept-detail .rate p {
  width: 100%;
  text-align: center;
  font-size: 0.3rem;
  color: #666666FF;
  /* line-height: 0.6rem; */
}

.dept-detail .average p:last-of-type,
.dept-detail .rate p:last-of-type {
  font-size: 0.3rem;
  color: #666666FF;
}

.dept-detail .average p:last-of-type span,
.dept-detail .rate p:last-of-type span {
  color: #FD6258FF;
  font-size: 1rem;
  line-height: 1.3rem;
}
.dspan{
  font-size: 0.5rem !important;
  line-height: 0.5rem !important;
}

.dept {
  margin-bottom: 0.5rem;
}

.self-detail {
  margin: 0.3rem 0.2rem;
  border-bottom: 1px solid #D2D2D2FF;
  overflow: hidden;
}

.self-detail .self-info {
  margin-top: 0.6rem;
  text-align: center;
}

.self-detail .self-info span {
  display: inline-block;
  text-align: center;
  height: 0.8rem;
  line-height: 0.8rem;
}

.self-detail .self-info span img {
  float: left;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  margin-right: 0.1rem;
  margin-top:0.1rem;
}

.self-detail .self-info span i {
  float: left;
  display: inline-block;
  color: #666666FF;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.3rem;
}

.self-detail .self-value {
  text-align: center;
  font-size: 0.3rem;
  color: #666666FF;
}

.self-detail .self-rank {
  font-size: 0.29;
  color: #ddcff2;
}

.self-detail .self-rank span {
  font-size: 0.95rem;
  color: #e9c74c;
}

.flaunt {
  float: right;
  padding: 0 0.2rem;
  text-align: center;
  margin-right: 0.21rem;
  font-size: 0.2rem;
  color: #fff;
  height: 0.42rem;
  line-height: 0.46rem;
  background-color: #FF5C5CFF;
  border-radius: 0.21rem;
}

.footer {
  /* position: fixed;
          bottom: .4rem;
          left: 0; */
  width: 100%;
  margin-bottom: 0.4rem;
}

.footer p {
  height: 0.48rem;
  line-height: 0.48rem;
  color: #a37aca;
  font-size: 0.26rem;
}

.mainer span.null.word {
  color: transparent;
}

.deptrank-detail .vux-flexbox-item,
.selfrank-detail .vux-flexbox-item {
  text-align: center;
}

.deptrank-detail .vux-flexbox-item {
  font-size: 0.22rem;
  margin-left: 0;
}

.mainer .vux-flexbox {
  border-bottom: 1px solid #553485;
}

.mainer .vux-flexbox .vux-flexbox-item {
  position: relative;
  text-align: center;
  color: #666666FF;
  height: 0.8rem;
  line-height: 0.8rem;
  /* border-bottom: 1px solid #553485; */
}

.number img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.deptrank-list-head,
.selfrank-list-head {
  border-bottom: 0px solid #553485 !important;
  background-color: #E5E5E5FF;
}

.deptrank-list-body,
.selftoprank-list-body,
.selfdeptrank-list-body {
  padding: 0 0.2rem;
}

.deptrank-list-body .vux-flexbox,
.selftoprank-list-body .vux-flexbox,
.selfdeptrank-list-body .vux-flexbox {
  border-bottom: 1px solid #D2D2D2FF;
}

.mainer .vux-flexbox .vux-flexbox-item p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mainer .rank .lts {
  text-align: left;
}

.selfrank-detail {
  margin-bottom: 0.2rem;
  color: #a37aca;
}

.ques-icon {
  color: transparent;
}

.tips p,
.tips div {
  display: inline-block;
}

.contact {
  position: absolute;
  right: 0.5rem;
  top: 6.22rem;
  display: inline-block;
  z-index: 10;
}

.contact span {
  display: inline-block;
}

.contact img {
  width: 0.2rem;
  height: 0.2rem;
  vertical-align: middle;
}

.contact.show:before {
  content: "团队分=必修完成率*人均学分";
  position: absolute;
  display: inline-block;
  top: -0.76rem;
  right: -0.38rem;
  width: 3.6rem;
  height: 0.6rem;
  line-height: 0.6rem;
  z-index: 100;
  border-radius: 0.2rem;
  color: #a58dca;
  background: rgba(0, 0, 0, 0.4);
}

.contact.show:after {
  content: "";
  position: absolute;
  top: -0.16rem;
  right: 0.04rem;
  border-left: 0.1rem solid transparent;
  border-right: 0.1rem solid transparent;
  border-bottom: 0.1rem solid transparent;
  border-top: 0.15rem solid rgba(0, 0, 0, 0.4);
}

.contact.hide:before,
.contact.hide:after {
  display: none;
}
</style>