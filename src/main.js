import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueLodash from 'vue-lodash'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import App from './App.vue'

Vue.use(VueAxios, axios)
Vue.use(Buefy)
Vue.use(VueLodash)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
