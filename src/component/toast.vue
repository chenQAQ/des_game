<!--Toast弹窗-->
<template>
    <div class="toast">
      <div class='toast-wrapper'>
        <div class="bgimg">
          <img src="../imgs/book.png" alt="" >
        </div>
        <div v-if="showIndex==1" class="regulation">
          <p class='subject'>活动须知</p>
          <div class='block'>
            <p class='title'>活动时间：</p>
            <p>{{activitydata.activity_time}}</p>
          </div>
          <div class='block'>
            <p class='title'>活动须知(Read it first)：</p>
            <p v-html="activitydata.regulation"></p>
          </div>
        </div>
        <div class="content" v-if="showIndex==2">
          <p class="msg">{{errMsg}}</p>
        </div>
        <div class="content" v-if="showIndex==3">
          <p class="msg">{{errMsg}}</p>
        </div>
        <div class="content" v-if="showIndex==4">
          <p class="msg">{{errMsg}}</p>
        </div>
        <div class="content" v-if="showIndex==5">
          <p class="msg">{{errMsg}}</p>
        </div>
        <div class="content" v-if="showIndex==6">
          <p class="msg">{{errMsg}}</p>
        </div>
        <div class="btn" v-if="showIndex!=5">
          <p @click="closeMask(1)" v-if="showIndex==1">确&nbsp;定</p>
          <p @click="closeMask(2)" v-if="showIndex==2">知&nbsp;道&nbsp;了</p>
          <p @click="closeMask(3)" v-if="showIndex==3">确&nbsp;定</p>
          <p v-if="showIndex==4" @click="goPage('/')">确&nbsp;定</p>
          <p @click="reset()" v-if="showIndex==6">确&nbsp;定</p>
        </div>
      </div>
    </div>
  </template>
<script>
    import {
        setCookie,
        getCookie
    } from '../js/cookie.js'
    export default {
        name: "toast",
        computed: {
            activitydata() {
                return this.$store.state.activitydata;
            }
        },
        props: {
            showIndex: {
                type: Number,
                required: true
            },
            errMsg: {
                type: String,
                required: false
            },
            resetPath:{
                type:String,
                required:true
            }
        },
        methods: {
            goPage(page) {
                this.$router.replace({
                    path: page,
                    query: {
                        updateuser: 1,
                        activity_id: this.$store.state.activityId
                    }
                });
            },
            reset(){
              this.$router.go(0);
            },
            closeMask(index) {
                if (index == 1) {
                    if (this.activitydata.regulation_required == 1) {
                        window.localStorage.setItem('isReadReg_' + this.$store.state.activityId, true);
                    }
                    this.$parent.showLay = false;
                } else if (index == 2) {
                    this.$parent.showError = false;
                } else if (index == 3) {
                    this.$parent.showError = false;
                }
            }
        }
    };
</script>
<style scoped>
    .toast {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }
    
    .toast-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 200;
        opacity: 1;
        width: 5.9rem;
        background-color: #ffecb8;
        border-radius: 0.18rem;
        padding: 0.9rem 0 1.5rem;
    }
    
    .toast-wrapper .bgimg {
        position: absolute;
        top: -0.6rem;
        text-align: center;
    }
    
    .toast-wrapper .bgimg img {
        width: 60%;
        height: auto;
    }
    
    .toast-wrapper .regulation {
        max-height: 5.6rem;
        min-height: 3.6rem;
        overflow-y: scroll;
    }
    
    .toast-wrapper .subject {
        font-size: 0.38rem;
        color: #826821;
        text-align: center;
        line-height: 0.6rem;
    }
    
    .block {
        margin-top: 0.2rem;
        padding: 0 0.2rem;
    }
    
    .block p {
        font-size: 0.28rem;
        color: #aca182;
        line-height: 0.46rem;
        text-align: left;
    }
    
    .block span {
        font-size: 0.28rem;
        color: #dc4e62;
    }
    
    .block .title {
        font-size: 0.3rem;
        color: #937e44;
    }
    
    .toast-wrapper .content {
        margin: 1rem 0;
        padding: 0 0.5rem;
        text-align: center;
        font-size: 0.38rem;
        color: #826821;
    }
    
    .toast .btn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.88rem;
        text-align: center;
        line-height: 0.88rem;
        font-size: 0.42rem;
        color: #fff9e9;
        background-color: #f9b600;
        border-bottom-left-radius: 0.18rem;
        border-bottom-right-radius: 0.18rem;
    }
</style>