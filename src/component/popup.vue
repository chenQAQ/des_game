<template>
  <div id="popup">
    <div v-transfer-dom>
      <popup v-model="showRefuse" position="top" :show-mask="false">
        <div class="wsErrMsg" v-if="msgIndex==1">{{refuseUserName}}拒绝了你的PK邀请</div>
        <div class="wsErrMsg" v-if="msgIndex==2">对方暂无响应</div>
        <div class="wsErrMsg" v-if="msgIndex==3">{{refuseUserName}}</div>
      </popup>
    </div>
  </div>
</template>
<script>
    import {
        Popup
    } from 'vux'
    export default {
        name: "notify",
        data() {
            return {
                showRefuse: true,
                countdown: 2,
                timer: null
            }
        },
        components: {
            Popup
        },
        computed: {
            activitydata() {
                return this.$store.state.activitydata;
            }
        },
        props: {
            refuseUserName: {
                type: String
            },
            msgIndex: {
                type: Number
            }
        },
        beforeMount() {
            let i = 2;
            let counttimer;
            this.countdown = String(i);
            this.timer = setInterval(() => {
                i--;
                this.countdown = String(i);
                if (i == 0) {
                    this.$parent.showPopup = false;
                    this.showRefuse = false;
                    return;
                }
            }, 1000);
        },
        destroyed() {
            clearInterval(this.timer);
        },
        methods: {

        }
    };
</script>
<style scoped>
    .wsErrMsg {
        background-color: #ff0;
        color: #704e04;
        text-align: center;
        padding: 10px;
    }
</style>