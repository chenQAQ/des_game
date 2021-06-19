// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './css/mixins.less'
import animate from 'animate.css'
import './js/mock'
import {
    store
} from './js/store'
import $ from './js/jquery-3.3.1.min.js'
import {
    AlertPlugin,
    ToastPlugin,
    LoadingPlugin,
    TransferDom
} from 'vux'
Vue.use(AlertPlugin, ToastPlugin)
Vue.use(animate)
Vue.directive('transfer-dom', TransferDom)
Vue.config.productionTip = false
Vue.prototype.$ajax = axios;
/* eslint-disable no-new */
//路由拦截器
router.beforeEach((to, from, next) => {
    console.log('进入' + to.name + '页面');
    next();
});
new Vue({
    el: '#app',
    store,
    router,
    components: {
        App
    },
    template: '<App/>'
})