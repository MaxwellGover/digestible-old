import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

var db = firebase.database();
var auth = firebase.auth();

export const actions = {
    watchResources ({commit}) {
        var resourcesRef = db.ref().child('resources');
        resourcesRef.on('value', snapshot => {
            commit('mutateResources', snapshot.val());
        });
    },
    watchUsers ({commit}) {
        var usersRef = db.ref().child('users');
        usersRef.on('value', snapshot => {
            commit('mutateUsers', snapshot.val());
        });
    },
    watchUserInfo ({commit}) {
        auth.onAuthStateChanged( user => {
            if (user) {
                commit('mutateUserInfo', user)
            }
        }) 
    },
    watchSignIn ({commit}) {
        console.log('watch sign in', auth.signOut);
        if (!auth.currentUser) {
            console.log("Signing in...");
            var provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // Update userInfo state
                commit('mutateSignIn', user);
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
            
            auth.signOut().then(() => {
                console.log('logged out');
                commit('mutateSignIn', {}); // clear user
            });     
        }
    }
}