import Vue from 'vue';
import Router from 'vue-router';
import beatdown from '@/pages/beatdown';
import home from '@/pages/home';
import answer from '@/pages/answer';
import blockade from '@/pages/blockade';
import success from '@/pages/success';
import failture from '@/pages/failture';
import rank from '@/pages/rank';
import lottery from '@/pages/lottery';
import flaunt from '@/pages/flaunt';
import activity from '@/pages/activity';
import invite from '@/pages/invite';
import checkpoint from '@/pages/checkpoint';
import teamout from '@/pages/teamout';
import teampk from '@/pages/teampk';
import teamdown from '@/pages/teamdown';
import puzzle from '@/pages/puz/puz';
import farm from '@/pages/farm';
import choose from '@/pages/choose';

Vue.use(Router)


export default new Router({
    base: '/',
    // mode: 'history',
    routes: [{
            path: '/',
            name: 'home',
            name_cn: "主页",
            component: home
        },
        {
            path: '/answer',
            name: 'answer',
            name_cn: "闯关",
            component: answer
        },
        {
            path: '/blockade',
            name: 'blockade',
            name_cn: "闯关",
            component: blockade
        },
        {
            path: '/success',
            name: 'success',
            name_cn: "闯关成功",
            component: success
        },
        {
            path: '/failture',
            name: 'failture',
            name_cn: "闯关失败",
            component: failture
        },
        {
            path: '/rank',
            name: 'rank',
            name_cn: "排行榜",
            component: rank
        },
        {
            path: '/beatdown',
            name: 'beatdown',
            name_cn: '好友PK',
            component: beatdown
        },
        {
            path: '/lottery',
            name: 'lottery',
            name_cn: '我的知识币',
            component: lottery
        },
        {
            path: '/flaunt',
            name: 'flaunt',
            name_cn: '炫耀战绩页',
            component: flaunt
        },
        {
            path: '/activity',
            name: 'activity',
            name_cn: '活动列表',
            component: activity
        },
        {
            path: '/invite',
            name: 'invite',
            name_cn: '邀请pk',
            component: invite
        },
        {
            path : '/checkpoint',
            name : 'checkpoint',
            name_cn: '爱答题',
            component: checkpoint
        },
        {
            path : '/teamout',
            name : 'teamout',
            name_cn: '团队pk直播',
            component: teamout
        },
        {
            path : '/teampk',
            name : 'teampk',
            name_cn: '团队pk',
            component: teampk
        },
        {
            path : '/teamdown',
            name : 'teamdown',
            name_cn: '团队pk倒计时',
            component: teamdown
        },
        {
            path:'/puzzle',
            name:'puzzle',
            name_cn:"小西拼图",
            component:puzzle
        },
        {
            path:'/farm',
            name:'farm',
            name_cn:"小西农场",
            component:farm
        },
       {
            path: '/choose',
            name: 'choose',
            name_cn: '选择植物',
            component: choose
       },
    ]
})