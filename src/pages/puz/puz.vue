<template>
    <!--头部-->
    <div>
        <div style="width: 100vw;height: 100vh;overflow: hidden">
        <div class="bg"></div>
        <div class="bg2"></div>
        <div class="vs"></div>
        <toast v-if="showError==true" :showIndex="showIndex" :errMsg="errorInfo"></toast>
        <div class="goclick" :style="{background:(join && readly)?'#7aed83':'#959595'}" v-if="user1.guid==userdata.guid">
            <div v-if="!join">等待加入</div>
            <div v-if="join && !readly">等待准备</div>
            <div v-if="join && readly" @click="clickBegin()" >开始游戏</div>
        </div>
        <div  class="goclick" v-else>
            <div @click="clickReadly()">{{readly?"取消准备":"准备"}}</div>
        </div>
        <!--头部结束-->
        <!--中间游戏部分-->
        <div id="game_top">
          <div id="user-img">
              <div id="user-left">
                  <img :src="user1.headpic_url" v-if="user1.headpic_url">
                  <img src="./img/add.png" v-else>
              </div>
              <div style="height: 1.3rem;width: 1.3rem">
                  <canvas id="canvas" class="canvas" width="0" height="0" style="transition-duration: .5s"></canvas>
              </div>
              <div id="user-right" @click="goInvite">
                  <img v-if="user2.headpic_url" :src="user2.headpic_url">
                  <img v-else src="./img/add.png" class="invite">
                  <div v-show="readly" class="is-ok"></div>
              </div>
          </div>
          <div id="user-name">
            <div>
                <span v-if="user1.name">{{user1.name}}</span>
            </div>
            <div>
                <span v-if="user2.name">{{user2.name}}</span>
            </div>
          </div>
        </div>

        <div id="game_content">
            <div id="imgArea"></div>
        </div>
        <div id="game_c">
            <div id="game_control">
                <!-- <span id="btn">开始</span> -->
                <!-- <span id="level">level: 3x3</span> -->
                <!-- <span id="scroe">步数：0</span> -->
            </div>
            <!-- <div id="game_result"><span>展示图</span></div> -->
        </div>
        <!--中间游戏部分结束-->
        <!--底部tab栏-->
        <div id="game_footer">
            <ul id="img_list">
                <li><div class='imgcontent'/></li>
            </ul>
        </div>
        <!--底部tab栏结束-->
        </div>
    </div>
</template>


<script>
import  Countdown from './js/canv'
import notify from "@/component/notify";
import popup from "@/component/popup";
import $ from 'jquery'

import {
  GetUrlParam
} from "../../js/util.js";
export default {
  name: 'puzzle',
  data () {
    return {
       user1:{},
       user2:{},
       user1socket:"",
       readly:true,   //准备按钮
       join:true,     //是否已经加入
       imgOrigArr : [],  //图片的正确顺序
       imgRandArr : [], //图片打乱后的顺序
       width:"",    //整张图片的宽度
       height:"",          //整张图片的高度
       cellWidth:"",       //每一碎块的宽度
       cellHeight:"",      //每一碎块的高度
       moveTime:200,  //记录animate动画的运动时间，默认400毫秒
       imgCells:'',    //记录碎片节点
       lever:3,     //难度 3x3
       isInGame:false,       //标记是否在游戏中
       scroe:0,        //游戏步数
       presentImg:"",          //当前图片
       passImg:[],        //已经通关的图片
       s:0,
       limit_time:30,   //限制时间为30秒，超过则无法获取分数
      ctd:{},
      ctd2:{},
      showError:false,
      showIndex:0,
      errorInfo:""
    }
  },
  components:{
    notify,
    popup
  },
  computed:{
    userdata(){
      return this.$store.state.userdata
    },
    websocket() {
      return this.$store.state.websocket;
    },
  },
  created(){
    const _this=this
    //请求创建房间
    this.$ajax.get(
        "/api/puzzle/check?guid=" +
        _this.$store.state.userdata.guid+
        "&room_id="+GetUrlParam("room_id")
      ).then((res)=>{
        //如果查到没有该房间名，则创建
        if(res.data.code=="0"){
          _this.user1=_this.$store.state.userdata
        }
        //如果有，则查询房主信息，以及将该用户放到第二个位置
        else if(res.data.code=="1"){
          if(res.data.userdata.guid==_this.userdata.guid){
            _this.user1=_this.$store.state.userdata
          }else{
            _this.user1=res.data.userdata
            _this.user2=_this.$store.state.userdata
            _this.join=true
          }
        }
        else if(res.data.code=="2"){
          this.showError = true;
          this.showIndex = 4;
          this.errorInfo = '该房间已经满人了！';
        }
    }).catch((e)=>{
        _this.user1=_this.$store.state.userdata;
    })
  },
  mounted(){
    const _this=this;
    _this.setBgPic();
    window.addEventListener("beforeunload ",this.leave());
    window.addEventListener("pagehide ",this.leave());
  },
  methods:{
    leave(){
      this.$ajax.get("/api/puzzle/leave").then(res=>{
      })
    },
    goInvite(){
      if(!this.user2.headpic_url){
        this.$router.push({
          path: "invite",
          query: {
            activity_id: this.$store.state.activityId,
            access_token: this.$store.state.access_token
          }
        });
      }
    },
    websocketSend(data) {
      try {
        this.websocket.send(JSON.stringify(data));
      } catch (error) {
        this.showError = true;
        this.showIndex = 4;
        this.errorInfo = '网络异常，请稍后退出重试！';
      }
    },
    //开始游戏
    clickBegin(){
        if(this.readly){
            $(".bg").css("transform","translateY(100%)");
            $(".goclick").css("transform","translateY(100vh)");
            $(".vs").css("transform","translateY(100vh)");
            $("#game_top").css({"transform":"translateY(1.4rem)","top":"0"});
            $("#game_content").css("zIndex",100);
            $(".bg").hide(300);
            $(".vs").hide(300);
            $(".goclick").hide(300);
            $(".is-ok").hide(300);
            this.getImg();
        }
    },
    //准备
    clickReadly(){
      this.readly=!this.readly
      if(this.readly) {
        $(".goclick").css({"background":"#bebebe"})

      }else{
        $(".goclick").css({"background":"#7aed83"})
      }

    },
    //获取图片和乱序的数组
    getImg(){
      const _this=this;
      var _div=$("#img_list").children("li").find("div")[0];
      this.$ajax.get("/api/puzzle/get_img").then(res=>{
        $(_div).css({"background":`url(${res.data.src})`,'background-size':'100% 100%'});
        _this.presentImg=res.data.src;
        _this.imgSplit(_this.presentImg);
        _this.imgRandArr=res.data.random_data;
        _this.ctd= new Countdown();
        const size=$("#user-left").height();
        const fonts=$("#user-name div").css("fontSize").replace("px","");
        _this.ctd.init({time:5,size:size,fontSize:fonts*1.5});
        setTimeout(()=>{
          // _this.randomArr();
          _this.cellOrder(_this.imgRandArr);
          _this.beginGamePc();
          _this.beginGamePhone();
          _this.isInGame = true;
          _this.scroe = 0;
          _this.ctd2= new Countdown();
          _this.moveTime=30
          setTimeout( _this.ctd2.init({time:10,size:size,fontSize:fonts*1.5,ringColor:"#7aff93",over:true}),1000)
          // $("#scroe").text("步数：0");
        },5000)
      })
    },
    //设置背景图片
    setBgPic:function(){
      if (document.documentElement.clientWidth > 700){
        $(".bg").css('background-size', 'auto '+document.documentElement.clientHeight +'px');
        $(".bg").css('background-repeat', 'repeat');
      }else {
        $(".bg").css('background-size', document.documentElement.clientWidth+'px '+document.documentElement.clientHeight+'px');
        $(".bg").css('background-repeat', 'repeat-y');
      }
    },
    //切割图片
    imgSplit:function (img) {
      const _this=this
      _this.width = $("#imgArea").width();
      _this.height = $("#imgArea").height();
      _this.cellWidth = _this.width/_this.lever;
      _this.cellHeight = _this.height/_this.lever;
      _this.imgOrigArr = [];
      _this.imgRandArr = [];
      var cell = '';   //记录单个图片碎片的变量
      $("#imgArea").html("");
      for (var i = 0; i < _this.lever; i++){
        for (var j = 0; j < _this.lever; j++){
          _this.imgOrigArr.push(i*_this.lever+j);
          cell = document.createElement("div");
          cell.className = "imgCell";
          $(cell).css({
            width: _this.cellWidth - 2,
            height: _this.cellHeight - 2,
            left: j * _this.cellWidth,
            top: i * _this.cellHeight,
            background: "url('"+ img +"')",
            backgroundPosition: (-j)*_this.cellWidth + 'px ' + (-i)*_this.cellHeight + 'px',
            backgroundSize:$("#imgArea").width()+"px"+" "+$("#imgArea").width()+"px",
            float: 'left',
            border: '1px solid rgba(0, 0, 0, 0.58)',
            borderRadius: '4px',
            position:'absolute',
            zIndex:10,
            boxShadow:'0 0 8px #0d2f5f',
            transitionProperty: 'background-position',
            transitionDuration: '1000ms',
            transitionTimingFunction: 'ease-in-out'
          });
          $("#imgArea").append(cell);
        }
      }
      _this.imgCells = $(".imgCell");
      _this.imgCells.css('cursor', 'pointer');
    },
    //PC端
    beginGamePc:function () {
      const _this=this
      _this.imgCells.bind("mouseover", function () {
        $(this).addClass("hover");
      });
      _this.imgCells.bind("mouseout", function () {
        $(this).removeClass("hover");
      });
      _this.imgCells.bind("mousedown", function (e) {
        /*此处是图片移动*/
        $(this).css('cursor','move');
        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.pageX - $(this).offset().left;
        var cell_mouse_y = e.pageY - $(this).offset().top;
        //拖动碎片
        $(document).bind("mousemove", function (e2) {
          _this.imgCells.eq(cellIndex_1).css({
            zIndex: '40',
            left: e2.pageX - cell_mouse_x - $("#imgArea").offset().left,
            top: e2.pageY - cell_mouse_y - $("#imgArea").offset().top
          });
        });
        $(document).bind("mouseup", function (e3) {
          var cellIndex_2 = _this.cellChangeIndex(e3.pageX - $("#imgArea").offset().left, e3.pageY - $("#imgArea").offset().top, cellIndex_1);
          if (cellIndex_1 == cellIndex_2){
            _this.cellReturn(cellIndex_1);
          }else {
            _this.cellExchange(cellIndex_1, cellIndex_2);
          }
          //移除绑定
          $(document).unbind('mousemove').unbind('mouseup');
        })
      });
      _this.imgCells.bind("mouseup", function () {
        $(this).css('cursor','pointer');
      })
    },
    //移动端
    beginGamePhone:function(){
      const _this=this
      _this.imgCells.on('touchstart', function (e) {
        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.touches[0].pageX - $(this).offset().left;
        var cell_mouse_y = e.touches[0].pageY - $(this).offset().top;
        $(document).on('touchmove', function (e2) {
          _this.imgCells.eq(cellIndex_1).css({
            zIndex: '40',
            left: e2.touches[0].pageX - cell_mouse_x - $("#imgArea").offset().left,
            top: e2.touches[0].pageY - cell_mouse_y - $("#imgArea").offset().top
          });
        });
        $(document).on('touchend', function (e3) {
          var cellIndex_2 = _this.cellChangeIndex(e3.changedTouches[0].pageX - $("#imgArea").offset().left, e3.changedTouches[0].pageY - $("#imgArea").offset().top, cellIndex_1);

          if (cellIndex_1 == cellIndex_2){
            _this.cellReturn(cellIndex_1);
          }else {
            _this.cellExchange(cellIndex_1, cellIndex_2);
          }
          //移除绑定
          $(document).off('touchmove').off('touchend');
        })
      });

    },
    //打乱数组顺序
    //根据打乱的数组给图片排序
    cellOrder:function (arr) {
      const _this=this
      for (var i = 0; i < arr.length; i++){
        _this.imgCells.eq(i).animate({
          left: arr[i] % _this.lever * _this.cellWidth,
          top: Math.floor(arr[i] / _this.lever) * _this.cellHeight     //Math.floor向下取值（1.6为1）
        }, _this.moveTime);
      }
    },
    //计算被交换碎片的下标
    cellChangeIndex:function(x,y,index1){
      const _this=this
      if (x < 0 || x > _this.width || y < 0 || y > _this.height){
        return index1;
      }
      //鼠标拖动碎片在大图范围内移动
      var row = Math.floor(y / _this.cellHeight);
      var col = Math.floor(x / _this.cellWidth);
      var position = row * _this.lever + col;

      var i = 0;
      while ((i < _this.imgRandArr.length) && (_this.imgRandArr[i] != position)){
        i++;
      }
      return i;
    },
    //被拖动的图片返回原位置
    cellReturn:function(index){
      const _this=this
      var row = Math.floor(_this.imgRandArr[index]/_this.lever);
      var col = _this.imgRandArr[index] % _this.lever;
      _this.imgCells.eq(index).animate({
        left: col * _this.cellWidth,
        top: row * _this.cellHeight
      }, _this.moveTime, function () {
        _this.imgCells.eq(index).css('z-index','10');
      })
    },
    //交换图片位置
    cellExchange:function (indexfrom,indexto) {
      const _this=this;
      var rowform = Math.floor(_this.imgRandArr[indexfrom] / _this.lever);
      var colform = _this.imgRandArr[indexfrom] % _this.lever;
      var rowto = Math.floor(_this.imgRandArr[indexto] / _this.lever);
      var colto = _this.imgRandArr[indexto] % _this.lever;
      //交换图片的位置
      _this.imgCells.eq(indexfrom).animate({
        left: colto * _this.cellWidth,
        top: rowto * _this.cellHeight
      }, _this.moveTime, function () {
        _this.imgCells.eq(indexfrom).css('z-index','10');
      });

      _this.imgCells.eq(indexto).css('z-index','30').animate({
        left: colform * _this.cellWidth,
        top: rowform * _this.cellHeight
      }, _this.moveTime, function () {
        _this.imgCells.eq(indexto).css('z-index','10');

        //交换存储的数据
        var temp = _this.imgRandArr[indexfrom];
        _this.imgRandArr[indexfrom] = _this.imgRandArr[indexto];
        _this.imgRandArr[indexto] = temp;

        $("#scroe").text("步数：" + (_this.scroe+=1));

        //判断是否完成全部移动，可以结束游戏
        if (_this.checkPass(_this.imgOrigArr, _this.imgRandArr)){
          alert("游戏结束！！！")
          _this.passGame();
        }
      })
    },
    //判断是否完成全部移动，可以结束游戏
    checkPass:function (rightArr,puzzleArr) {
      if (rightArr.toString() == puzzleArr.toString()){
        return true;
      }
      return false;
    },
    //成功完成游戏之后的处理
    passGame:function(){
      const _this=this
      if ($.inArray(_this.presentImg, _this.passImg) == -1){
        _this.passImg.push(_this.presentImg);
      }
      else{
        _this.passKnowledge[_this.presentImg] = $("#gameAnswer").text();
        console.log("info:"+_this.passKnowledge[_this.presentImg]);
        _this.showReward(_this.presentImg);
      }
    },
    //展示游戏成功之后的界面
    showReward:function (img) {
      const _this=this;
      $("#imgArea").fadeOut();
      $("#game_reward").fadeIn();
      $("#btn").unbind();
      $("#level").unbind();
      // $("#game_result span").text("back");
      $("#game_reward").css('background', 'url('+ img +')');
      _this.s = 1;
    },
    //自适应手机
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "./css/weatherGame.css";
@import "./css/demo.css";
.goclick{
    width: 2rem;
    height: 0.8rem;
    position: absolute;
    border:2px solid black;
    bottom: 2rem;
    left: calc(50% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    background: #7aed83;
    -webkit-border-radius: 1rem;
    -moz-border-radius: 1rem;
    border-radius: 1rem;
    font-size: 0.35rem;
    font-family: 微软雅黑;
    transition-duration: .5s;
}
.goclick:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top:0.03rem;
    background: rgba(61, 61, 61, 0.48);
    z-index:-1;
    border:2px solid black;
    -webkit-border-radius: 1rem;
    -moz-border-radius: 1rem;
    border-radius: 1rem;
    transition-duration: .5s;
}

</style>
