<template>
  <div id="app">
    <nav class="nav">
      
      <div class="container">
        
        <div class="nav-left">
          <a class="nav-item is-brand" href="#" style="text-decoration: none">
            <h1 class="nav-title">Digestible</h1>
          </a>
        </div>
        
        <div class="nav-right nav-menu">
          <span class="nav-item">
            <a class="button is-outlined">
             <router-link to="/info" style="text-decoration: none">
                <span class="button-text">
                  Create a quiz
                </span>
              </router-link>
            </a>
          </span>
          <a class="nav-item" href="#" style="text-decoration: none">
            Study
          </a>
          <a class="nav-item" href="#" v-if="userInfo.uid" @click.prevent="toggleSignIn()" style="text-decoration: none">
           {{userInfo.displayName}}
          </a>
          <a v-else @click.prevent="toggleSignIn()">>Sign In / Sign Up</a>
        </div>
        
      </div>
    
    </nav>
    <!-- 
    <nav class="nav">
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
            <li v-if="userInfo.uid" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {{userInfo.displayName}}
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#" @click.prevent="toggleSignIn()">Sign Out</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
            <li class="nav-item" v-else>
              <a class="nav-link" href="#">Sign In/Sign Up</a>
            </li>
          </div>
        </ul>
      </div>
    </nav>
    -->
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

<style scoped>
#app {
  font-family: 'Khula', sans-serif;
  color: #2c3e50;
}
.nav-title {
  font-family: 'Chewy', cursive;
  font-size: 32px; 
  color: #f16233;
} 
.button {
  border-color: #f16233;
}
.button:hover {
  background-color: #f16233;
  border-color: #f16233;
  text-decoration: none;
}
.button-text:hover {
  color: #fff;
  text-decoration: none;
}
.button-text {
  color: #f16233;
}
</style>
