import Firebase from 'firebase'
import Vue from 'vue'

import config from '../config' // moved firbaseconfig to conf/index.js (could be different for production or development)

// console.log('db init', config.firebaseConfig);


// const config = {
//     apiKey: "AIzaSyAdSLXcIrAp_xXr6T9APC1MVU9pAQ8VsHA",
//     authDomain: "digestible-159a3.firebaseapp.com",
//     databaseURL: "https://digestible-159a3.firebaseio.com",
//     storageBucket: "digestible-159a3.appspot.com",
//     messagingSenderId: "1003151956886"
// };

export const firebase = Firebase.initializeApp(config.firebaseConfig);
const db = firebase.database()

// console.log('firebase init');
    
export default db