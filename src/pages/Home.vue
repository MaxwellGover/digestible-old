<template>
  <div>
    <div class="notification" v-if="show">
      <button class="delete" v-on:click="removeNotification"></button>
      <div class="container">
        <p class="notification-text">Hey there! Are you an absolute beginner to web design or development? Click
          <router-link to="/getting-started" style="color: #75fab4"><em>here</em></router-link>
        </p>
      </div>
    </div>
    <div v-if="!userInfo.uid">
      <div class="jumbotron">
        <div class="container">
          <h1 class="hero-header" v-html="jumbotronHeader">Retain the Web</h1>
          <p style="font-size: 18px">Make sure you are retaining the important information <br> from technical online articles, videos, and podcasts
            with Digestible.</p>
          <a class="button is-outlined" @click.prevent="toggleSignIn()"><span class="button-text" style="font-size: 16px; color: #fff">SIGN UP</span></a>
        </div>
      </div>
    </div>
    <div class="home container">
      <div class="feed">
        <resource-card v-for="resource in resources" :resource="resource" :passed="passedResources" :showLearn="showLearn"></resource-card>
      </div>
      <div class="side-bar">
        <p class="side-bar-header"><b>Here are some users to check out</b></p>
        <small style="font-size: 12px; margin-top: 5px; color: #8f8f8f">See what other users are learning.</small>
        <hr>
        <side-bar v-for="(user, index) in users" :user="user"></side-bar>
      </div>
      <!--{{resources}}-->
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

// var db = firebase.database();
import db from '../db'

Vue.use(VueFire)

export default {
  name: 'home',
  components: { 
    ResourceCard, 
    Categories,
    SideBar
  },
  computed: mapState({
    userInfo: state => state.userInfo,
  }),
  firebase() {
    return {
      resources: db.ref().child('resources'),
      passedResources: db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/passedResources'),
      users: db.ref().child('users')
    }
  },
  data () {
    return {
      jumbotronHeader: "<strong>Retain the Web</strong>",
      show: true,
      showLearn: true
    }
  },
  methods: {
    toggleSignIn () {
      this.$store.dispatch('watchSignIn');
    },
    removeNotification () {
      this.show = false 
    },
  }
  // vuex: {
  //   getters: {
  //     resources: state => state.resources
  //   }
  // },
  // firebase: {
  //   resources: db.ref().child('resources'),
  //   users: db.ref().child('users')
  // } 
}
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
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  }
  
  .side-bar-header {
    font-size: 16px;
    
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
  
  .popular-resources {
    margin-top: 40px;
    font-size: 16px
  }

  .popular-resources-list {
    margin-top: 10px
  }

  .popular-resource-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 18px
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
  
  .notification-text {
    font-size: 18px;
    color: #fff;
  }

  .notification {
    background-color: #006ce4
  }
  
  a {
    color: #000;
    text-decoration: none
  }
</style>