<template>
	<div class="quiz container">
		<div class="question">
			<h5 class="question">This is a question</h5>
			<input type="checkbox" aria-label="Checkbox for following text input" style="margin-right: 10px"> For each option render one of these
			</br>
			<input type="checkbox" aria-label="Checkbox for following text input" style="margin-right: 10px"> For each option render one of these
			</br>
			<input type="checkbox" aria-label="Checkbox for following text input" style="margin-right: 10px"> For each option render one of these
			</br>
			<input type="checkbox" aria-label="Checkbox for following text input" style="margin-right: 10px"> For each option render one of these
		</div>
	</div>
</template>

<script>

// TODO: WHY IS userInfo.uid UNDEFINED!!!!?????

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
	created () {
		console.log(store.state.userInfo.uid)
	},
	components: {},
	firebase: {
		quiz: db.ref('/users/' + store.state.userInfo.uid + '/createdResources/' + store.state.postKey + '/quiz/')
	}
}
</script>

<style>
	.quiz {
		margin-top: 60px;
		padding: 40px;
		width: 800px;
		background-color: white
	}
</style>