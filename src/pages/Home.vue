<template>
<div>
  <div class="jumbotron jumbotron-fluid">
    <div class="container">
      <h2 class="display-3">Retain the Web</h2>
      <p class="lead">Make sure you are retaining the most important information <br> from online articles, videos, and podcasts with Digestible.</p>
    </div>
  </div>
  <div class="home container">
    <div class="feed">
      <resource-card v-for="resource in resources" :resource="resource" :passed="passedResources[resource['.key']]"></resource-card>
    </div>
    <div class="side card card-block">
      I am a side bar
    <pre>
{{passedResources|json}}
    </pre>
    </div>
    <!--{{resources}}-->
  </div>
</div>
</template>

<script>
import ResourceCard from '../components/ResourceCard'
import Categories from '../components/Categories'
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

// var db = firebase.database();
import db from '../db'

Vue.use(VueFire)

export default {
  name: 'home',
  components: { 
    ResourceCard, 
    Categories
  },
  computed: mapState({
    userInfo: state => state.userInfo,
    passedResources: state => state.passedResources
  }),
  // vuex: {
  //   getters: {
  //     resources: state => state.resources
  //   }
  // },
  firebase: {
    resources: db.ref().child('resources')
  } 
}
</script>

<style>
.home {
  display: flex;
  justify-content: space-between;
}
.feed {
  display: flex;
  flex-direction: column;
}
.side {
  width: 400px;
  margin-top: 40px;
}
.jumbotron {
  margin-bottom: 60px;
  background-color: blue;
}
.categories {
  margin-top: 60px
}
</style>