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
      <button type="button" class="btn btn-primary" id="next-button" v-on:click.prevent="saveToFB">Next</button>
    </form>

    <!--{{resource}}-->
  </div>
</template>

<script>
// var db = firebase.database();
import db from '../db'
import store from '../store'
import { mapState } from 'vuex'
import Vue from 'vue'
import router from '../router'

export default {
  name: 'resource-info',
  computed: mapState({
      userInfo: state => state.userInfo
  }),
  firebase() {
    if ( !this.$route.params.resourceId ) return; // no route param
		
    return {
			resource: {
				source: db.ref('resources/' + this.$route.params.resourceId),
				asObject: true
			}
		};
	},
  // firebase: {
  //     resources: db.ref().child('resources')
  //     // users: db.ref().child('users')
  // },
  data () {
    // console.log('resource to display', this.$route.params.key, this.$firebaseRefs);
    // let key = this.$route.params.resourceId;
		// let resource = this.$store.state.resources[key];

    let emptyResource = {
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
    };

    return {
      resource: this.resource || emptyResource
    };
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
      // console.log('saving', newPostKey);
      var newPostKey = db.ref('resources').push().key;
      this.$store.state.postKey = newPostKey;
      var updates = {};

      updates['/resources/' + newPostKey] = Object.assign({}, this.resource);
      updates['/users/' + this.$store.state.userInfo.uid + '/createdResources/' + newPostKey] = true; //this.resource;

      // console.log('updating', updates);


      this.resource.title = '',
      this.resource.type = '',
      this.resource.desc = '',
      this.resource.url = '',
      this.resource.tags = []

      console.log("Saving resource data...")
      
      // Clear inputs before return statement without losing them?  
      db.ref().update(updates);

      // navigate to create route by pushing to router
      router.push('create');
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
  background-color: #4e30f9; 
  border: none;
  border-radius: 2px;
}
</style>