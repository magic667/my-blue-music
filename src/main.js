import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 图片懒加载
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
  loading: require('assets/imgs/loadImg.gif'),
  error: require('assets/imgs/error.png'),
  attempt: 6,
  observer: true
});

// 自定义全局过滤器
// 格式化大于10000的数字
import formatNum from './common/formatNum';
Vue.use(formatNum);
// 格式化时间
import formatDuration from './common/formatDuration';
Vue.use(formatDuration);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
