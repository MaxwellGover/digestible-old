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
        <a v-bind:href="resource.url" class="button is-light is-medium" target="_blank" v-else>
          Go to resource
        </a>
        <button type="button" class="button is-light is-medium" @click.prevent="$router.push('/info/' + $route.params.resourceId)" v-if="!showLearn && isOwner">Edit resource</button>
        <!-- remove below just for faster deleting during testing-->
        <!--<button type="button" class="button is-danger is-medium" @click.prvent="remove(resource)"  v-if="isOwner">Remove</button> -->
      </div>
    </div>
    
    <footer class="card-footer">
      <div class="container">
        <div class="columns">
          <div class="column is-half">
            <p style="font-size: 16px; margin-top: 5px"><i class="fa fa-thumbs-o-up fa-3x" aria-hidden="true"></i>{{resource.timesPassed}}</p>
          </div>
          <div class="column is-half">
            <span class="is-pulled-right">{{creationDate}}</span>
            <i v-if="showShare" @click="showModal()" class="share fa fa-share-alt fa-3x" aria-hidden="true"></i>
          </div>
      </div>
    </footer>

</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import moment from 'moment'
var VueFire = require('vuefire')
Vue.use(VueFire)
import db from '../db'

const DATE_FORMAT = 'dddd, MMMM Do YYYY, hh:mm'

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
    showShare: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
    isOwner() {
      return this.resource.authorId === this.$store.state.userInfo.uid;
    },
    creationDate () {
      // show up to 2 days ago then shows UTC date
      let resultText = ''
      const prefixText = 'created ';
      if (this.resource.createdAt) {
        let createdMoment = moment(this.resource.createdAt || 0);
        // console.log('time ago', this.resource.createdAt, createdMoment);
        let time = createdMoment < moment() ? moment() : createdMoment // force timeAgo --> avoids in a few seconds display (we can be out of sync. by a few ms)
        resultText = createdMoment.isBefore(moment.duration(moment().subtract(3, 'days').valueOf())) ? 
          prefixText + createdMoment.utc().format(DATE_FORMAT) : 
          prefixText + createdMoment.from(time)
      }

      return resultText; // if no date --> show nothing
    }
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
    remove(resource) {
      this.$emit('remove', resource);
    }
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