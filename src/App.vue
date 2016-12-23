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
          <a class="nav-item" v-else @click="openModal">Sign In / Sign Up</a>
        </div>
        
      </div>
    
    </nav>
    <router-view></router-view>
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

export default {
  name: 'app',
  computed: mapState({
    state: state => state,
    userInfo: state => state.userInfo
  }),
  data () {
    return {
      showModal: false,
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
</style>
