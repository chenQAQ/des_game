<template>
    <div>
	      <div @click="changeOn" :class="isOff?'isOff':'isOn'"></div>
	      <audio  id="audio" src="https://img.tukuppt.com/newpreview_music/09/01/86/5c8a181d9e6af98360.mp3"></audio>
	  </div>
</template>
<script>
export default {
    name : "music",
    data() {
      return {
          isOff:true
      }
    },
    components: {},
    created(){
        // this.audioAutoPlay();
    },
    mounted() {
        // 自动播放音乐效果，解决微信自动播放问题
       document.addEventListener('touchstart',this.audioAutoPlay,false);
    //    document.addEventListener('WeixinJSBridgeReady', this.audioAutoPlay,false);
       let oAudio = document.querySelector("#audio");
        oAudio.onended = function () {//播放完毕，重新循环播放
            oAudio.load();
            oAudio.play();
        }
    },
    methods: { 
           changeOn(){
                let oAudio = document.querySelector("#audio");
               if(this.isOff){
                oAudio.play();//开始播放     
               }else{
                oAudio.pause();//暂停播放 
               }
               this.isOff = !this.isOff;
           },
           audioAutoPlay() {
                 let oAudio = document.querySelector("#audio");
                    this.isOff = false;
                    oAudio.play();
                document.removeEventListener('touchstart',this.audioAutoPlay);
            }
           
    }
  }
</script>
 
<style scoped>
.isOn{
    width: 0.7rem;
    height: 0.7rem;
    position: fixed;
    z-index: 2000;
    top: 0.5rem;
    right: 10px;
     -webkit-animation: rotating 1.2s linear infinite;
    animation: rotating 1.2s linear infinite;
    background: url("https://www.17sucai.com/preview/63045/2015-02-11/slideshow/img/music-16a4e0f1.png")  no-repeat;
    background-size:100%; 
}
@keyframes rotating {
    from { -webkit-transform: rotate(0) }
    to { -webkit-transform: rotate(360deg) }
 }
@-webkit-keyframes rotating {
    from { -webkit-transform: rotate(0) }
    to { -webkit-transform: rotate(360deg) }
 }
.isOff{
    width: 0.7rem;
    height: 0.7rem;
    position: fixed;
    z-index: 2000;
    top: 0.5rem;
    right: 10px;
    background: url("https://www.17sucai.com/preview/63045/2015-02-11/slideshow/img/music-16a4e0f1.png") no-repeat;
    background-size:100%; 
}
</style>
