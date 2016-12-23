<template v-if="this.userInfo">
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <img class="profile-pic" :src="userInfo.photoURL" alt="User image">
          </div>
          <div class="col-md-10">
            <h1 class="display-5">{{userInfo.displayName}}</h1>
            <!--{{userInfo}}-->
            <p class="lead"></p>
          </div>
        </div>
      </div>
    </div>
    <h1>Your passed quizes</h1>
    <resource-card v-for="resource in joinedResources" :resource="resource" :passed="passedResources"></resource-card>

    <pre>
      <!--{{JSON.stringify(users, null, 2)}}-->
    </pre>
    <!--{{joinedResources}}-->
    
    <h1>Your created resources</h1>
    <created-resources :data="joinedResources" :passed="passedResources"></created-resources>

    <h1>Your user information:</h1>
    {{userInfo}}
  </div>
</template>

<script>
// var db = firebase.database();
import db, { joinPaths } from '../db'
import store from '../store'
import CreatedResources from '../components/CreatedResources'
import ResourceCard from '../components/ResourceCard'
import { mapState } from 'vuex'

export default {
  name: 'profile',
  firebase: function() {
    return {
      createdResources: db.ref('/users/' + this.$route.params.uid + '/createdResources/'),
      passedResources: db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/passedResources')
      // users: db.ref('/users/')
    }
  },
  created() {
    // this.$firebaseRefs.createdResources.
    this.loadData(); // todo --> check route change
  },
  data() {
    return {
      joinedResources: {},
      joinedPassedResources: {}
    }
  },
  methods: {
    loadData() {
      // console.log('loading', this.$route.params);
      
      // console.log(createdResPath);
      db.ref('resources').on('value', (snapshot) => {
        let resourcesArray = snapshot.val();

        join(this.$firebaseRefs.createdResources, resourcesArray).then((val) => {
          // console.log('joined', val);
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
          let joined = Object.assign({}, resourcesToJoin);
          // console.log('before join', resourcesToJoin);
          Object.keys(resourcesToJoin).forEach((key) => {
              console.log(key); // e.g. key for createdResource
              let arrKeyFound, arrElement;
              console.log('inarray', inputArr);
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

                console.log('not found', key, arrElement); //joined[key]);
                delete joined[key];
              }
            });

            return joined;

          // Object.keys(resourcesToJoin).forEach((key) => {
          //   console.log(key);
          //   db.ref('/resources/' + key).once('value', (resSnap) => {
          //     // console.log(resSnap.val());
          //     let resourceOfUser = resSnap.val();
          //     if (resourceOfUser) {
          //       // resource is defined for user
          //       joined[key] = resourceOfUser;
          //       joined[key]['.key'] = key; //manually added because it's not available in data joined = [-jshdfh: {}, -jsjdf: {}]
          //     }
          //     else {
          //       // remove key if undefined
          //       // Why is this needed?
          //       // There shouldn't be an undefined key because we're requesting it for the current user
          //       // but this could happen if resoure is deleted with-out deleting the key in users/uid/createdResources

          //       console.log('delete', key, joined[key]);
          //       delete joined[key];
          //     }
          //   }, (err) => {
          //     console.log('error', err);
          //   });

          //   this.joinedResources = joined;
          });
        }
      }
    },
    computed: mapState({
        userInfo: state => state.userInfo
        // passedResources: state => state.passedResources
    }),
    components: { 
      CreatedResources,
      ResourceCard
    }
}
</script>

<style>
  .profile-pic {
    height: 40px;
    width: 40px;
    border-radius: 50%
  }
  
  .jumbotron {
    background-color: white;
    margin-bottom: 0px
  }
</style>