import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'
import AsyncComputed from 'vue-async-computed'
// import VueResource from 'vue-resource'

// import VuexFire from 'vuexfire'

import '../node_modules/spinkit/css/spinkit.css'

import App from './App'
import db from './db'

import store from './store'
import router from './router';
// import loadingMixin from './mixins/loading'

Vue.use(VueFire);
// Vue.use(VuexFire)
Vue.use(VueRouter);
Vue.use(AsyncComputed)
// Vue.use(VueResource)

new Vue({
  el: '#app',
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  router,
  firebase: function() {
    // console.log('firebase refs', store.state.userInfo.uid); //this.$store.state);
    return {
      // resources: db.ref().child('resources'),
      users: db.ref().child('users')
    };
  },
  render: h => h(App)
})

Vue.filter('json', function(value, spaces) {
  return JSON.stringify(value, null, spaces || 2);
});


Vue.filter('isEmptyObject', function(obj) {
  console.log('isEmptyObject filter', obj);
  return Object.keys(obj).length === 0 && obj.constructor === Object;
});