import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var db = firebase.database();
var auth = firebase.auth();

const store = new Vuex.Store({
  state: {
    userInfo: {},
    users: {},
    resources: [],
    postKey: ''
  },
  getters: {
    resources: state => state.resources,
    users: state => state.users,
    userInfo: state => state.userInfo
  },
  actions: {
    watchResources (context) {
      var resourcesRef = db.ref().child('resources');
      resourcesRef.on('value', snapshot => {
        context.commit('mutateResources', snapshot.val());
      });
    },
    watchUsers (context) {
      var usersRef = db.ref().child('users');
      usersRef.on('value', snapshot => {
        context.commit('mutateUsers', snapshot.val());
      });
    },
    watchUserInfo (context) {
      auth.onAuthStateChanged( user => {
        if (user) {
          context.commit('mutateUserInfo', user)
        }
      }) 
    },
    watchSignIn (context) {
      if (!auth.currentUser) {
          console.log("Signing in...");
          var provider = new firebase.auth.GoogleAuthProvider();
          auth.signInWithPopup(provider).then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // Update userInfo state
          context.commit('mutateSignIn', user);
          // Set a user in firebase
          var uid = user.uid;
          db.ref('users/' + user.uid).set({
              name: user.displayName,
              email: user.email,
              profilePicture : user.photoURL,
          })
          // ...
          }).catch( error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
           // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          });
      } else {
          console.log('Signing out...');
          auth.signOut();      
      }
    }
  },
  mutations: {
    mutateResources (state, resources) {
      state.resources.push(resources);
    },
    mutateUsers (state, users) {
      state.users = users;
    },
    mutateUserInfo (state, user) {
      state.userInfo = user
    },
    mutateSignIn (state, user) {
      state.userInfo = user
    }
  }
})

export default store