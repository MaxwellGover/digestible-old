<template>
	<div class="quiz container">
		<question></question>
	</div>
</template>

<script>

var db = firebase.database();
import store from '../store'
import Question from '../components/Question'
import VueFire from 'vuefire'
import Vue from 'vue'

Vue.use(VueFire)

export default {
	name: 'quiz',
	components: {Question},
	firebase: {
		resources: db.ref('/users/' + store.state.userInfo.uid + '/createdResources/')
	},
	created () {
		var resource = this.resources.map((resource, index) => resource)
		console.log(resource);
		return resource;
	},
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