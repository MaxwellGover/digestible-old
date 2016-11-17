<!-- 

TODO: 

1. Add ability to add categories

-->

<template>
  <div class="resource-info container">
    <form id="resource-info" v-on:submit.prevent="saveToFB">
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
      <button type="submit" class="btn btn-primary" id="next-button" style="float: right; background-color: #ffcc00; border: none">Next</button>
    </form>
  </div>
</template>

<script>
var db = firebase.database();
var resourcesRef = db.ref().child('resources');
import store from '../store'
import { mapState } from 'vuex'

export default {
  name: 'resource-info',
  computed: mapState({
      userInfo: state => state.userInfo
  }),
  data () {
    return {
      resource: {
        type: '',
        title: '',
        url: '',
        description: '',
        timesPassed: 0,
        authorName: this.$store.state.userInfo.displayName,
        authorImage: this.$store.state.userInfo.photoURL,
        authorId: this.$store.state.userInfo.uid
      }
    }
  },
  methods: {
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
      this.resource.url = ''

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