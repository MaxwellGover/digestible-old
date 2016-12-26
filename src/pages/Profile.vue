<template v-if="this.userInfo">
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <img class="profile-pic" :src="userDataPublic.profilePicture" alt="User image">
          </div>
          <div class="col-md-10">
            <h1 class="display-5">{{userDataPublic.name}}</h1>
            <!--{{userInfo}}-->
            <p class="lead"></p>
            <badge :users="users"></badge>
          </div>
        </div>
      </div>
    </div>
    
    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-center">
          <a class="nav-item is-tab" :class="{'is-active': tab['passed']}" style="color: #f16233" href="#passed" role="tab" data-toggle="tab" @click="tab={};tab['passed']=true">Passed resources</a>
          <a class="nav-item is-tab" :class="{'is-active': tab['created']}" style="color: #f16233" href="#created" role="tab" data-toggle="tab"  @click="tab={};tab['created']=true">Created resources</a>
        </div>
      </div>
    </nav>

    <!-- Tab panes -->
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="passed">
        <div class="user-feed container">
          <resource-card v-for="resource in joinedPassedResources" :resource="resource" :passed="passedResources" style="align: center"></resource-card>
          <p v-if="!joinedPassedResources">No quizes passed yet.</p>
        </div>
      </div>
      <div role="tabpanel" class="user-feed tab-pane" id="created">
        <created-resources :data="joinedResources" :passed="passedResources"></created-resources>
        <p v-if="createdResources.length === 0">No resources created.</p>
      </div>
    </div>

  </div>
</template>

<script>
// var db = firebase.database();
import db, { joinPaths } from '../db'
import store from '../store'
import CreatedResources from '../components/CreatedResources'
import ResourceCard from '../components/ResourceCard'

import Badge from '../components/Badge'
import { mapState } from 'vuex'

export default {
  name: 'profile',
  // firebase: function() {
  //   // console.log('firebase', this.uid, this.userDataPublicRef)
  //   return Object.assign({}, this.userDataPublicRef, this.createdResourcesRef, this.passedResourcesRef);
  // },
  firebase() {
    return {
    };
  },
  computed: {
      ...mapState({
        userInfo: state => state.userInfo,
        users: state => state.users
        // passedResources: state => state.passedResources
      }),
      uid: function() {
        console.log('uid prop', this.$route.params.uid);
        return this.$route.params.uid;
      },
      userDataPublicRef() {
        return { userDataPublic: {
            source: db.ref('/users/').child(this.uid),
            asObject: true
          }
        };
      },
      createdResourcesRef() {
        return { createdResources: { source: db.ref('/users/').child(this.uid).child('createdResources') }};
      },
      passedResourcesRef() {
        return { passedResources: { source: db.ref('/users/').child(this.uid).child('passedResources') }};
      },
  },
  created() {
    this.loadData();
  },
  watch: { // added additionally to created because $route is reactive in vue2.x, so route change will also refresh data
    '$route': 'loadData'
  },
  data() {
    return {
      userDataPublic: {},
      createdResources: [],
      passedResources: [],
      joinedResources: [],
      joinedPassedResources: [],
      resources: [],
      tab: {
        passed: true
      } // active tab
      // userDataPublicRef: '',
      // createdResourcesRef: '',
      // passedResourcesRef: ''
    }
  },
  methods: {
    // checkRefs() {
    //   let prefixURL = '/users/';

    //   Object.keys(this.$firebaseRefs).forEach((refKey)=> {
    //     console.log('ref check', refKey, this.firebaseRefs);
    //     console.log('compare', `${prefixURL}${this.$route.params.uid}/${refKey}`);
    //     // if (prefixURL + this.$route.params.uid + refKey !== this.firebaseRefs[refKey].source)
    //   });
    // },
    isNotEmpty(val) {
      // console.log(val, this);
      return !this.$options.filters.isEmptyObject(val);
    },
    loadData() {
      // console.log('loading', this.$route.params);
      this.$firebaseRefs = Object.assign({}, this.userDataPublicRef, this.createdResourcesRef, this.passedResourcesRef);
      // console.log(this.$firebaseRefs);


      this.$bindAsArray('createdResources', this.$firebaseRefs.createdResources.source);
      this.$bindAsArray('passedResources', this.$firebaseRefs.passedResources.source);
      this.$bindAsObject('userDataPublic', this.$firebaseRefs.userDataPublic.source);


      db.ref('resources').on('value', (snapshot) => {
        let resourcesArray = snapshot.val();
        // console.log(resourcesArray);
        join(this.$firebaseRefs.createdResources, resourcesArray).then((val) => {
          console.log('joined', val);
          this.joinedResources = val;
        });

        join(this.$firebaseRefs.passedResources, resourcesArray).then((val) => {
          this.joinedPassedResources = val;
        })

      });

      // join users/uid/createdResources with resources
      // createdResources is only storing ["resourcId0": true, "resourcId1": true]
      // --> createdResources is loaded by VueFire - on('value') we're loading the resource for each key and
      //     create a joinedResources array
      function join(ref, inputArr) {
        return ref.once('value').then((snapshot) => {
          let resourcesToJoin = snapshot.val();
          // console.log('joining', ref.toString(), resourcesToJoin);

          if (resourcesToJoin == undefined) return undefined; // nothing to join

          let joined = Object.assign({}, resourcesToJoin);
          // console.log('before join', resourcesToJoin);
          Object.keys(resourcesToJoin).forEach((key) => {
              // console.log(key); // e.g. key for createdResource
              let arrKeyFound, arrElement;
              // console.log('inarray', inputArr);
              // inputArr is an array-like object
              arrKeyFound = Object.keys(inputArr).filter((arrKey) => arrKey === key)[0];
              if (arrKeyFound) {
                arrElement = inputArr[arrKeyFound]; // replace key with object --> looks hacky
              }

              if (arrElement) {
                // resource is defined for user
                joined[key] = arrElement;
                joined[key]['.key'] = key; //manually added because it's not available in data joined = [-jshdfh: {}, -jsjdf: {}]
              }
              else {
                // remove key if undefined
                // Why is this needed?
                // There shouldn't be an undefined key because we're requesting it for the current user
                // but this could happen if resoure is deleted with-out deleting the key in users/uid/createdResources

                console.log('not found?!', ref.path.toString(), key, arrElement); //joined[key]);
                delete joined[key];
              }
            });

            return joined;
          });
        }
      }
    },
    components: { 
      CreatedResources,
      ResourceCard,
      Badge
    }
}
</script>

<style scoped>
.profile-pic {
  border-radius: 50%
}
.jumbotron {
  background-color: white;
  margin-bottom: 0px
}
.nav-item:hover {
  color: #f16233
}
.display-name {
  font-size: 28px
}
.user-feed {
  display: flex;
  flex-direction: column;
  align-items: center
}
</style>