<template>
	
</template>

<script>
import Vue from 'vue'
import VueFire from 'vuefire'
import { mapState } from 'vuex'

// var db = firebase.database();
import db from '../db'

export default {
  computed: mapState({
    userInfo: state => state.userInfo,
  }),
  firebase() {
    return {
      answeredQuestions: db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/answeredQuestions'),
    }
  },
}
</script>

<style>
	
</style>