<template>
<div>
  <div v-if="!userInfo.uid">
    <div class="jumbotron">
      <div class="container">
        <h1 class="hero-header" v-html="jumbotronHeader">Retain the Web</h1>
        <p style="font-size: 18px">Make sure you are retaining the important information <br> from online articles, videos, and podcasts with Digestible.</p>
        <a class="button is-large" @click.prevent="toggleSignIn()"><span class="button-text">Sign Up</span></a>
      </div>
    </div>
  </div>
  <div class="home container">
    <div class="feed">
      <resource-card v-for="resource in resources" :resource="resource"></resource-card>
    </div>
    <div class="side card card-block">
      I am a side bar
    </div>
  </div>
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
  created () {
    this.$store.dispatch('watchResources');
    this.$store.dispatch('watchUsers');
    this.$store.dispatch('watchUserInfo');
  
    console.log(this.$store.state);
  },
  data () {
    return {
      jumbotronHeader: "<strong>Retain the Web</strong>"  
    }
  },
  methods: {
    toggleSignIn () {
      this.$store.dispatch('watchSignIn');
    }
  },
  vuex: {
    getters: {
      resources: state => state.resources
    }
  },
  firebase: {
    resources: db.ref().child('resources')
  } 
};
</script>

<style scoped>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 40px;
  height: 300px;
}
.categories {
  margin-top: 60px
}
.hero-header {
  font-size: 40px;
}
.button {
  margin-top: 20px;
  background-color: #f16233;
  padding: 15px;
}
.button:hover {
  background-color: #f16233;
  border-color: #f16233;
}
.button-text {
  color: #fff;
}
</style>