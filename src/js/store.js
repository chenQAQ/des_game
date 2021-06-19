import Vue from 'vue';
import Vuex from 'vuex';
import {
    setCookie,
    getCookie
} from './cookie'
import {
    GetUrlParam
} from "./util.js";
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        userdata: {}, //用户信息
        activitydata: {}, //活动信息
        status: '', //是否绑定
        token: getCookie('access_token'),
        websocket: null,
        wsState: 0,
        activityId: GetUrlParam("activity_id"),
        access_token: GetUrlParam("access_token"),
        avatar_default: '//s1-hn.aghcdn.com/king/avatar.jpg',
        logo_cdn: '//game.aghcdn.com/design/king/avatar_default.png',
        showOffline: false,
        offlineMsg: '',
        share_img: 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMUIyNjA1QzM4QTcxMUU4QUU3QUNFNjU1NjkyMzcxRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMUIyNjA1RDM4QTcxMUU4QUU3QUNFNjU1NjkyMzcxRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUxQjI2MDVBMzhBNzExRThBRTdBQ0U2NTU2OTIzNzFEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUxQjI2MDVCMzhBNzExRThBRTdBQ0U2NTU2OTIzNzFEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgID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',
        my_plant:{}   //农场信息
    },
    mutations: {
        setState(state, payload) {
            for (let key in payload) {
                state[key] = payload[key]
            }
        },
        setUserState(state, payload) {
            for (let key in payload) {
                state.userdata[key] = payload[key]
            }
        },
        updatePlantState(state,payload){
            for(let key in payload){
                state.my_plant[key]=payload[key]
            }
        },
    }
});