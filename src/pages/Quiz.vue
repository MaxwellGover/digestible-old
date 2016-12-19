<template>
	<div class="quiz container">
		<!--{{$route.params.resourceId}}-->
		<!--<div>-->
		<resource-card :resource="resource" :options="options" style="margin-right: 0"></resource-card>
		
		<div v-if="submitted">
			<!--Form submitted.-->
			<flash-card :score="score"></flash-card>
		</div>
		<div class="card">
			<form @submit.prevent="displayAnswers"> 
				<!--v-model="selectedAnswer">-->
				<question v-for="(quiz, quizIndex) in resource.quiz" :quiz="quiz" :quiz-index="quizIndex" :submitted="submitted" :resource="resource"></question>
				<button type="submit" class="btn btn-primary pull-right">submit</button>
			</form>
		</div>
		<!--<pre>selected answers 
checked answers: {{selectedCount}}
{{answers}}
{{resource.quiz}}
		</pre>-->
	</div>
</template>

<script>

var db = firebase.database();
// import store from '../store'
import ResourceCard from '../components/ResourceCard'
import FlashCard from '../components/FlashCard' // display info after submitting the answers
import Question from '../components/Question'

import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'

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
		FlashCard,
		Question
	},
	firebase() {
		return {
			resource: {
				source: db.ref('resources/' + this.$route.params.resourceId),
				asObject: true
			}
		};
	},
	data() {
		// let key = this.$route.params.resourceId;
		// console.log('quiz', this.$store.state.resources[key], key)
		// let resource = this.$store.state.resources[key];

		// this.$store.commit('prepareAnswerList', resource);

		this.$store.commit('resetForm');
		// console.log(questionCount, index, quizList.quiz[index])
		// console.log(answers, resource.quiz);
		// this.$store.dispatch('checkAnswers', answers);

		// console.log('resource', resource);
		return {
			options: {
				lightResource: true // hides quiz link
			},
			// resource: {},
			// submitted: false,
			// answeredQuestions: []
			result: {
				correctIds: [], // store correctly selected answers
				score: 0,
				total: 0
			}
		};
	},
	computed: {
		...mapState({
			answers: state => state.quiz.answeredQuestions,
			submitted: state => state.quiz.submittedStatus,
			selectedCount: state => state.quiz.selectedCount,
			// resource: state => state.resource
			// correctAnswerCount: (state) => state.quiz.result.correctIds.length
		}),
		score() {
			// console.info('score', this.$store.state); //.quiz.resource.quiz);
			let isAnswer = (option) => option.isAnswer===true;
			var sum = 0;
			this.resource.quiz.forEach((question) => {
				console.log('sum. total', question, sum);
				sum += question.options.filter(isAnswer).length;
			});
			let totalCorrectAnswers = sum;
			let selected = this.$store.state.quiz.selectedCount;
			let incorrectCount = (selected > totalCorrectAnswers) ? selected - totalCorrectAnswers: 0; // do we need to calculate if not enough answers?
			let correctCount = this.$store.state.quiz.result.correctIds.length;

			// console.log('totalCorrectAnswers', totalCorrectAnswers);
			// console.info('correct answer, total correct', this.$store.state.quiz.result.correctIds, this.$store.state.quiz.result.correctIds.length, totalCorrectAnswers,  );
			
			// calculate amount = points for correct answers --> incorrect subtracted
			let amount = correctCount - incorrectCount;
			// console.log('correcct / incorrect', correctCount, incorrectCount);

			if (amount < 0) { // limit to 0
				amount = 0;
			}

			return {
				amount,
				total: totalCorrectAnswers // total correct answer count - used to calculated messages
			};
		}
		// ...mapGetters(['submittedStatus']),
		// quizRandom() {
		// 	let key = this.$route.params.resourceId;
		// 	let quizList = this.$store.state.resources[key];
		// 	let questionCount = quizList.quiz.length,
		// 	index = parseInt(Math.random() * questionCount);

		// 	return quizList.quiz[index];
		// }	
	},
	methods: {
		...mapMutations(['displayAnswers'])
		// displayAnswers() {
		// 	this.submitted = true;
		// },
		// resetForm() {
		// 	this.submitted = false;
		// }
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