<template>
	<div class="quiz container">
	
	</div>
</template>

<script>

var db = firebase.database();
import store from '../store'
import VueFire from 'vuefire'
import Vue from 'vue'

Vue.use(VueFire)

export default {
	name: 'quiz',
	firebase: {
		resources: db.ref('/users/' + store.state.userInfo.uid + '/createdResources/')
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