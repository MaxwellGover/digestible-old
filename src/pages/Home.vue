<template>
  <div class="home container">
    <div class="row">
      <div class="col-md-8">
        <resource-card v-for="resource in resources" :resource="resource"></resource-card>
      </div>
      <div class="categories col-md-4">
        <h5>Categories</h5>
        <p style="color: #a3a3a3">View all</p>
      </div>
    </div>
    <h1>Debugging info</h1>
    <pre>{{userInfo}}</pre>
  </div>
</template>

<script>
import ResourceCard from '../components/ResourceCard'
import Categories from '../components/Categories'
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

var db = firebase.database();

Vue.use(VueFire)

export default {
  name: 'home',
  components: { 
    ResourceCard, 
    Categories
  },
  computed: mapState({
    userInfo: state => state.userInfo
  }),
  vuex: {
    getters: {
      resources: state => state.resources
    }
  },
  firebase: {
    resources: db.ref().child('resources')
  } 
}
</script>

<style>
#app {
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f9f9f9
  /* margin-top: 60px; */
}
.categories {
  margin-top: 60px
}
</style>