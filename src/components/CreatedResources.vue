<template v-if="this.userInfo">
  <div class="created-resources container">
    <div v-for="resource in data"> <!-- div just for debugging-->
    <resource-card  :resource="resource" :passed="passed" :showLearn="showLearn"></resource-card>
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
  data () {
    return {
      showLearn: true 
    }
  }
}
</script>

<style>
</style>