<template>

	<div class="quiz container">

		<resource-card :resource="resource" :passed="passedResources" :showLearn="showLearn" :options="options" :showShare="showShare" :resourceLink="resourceLink"style="margin-right: 0"></resource-card>

		<div class="questions box container">
			<div>
				<form @submit.prevent="submitQuiz"> 
					<question v-for="(quiz, quizIndex) in resource.quiz" :quiz="quiz" :quiz-index="quizIndex" :submitted="submitted" :resource="resource"></question>
					<flash-card :score="score" :visible="submitted" style="margin-top: 40px"></flash-card>
					<button type="submit" class="button is-info pull-right" :disabled="submitted" @click="submitQuiz()">Submit</button>
				</form>
			</div>
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
			},
		}
	},
	data() {
		this.$store.commit('resetForm');
		
		return {
			options: {
				lightResource: true 
			},
			showLearn: true,
			showShare: false,
			resourceId: this.$route.params.resourceId,
			passedResources: [],
			answeredQuestionsRes: [],
			resourceLink: window.location.href
		};
	},
	created() {
		let passedRes = this.$firebaseRefs['passedResources'] = db.ref('/users/' + this.$store.state.userInfo.uid + '/passedResources');
		let answeredQuestionsRes = this.$firebaseRefs['answeredQuestions'] = db.ref('/users/' + this.$parent.$store.state.userInfo.uid + '/answeredQuestions');

		this.$bindAsArray('passedResources', passedRes);
		this.$bindAsArray('answeredQuestions', answeredQuestionsRes);

		// Swap out buttons
		this.showLearn = false;
		this.showShare = true
	},
	computed: {
		...mapState({
			answers: state => state.quiz.answeredQuestions,
			submitted: state => state.quiz.submittedStatus,
			selectedCount: state => state.quiz.result.selectedCount,
			result: state => state.quiz.result,
			userInfo: state => state.userInfo
		}),
		score() {
			if ( this.resource.quiz === undefined ) return; 

			let isAnswer = (option) => option.isAnswer===true;
			let totalCorrectAnswers = 0;
			this.resource.quiz.forEach((question) => {
				totalCorrectAnswers += question.options.filter(isAnswer).length;
			});
			let selected = this.selectedCount;
			let incorrectCount = (selected > totalCorrectAnswers) ? selected - totalCorrectAnswers: 0; 
			let correctCount = this.result.correctIds.length;

			let amount = correctCount - incorrectCount;
			
			if (amount < 0) { 
				amount = 0;
			}

			return {
				amount,
				total: totalCorrectAnswers // total correct answer count - used to calculated messages
			};
		}
	},
	methods: {
		submitQuiz() {

			this.$store.commit('displayAnswers');

			let getCorrectAnswerText = () => {
				let result = {}
				this.result.correctIds.forEach(({quizIndex, index}) => {
					let quiz = this.resource.quiz[quizIndex];
					result[quizIndex] = result[quizIndex] || {}; // default to empty obj.

					Object.assign(result[quizIndex], {
						questionText: quiz.text,
						summaryText: quiz.summaryText || '', // default to empty string --> model changed / new property (check how it is used)
						[index]: {
							text: quiz.options[index].text
						}
					});
				});
        console.log('correct answers', result);

				return {
					[this.resource['.key']]: {
						'quizText': result // quizText(15).fill(result) <--- quizText is not defined.
					},

					// TODO: router.push('/profile/' + authorId );
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
						console.log('answeredQuestions', answerData);
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

<style scoped>
	.questions {
		margin-top: 20px;
		padding: 40px;
		width: 800px;
		background-color: white;
	}
	.quiz {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.quiz-link {
		display: flex;
		margin-top: 20px
	}
</style>