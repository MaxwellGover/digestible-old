<template>
<div>
  <div class="notification" v-if="show">
    <button class="delete" v-on:click="removeNotification"></button>
    <div class="container">
    <p class="notification-text">Hey there! Are you an absolute beginner to web design or development? Click <router-link to="/getting-started" style="color: #1da1f2"><em>here</em></router-link></p>
    </div>
  </div>
  <div v-if="!userInfo.uid">
    <div class="jumbotron">
      <div class="container">
        <h1 class="hero-header" v-html="jumbotronHeader">Retain the Web</h1>
        <p style="font-size: 18px">Make sure you are retaining the important information <br> from technical online articles, videos, and podcasts with Digestible.</p>
        <a class="button is-outlined" @click.prevent="toggleSignIn()"><span class="button-text" style="font-size: 16px; color: #fff">SIGN UP</span></a>
      </div>
    </div>
  </div>
  <div class="home container">
    <div class="feed">
      <resource-card v-for="resource in resources" :resource="resource"></resource-card>
    </div>
    <div class="side-bar">
      <p class="side-bar-header"><b>Here are some users to check out</b></p>
    <side-bar v-for="(user, index) in users" :user="user"></side-bar>
    </div>
  </div>
</div>
</template>

<script>
import ResourceCard from '../components/ResourceCard'
import Categories from '../components/Categories'
import SideBar from '../components/SideBar'
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

var db = firebase.database();

Vue.use(VueFire)

export default {
  name: 'home',
  components: { 
    ResourceCard, 
    Categories,
    SideBar
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
      jumbotronHeader: "<strong>Retain the Web</strong>",
      show: true
    }
  },
  methods: {
    toggleSignIn () {
      this.$store.dispatch('watchSignIn');
    },
    removeNotification () {
      this.show = false 
    },
  },
  vuex: {
    getters: {
      resources: state => state.resources
    }
  },
  firebase: {
    resources: db.ref().child('resources'),
    users: db.ref().child('users')
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
.side-bar {
  margin-top: 40px;
}
.side-bar-header {
  font-size: 16px;
  margin-bottom: 15px;
}
.jumbotron {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 40px;
  height: 300px;
  background-color: #fff;
}
.categories {
  margin-top: 60px
}
.hero-header {
  font-size: 40px;
}
.button {
  margin-top: 20px;
  padding: 20px;
  border-radius: 50px;
  border-color: #006ce4;
  background-color: #006ce4;
}
.button:hover {
  border-color: #75fab4;
}
.button-text {
  color: #fff;
}
.notification {
  padding: 40px;
  margin-bottom: 0px;
}
.notification-text {
  font-size: 18px;
}
</style>