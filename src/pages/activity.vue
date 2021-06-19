<!--活动列表页面-->
<template>
  <div class="container">
    <div class="wrapper">
      <p>请前往蓝凌叮当展台联系工作人员，获取客服支持，让您轻松创建答题活动</p>
      <!-- <div @click="preview()">
        <img src="../imgs/qrcode.png" alt="">
      </div>-->
      <!-- <p>点击查看二维码，长按识别获取客服支持</p> -->
      <!-- <p>让您轻松创建知否活动</p>
      <p class="phone">客服热线：0755-33942806</p>-->
    </div>
  </div>
</template>
<script>
export default {
  name: "activity",
  data() {
    return {};
  },
  computed: {
    activitydata() {
      return this.$store.state.activitydata;
    }
  },
  created() {},
  beforeMount() {
    if (window.dd) {
      dd.postMessage({
        name: "home"
      });
      dd.onMessage = e => {};
    }
  },
  methods: {
    preview() {
      if (window.dd) {
        dd.previewImage({
          current: 0,
          urls: ["http://s1-hn.aghcdn.com/dingtalk/qrcode.png"]
        });
      }
    }
  }
};
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: #2d4f8c;
}

.wrapper {
  width: 5.6rem;
  padding-top: 2.5rem;
  margin: 0 auto;
  text-align: center;
}

.wrapper div {
  width: 4.12rem;
  height: 4.12rem;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 0.04rem;
  text-align: center;
  margin: 0 auto 0.35rem;
}

.wrapper img {
  width: 3.72rem;
  height: auto;
  margin-top: 0.2rem;
}

.wrapper p {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.28rem;
  line-height: 0.52rem;
}

.wrapper p.phone {
  margin-top: 0.48rem;
}
</style>