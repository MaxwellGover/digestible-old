<template v-if="this.userInfo">
  <div class="created-resources container">
    <resource-card v-for="resource in createdResources" :resource="resource"></resource-card>
  </div>
</template>

<script>

// TODO: WHY IS userInfo.uid UNDEFINED!!!!????

var db = firebase.database();
import store from '../store'
import ResourceCard from './ResourceCard'
import Profile from '../pages/Profile'
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

Vue.use(VueFire)

export default {
  name: 'created-resources',
  props: ['userInfo'],
  created: function () {
    console.log(store.state.userInfo.uid)
  },
  components: { ResourceCard }
}
</script>

<style>
.created-resources {
  width: 700px
}
</style>