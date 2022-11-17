import App from './App'
// 引入iconfont.css样式
import '@/common/iconfont.css'
// 引入request
import {myRequest} from '@/common/request.js'
Vue.prototype.$myRequest = myRequest
// 全局过滤器
Vue.filter('formatcount',(value) =>{
	if(value>=10000 && value <=100000000){
		value /=10000
		return value.toFixed(1) + '万'
	}else if(value >100000000){
		value /=100000000
		return value.toFixed(1) + '亿'
	}else{
		return value
	}
})
// 格式化时间
Vue.filter('formattime',(val)=>{
	let date = new Date(val)
	return date.getFullYear() + '年' + (date.getMonth()+1) + '月' +date.getDate() + '日'
})

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif