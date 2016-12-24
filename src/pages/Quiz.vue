<template>
	<div class="quiz container">
		<resource-card :resource="resource" :passed="passedResources" :options="options" style="margin-right: 0"></resource-card>
		
		<flash-card :score="score" :visible="submitted"></flash-card>
		{{passedResources}}

		<br/>
		<hr/>
		{{resourceId}}
		<div class="card">
			<form @submit.prevent="submitQuiz"> 
				<question v-for="(quiz, quizIndex) in resource.quiz" :quiz="quiz" :quiz-index="quizIndex" :submitted="submitted" :resource="resource"></question>
				<button type="submit" class="btn btn-primary pull-right" :disabled="submitted">submit</button>
			</form>
		</div>
<!--<pre>
		{{answeredQuestions|json}}
</pre>-->
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
	// props: {
	// 	options: {
	// 		type: Object,
	// 		default() {
	// 			return {
	// 				testMode: false // if true no data saved to fb --> used to test quiz during creation
	// 			}
	// 		}
	// 	}
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
			},
			// todo how to get store here with-out $parent
			// --> moved to created
			// passedResources: db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/passedResources'), //<<<<<<<<<<todo is there a better way to get the store here?!
			// answeredQuestions: db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/answeredQuestions')
		};
	},
	data() {
		// console.log('quiz', this.resource)
		this.$store.commit('resetForm');
		
		return {
			options: {
				lightResource: true // hides quiz link
			},
			resourceId: this.$route.params.resourceId,
			passedResources: [],
			answeredQuestionsRes: []
		};
	},
	created() {
		let passedRes = this.$firebaseRefs['passedResources'] = db.ref('/users/' + this.$store.state.userInfo.uid + '/passedResources');
		let answeredQuestionsRes = this.$firebaseRefs['answeredQuestions'] = db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/answeredQuestions');

		this.$bindAsArray('passedResources', passedRes);
		this.$bindAsArray('answeredQuestions', answeredQuestionsRes);

		// passedRes.set([]); // used for deleting testwise
	},
	computed: {
		...mapState({
			answers: state => state.quiz.answeredQuestions,
			submitted: state => state.quiz.submittedStatus,
			selectedCount: state => state.quiz.result.selectedCount,
			result: state => state.quiz.result
		}),
		score() {
			if ( this.resource.quiz === undefined ) return; // not sure if there is a better way of catching the reload issue at quiz route but this is working.

			let isAnswer = (option) => option.isAnswer===true;
			let totalCorrectAnswers = 0;
			this.resource.quiz.forEach((question) => {
				totalCorrectAnswers += question.options.filter(isAnswer).length;
			});
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
	// watch: {
	// 	selectedCount: function(val) {
	// 		console.log('changed selection', val);
	// 	}
	// },
	methods: {
		// ...mapMutations(['displayAnswers'])
		submitQuiz() {

			this.$store.commit('displayAnswers');

			let getCorrectAnswerText = () => {
				let result = {}
				this.result.correctIds.forEach(({quizIndex, index}) =>{
					let quiz = this.resource.quiz[quizIndex];
					result[quizIndex] = result[quizIndex] || {}; // default to empty obj.

					Object.assign(result[quizIndex], {
						questionText: quiz.text,
						[index]: {
							text: quiz.options[index].text
						}
					});
				});

				return {
					[this.resource['.key']]: {
						quizText: result
					}
				};
			};

			if (!this.options.testMode) {
				this.$nextTick(function () {
					// delay to next tick, so we have latest computed values
					console.log(this.score);
					if (this.score.amount == this.score.total) {
						// 100% answer
						// Push specific resource object to Firebase under `/users/ ` + userInfo.uid + ` /passedResources` node ONCE score reaches 100% on submit. 
						// console.log('100% answer', this.$store.state.userInfo.uid)
						let passedRes;
						// save answered quiz in passedResources
						// update times passed if all questions answered or score = 100%
						// console.log('incPassedResource', this.resource);
						this.$store.commit('incPassedResource', this.resource); // update store
						// console.log('after mutation', this.$store.state.passedResources);
						passedRes = this.$store.state.passedResources;
						this.$firebaseRefs.passedResources.set(passedRes);


						// save answeredQuestion as text in user/uid/answeredQuestion/resourceID
						let answerData = getCorrectAnswerText();
						// console.log('answeredQuestions', answerData);
						this.$firebaseRefs.answeredQuestions.set(answerData);
						// no need to update store --> will be loaded into state in study component

						// --> all questions answered - increment timesPassed on resource
						let totalTimesPassed = parseInt(this.resource.timesPassed);
						totalTimesPassed++;
						// not working yet --> need to load timesPassed of resource, inc. & save back. or maybe use increment of firebase
						this.$firebaseRefs.resource.child('timesPassed').set(totalTimesPassed); // todo firebase inc. would be handy here!
					}
				});
			}
		}
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