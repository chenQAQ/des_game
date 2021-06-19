<!--Notify弹窗-->
<template>
  <div :class="counttime==10?'anima notify':'notify'" :style="btStyle(bottom)" v-if="showNotify==true">
    <p class="invite">
      <span>{{inviteUserName}}</span>邀请你PK</p>
    <p class="btns">
      <span class="reject" @click="reject()">拒绝({{countdown}}s)</span>
      <span class="accept" @click="accept()">接受</span>
    </p>
  </div>
</template>
<script>
    export default {
        name: "notify",
        data() {
            return {
                countdown: 10,
                username: '',
                timer: null
            }
        },
        computed: {
            activitydata() {
                return this.$store.state.activitydata;
            }
        },
        props: {
            inviteUserId: {
                type: Number
            },
            inviteUserName: {
                type: String
            },
            showNotify: {
                type: Boolean
            },
            bottom: {
                type: Number
            },
            index: {
                type: Number
            },
            counttime: {
                type: Number
            }
        },
        beforeMount() {
            // let i = 10;
            let counttimer;
            if (this.$parent.notifyList.length == 1) {
                this.countdown = String(this.$parent.notifyList[this.index].counttime--);
            } else {
                this.countdown = String(this.$parent.notifyList[this.index].counttime);
            }
            this.timer = setInterval(() => {
                this.countdown = String(this.$parent.notifyList[this.index].counttime);
                this.$parent.notifyList[this.index].counttime--;
                if (this.$parent.notifyList[this.index].counttime < 0 || this.$parent.notifyList[this.index].counttime == 0) {
                    clearInterval(this.timer);
                    this.$ajax
                        .post("/api/pk/response", {
                            sponsor_user_id: this.inviteUserId,
                            answer: 2,
                            activity_id: this.$store.state.activityId,
                            access_token: this.$store.state.access_token
                        })
                        .then(response => {
                            if (response.data.error == 302) {
                                let locationNow = window.location.href;
                                window.location.href = response.data.redirect + '&redirect=' + encodeURIComponent(locationNow);
                                return;
                            }
                            this.showNotify = false;
                            // this.$parent.notifyList[this.index].showNotify = false;
                            this.$parent.notifyList.forEach((item, index) => {
                                if (item.inviteUserId == this.inviteUserId) {
                                    this.$parent.notifyList.splice(index, 1);
                                }
                            })
                            clearInterval(this.timer);
                        })
                        .catch(error => {
                            window.location.href = error.response.data.redirect;
                        });
                    clearInterval(this.timer);
                    return;
                }
            }, 1000);
        },
        destroyed() {
            clearInterval(this.timer);
        },
        methods: {
            btStyle(bottom) {
                return {
                    position: 'fixed',
                    right: 0,
                    bottom: `${bottom}rem`
                }
            },
            reject() {
                clearInterval(this.timer);
                this.$ajax
                    .post("/api/pk/response", {
                        sponsor_user_id: this.inviteUserId,
                        answer: 0,
                        activity_id: this.$store.state.activityId,
                        access_token: this.$store.state.access_token
                    })
                    .then(response => {
                        if (response.data.error == 302) {
                            let locationNow = window.location.href;
                            window.location.href = response.data.redirect + '&redirect=' + encodeURIComponent(locationNow);
                            return;
                        }
                        this.showNotify = false;
                        this.$parent.notifyList.forEach((item, index) => {
                            if (item.inviteUserId == this.inviteUserId) {
                                this.$parent.notifyList.splice(index, 1);
                            }
                        })
                        clearInterval(this.timer);
                    })
                    .catch(error => {
                        window.location.href = error.response.data.redirect;
                    });
            },
            accept() {
                clearInterval(this.timer);
                this.$ajax
                    .post("/api/pk/response", {
                        sponsor_user_id: this.inviteUserId,
                        answer: 1,
                        activity_id: this.$store.state.activityId,
                        access_token: this.$store.state.access_token
                    })
                    .then(response => {
                        if (response.data.error == 302) {
                            let locationNow = window.location.href;
                            window.location.href = response.data.redirect + '&redirect=' + encodeURIComponent(locationNow);
                            return;
                        }
                        this.showNotify = false;
                        this.$parent.notifyList[this.index].showNotify = false;
                        clearInterval(this.timer);
                        this.$router.replace({
                            path: "/beatdown",
                            query: {
                                room_id: response.data.data.roomId,
                                activity_id: this.$store.state.activityId,
                                start_sign: true,
                                access_token: this.$store.state.access_token
                            }
                        });
                    })
                    .catch(error => {
                        window.location.href = error.response.data.redirect;
                    });
            }
        }
    };
</script>
<style scoped>
    .notify {
        position: fixed;
        z-index: 1000;
        /* top: 60%; */
        right: 0;
        height: 1.62rem;
        background-color: #242f55;
        border-top-left-radius: .06rem;
        border-bottom-left-radius: .06rem;
        border: solid 1px #a1a5bd;
        border-right: none;
        opacity: 0.95;
        filter: alpha(opacity=95);
        padding: 0 .3rem;
    }
    
    .notify.anima {
        animation: myfirst .5s;
        -moz-animation: myfirst .5s;
        -webkit-animation: myfirst .5s;
        -o-animation: myfirst .5s;
    }
    
    .invite {
        font-size: .32rem;
        color: #f0e8ff;
        text-align: left;
        line-height: .8rem;
        height: .8rem;
    }
    
    .invite span {
        color: #f8d445;
    }
    
    .btns {
        overflow: hidden;
    }
    
    .btns span {
        display: inline-block;
        float: left;
        width: 1.26rem;
        text-align: center;
        height: .46rem;
        line-height: .44rem;
        border-radius: .02rem;
        font-size: .22rem;
    }
    
    .reject {
        background-color: #303d67;
        border: solid 1px #4e5886;
        opacity: 0.95;
        filter: alpha(opacity=95);
        color: #daddfe;
        margin-right: .2rem;
        margin-left: 2rem;
    }
    
    .accept {
        background-color: transparent;
        border: solid 1px #f8d445;
        color: #f8d445;
    }
    
    @keyframes myfirst {
        from {
            right: -5.5rem;
        }
        to {
            right: 0;
        }
    }
    
    @-moz-keyframes myfirst
    /* Firefox */
    
    {
        from {
            right: -5.5rem;
        }
        to {
            right: 0;
        }
    }
    
    @-webkit-keyframes myfirst
    /* Safari 和 Chrome */
    
    {
        from {
            right: -5.5rem;
        }
        to {
            right: 0;
        }
    }
    
    @-o-keyframes myfirst
    /* Opera */
    
    {
        from {
            right: -5.5rem;
        }
        to {
            right: 0;
        }
    }
</style>