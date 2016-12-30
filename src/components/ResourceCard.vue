<template>
  <div class="card is-fullwidth">
  
    <header class="card-header">
      <img class="user-image" :src="resource.authorImage" alt=""/>
      <div class="right">
        <p class="card-header-title">
          <router-link :to="'/profile/' + resource.authorId" class="author-link">{{resource.authorName}}</router-link><br>
          <small style="font-size: 14px; color: #8f8f8f">Resource type: <span><router-link :to="'/type/' + resource.type + 's'" style="color: #333; font-size: 14px">{{resource.type | capitalize}}</router-link></span></small>
        </p>
    </header>
    
    <div class="card-content">
      <div class="content">
        <router-link :to="'/quiz/' + resource['.key']"><p class="resource-title"><b>{{resource.title}}</b></p></router-link>
        <p style="font-size: 18px; color: #8f8f8f">{{resource.description}}</p>
        <!-- Learn button -->
        <router-link v-if="showLearn" class="button is-light is-medium" :to="'/quiz/' + resource['.key']">
          Learn
        </router-link>
        <a v-bind:href="resource.url" class="button is-light is-medium" v-else>
          Go to resource
        </a>
      </div>
    </div>
    
    <footer class="card-footer">
        <i class="fa fa-thumbs-o-up fa-3x" aria-hidden="true"></i>
        <p style="font-size: 16px; margin-top: 5px">{{resource.timesPassed}}</p>
    </footer>

</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
var VueFire = require('vuefire')
Vue.use(VueFire)
import db from '../db'

export default {
  name: 'resource-card',
  props: { 
    resource: {
      types: Object,
      default: function() {
        return {
          // error: {
          //   msg: 'resource not available!'
          // }
        }
      }
    }, 
    passed: {
      types: Object,
      default: function() {
        return {}
      }
    },
    options: {
      type: Object,
      default: function() {
        return {
        };
      }
    },
    showLearn: {
      type: Boolean, 
    },
  },
  data() {
    return {
      error: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    })
  },
  filters: {
    capitalize: function (value) {
      if (!value) return;
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    findResourceByKeyInPassed(resource) { // times passed on user basis
      // if (typeof this.passed !== 'Array') return;

      let found = this.passed.filter(passedRes => 
        passedRes['.key'] === resource['.key'])[0];
        
      return found? found.timesPassed : 0;
    },
    hideModal () {
      modalOpen = false 
    },
    showModal () {
      modalOpen = true
    },
    toggleSignIn () {
      this.$store.dispatch('watchSignIn');
    },
    openModal () {
      if (!this.userInfo) {
        this.showModal = true;
        console.log('No user signed in');
      } else {
        this.isBookmarked = true
      }
    },
    closeModal () {
      this.showModal = false;
    },
  }
}
</script>

<style scoped>
a {
  text-decoration: none
}
.card {
  font-family: 'Roboto', sans-serif;
  margin-right: 20px;
  margin-top: 40px;
  width: 800px;
}
.card-header {
  background-color: #fff;
  border-bottom: none
}
.card-footer {
  padding: 20px
}
.card-header-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  border-bottom: none;
}
.resource-title {
  font-size: 32px; 
  color: #333;
  margin-bottom: 5px; 
  font-family: 'Patua One', cursive;
  text-decoration: none;
}
.button {
  text-decoration: none
}
.learn-button:hover {
  border-color: #006ce4;
}
.user-image {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  margin-right: 5px;
  align-self: center;
}
.card-footer {
  display: flex;
  align-items: center;
  background-color: #fafafa
}
.author-link {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: -20px
}
.user-name {
  color: #006ce4;
}
.user-name:hover {
  text-decoration: none;
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.fa {
  color: #333;
  margin-right: 15px
}
</style>