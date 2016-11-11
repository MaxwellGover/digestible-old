<template>
  <div class="home container">
    <div class="row">
      <div class="col-md-8">
        <resource-card v-for="resource in resources" :resource="resource"></resource-card>
      </div>
      <div class="categories col-md-4">
        <h5>Categories</h5>
        <p style="color: #a3a3a3">View all</p>
        <categories></categories>
      </div>
    </div>
  </div>
</template>

<script>
import ResourceCard from './ResourceCard'
import Categories from './Categories'
import Vue from 'vue'
import VueFire from 'vuefire'

var db = firebase.database();

Vue.use(VueFire)

export default {
  name: 'home',
  components: { 
    ResourceCard, 
    Categories
  },
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