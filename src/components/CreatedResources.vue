<template v-if="this.userInfo">
  <div class="created-resources container">
    <div v-for="resource in data"> <!-- div just for debugging-->
    <resource-card  :resource="resource" :passed="passed"></resource-card>
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
  components: { ResourceCard }
}
</script>

<style>
.created-resources {
  width: 700px
}
</style>