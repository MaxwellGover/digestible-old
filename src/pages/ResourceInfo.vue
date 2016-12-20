<template>
  <div class="resource-info container">
    <form id="resource-info">
      <div class="form-group">
        <label for="type">This quiz is for (required)</label>
        <select id="type" class="form-control" v-model="resource.type">
          <option value="article">An online article</option>
          <option value="book">A chapter in a book</option>
          <option value="video">A video</option>
          <option value="podcast">A podcast</option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">Resource title (required)</label>
        <input type="text" class="form-control" id="title" v-model="resource.title">
        <small id="title-help" class="form-text text-muted">Enter the title of your resource.</small>
      </div>
      <div class="form-group">
        <label for="url">Resource link (required)</label>
        <input type="url" class="form-control" id="url" v-model="resource.url">
        <small id="url-help" class="form-text text-muted">Copy and paste the url to your resource.</small>
      </div>
      <div class="form-group">
        <label for="desc">Resource description (optional)</label>
        <textarea class="form-control" id="desc" v-model="resource.description"></textarea>
        <small id="desc-help" class="form-text text-muted">Enter a short description of your resource.</small>
      </div>
      <div class="form-group">
        <label for="categories">Categories (required)</label>
        <input type="text" class="form-control" id="categories" @keyup.enter="addTag" v-model="resource.text">
        <span class="tag is-info is-medium" v-for="(tag, index) in resource.tags" style="margin-top: 10px; margin-bottom: 10px; margin-right: 5px">
        {{tag.text | capitalize}}
        <button class="delete is-small" @click="handleDelete(index)"></button>
        </span>
        <small id="category-help" class="form-text text-muted">Add some categories.</small>
      </div>
      <button type="button" class="btn btn-primary" id="next-button" v-on:click.prevent="saveToFB">Next</button>
    </form>

    <!--{{resource}}-->
  </div>
</template>

<script>
var db = firebase.database();
import store from '../store'
import { mapState } from 'vuex'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default {
  name: 'resource-info',
  computed: mapState({
      userInfo: state => state.userInfo
  }),
  data () {
    // console.log('resource to display', this.$route.params.key, this.$firebaseRefs);

    return {
      resource: {
        type: '',
        title: '',
        url: '',
        description: '',
        timesPassed: 0,
        tags: [],
        text: '',
        authorName: this.$store.state.userInfo.displayName,
        authorImage: this.$store.state.userInfo.photoURL,
        authorId: this.$store.state.userInfo.uid
      }
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
    addTag: function () {
      let tags = this.resource.tags;
      console.log(tags);
      tags.push({
        id: this.resource.tags.length + 1,
        text: this.resource.text
      })
      this.resource.text = ''
    },
    handleDelete: function(i) {
        let tags = this.resource.tags;
        tags.splice(index, 1);
    },
    saveToFB () {
      var newPostKey = db.ref('resources').push().key;
      store.state.postKey = newPostKey;
      var updates = {};
      updates['/resources/' + newPostKey] = this.resource;
      updates['/users/' + store.state.userInfo.uid + '/createdResources/' + newPostKey] = this.resource;

      return db.ref().update(updates);

      // Clear inputs before return statement without losing them?  

      this.resource.title = '',
      this.resource.type = '',
      this.resource.desc = '',
      this.resource.url = '',
      this.resource.tags = []

      console.log("Saving resource data...")
    }
  }
}
</script>

<style scoped>
.resource-info {
  margin-top: 40px;
  width: 700px
}
.btn {
  float: right; 
  background-color: #f16233; 
  border: none;
  border-radius: 2px;
}
</style>