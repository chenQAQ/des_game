<!--绑定身份弹窗-->
<template>
  <div class="identify" @click.prevent="hideLogin()">
    <div class="identify-wrapper" @click.stop.prevent="preventHide()">
      <p class="title">绑定身份</p>
      <p class="phone">
        <input type="text" name="phoneNum" placeholder="请输入工号" v-model="phoneNum">
        <!-- <span @click="getCode()">{{checkText}}</span> -->
      </p>
      <p class="verify-code">
        <input type="text"  placeholder="请输入姓名" name="username"  v-model="username">
      </p>
      <p class="tip">{{tipText}}</p>
      <p class="submit" @click="submit()">确定</p>
    </div>
  </div>
</template>
<script>
    export default {
        name: "login",
        data() {
            return {
                phoneNum: '', //手机号码
                username: '', //姓名
                waitSecond: 0, //等待时间
                tipText: '' //错误信息
            }
        },
        computed: {
            checkText() {
                if (this.waitSecond == 0) {
                    return '验证工号'
                } else {
                    return '等待... '
                }
            }
        },
        methods: {
            hideLogin() {
                this.$parent.showVertify = false;
            },
            getCode() {
                var pattern = /^[A-Za-z0-9]{3,10}$/;
                if (this.phoneNum == '') {
                    this.tipText = '请输入工号';
                    return;
                } else if (!pattern.test(this.phoneNum)) {
                    this.tipText = '工号格式有误';
                    return;
                } else if (this.waitSecond != 0) {
                    return;
                } else {
                    var timer = null;
                    this.waitSecond = 60;
                    // timer = setInterval(() => {
                    //     if (this.waitSecond > 0) {
                    //         this.waitSecond--;
                    //     } else {
                    //         clearInterval(timer);
                    //     }
                    // }, 1000)
                    this.$ajax
                        .post("/api/user/sendsms?activity_id=" + this.$store.state.activityId, {
                            phone: this.phoneNum
                        })
                        .then(response => {
                            this.waitSecond = 0;
                            let res = response.data;
                            if (res.error != 0) {
                                this.tipText = res.message;
                                this.verifyCode = '';
                                // clearInterval(timer);
                                // this.waitSecond = 0;
                            }
                            if (res.error == 0) {
                                this.verifyCode = res.name;
                                this.tipText = '';
                            }
                        })
                        .catch(error => {});
                }
            },
            preventHide() {
                return;
            },
            submit() {
                if (this.phoneNum == '') {
                    this.tipText = '请输入工号';
                    return;
                } 
                if (this.username == '') {
                    this.tipText = '请输入姓名';
                    return;
                }
                this.$ajax
                    .post("/api/user/userbind?activity_id=" + this.$store.state.activityId, {
                        phone: this.phoneNum,
                        username: this.username
                    })
                    .then(response => {
                        if (response.data.error == 0) {
                            this.$parent.showVertify = false;
                            // window.location.reload();
                            window.location.replace("https://game.sgjyun.com?activity_id="+this.$store.state.activityId);
                        }
                        if(response.data.error != 0) {
                            this.tipText = response.data.message;
                        }
                    })
                    .catch(error => {});
            }
        }
    };
</script>
<style scoped>
    .identify {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 100;
        background: rgba(0, 0, 0, 0.6);
    }
    
    .identify .identify-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        z-index: 200;
        opacity: 1;
        width: 260px;
        height: 260px;
        border-radius: 15px;
        padding: 0 30px;
    }
    
    .identify-wrapper p {
        width: 100%;
    }
    
    .identify-wrapper .title {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        color: #333;
        text-align: center;
    }
    
    .identify-wrapper .phone {
        height: 50px;
        line-height: 50px;
        position: relative;
    }
    
    .identify-wrapper .phone span {
        display: inline-block;
        position: absolute;
        right: 0;
        width: 80px;
        top: 7px;
        border-left: 1px solid #ddd;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        color: darkorange;
    }
    
    .identify-wrapper .verify-code {
        height: 50px;
        line-height: 50px;
    }
    
    .identify-wrapper .phone input,
    .identify-wrapper .verify-code input {
        width: 100%;
        height: 34px;
        padding: 0 4px;
        border: 1px solid #999;
    }
    
    input:focus {
        background: transparent;
        outline: none;
    }
    
    input::selection,
    input::-moz-selection {
        background: transparent;
    }
    
    .identify-wrapper .tip {
        height: 28px;
        color: rgb(197, 83, 83);
        text-align: left;
        font-size: 10px;
    }
    
    .identify-wrapper .submit {
        width: 100%;
        height: 32px;
        line-height: 32px;
        background: #00BFFF;
        text-align: center;
        color: #fff;
        font-size: 16px;
        letter-spacing: 4px;
        border-radius: 6px;
        margin-top: 20px;
    }
</style>