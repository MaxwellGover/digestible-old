<template>
	<div class="quiz container">
		<resource-card :resource="resource" :options="options" style="margin-right: 0"></resource-card>
		
		<flash-card :score="score" :visible="submitted"></flash-card>
		
		<div class="card">
			<form @submit.prevent="displayAnswers"> 
				<question v-for="(quiz, quizIndex) in resource.quiz" :quiz="quiz" :quiz-index="quizIndex" :submitted="submitted" :resource="resource"></question>
				<button type="submit" class="btn btn-primary pull-right">submit</button>
			</form>
		</div>
	</div>
</template>

<script>

import db from '../db';

import ResourceCard from '../components/ResourceCard'
import FlashCard from '../components/FlashCard' // display info after submitting the answers
import Question from '../components/Question'

import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'

export default {
	name: 'quiz',
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
		// console.log('quiz', this.resource)
		this.$store.commit('resetForm');
		
		return {
			options: {
				lightResource: true // hides quiz link
			}
		};
	},
	computed: {
		...mapState({
			answers: state => state.quiz.answeredQuestions,
			submitted: state => state.quiz.submittedStatus,
			selectedCount: state => state.quiz.result.selectedCount
		}),
		score() {
			if ( this.resource.quiz === undefined ) return; // not sure if there is a better way of catching the reload issue at quiz route but this is working.

			// console.log('score', this.$store.state, this.resource);
			let isAnswer = (option) => option.isAnswer===true;
			let totalCorrectAnswers = 0;
			this.resource.quiz.forEach((question) => {
				totalCorrectAnswers += question.options.filter(isAnswer).length;
			});
			let selected = this.$store.state.quiz.result.selectedCount;
			let incorrectCount = (selected > totalCorrectAnswers) ? selected - totalCorrectAnswers: 0; // do we need to calculate if not enough answers?
			let correctCount = this.$store.state.quiz.result.correctIds.length;

			// calculate amount = points for correct answers --> incorrect subtracted
			let amount = correctCount - incorrectCount;
			
			if (amount < 0) { // limit to 0
				amount = 0;
			}

			return {
				amount,
				total: totalCorrectAnswers // total correct answer count - used to calculated messages
			};
		}
	},
	methods: {
		...mapMutations(['displayAnswers'])
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