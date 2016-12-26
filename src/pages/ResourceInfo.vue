<!-- Add option for authors to write in a description of the answer --> 
<template>
    <!-- Quiz container -->
    <div class="box container" style="width: 60%; margin-top: 60px">
      <!-- Form -->
      <form id="resource-info">
        <!-- Resource type dropdown -->
        <label class="label">What type of resource is this quiz for?</label>
        <p class="control">
          <span class="select is-medium">
            <select id="type" v-model="resource.type">
              <option value="article">An online article</option>
              <option value="book">A chapter in a book</option>
              <option value="video">An online video</option>
              <option value="podcast">A podcast</option>
            </select>
          </span>
        </p>
        <!-- Resource title input -->
        <label class="label" style="margin-top: 20px">Resource title</label>
        <p class="control">
          <input class="input is-medium" type="text" v-model="resource.title">
        </p>
        <small>Enter the title of your resource.</small>
        <!-- Resource URL input -->
        <label class="label" style="margin-top: 20px">Resource URL</label>
        <p class="control">
          <input class="input is-medium" type="url" v-model="resource.url">
        </p>
        <small>Copy and paste the url to your resource above.</small>
        <!-- Resource description text area -->
        <label class="label" style="margin-top: 20px">Resource description</label>
        <p class="control">
          <textarea class="textarea is-medium" v-model="resource.description"></textarea>
        </p>
        <small>Optionally add a short description of what your resource is about.</small>
        <!-- Topics input -->
        <label class="label" style="margin-top: 20px">Topics</label>
        <p class="control">
          <input class="input is-medium" type="text" placeholder="front-end development" @keyup.enter="addTag" v-model="resource.text">
        </p>
          <span class="tag is-info is-medium" v-for="(tag, index) in resource.tags" style="margin-top: 10px; margin-bottom: 10px; margin-right: 5px">
          {{tag.text | capitalize}}
          <button class="delete is-small" @click="handleDelete(index)"></button>
          </span><br>
          <small>Add some topics to help users find your resource.</small>
          <button type="button" v-on:click.prevent="deleteResource" v-if="isOwner || DEBUG_EN_DELETE ">Delete resource</button>
        <button type="button" class="button is-info" v-on:click.prevent="saveToFB">Next</button>
      
      </form> <!-- End form -->
      
      <modal ref="confirmModal" title="Confirm delete" :ok="confirmedDelete" :cancel="cancel">
      Are you sure to delete resource <strong>{{resource.title}}</strong>?
      </modal>
    </div> <!-- End form container -->

</template>

<script>

// var db = firebase.database();
import db from '../db'
import { mapState } from 'vuex'
import Vue from 'vue'
import router from '../router'
import modal from '../components/Modal'

export default {
  name: 'resource-info',
  components: {
    modal
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    isOwner() {
      return this.resource.authorId === this.$store.state.userInfo.uid;
    }
  },
  firebase() {
    if ( !this.$route.params.resourceId ) return; // no route param
		console.log('db', db);
    console.log('firebase', this.$route.params.resourceId);
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
    // console.log('data', this.$store.state.userInfo)
    
    return this.loadData();
  },
  filters: {
    capitalize: function (value) {
      if (!value) return;
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  watch: {
		'$route': 'loadData'
	},
  methods: {
    loadData() {
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
        resource: this.resource || emptyResource,
        DEBUG_EN_DELETE: false // if true, can delete every post --> later this could be stored in a user_role collection for each user.
      };
    },
    confirmedDelete() {
      // console.log('ok');

      db.ref('/users/' + this.$store.state.userInfo.uid + '/createdResources/' + this.resource['.key']).remove(); // remove from createdResources
      this.$firebaseRefs.resource.remove();

      // navigate to home
      router.push('/');
    },
    cancel() {
      console.log('cancel');
    },
    // TODO: Figure out why tags are overwriting each other.
    addTag: function () {
      var tags = this.resource.tags;
      console.log(tags);
      tags.push({
        id: this.resource.tags.length + 1,
        text: this.resource.text
      });
      this.resource.text = '';
    },
    handleDelete: function(index) {
        var tags = this.resource.tags;
        tags.splice(index, 1);
    },
    deleteResource() {
      // console.log('delete', this.$refs, this.$refs.confirmModal.$el);

      this.$store.commit('modalToggle', this.$refs.confirmModal.$el); 
    },
    saveToFB () {
      console.log('saving', newPostKey);
      var newPostKey = this.resource['.key'] || db.ref('resources').push().key; // only create new key if undefined
      // this.$store.state.postKey = newPostKey; // mutates stated --> move to store and use commit!!!
      this.$store.commit('addPostKey', newPostKey);
      var updates = {};

      delete this.resource['.key']; // remove key before storing (if any) --> was a problem with updating existing resources

      // console.log('resource', this.resource);
      updates['/resources/' + newPostKey] = Object.assign({}, this.resource);
      updates['/users/' + this.$store.state.userInfo.uid + '/createdResources/' + newPostKey] = true; //this.resource;

      // console.log('updating', updates);
      console.log("Saving resource data...", updates)
      
      db.ref().update(updates);

      // TODO: Find out how to clear inputs before the return statement.  

      this.resource.title = '',
      this.resource.type = '',
      this.resource.desc = '',
      this.resource.url = '',
      this.resource.tags = []

      // navigate to create route by pushing to router
      router.push('/create');
    }
  }
};

</script>

<style scoped>

.button {
  float: right; 
  background-color: #006ce4; 
  border: none;
  border-radius: 2px;
  padding: 15px;
  margin-top: 20px;
}

.notification {
  padding: 40px;
  margin-bottom: 0px;
}

.notification-text {
  font-size: 16px;
}

.input:focus {
  border-color: #006ce4;
}

.textarea:focus {
  border-color: #006ce4;
}

select:focus {
  border-color: #006ce4;
}

small {
  font-size: 12px;
}

</style>