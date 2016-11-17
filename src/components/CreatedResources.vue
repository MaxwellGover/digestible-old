<template>
  <div class="created-resources container">
    <resource-card v-for="resource in createdResources" :resource="resource"></resource-card>
  </div>
</template>

<script>
var db = firebase.database();
import store from '../store'
import ResourceCard from './ResourceCard'
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

Vue.use(VueFire)

export default {
  name: 'created-resources',
  props: ['userInfo'],
  components: { ResourceCard },
  created () {
    console.log(this.userInfo.uid)
    this.$bindAsArray('createdResources', db.ref('users' + this.userInfo.uid + '/createdResources/'))
  }
}
</script>

<style>
.created-resources {
  width: 700px
}
</style>