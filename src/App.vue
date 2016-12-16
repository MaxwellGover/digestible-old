<template>
  <div id="app">
    <nav class="navbar navbar-light bg-faded">
      <div class="container">
        <ul class="nav navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#"><h4><router-link to="/" class="link">Digestible</router-link><span class="sr-only">(current)</span></h4></a>
          </li>
          <div class="links">
            <li class="nav-item">
              <router-link to="/info" class="create-quiz-link">Create a quiz</router-link>
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
                <a class="dropdown-item" href="#">Action</a>
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
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app',
  computed: mapState({
    state: state => state,
    userInfo: state => state.userInfo
  }),
  created () {
    this.$store.dispatch('watchResources');
    this.$store.dispatch('watchUsers');
    this.$store.dispatch('watchUserInfo');
  
    console.log(this.$store.state);
  },
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
</style>
