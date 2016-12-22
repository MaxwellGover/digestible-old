<template>
	<div class="quiz container">
		<resource-card :resource="resource" :passed="passedResources[resource['.key']]" :options="options" style="margin-right: 0"></resource-card>
		
		<flash-card :score="score" :visible="submitted"></flash-card>
		{{passedResources}}
		<div class="card">
			<form @submit.prevent="submitQuiz"> 
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
			// passedResource: {}
		};
	},
	// created() {

	// 	this.$firebaseRefs['passedResource'] = db.ref('users/' + this.$store.state.userInfo.uid + '/passedResources/' + this.$route.params.resourceId);
	// },
	computed: {
		...mapState({
			answers: state => state.quiz.answeredQuestions,
			submitted: state => state.quiz.submittedStatus,
			selectedCount: state => state.quiz.result.selectedCount,
			result: state => state.quiz.result,
			passedResources: state => state.passedResources
		}),
		score() {
			if ( this.resource.quiz === undefined ) return; // not sure if there is a better way of catching the reload issue at quiz route but this is working.

			// console.log('score', this.$store.state, this.resource);
			let isAnswer = (option) => option.isAnswer===true;
			let totalCorrectAnswers = 0;
			this.resource.quiz.forEach((question) => {
				totalCorrectAnswers += question.options.filter(isAnswer).length;
			});
			// let selected = this.$store.state.quiz.result.selectedCount;
			let selected = this.selectedCount;
			let incorrectCount = (selected > totalCorrectAnswers) ? selected - totalCorrectAnswers: 0; // do we need to calculate if not enough answers?
			let correctCount = this.result.correctIds.length;

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
	watch: {
		selectedCount: function(val) {
			console.log('changed selection', val);
			// this.$store.commit('resetForm');
			// this.score = {
			// };
		}
	},
	methods: {
		// ...mapMutations(['displayAnswers'])
		submitQuiz() {

			this.$store.commit('displayAnswers');

			this.$nextTick(function () {
				// delay to next tick, so we have lates computed values
				console.log(this.score);
				if (this.score.amount == this.score.total) {
					// 100% answer
					// Push specific resource object to Firebase under `/users/ ` + userInfo.uid + ` /passedResources` node ONCE score reaches 100% on submit. 
					// console.log('100% answer', this.$store.state.userInfo.uid)
					// let passedKey = db.ref('resources').push().key;
					let update = Object.assign({}, 
					{
						timesPassed: this.resource.timesPassed++,
					});

					delete update['.key'];

					db.ref('users/' + this.$store.state.userInfo.uid + '/passedResources/' + this.resource['.key']).update(update);
					// console.log(this.resource.timesPassed);
					// update times passed if all questions answered or score = 100%
					// --> all questions answered info not available yet.
					// this.$firebaseRefs.resource.child('timesPassed').set(this.resource.timesPassed++); // ?! need to store it per user!!
				}
			});
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