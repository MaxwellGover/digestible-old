<template>
  <div id="app">
    <nav class="navbar navbar-light bg-faded">
      <div class="container">
        <ul class="nav navbar-nav">
          <li class="nav-item active">
            <h4><router-link to="/" class="link">Digestible</router-link><span class="sr-only">(current)</span></h4>
          </li>
          <div class="links">
            <li class="nav-item">
              <router-link :to="{name: 'createInfo'}" class="create-quiz-link">Create a quiz</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Study</a>
            </li>
            <!--<li v-if="userInfo.uid" class="nav-item dropdown">-->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span v-if="userInfo.uid">{{userInfo.displayName}}</span>
              <span v-else>Sign In/Sign Up</span>
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <router-link  class="dropdown-item" v-if="userInfo.uid" :to="'/profile/' + userInfo.uid">Profile</router-link>
                <a class="dropdown-item" href="#" @click.prevent="toggleSignIn()">Sign <span>{{userInfo.uid? 'Out': 'In'}}</span></a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
            <!--<li class="nav-item" v-else>
              <a class="nav-link" href="#">Sign In/Sign Up</a>
            </li>-->
          </div>
        </ul>
      </div>
    </nav>
    <div v-if="loading" class="spinner-wrapper">
      <!--loading...-->
      <div class="spinner-container">
        <!--<div class="sk-rotating-plane"></div>-->
        <div class="sk-folding-cube">
          <div class="sk-cube1 sk-cube"></div>
          <div class="sk-cube2 sk-cube"></div>
          <div class="sk-cube4 sk-cube"></div>
          <div class="sk-cube3 sk-cube"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import loadingMixin from './mixins/loading'

// var db = firebase.database();
import db from './db'

export default {
  name: 'app',
  mixins: [loadingMixin], // adds loading behaviour
  firebase: function() {
    return {
      resources: db.ref().child('resources'),
      users: db.ref().child('users')
    };
  },
  // data() {
  //   return {
  //     passedResources: {}
  //   }
  // },
  created() {
    console.log('app creat', this.$store.state.userInfo.uid)
    // this.$firebaseRefs['passedResources'] = db.ref('/users/' + this.$store.state.userInfo.uid + '/passedResources');

    // this.$firebaseRefs['passedResources']
    db.ref('/users/' + this.$store.state.userInfo.uid + '/passedResources').on('value', (snap) => {
      console.log('passed Res', snap.val());
      // this.$store.state.passedResources = snap.val();
      this.$store.dispatch('addPassedResources', snap.val());
    });
  },
  computed: mapState(['userInfo']),
  methods: {
    toggleSignIn () {
      this.$store.dispatch('watchSignIn');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Khula', sans-serif;
  color: #2c3e50;
}
.navbar {
  background-color: white;
  padding: 15px;
}
.links {
  display: flex;
  align-items: center;
  float: right;
}
.link {
  color: #4e30f9;
}
.link:visited, .link:hover, .link:active {
  color: #4e30f9;
  text-decoration: none;
}
.create-quiz-link {
  color: #4e30f9;;
}
.create-quiz-link:visited, .create-quiz-link:hover, .create-quiz-link:active {
  color: #4e30f9;
  text-decoration: none;
}


/* centering classes for loading spinner */
.spinner-wrapper {
  height: 100%;
}

.spinner-container {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 60px;
    right: 0;
    margin: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/*.absolute-center {
  width: 50%;
  height: 50%;
  overflow: auto;
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
}*/

</style>
