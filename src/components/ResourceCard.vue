<template>
  <div class="card is-fullwidth">
  
    <header class="card-header">
      <img class="user-image" :src="resource.authorImage" alt=""/>
      <div class="test">
      <p class="card-header-title">
        <router-link :to="'/profile/' + resource.authorId" class="author-link">{{resource.authorName}}</a>
        <small style="font-size: 12px; color: #9fa6ad">Resource type: <span style="color: #006ce4">{{resource.type | capitalize}}</span></small>
      </p>
    </header>
    
    <div class="card-content">
      <div class="content">
        <p style="font-size: 32px; margin-bottom: 5px"><b>{{resource.title}}</b></p>
        <p style="font-size: 18px">{{resource.description}}</p>
        <router-link class="learn-button button is-inverted" :to="'/info/' + resource['.key']">
          <span style="color: #fff">Learn</span>
        </router-link>
        <router-link class="learn-button button is-inverted" :to="'/quiz/' + resource['.key']" style="color: #fff">
          Quiz
        </router-link>
      </div>
    </div>
    
    <footer class="card-footer">
      <img class="icon" src="../assets/passed-icon.png" title="Number of times this quiz has been passed" alt=""/>
      {{resource.timesPassed}}
      <div class="bookmark">
        <img v-if="!isBookmarked" class="bookmark-icon" src="../assets/book.png" title="Number of times this quiz has been passed" alt="" @click="openModal"/>
        <img v-else class="bookmark-icon animated tada" src="../assets/book-fill.png" title="Click to save this resource for later" alt="" @click="unBookmark"/>
      </div>
    </footer>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
var VueFire = require('vuefire')
Vue.use(VueFire)

// var db = firebase.database();

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
    }
  },
  data() {
    return {
      error: false,
      isBookmarked: false,
      showModal: false
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
    bookmark () {
      // db.ref('/users/').push(this.resource);
      console.log(this.resource);
      // Push to firebase array
    },
    unBookmark () {
      this.isBookmarked = false;
      // Remove from firebase array
    }
  }
}
</script>

<style scoped>
.card {
  font-family: 'Khula', sans-serif;
  margin-right: 20px;
  margin-top: 40px;
  width: 800px;
}
.card-header {
  background-color: #fff;
  border-bottom: none
}
.card-header-title {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-bottom: none;
}
.learn-button {
  background-color: #006ce4;
  border-color: #006ce4;
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
.icon {
  height: 70px;
  width: 70px;
  margin-left: -20px;
  margin-right: -5px;
}
.author-link {
  color: #006ce4;
  text-decoration: none
}
.user-name {
  color: #006ce4;
}
.user-name:hover {
  text-decoration: none;
}
.test {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -5px
}
.bookmark-icon {
  height: 70px;
  width: 70px;
  cursor: pointer;
}
.bookmark {
  float: right;
}
</style>