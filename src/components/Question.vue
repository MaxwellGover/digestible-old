<template>
    <div class="question">
        <h1 class="question-text"><b>{{quiz.text}}</b></h1>
        <div class="form-group" v-for="(option, index) in quiz.options" :class="answeredQuestions[quizIndex].answers[index].style = isCorrectAnswer(quizIndex, index)">
            <div class="checkbox">
                <div class="answer">
                    <input type="checkbox" 
                        name="question"
                        v-model="answeredQuestions[quizIndex].answers[index].selected"
                        :true-value="true"
                        :false-value="false" @change="checkboxChange(quizIndex, index, answeredQuestions[quizIndex].answers[index].selected)"/> 
                        <p class="answer-text" @click.prevent="select(quizIndex, index, answeredQuestions[quizIndex].answers[index].selected)">{{option.text}}</p>
                </div>
                <i class="fa fa-check-circle-o fa-2x pull-right" style="color: #23d160" v-if="submitted && answeredQuestions[quizIndex].answers[index].style === 'correct'"></i>
                <i class="fa fa-exclamation-circle fa-2x pull-right" v-if="submitted && answeredQuestions[quizIndex].answers[index].style === 'wrong-answer'" style="color: #ff3860"></i>
            </div>
        </div>
        <hr>
        <!--{{quiz}}-->
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
            this.$store.commit('mutateAnswerList', this.resource);

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
            checkboxChange(questionIndex, index, value) {
                this.$store.commit('markAnswer', {questionIndex, index, value});
            },
            select(questionIndex, index, value) {
                value = !value; // toggle value
                this.$store.commit('markAnswer', {questionIndex, index, value});
            }
        }
    }
</script>

<style scoped>
    .correct {
        border: 2px solid #23d160 !important;
        padding: 20px;
    }

    .wrong-answer {
        border: 2px solid #ff3860 !important;
        padding: 20px;
    }

    .question-text {
        font-size: 28px;
        margin-bottom: 20px;
        font-family: 
    }

    .question {
        margin-bottom: 20px;
    }

    .answer-text {
        font-size: 16px;
        color: #8f8f8f;
        margin-left: 15px;
    }

    .checkbox {
        display: flex;
    }

    .answer {
        display: flex;
        align-items: center;
    }

    .fa {
        margin-left: 600px
    }

</style>