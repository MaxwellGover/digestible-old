<template>
	<div class="quiz">
		<div class="question">
			<h4 class="question"></h4>
		</div>
	</div>
</template>

<script>
var db = firebase.database();
import store from '../store'
import { mapState } from 'vuex'
import VueFire from 'vuefire'
import Vue from 'vue'

Vue.use(VueFire)

export default {
	name: 'quiz',
	computed: mapState({
		userInfo: state => state.userInfo
	}),
	components: {},
	firebase: {
		quiz: db.ref('/users/' + store.state.userInfo.uid + '/createdResources/' + store.state.postKey + '/quiz/')
	}
}
</script>

<style>
	
</style>