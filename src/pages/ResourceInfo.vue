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

        <!--tag input-->
        <!--<input-tag 
                :tags="resource.tags"
                :on-change="resourceChange"></input-tag>-->

        <!--typeahead-->

          <input-tag
                :tags="resource.tags"
                :on-change="tagChange"
                />

        <!--<p class="control">-->
          <!--<input class="input is-medium" type="text" placeholder="front-end development" @keyup.enter="addTag()" v-model="resource.text">-->
        <!--</p>-->
          <!--<span class="tag is-info is-medium" v-for="(tag, index) in resource.tags" style="margin-top: 10px; margin-bottom: 10px; margin-right: 5px">
          {{tag.text | capitalize}}
          <button class="delete is-small" @click="handleDelete(index)"></button>
          </span><br>-->
          <br/>
          <small>Add some topics to help users find your resource.</small>
          <button type="button" v-on:click.prevent="deleteResource" v-if="isOwner || DEBUG_EN_DELETE ">Delete resource</button>
        <button type="button" class="button is-info" v-on:click.prevent="saveToFB">Next</button>
      
      </form> <!-- End form -->
      
      <modal ref="confirmModal" title="Confirm delete" :ok="confirmedDelete" :cancel="cancel">
      Are you sure to delete resource <strong>{{resource.title}}</strong>?
      </modal>
      <pre>{{resource | json}}</pre>
    </div> <!-- End form container -->

</template>

<script>
// import inputTag from 'vue-input-tag'
// var db = firebase.database();
import db from '../db'
import { mapState } from 'vuex'
import Vue from 'vue'
import router from '../router'
import modal from '../components/Modal'
import inputTag from '../components/InputTag'

export default {
  name: 'resource-info',
  // extends: VueTypeahead,
  // mixins: [
  //   VueTypeahead
  // ],
  components: {
    modal,
    inputTag
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
  data () {
    // db.ref('tags').remove(); // testwise clear all tags
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
        // queryTypeahead: '',
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
    // addTag: function () {
    //   var tags = this.resource.tags;
    //   console.log(tags);
    //   tags.push({
    //     id: this.resource.length + 1,
    //     text: this.resource.text
    //   });
    //   this.resource.text = '';
    // },
    // handleDelete: function(index) {
    //     var tags = this.resource.tags;
    //     tags.splice(index, 1);
    // },
    // deleteResource() {
    //   this.$store.commit('modalToggle', this.$refs.confirmModal.$el); 
    // },
    tagChange(data) {
      let tagsRef = db.ref('tags');
      let key = data[0];
      console.log('tag data', data);
      // console.log('type of string', typeof data[0] === 'string');
      // see fetch for getting typeahead data from firebase
      // data = ['string'] --> if not in firebase
      // data = [{.key, ...}] --> object if in firebase
      // if ( typeof data[0] === 'string' ) {
        // test if string is in db
        // tagsRef.orderByChild('name').equalTo(data[0]).once('value').then((snap) => {
      if (data[0]) {
        tagsRef.child(data[0]).once('value').then((snap) => {
          let tagValue = snap.val();
          let newKey = data[0]; //tagsRef.push().key;
          
          console.log('tagValue', tagValue);
          if (!tagValue) {
            // not in db --> add it
            let newData = {
              [newKey]: {
                // name: data[0],
                authorId: this.userInfo.uid
              }
            };
            console.log('update tags', newData);
            tagsRef.update(newData);
            // tagsRef.update({
            //   [newKey]: newData
            // });
          }
          else {
            console.log('tag exists');
          }
          // else {
          //   console.log('tag in db', snap.key);
          //   newKey = snap.key;
          // }
          key = newKey;
        });
      }

      console.log('key', key);
      if (!this.resource.tags.includes(key)) {
        this.resource.tags.push(key);
      }
      // typeahead --> check tags in firebase show autocomplete
      // if new key required --> only key saved in resource and in global tags collection
    },
    saveToFB () {
      var newPostKey = this.resource['.key'] || db.ref('resources').push().key;
      console.log('saving', newPostKey);
      this.$store.commit('addPostKey', newPostKey);
      var updates = {};

      delete this.resource['.key']; 

      updates['/resources/' + newPostKey] = Object.assign({}, this.resource);
      updates['/users/' + this.$store.state.userInfo.uid + '/createdResources/' + newPostKey] = true; 

      console.log("Saving resource data...", updates)
      
      db.ref().update(updates);

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