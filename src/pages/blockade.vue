<template>
    <div :class="className.container + ' container'">
      <div class="ready" v-if="isReady==false" :style="bgstyle(count_down_background)">
        <p class="ready-time" ref="countp">{{readyContent}}</p>
      </div>
      <div class="answer" v-else>
        <div class="top-block">
          <div :class="countDownTime>totalTime || countDownTime=='start'?'countdown countdownstart':'countdown'">
          
                <x-progress :percent="((totalTime-countDownTime)/totalTime)*100" :show-cancel="false"></x-progress>
           
          </div>
          <div class="lifeCount" v-if="qaLife">
            <ul>
              <li v-for="(n,index) in qaLife" :key="index">n</li>
              <li v-for="(m,mindex) in unLife" class="unlife" :key="'m'+mindex">m</li>
            </ul>
          </div>
          <div class="type" @click="clickFooter()">{{stepIndex}}/{{countQues}}</div>
        </div>
        <div class="center-block">
          <transition name="bounce">
            <p v-show="showEle.title" class="detail"><span :class="receiveQuesData.question_type==2?'isRed':''">{{receiveQuesData.question_type==2?'【多选】':'【单选】'}}</span>{{questionTitle}}</p>
          </transition>
        </div>
        <div class="bottom-block">
          <transition name="bounce">
            <ul class="choice" v-show="showEle.options">
              <li @click="verify(i,item,$event)" v-for="(item,i) in quesKeyArr" :key="i">
                <span></span>
                <p>{{questionOptions[item]}}</p>
              </li>
            </ul>
          </transition>
        </div>
        <notify v-for="(item,index) in notifyList" :key="index" :index="index" :showNotify="item.showNotify" :inviteUserId="item.inviteUserId"
          :inviteUserName="item.inviteUserName" :bottom="item.bottom" :counttime="item.counttime"></notify>
        <popup v-if="showPopup==true" :refuseUserName="refuseUserName" :msgIndex="msgIndex"></popup>
        <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo"></toast>
        <toast v-if="$store.state.showOffline==true" :showIndex="5" :errMsg="$store.state.offlineMsg"></toast>
        <!-- <popup v-if="showPopup==true" :refuseUserName="refuseUserName"></popup> -->
      </div>
    </div>
</template>

<script>
    import {
        setCookie,
        getCookie
    } from "../js/cookie.js";
    import {
        XCircle,
        XProgress
    } from "vux";
    import {
        strictEqual
    } from "assert";
    import {
        setTimeout
    } from "timers";
    import toast from "@/component/toast";
    import popup from "@/component/popup";
    import notify from "@/component/notify";
    Array.prototype.shuffle = function() {
        var input = this;
        for (var i = input.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    };

    export default {
        name: "workstatu",
        data() {
            return {
                showNotify: false,
                notifyList: [
                    // {
                    // showNotify: false,
                    // inviteUserId: 0,
                    // inviteUserName: ''
                    // }
                ],
                inviteUserId: 0,
                inviteUserName: '',
                showPopup: false,
                refuseUserName: '',
                msgIndex: 0,
                timeTick: null,
                quesTimeTick: null,
                count_down_background: '',
                className:{},
                blockadeId: 0,
                showError: false, //是否显示错误页面
                errorInfo: "", //错误提醒消息
                showIndex: 0,
                isReady: false, //倒计时结束开始答题
                isChoose: false, //是否已经选择
                receiveQuesData: {}, //接收的题目信息
                receiveAnswerData: {}, //接收的答题答案信息
                questionOptions: {}, //问题选择
                questionTitle: "", //问题题目
                initData: {
                    //初始传给后端websocket数据
                    channel: "blockade",
                    action: "startGame",
                    data: {
                        blockade_num: 0
                    }
                },
                blockade_num: 0,
                chooseIndex: "", //用户选择选项
                stepIndex: 0, //题号
                countQues: 0, //总题目数量
                countDownTime: 'start', //倒计时
                gameInfo: {}, //闯关答题信息
                isQA: true, //是否显示生命数
                qaLife: 0, //允许答题错误数
                unLife: 0, //已经打错题目数  
                showEle: {
                    //题目显示动画
                    title: false,
                    options: false
                },
                totalTime: 10,
                readyContent: "", //准备开始倒计时
                quesKeyArr: [], //问题key值数组
                showTrick: 0,
                answerStr: [] //多选题选项数组
            };
        },
        components: {
            XCircle,
            XProgress,
            toast,
            popup,
            notify
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
            sharedesc() {
                return this.activitydata.dingtalk_share_home.replace('[my_name]', this.userdata.name);
            }
        },
        created() {
            this.blockade_num  = this.$route.query.blockade_num;
            this.initData.data.blockade_num = this.$route.query.blockade_num;
            this.countDown();
        },
        beforeMount() {
            this.count_down_background = "https://kuyi.shengws.com/countdown_bg.jpg"
            this.className.container = "pink_container"
            if(this.activitydata.top_background_color == "pink"){
                this.count_down_background = "https://kuyi.shengws.com/countdown_bg.jpg"
                this.className.container = "pink_container"
            } 

            if(this.activitydata.top_background_color == "purple"){
                this.count_down_background = "https://kuyi.shengws.com/purple/countdown_bg.jpg"
                this.className.container = "purple_container"
            }

            if(this.activitydata.top_background_color == "red"){
                this.count_down_background = "https://kuyi.shengws.com/red/countdown_bg.jpg"
                this.className.container = "red_container"
            }

            if(this.activitydata.top_background_color == "yellow"){
                this.count_down_background = "https://kuyi.shengws.com/yellow/countdown_bg.jpg"
                this.className.container = "yellow_container"
            }

            if(this.activitydata.top_background_color == "blue"){
                this.count_down_background = "https://kuyi.shengws.com/blue/countdown_bg.jpg"
                this.className.container = "blue_container"
            }

            if (this.userdata.platform == 'dingtalk') {
               if(window.dd){
                    dd.postMessage({
                    name: "home",
                    desc: this.sharedesc
                });
                dd.onMessage = (e) => {}
               }
            }
            let tp = this.$route.query.tp;
            if (tp == "QA") {
                this.isQA = true;
            }
        },
        methods: {
            clickFooter() {
                // window.vConsole.showSwitch()
                this.showTrick += 1
                if (this.showTrick == 2) {
                    vConsole.show()
                    this.showTrick = 0
                }
            },
            bgstyle(bg) {
                return {
                    background: `url(${bg}) center no-repeat`,
                    backgroundSize: "cover",
                    backgroundOrigin: "content-box",
                    backgroundColor: '#59528c'
                };
            },
            //websocket send方法
            websocketSend(data) {
                try {
                    this.websocket.send(JSON.stringify(data));
                } catch (error) {
                    this.showError = true;
                    this.showIndex = 4;
                    this.errorInfo = '网络异常，请稍后退出重试！';
                }
            },
            //websocket message方法
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
                        return;
                    }
                    if (re.action == "refuseNotify") {
                        this.showPopup = true;
                        this.refuseUserName = res.name;
                        return;
                    }
                    if (re.action == "startGame") {
                        this.gameInfo = res.blockade;
                        this.blockadeId = res.blockade_id;
                        this.receiveQuesData = res.question;
                        if (this.isQA) {
                            //必答题小招喵
                            this.qaLife = res.blockade.permit_wrong_count + 1;
                            this.unLife = 0;
                        }
                        this.totalTime = res.question.count_down;
                        this.countDownTime = this.totalTime + 2;
                        this.showQuestion();
                    }
                    if (re.action == "startReturn") {
                        if (re.error_code != 0 && re.error_code != undefined) {
                            //服务器返回失败
                            this.showIndex = 4;
                            this.showError = true;
                            this.errorInfo = re.message;
                        }
                    }
                    if (re.action == "offline") {
                        this.$store.state.showOffline = true;
                        this.$store.state.offlineMsg = res.message;
                    }
                    if (re.action == "online") {
                        this.$store.state.showOffline = false;
                        this.$store.state.offlineMsg = '';
                    }
                    if (res) {
                        if (this.blockadeId != res.blockade_id) {
                            return;
                        }
                    }
                    if (re.action == "answerResult") {
                        this.isChoose = true;
                        clearInterval(this.timeTick);
                        this.receiveAnswerData = res.answerResult;
                        var iTrue = [];
                        this.receiveAnswerData.correct_answer.split('').forEach((answerItem) => {
                            this.quesKeyArr.forEach((item, index) => { //quesKeyArr ["D", "C", "A", "B"]
                                if (answerItem == item) {
                                    iTrue.push(index);
                                }
                            })
                        })
                        if (this.receiveAnswerData.is_correct == 1) {
                            //正确
                            iTrue.forEach((item) => {
                                $(".choice li")
                                    .eq(item)
                                    .addClass("true");
                            })
                        } else {
                            if (this.isQA) {
                                this.qaLife--;
                                this.unLife++;
                            }
                            iTrue.forEach((item) => {
                                $(".choice li")
                                    .eq(item)
                                    .addClass("true");
                            })
                        }
                        setTimeout(() => {
                            this.showEle = {
                                title: false,
                                options: false
                            };
                        }, 1800);

                        if (res.result) {
                            this.receiveAnswerData = res.result;
                            if (this.receiveAnswerData.is_success == 1) {
                                setTimeout(() => {
                                    this.$router.replace({
                                        path: "/success",
                                        query: {
                                            isBlockade: this.receiveAnswerData.isBlockade,
                                            knowledge_money: this.receiveAnswerData.knowledge_money,
                                            limit: this.receiveAnswerData.is_everyday_limit,
                                            limitmsg: this.receiveAnswerData.everyday_limit_message,
                                            activity_id: this.$store.state.activityId,
                                            access_token: this.$store.state.access_token
                                        }
                                    });
                                }, 2000);
                            } else {
                                setTimeout(() => {
                                    this.$router.replace({
                                        path: "/failture",
                                        query: {
                                            isBlockade: this.receiveAnswerData.isBlockade,
                                            knowledge_money: this.receiveAnswerData.knowledge_money,
                                            limit: this.receiveAnswerData.is_everyday_limit,
                                            limitmsg: this.receiveAnswerData.everyday_limit_message,
                                            activity_id: this.$store.state.activityId,
                                            access_token: this.$store.state.access_token
                                        }
                                    });
                                }, 2000);
                            }
                        } else {
                            setTimeout(() => {
                                this.receiveQuesData = res.question;
                                this.totalTime = res.question.count_down;
                                this.countDownTime = this.totalTime + 2;
                                this.showQuestion();
                            }, 2100);
                        }
                    }
                };
            },
            //题目选择验证
            verify(index, event) {
                if (this.receiveQuesData.question_type == 1) {
                    //单选题
                    if (this.isChoose == true) {
                        return;
                    } else if (this.websocket.readyState == 1 && navigator.onLine == true) {
                        //网络顺畅 websocket连接成功
                        this.isChoose = true;
                        // this.showWsErr = false;
                        this.initData = {
                            channel: "blockade",
                            action: "answer",
                            data: {
                                blockade_id: this.blockadeId,
                                step: this.receiveQuesData.step,
                                question_id: this.receiveQuesData.question_id,
                                user_answer: this.quesKeyArr[index],
                                blockade_num: this.blockade_num
                            }
                        };
                        this.websocketSend(this.initData);
                        if (this.receiveQuesData.correct_answer == this.quesKeyArr[index]) {
                            $(".choice li")
                                .eq(index)
                                .addClass("true");
                        } else {
                            $(".choice li")
                                .eq(index)
                                .addClass("error");
                        }
                    }
                } else {
                    if (this.isChoose == true) {
                        return;
                    } else if (this.websocket.readyState == 1 && navigator.onLine == true) {
                        //多选题
                        if (this.answerStr.indexOf(this.quesKeyArr[index]) == -1) {
                            this.answerStr.push(this.quesKeyArr[index]);
                        }
                        if (this.receiveQuesData.correct_answer.indexOf(this.quesKeyArr[index]) == -1) {
                            this.isChoose = true;
                            var str = '';
                            this.answerStr.forEach((item) => {
                                str += item;
                            })
                            console.log('str', str);
                            this.initData = {
                                channel: "blockade",
                                action: "answer",
                                data: {
                                    blockade_id: this.blockadeId,
                                    step: this.receiveQuesData.step,
                                    question_id: this.receiveQuesData.question_id,
                                    user_answer: str,
                                    blockade_num: this.blockade_num
                                }
                            };
                            this.websocketSend(this.initData);
                            $(".choice li")
                                .eq(index)
                                .addClass("error");
                        } else if (this.receiveQuesData.correct_answer.indexOf(this.quesKeyArr[index]) > -1) {
                            $(".choice li")
                                .eq(index)
                                .addClass("true");
                            if (this.answerStr.sort().join('') === this.receiveQuesData.correct_answer.split('').sort().join('')) {
                                console.log('answerstr', this.answerStr.sort().join(''))
                                console.log('correct_answer', this.receiveQuesData.correct_answer.split('').sort().join(''))
                                this.isChoose = true;
                                var str = '';
                                this.answerStr.forEach((item) => {
                                    str += item;
                                })
                                console.log('str', str);
                                this.initData = {
                                    channel: "blockade",
                                    action: "answer",
                                    data: {
                                        blockade_id: this.blockadeId,
                                        step: this.receiveQuesData.step,
                                        question_id: this.receiveQuesData.question_id,
                                        user_answer: str,
                                        blockade_num: this.blockade_num
                                    }
                                };
                                this.websocketSend(this.initData);
                            }
                        }
                    }
                }
            },
            //倒计时
            countDown() {
                let i = 3;
                let timer;
                this.readyContent = String(i);
                timer = setInterval(() => {
                    i--;
                    this.readyContent = String(i);
                    if (i == 0) {
                        this.readyContent = "GO";
                    }
                    if (i == -1) {
                        this.isReady = true;
                        clearInterval(timer);
                        this.websocketMess();
                        this.websocketSend(this.initData);
                        return;
                    }
                }, 1000);
            },
            //题目渲染
            showQuestion() {
                this.isChoose = false;
                this.answerStr = [];
                $(".choice li").removeClass("true");
                $(".choice li").removeClass("error");
                //打乱题目选项渲染顺序
                // this.quesKeyArr = Object.keys(this.receiveQuesData.question_options).shuffle(); //["D", "C", "A", "B"]
                console.log('this.quesKeyArr', this.quesKeyArr);
                if (this.activitydata.lang.indexOf('en') > -1) {
                    if (this.receiveQuesData.en_question_title == '') {
                        this.quesKeyArr = Object.keys(this.receiveQuesData.question_options).shuffle();
                    } else {
                        this.quesKeyArr = Object.keys(this.receiveQuesData.en_question_options).shuffle();
                    }
                } else if (this.activitydata.lang.indexOf('zh') > -1) {
                    this.quesKeyArr = Object.keys(this.receiveQuesData.question_options).shuffle();
                }
                this.timeTick = setInterval(() => {
                    this.countDownTime--;
                    if (this.countDownTime == 0 || this.countDownTime < 0) {
                        clearInterval(this.timeTick);
                        if (this.isChoose == false) {
                            var userAnswer = '';
                            if (this.receiveQuesData.question_type == 1) {
                                userAnswer = 'Z';
                            } else {
                                if (this.answerStr.length == 0) {
                                    userAnswer = 'Z';
                                } else {
                                    this.answerStr.forEach((item) => {
                                        userAnswer += item;
                                    })
                                }
                                console.log('userAnswer', userAnswer);
                            }
                            this.websocketSend({
                                channel: "blockade",
                                action: "answer",
                                data: {
                                    blockade_id: this.blockadeId,
                                    step: this.receiveQuesData.step,
                                    question_id: this.receiveQuesData.question_id,
                                    user_answer: userAnswer,
                                    blockade_num:this.blockade_num
                                }
                            });
                        }
                    }
                }, 1000);
                if (this.activitydata.lang.indexOf('en') > -1) {
                    if (this.receiveQuesData.en_question_title == '') {
                        this.questionTitle = this.receiveQuesData.question_title;
                    } else {
                        this.questionTitle = this.receiveQuesData.en_question_title;
                    }
                } else if (this.activitydata.lang.indexOf('zh') > -1) {
                    this.questionTitle = this.receiveQuesData.question_title;
                }
                // this.questionTitle = this.receiveQuesData.question_title;
                setTimeout(() => {
                    this.showEle.title = true;
                }, 800)
                if (this.activitydata.lang.indexOf('en') > -1) {
                    if (this.receiveQuesData.en_question_title == '') {
                        this.questionOptions = this.receiveQuesData.question_options;
                    } else {
                        this.questionOptions = this.receiveQuesData.en_question_options;
                    }
                } else if (this.activitydata.lang.indexOf('zh') > -1) {
                    this.questionOptions = this.receiveQuesData.question_options;
                }
                // this.questionOptions = this.receiveQuesData.question_options; //题目选项对象
                setTimeout(() => {
                    this.showEle.options = true;
                }, 1300);
                setTimeout(() => {
                    this.websocketSend({
                        channel: "blockade",
                        action: "startAnswer",
                        data: {
                            blockade_id: this.blockadeId,
                            step: this.receiveQuesData.step
                        }
                    });
                }, 1400);
                this.stepIndex = this.receiveQuesData.step;
                this.countQues = this.receiveQuesData.count;
            }
        }
    };
</script>
<style lang="less">
    .container {
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
    }

    .pink_container{
        background: #4755b2 url("../imgs/pk_bg.jpg") 0 0 no-repeat;
    }

    .purple_container {
        background: #4755b2 url("../purple_imgs/pk_bg.jpg") 0 0 no-repeat;
    }

    .yellow_container {
        background: #4755b2 url("../yellow_imgs/pk_bg.jpg") 0 0 no-repeat;
    }

    .red_container {
        background: #4755b2 url("../red_imgs/pk_bg.jpg") 0 0 no-repeat;
    }

    .blue_container {
        background: #4755b2 url("../blue_imgs/pk_bg.jpg") 0 0 no-repeat;
    }
    
    .container .ready {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        /* background: url("../imgs/countdown_bg.png") 0 0 no-repeat;
            background-size: 100% 100%; */
    }
    
    .ready .ready-time {
        width: 100%;
        color: #ffe13c;
        font-size: 3.98rem;
    }
    
    .container .answer {
        width: 100%;
        height: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling : touch;
        // display: flex;
        // display: -webkit-flex;
        // // flex: 1;
        // justify-content: space-between;
        // flex-direction: column;
    }
    .container{
        .top-block {
            position: relative;
            >div {
        /* align-self: center; */
        margin-top: 0.2rem;
    }
    .countdown {
        /* width: 1.6rem; */
        /* height: 1.6rem; */
        /* border-radius: 50%; */
        background: #fff;
        height: 0.14rem;
        /* margin: 26px auto; */
        margin-top: 0;
    }
        }
    }    
       .container .top-block {
        position: relative;
    }
    
    .container .top-block>div {
        /* align-self: center; */
        margin-top: 1.5rem;
    }
    
    .container .top-block .countdown {
        /* width: 1.6rem; */
        /* height: 1.6rem; */
        /* border-radius: 50%; */
        background: #fff;
        height: 0.14rem;
        /* margin: 26px auto; */
        margin-top: 0;
    }
    
    .container .center-block {
        display: flex;
        display: -webkit-flex;
        width: 100%;
        height: auto;
        justify-content: center;
        align-items: center;
        padding: 0 0.5rem;
        line-height: 0.3rem;
        font-size: 0.34rem;
        color: #fff;
        margin:1rem 0;
    }
    
    .container .top-block .type {
        width: 2.5rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.45rem;
        color: #FFFFFFFF;
        margin: 0 auto;
    }

    .pink_container .top-block .type {
        background: url("../imgs/question_number.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .purple_container .top-block .type {
        background: url("../purple_imgs/question_number.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .yellow_container .top-block .type {
        background: url("../yellow_imgs/question_number.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .red_container .top-block .type {
        background: url("../red_imgs/question_number.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .blue_container .top-block .type {
        background: url("../blue_imgs/question_number.png") center center no-repeat;
        background-size: 100% 100%;
    }
    
    .lifeCount ul {
        margin: 0 auto;
        text-align: center;
    }
    
    .lifeCount ul li {
        display: inline-block;
        font-size: 0;
        width: 0.5rem;
        height: 0.5rem;
        margin: 0.1rem;
        background: url("../imgs/life.png") center center no-repeat;
        background-size: cover;
    }

    .lifeCount  .unlife{
        display: inline-block;
        font-size: 0;
        width: 0.5rem;
        height: 0.5rem;
        margin: 0.1rem;
        background: url("../imgs/unlife.png") center center no-repeat;
        background-size: cover;
    }

    
    .container .center-block p.detail {
        /*设置动画属性*/
        /* animation-duration: 3s; */
        /* animation-delay: 0; */
        font-size: 0.34rem;
        color: #ffffff;
        line-height: 1.4;
        text-align: left;
        min-height:1rem;
    }
    
    .container .detail span {
        color: #ff0;
    }
    
    .container .detail span.isRed {
        color: #f00;
    }
    


    .container .bottom-block {
        display: flex;
        display: -webkit-flex;
        width: 100%;
        padding-bottom:0.5rem;
        /* justify-content: space-between; */
        justify-content: flex-start;
    }
    
    .container .bottom-block ul {
        width: 5.6rem;
        align-self: center;
        margin: 0 auto;
        animation-delay: 1;
        
    }
    
    .container .bottom-block ul li {
        position: relative;
        width: 100%;
        min-height: 1rem;
        border-radius: 10px;
        background: #fff;
        margin: 0.2rem 0;
        text-align: center;
        line-height: 1.4;
        color: #33435e;
        padding:0.2rem 0.65rem;
        display: flex;
        align-items: center;
        justify-content: left;
        font-size: 0.26rem;
    }

    .container .bottom-block ul li p {
      text-align: center;
      display: block;
      width: 100%;
    }
    
    .container .bottom-block ul li.error {
        // background: #4188F3FF;
        color: #effbf5;
    }

    .pink_container .bottom-block ul li.error {
        background: #4188F3FF;
        color: #effbf5;
    }

    .blue_container .bottom-block ul li.error {
        background: #fe4191;
        color: #effbf5;
    }

    .yellow_container .bottom-block ul li.error {
        background: #ff673e;
        color: #effbf5;
    }

    .red_container .bottom-block ul li.error {
        background: #ffb900;
        color: #effbf5;
    }

    .purple_container .bottom-block ul li.error {
        background: #ff5a58;
        color: #effbf5;
    }
    
    .container .bottom-block ul li.true {
        // background: #FFC64AFF;
        color: #fff;
    }

    .pink_container .bottom-block ul li.true {
        background: #FFC64AFF;
        color: #fff;
    }

    .red_container .bottom-block ul li.true {
        background: #2fae53;
        color: #fff;
    }

    .yellow_container .bottom-block ul li.true {
        background: #3eb235;
        color: #fff;
    }
    
    .blue_container .bottom-block ul li.true {
        background: #3ab4f3;
        color: #fff;
    }

    .purple_container .bottom-block ul li.true {
        background: #0cc75c;
        color: #fff;
    }

    .container .bottom-block ul li.true span {
        display: inline-block;
        background: url("../imgs/true.png") center center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0.25rem;
        top: 50%;
        margin-top: -0.13rem;
        height: 0.26rem;
        width: 0.36rem;
        right: 100%;
        margin-right: 0.2rem;
    }
    
    .container .bottom-block ul li.error span {
        display: inline-block;
        background: url("../imgs/false.png") center center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0.25rem;
        top: 50%;
        margin-top: -0.13rem;
        height: 0.28rem;
        width: 0.28rem;
        right: 100%;
        margin-right: 0.2rem;
    }
</style>
<style>
    .countdown .weui-progress__bar {
        background: none;
    }
    
    .countdown .weui-progress__inner-bar {
        background: #edbb36;
        height: 0.14rem;
    }
    
    .countdown.countdownstart .weui-progress__inner-bar {
        background: #fff;
    }
    
    .bounce-enter-active {
        animation: bounce-in 0.4s;
    }
    
    .bounce-leave-active {
        animation: bounce-in 0.4s reverse;
    }
    
    .bouncedelay-enter-active {
        animation: bounce-in 0.4s;
    }
    
    .bouncedelay-leave-active {
        animation: bounce-in 0.4s reverse;
    }
    
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
</style>