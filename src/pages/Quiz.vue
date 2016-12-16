<template>
	<div class="quiz container">
		<!--{{$route.params.resourceId}}-->

		<!--<div>-->
		<resource-card :resource="resource" :options="options" style="margin-right: 0"></resource-card>
		<!--</div>-->
		
		<div class="card">
			<form @submit.prevent="checkAnswer"> 
				<!--v-model="selectedAnswer">-->
				<div class="question" v-for="(quiz, quizIndex) in resource.quiz">
					<h1>{{quiz.text}}</h1>
					<div class="form-group" v-for="(option, index) in quiz.options">
						<div class="checkbox">
							<label>
								<!--<input type="checkbox" name="question" v-model="answers[option.text.replace(/\s+/g, '')][index]"/>{{option.text}}-->
								<input type="checkbox" name="question" v-model="answers[quizIndex].answers[index].selected"/>{{option.text}}
								<!--<input type="checkbox" name="question"/>{{option.text}}-->
								{{answers[quizIndex].answers[index].selected}}
							</label>
						</div>
							<!--{{selected[index].selectedAnswer}}-->
							<!--{{answers[quizIndex]}}-->

					</div>
				</div>
				<button type="submit" class="btn btn-primary pull-right">submit</button>
			</form>
		</div>
		<pre>selected answers {{answers}}
{{resource.quiz}}
			<!--{{JSON.stringify(quiz, null, 3)}}-->
		</pre>
	</div>
</template>

<script>

var db = firebase.database();
// import store from '../store'
import ResourceCard from '../components/ResourceCard'
import VueFire from 'vuefire'
import Vue from 'vue'

Vue.use(VueFire)

export default {
	name: 'quiz',
	// firebase: {
	// 	resources: db.ref().child('resources')
	// },
	// firebase: {
	// 	resources: db.ref('/users/' + store.state.userInfo.uid + '/createdResources/'),
	// },
	components: { 
    	ResourceCard, 
	},
	data() {
		let key = this.$route.params.resourceId;
		let resource = this.$store.state.resources[key];
		let answers = resource.quiz.map((question, index) => {
			console.log(question)
			return {
					// question
					id: index,
					answers: question.options.map((option, idx) => {
							return {
								id: idx, // create id based on index in array --> would be better if we would hava a uuid
								selected: false
							};
					})
			};
		});

		// console.log(questionCount, index, quizList.quiz[index])
		console.log(answers, resource.quiz);
		// this.$store.dispatch('checkAnswers', answers);

		return {
			options: {
				lightResource: true // hides quiz link
			},
			resource,
			answers
			// answeredQuestions: answers
		};
	},
	computed: {
		quizRandom() {
			let key = this.$route.params.resourceId;
			let quizList = this.$store.state.resources[key];
			let questionCount = quizList.quiz.length,
			index = parseInt(Math.random() * questionCount);

			return quizList.quiz[index];
		}	
	},
	methods: {
		checkAnswer() {
			console.log('check answers', this.answers, this.$store);
			// console.log('checking answers --> dispatch', this.answeredQuestions);
			// this.$store.dispatch('checkAnswers', this.answeredQuestions);
			// console.log('check answer now', this.$store, this.answers)
			for(let answer of this.answers) {
				console.log('answer', answer);
			}
		}
	}
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