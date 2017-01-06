// var db = firebase.database();
import Firebase from 'firebase'
import db, { firebase } from '../db'
import router from '../router'
var auth = firebase.auth(); //firebase.auth();

function signIn(commit) {
  console.log("Signing in...");
  var provider = new Firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // Update userInfo state
    commit('mutateSignIn', user);
    // Set a user in firebase
    var uid = user.uid;

    db.ref('users/' + uid).once('value').then((snapshot) => {
      let fbUser = snapshot.val();

      Object.assign(fbUser, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        isExpert: false
      });

      db.ref('users/' + user.uid).set(fbUser); // update user
    })
    // ...
  }).catch(error => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

export const actions = {
  updatePassedResources({commit}, data) {
    commit('mutatePassedResources', data);
  },
  updateAnsweredQuestions({commit}, answeredQuestions) {
    commit('mutateAnsweredQuestions', answeredQuestions);
  },
  updateStudyStatus({commit}, status) {
    commit('mutateStudyStatus', status);
  },
  checkAuth({commit}) {
    // console.log('checkAuth', auth.currentUser, this)
    // if (!auth.currentUser && !window.localStorage.get('vuex').userInfo) {
    let vuexLocal = JSON.parse(window.localStorage.getItem('vuex')) // would be better if we could read from vuex store but localStorage is also OK
    let user = vuexLocal ? vuexLocal.userInfo : {}

    // console.log('localstorage', user);
    if (Object.keys(user).length === 0 && user.constructor === Object) {
      signIn(commit)
    }
  },
  watchSignIn({commit}) {
    console.log('watch sign in', auth.signOut);
    if (!auth.currentUser) {
      signIn(commit)
    } else {
      console.log('Signing out...');

      auth.signOut().then(() => {
        console.log('logged out');
        commit('mutateSignIn', {}); // clear user
      });

      router.push('/') // goto home
    }
  }
}