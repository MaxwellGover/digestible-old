<!-- Add option for authors to write in a description of the answer --> 
<template>
    <!-- Quiz container -->
    <div class="box container" style="width: 60%; margin-top: 60px">
      <!-- Form -->
      <form id="resource-info" name="resourceForm" @submit.prevent="saveToFB">
        <!-- Resource type dropdown -->
        <label class="label">What type of resource is this quiz for?</label>
        <p class="control">
          <span class="select is-medium">
            <select id="type" name="resource type" v-model="resource.type" v-validate.initial="resource.type" data-vv-rules="required" :class="{'is-danger': errors.has('resource type') }">
              <option value="article">An online article</option>
              <option value="book">A chapter in a book</option>
              <option value="video">An online video</option>
              <option value="podcast">A podcast</option>
            </select>
          </span>
        </p>
        <p v-show="errors.has('resource type')">{{ errors.first('resource type') }}</p>
        
         <!-- Framwork selection --> 
          <label class="label">For which Framework?</label>
            <p class="frameworks-input control">
              <span class="select is-medium">
                <select v-model="resource.framework">
                  <option value="angular">Angular</option>
                  <option value="angular">Ember</option>
                  <option value="angular">Polymer</option>
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                </select>
              </span>
            </p>
        
        <!-- Resource title input -->
        <label class="label" style="margin-top: 20px">Resource title</label>
        <p class="control">
          <input class="input is-medium" name="title" type="text" v-model="resource.title" v-validate.initial="resource.title" data-vv-rules="required|min:5" :class="{'is-danger': errors.has('title') }">
        </p>
        <small>Enter the title of your resource.</small>
        <p v-show="errors.has('title')">{{ errors.first('title') }}</p>
        <!-- Resource URL input -->
        <label class="label" style="margin-top: 20px">Resource URL</label>
        <p class="control">
          <input class="input is-medium" name="url" data-vv-as="resource url" type="text" v-model="resource.url" v-validate.initial="resource.url" data-vv-rules="url:google.com" data-vv-delay="1000" :class="{'is-danger': errors.has('url') }">
        </p>
        <small>Copy and paste the url to your resource above.</small>
        <p v-show="errors.has('url')">{{ errors.first('url') }}</p>
        <!-- Resource description text area -->
        <label class="label" style="margin-top: 20px">Resource description</label>
        <p class="control">
          <textarea class="textarea is-medium" v-model="resource.description"></textarea>
        </p>
        <small>Optionally add a short description of what your resource is about.</small>
        <!-- Topics input -->
        <label class="label" style="margin-top: 20px">Topics</label>

        <!--typeahead & tags -->
          <!--todo userRole isAdmin not implemented yet. Add a collection userRoles/uid/role-value='isAdmin' so we can secure this with firebase & join the role to userInfo during loading-->
          <input-tag
                :new-tags-allowed="userInfo.isAdmin"
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
        <button type="submit" class="button is-info">Next</button>
      
      </form> <!-- End form -->
      
      <modal ref="confirmModal" title="Confirm delete" :ok="confirmedDelete" :cancel="cancel">
      Are you sure to delete resource <strong>{{resource.title}}</strong>?
      </modal>
      <!--<pre>{{resource | json}}
fields
{{fields.dirty()}}</pre>-->
    </div> <!-- End form container -->

</template>

<script>
// import inputTag from 'vue-input-tag'
// var db = firebase.database();
// import Firebase from 'firebase'
import _ from 'lodash'
import db from '../db'
import { mapState } from 'vuex'
import Vue from 'vue'
import router from '../router'
import modal from '../components/Modal'
import inputTag from '../components/InputTag'


function defaultData(store) {
  let emptyResource = {
      type: '',
      title: '',
      url: '',
      description: '',
      timesPassed: 0,
      framework: '',
      text: '',
      authorName: store.state.userInfo.displayName,
      authorImage: store.state.userInfo.photoURL,
      authorId: store.state.userInfo.uid,
      // createdAt: Firebase.database.ServerValue.TIMESTAMP, // --> adds create date to early, better add it after createQuiz click
  };

  return {
    // queryTypeahead: '',
    resource: emptyResource,
    submitted: false,
    unwatchResource: undefined,
    // newQuiz: false,
    DEBUG_EN_DELETE: true // if true, can delete every post --> later this could be stored in a user_role collection for each user.
  };
}

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
      userInfo: state => state.userInfo,
      resource: state => state.resource
    }),
    isOwner() {
      return this.resource.authorId === this.$store.state.userInfo.uid;
    }
  },
  firebase: {
    // moved to loadData
	},
  created() {
    // console.log('created');
    this.$validator.attach('global', ''); // no validation just fieldBag global used --> needed for fields with-out validation
    
    this.loadData();
    // testing queries below for deleting wrong resources
    // var ref = db.ref('resources').once('value').then((snap) => {
    //   console.log(snap.val());
      
    // });
    // var ref = db.ref('resources/');  // just for bulk deleting not needed data
    // ref.orderByChild('title').child('Another test of keep-alive!!!!').once('value').then((snap) => {
    //   console.log('snap', snap.val());
    //   // var updates = {};
    //   // snap.forEach(function(child){
    //   //       updates[child.key] = null;
    //   // });
    //   // ref.update(updates);
    // });
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    console.log(this.fields.dirty()); // form is dirty
    if (!this.submitted && this.fields.dirty()) {
      let stay = confirm('Warning! If you navigate away from this route it is possible to lose data. Leave any way?');
      console.log(stay);
      next(stay);
    } else {
      next();
    }
  },
  data () {
    // db.ref('tags').remove(); // testwise clear all tags
    return defaultData(this.$store);
  },
  filters: {
    capitalize: function (value) {
      if (!value) return;
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    resetData() {
      if (this.unwatchResource) this.unwatchResource();
      this.$store.dispatch('updateResource', defaultData(this.$store).resource); // clear resource (if we have a resourceId in route, otherwise we need the data for new form reload)
      this.clearErrors();
    },
    clearErrors() {
      this.$nextTick(() => {
        this.fields.reset();
        this.errors.clear();
      });
    },
    loadData() {
        const updateResourceInStore =  _.debounce(() => { // works --> but it always runs twice because resource is a computed prop. (other approach with eventlistener on inputs = same behaviour)
            console.log('debounced update');
            this.fields.setDirty('global', true); // flag for not validated fields
            // this.$store.dispatch('updateResource', this.resource);
          }, 1000);

        const createResourceWatch = () => this.$watch('resource', updateResourceInStore, {deep: true});

        this.resetData();

        if (this.$route.params.resourceId) {
          const fbResourceRef = this.$firebaseRefs['fbResource'] = db.ref('resources/' + this.$route.params.resourceId);
          this.$bindAsObject('fbResource', fbResourceRef);

          this.$firebaseRefs.fbResource.once('value').then((snapshot) => {
            // const resource = Object.assign({}, this.resource, snapshot.val());
            console.log('firebase', snapshot.val());
            const resource = snapshot.val();
            this.$store.dispatch('updateResource', resource);
            this.clearErrors();
            
            this.unwatchResource =  createResourceWatch(); // watch needed to update store, so it is persisted in localstorage later --> reloading with-out losing data possible. (used route guard at the moment)
          });
        }
        else {
          this.unwatchResource = createResourceWatch(); // needed twice because it would be triggered to early if not in then callback
        }

        this.$watch('$route', this.loadData); // this.resetData);
    },
    confirmedDelete() {
      // console.log('ok');

      db.ref('/users/' + this.$store.state.userInfo.uid + '/createdResources/' + this.resource['.key']).remove(); // remove from createdResources
      this.$firebaseRefs.fbResource.remove();

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
    deleteResource() {
      this.$store.commit('modalToggle', this.$refs.confirmModal.$el); 
    },
    /*
    tagChange(data) {
      let tagsRef = db.ref('tags');
      let key = data[0];
      // console.log('tag data', data);
      // console.log('type of string', typeof data[0] === 'string');
      // see fetch for getting typeahead data from firebase
      // data = ['string'] --> if not in firebase
      // data = [{.key, ...}] --> object if in firebase
      // if ( typeof data[0] === 'string' ) {
        // test if string is in db
        // tagsRef.orderByChild('name').equalTo(data[0]).once('value').then((snap) => {
      if (data[0]) {
          data[0] = data[0].replace(/[\.\#\$\[\]]/g, '-'); // replace invalid key chars with hyphen --> these chars are not allowed in keys
          // console.log(data);
        tagsRef.child(data[0]).once('value').then((snap) => {
          let tagValue = snap.val();
          let newKey = data[0]; //tagsRef.push().key;

          // console.log('tagValue', tagValue);
          if (!tagValue) {
            // not in db --> add it
            let newData = {
              [newKey]: {
                // name: data[0],
                authorId: this.userInfo.uid
              }
            };
            // console.log('update tags', newData);
            tagsRef.update(newData);
          }
          else {
            console.log('tag exists');
          }

          key = newKey;
        });
      }

      // console.log('key', key);
      this.resource.tags = this.resource.tags || []; // create tags if undefined

      if (!this.resource.tags.includes(key)) {
        this.resource.tags.push(key);
      }
      // typeahead --> check tags in firebase show autocomplete
      // if new key required --> only key saved in resource and in global tags collection
    },
    */
    saveToFB () {
      this.$validator.validateAll();

      // console.log('validator', this.errors);
      if (!this.errors.any()) {
        var newPostKey =  this.$route.params.resourceId || db.ref('resources').push().key;
        // this.newQuiz = false;
        this.submitted = true;
        console.log('saving', newPostKey, this.$route.params.resourceId);
        this.$store.commit('addPostKey', newPostKey);
        var updates = {};

        // delete this.resource['.key']; 

        updates['/resources/' + newPostKey] = Object.assign({}, this.resource);
        updates['/users/' + this.$store.state.userInfo.uid + '/createdResources/' + newPostKey] = true;
        updates['/frameworks/' + this.framework + newPostKey] = Object.assign({}, this.resource);

        console.log("Saving resource data...", updates)
        
        db.ref().update(updates);

        // navigate to create route by pushing to router
        router.push('/create/');
      }
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