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
        <h5><span class="tag tag-default" v-for="tag in resource.tags" style="margin: 2px; margin-top: 5px; color: #525252; padding: 10px; background-color: #F0F0F0">{{tag.text}}</span></h5>
        <small id="category-help" class="form-text text-muted">Add some categories.</small>
      </div>
      <button type="button" class="btn btn-primary" id="next-button" v-on:click.prevent="saveToFB" style="float: right; background-color: #ffcc00; border: none">Next</button>
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

<style>
.resource-info {
  margin-top: 40px;
  width: 700px
}
</style>