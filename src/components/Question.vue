<template>
    <div class="question">
        <h1>{{quiz.text}}</h1>
        <div class="form-group" v-for="(option, index) in quiz.options" :class="answeredQuestions[quizIndex].answers[index].style = isCorrectAnswer(quizIndex, index)">
            <div class="checkbox">
                <label>
                    <input type="checkbox" 
                        name="question"
                        :true-value="true"
                        :false-value="false" 
                        @click="select(quizIndex, index, answeredQuestions[quizIndex].answers[index].selected)"/>{{option.text}}
                </label>
                <i class="fa fa-check-circle-o fa-2x pull-right" v-if="submitted && answeredQuestions[quizIndex].answers[index].style === 'correct'"></i>
                <i class="fa fa-exclamation-circle fa-2x pull-right" v-if="submitted && answeredQuestions[quizIndex].answers[index].style === 'wrong-answer'"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        props: ['quiz', 'quizIndex', 'submitted', 'resource'],
        computed: {
            ...mapState({
			    answeredQuestions: state => state.quiz.answeredQuestions,
	    	})
        },
        data() {
            this.$store.commit('prepareAnswerList', this.resource);

            return {

            };
        },
        methods: {
            isCorrectAnswer(quizIndex, index) {
                const styleClasses = {
                    0: 'wrong-answer',
                    1: 'correct'
                };

                if (this.submitted) {
                    // console.log('iscorrect?',quizIndex, index,  this.$store.state.quiz.answeredQuestions);
                    let answer = this.answeredQuestions[quizIndex].answers[index];

                    let correctAnswer = answer.selected && (answer.selected === answer.isAnswer);
                    let incorrecctAnswer = answer.selected && (answer.selected !== answer.isAnswer);
                    let answerObj = {quizIndex, index};
                    let style = '';

                    // console.log('stlye check', incorrecctAnswer, correctAnswer);

                    if (correctAnswer) {
                        this.$store.commit('addCorrectCount', answerObj);
                        style = styleClasses[1];
                    }
                    else {
                        this.$store.commit('removeCorrectCount', answerObj);
                        
                        if (incorrecctAnswer) {
                            style = styleClasses[0];
                        }
                    }
                    // console.log('style selected', style);
                    return style;
                }

                return; // not submitted
            },
            select(questionIndex, index, value) {
                value = !value; // toggle value
                this.$store.commit('markAnswer', {questionIndex, index, value});
            }
        }
    }
</script>

<style>
    .correct {
        border: 1px solid green !important;
    }

    .wrong-answer {
        border: 1px solid red !important;
    }

</style>