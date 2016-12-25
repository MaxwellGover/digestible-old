<template>
  <div id="app">
    <nav class="nav">
      
      <div class="container">
        <div class="nav-left">
          <router-link to="/" class="nav-item is-brand" style="text-decoration: none">
            <h1 class="nav-title">Digestible</h1>
          </router-link>
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

          <div class="nav-item dropdown" v-if="userInfo.uid">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              {{userInfo.displayName}}
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><router-link :to="'/profile/'+userInfo.uid">Profile</a></li>
              <!--<li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>-->
              <li role="separator" class="divider"></li>
              <li><a href="#" @click.prevent="toggleSignIn()">Logout</a></li>
            </ul>
          </div>
          <a class="nav-item" v-else @click="openModal">Sign In / Sign Up</a>
        </div>
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
    <!--{{loading}}-->
  <!--</div>-->

    <!--<router-view></router-view>-->
    <div v-if="showModal" class="modal is-active">
      <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Digestible</p>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <div class="google" @click.prevent="toggleSignIn()" >
              <img class="google-logo" src="./assets/google-logo.png" alt="Sign In with Google" />
              <p>Continue with Google</p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <a class="button" @click="closeModal">Cancel</a>
          </footer>
        </div>
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
  firebase: function() { // moved to main.js to have them globally
    // console.log('firebase refs', this.$store); //this.$store.state);
    return {
      // resources: db.ref().child('resources'),
      users: db.ref().child('users')
    };
  },
  data() {
    return {
      userInfo: {
        uid: ''
      },
      showModal: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    toggleSignIn () {
      this.$store.dispatch('watchSignIn');
      this.closeModal()
    },
    openModal () {
      this.showModal = true;
    },
    closeModal () {
      this.showModal = false;
    },
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
  color: #000;
} 
.button {
  border-color: #006ce4;
}
.button:hover {
  border-color: #006ce4;
  text-decoration: none;
}
.button-text:hover {
  text-decoration: none;
}
.button-text {
  color: #006ce4;
}
.modal-card-head {
  height: 100px;
}
.modal-card-body {
  display: flex;
  flex-direction: column;
}
.modal-card-title {
  font-family: 'Chewy', cursive;
  text-align: center;
  font-size: 32px; 
  color: #f16233;
}
.google {
  display: flex;
  padding: 20px;
  width: 400px;
  border: 1px solid #eceeef;
  align-self: center;
  align-items: center;
  cursor: pointer;
}
.google-logo {
  height: 25px;
  width: 25px;
  margin-right: 15px;
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
