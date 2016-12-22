<template v-if="this.userInfo">
  <div class="created-resources container">
    <div v-for="resource in data"> <!-- div just for debugging-->
    <resource-card  :resource="resource" :passed="getPassedResource(resource)"></resource-card>
    <!--created-resources passed: {{getPassedResource(resource)}}

    <br/>
    {{resource['.key']}}-->
    </div>
  </div>
</template>

<script>

// TODO: WHY IS userInfo.uid UNDEFINED!!!!????

// var db = firebase.database();
import db from '../db'
import store from '../store'
import ResourceCard from './ResourceCard'
import Profile from '../pages/Profile'
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

Vue.use(VueFire)

export default {
  name: 'created-resources',
  props: ['data', 'passed'],
  components: { ResourceCard },
  methods: {
    getPassedResource(resource) { //<<<<<<<<<<<<< not working yet
      console.log('getting passed', this.passed, resource['.key']);
      let key =  resource['.key'];
      // console.log(this.passed[key]);
      this.passed.forEach((passedRes) => {
        // console.log('each passed', passedRes['.key'], key)
        if (passedRes['.key'] === key) {
          console.log('found', passedRes, passedRes['.key'], key);
          return passedRes;
        }
      })

      return {};
    }
  }
}
</script>

<style>
.created-resources {
  width: 700px
}
</style>