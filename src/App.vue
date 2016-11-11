<template>
  <div id="app">
    <nav class="navbar navbar-light bg-faded">
      <ul class="nav navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="#"><h4><router-link to="/" style="color: #ffcc00">Digestible</router-link><span class="sr-only">(current)</span></h4></a>
        </li>
        <div class="right">
          <li class="nav-item">
            <a class="nav-link" href="#"><router-link to="/info" style="color: #ffcc00">Create a quiz</router-link></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Study</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="" @click.prevent="toggleSignIn">
            Sign In / Sign Up
            </a>
          </li>
        </div>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  computed: {
    state () {
      return this.$store.state 
    }
  },
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
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.navbar {
  background-color: white;
}
.right {
  float: right;
}
</style>
