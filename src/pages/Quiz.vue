<template>
	<div class="quiz container">
		<!--{{$route.params.resourceId}}-->
		<div>
			<h1>{{quiz.text}}</h1>
			<form v-model="selectedAnswer">
				<div class="form-group" v-for="option in quiz.options">
					<input type="radio" name="question"   v-bind:true-value="true"
 	 					v-bind:false-value="false" 
  						v-model="option.isAnswer"/>{{option}}
				</div>
			</form>
		</div>
		<pre>
			{{JSON.stringify(quiz, null, 3)}}
		</pre>
	</div>
</template>

<script>

var db = firebase.database();
// import store from '../store'
import VueFire from 'vuefire'
import Vue from 'vue'
import { mapGetters } from 'vuex'

Vue.use(VueFire)

export default {
	name: 'quiz',
	// firebase: {
	// 	resources: db.ref().child('resources')
	// },
	// firebase: {
	// 	resources: db.ref('/users/' + store.state.userInfo.uid + '/createdResources/'),
	// },
	data() {
		let key = this.$route.params.resourceId;
		let quizList = this.$store.state.resources[key];
		let questionCount = quizList.quiz.length,
			index = parseInt(Math.random() * questionCount);

		console.log(questionCount, index, quizList.quiz[index])
		
		return {
			quiz: quizList.quiz[index]
		};
	},
	// computed: {
	// 	quiz() {
	// 		let key = this.$route.params.resourceId;
	// 		let quizList = this.$store.state.resources[key];
	// 		let questionCount = this.quizList.quiz.length,
	// 			index = parseInt(Math.random() * questionCount);

	// 		console.log(questionCount, index, quizList.quiz[index])
	// 		return quizList.quiz[index];
	// 	}
	// }
	// computed: {
	// 	getQuizByKey(key) {
	// 		console.log('get quiz', this.$store.state, key);
	// 		for (let r in state.resources) {
	// 			console.log(r.key, key, r);
	// 			if (r.key === key) {
	// 				return r;
	// 			}
	// 		}
	//   	}
	// }
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