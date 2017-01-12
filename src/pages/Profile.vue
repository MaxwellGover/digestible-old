<template v-if="this.userInfo">
<div>
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="user-info container">
        <img class="profile-pic" :src="userDataPublic.profilePicture" alt="User image">
        <h1 class="user-name">{{userDataPublic.name}}</h1>
      </div>
    </div>
  </div>
    
    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-center">
          <a class="nav-item is-tab" :class="{'is-active': tab['passed']}" style="color: #333" href="#passed" role="tab" data-toggle="tab" @click="tab={};tab['passed']=true">Passed resources</a>
          <a class="nav-item is-tab" :class="{'is-active': tab['created']}" style="color: #333" href="#created" role="tab" data-toggle="tab"  @click="tab={};tab['created']=true">Created resources</a>
        </div>
      </div>
    </nav>

    <!-- Tab panes -->
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="passed">
        <div class="container passed-resources">
          <resource-card v-for="resource in joinedPassedResources" :resource="resource" :passed="passedResources" :showLearn="showLearn" style="align: center"></resource-card>
          <p v-if="!joinedPassedResources">No quizes passed yet.</p>
        </div>
      </div>
      <div role="tabpanel" class="tab-pane" id="created">
        <div class="container created-resources">
          <created-resources :data="joinedResources" :passed="passedResources"></created-resources>
          <p v-if="createdResources.length === 0">No resources created.</p>
        </div>
      </div>
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
      answeredQuestions: [],
      resources: [],
      showLearn: true,
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
  border-radius: 50%;
  height: 120px;
  width: 120px;
}
.user-info {
  display: flex;
  align-items: center
}
.user-name {
  font-size: 32px;
  margin-left: 40px
}
.jumbotron {
  background-color: white;
  margin-bottom: 0px
}
.nav-item {
  color: #333;
}
.nav-item:hover {
  color: #333;
  text-decoration: none
}
.display-name {
  font-size: 28px
}
.passed-resources {
  display: flex;
  flex-direction: column;
  width: 700px;
}
.created-resources {
  width: 700px;
}
</style>